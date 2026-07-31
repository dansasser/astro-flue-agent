use std::env;
use std::fmt;
use std::fs::read_to_string;
use std::io::{Read, Write};
use std::net::{Shutdown, TcpStream};
use std::path::{Component, Path, PathBuf};
use std::process::{Child, Command, Stdio};
use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};
use std::thread::{self, sleep, JoinHandle};
use std::time::{Duration, Instant};

use crate::http::parse_status_code;

const MIN_NODE_MAJOR: u64 = 22;
const MIN_NODE_MINOR: u64 = 18;

#[derive(Debug, Clone, Default)]
pub struct GatewayOptions {
    pub port: Option<u16>,
    pub server_path: Option<PathBuf>,
}

pub struct GatewayHandle {
    pub started: bool,
    pub port: u16,
    pub base_url: String,
    child: Option<Child>,
    log_drain: Option<ServerLogDrain>,
}

impl fmt::Debug for GatewayHandle {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter
            .debug_struct("GatewayHandle")
            .field("started", &self.started)
            .field("port", &self.port)
            .field("base_url", &self.base_url)
            .finish_non_exhaustive()
    }
}

impl GatewayHandle {
    pub fn cleanup(&mut self) {
        if let Some(mut child) = self.child.take() {
            stop_server(&mut child);
        }
        if let Some(log_drain) = self.log_drain.take() {
            log_drain.join();
        }
    }
}

impl Drop for GatewayHandle {
    fn drop(&mut self) {
        self.cleanup();
    }
}

pub fn ensure_server_running(options: &GatewayOptions) -> Result<GatewayHandle, String> {
    let runtime_root = resolve_runtime_root()?;
    let port = options
        .port
        .or_else(|| read_gateway_port(&runtime_root))
        .unwrap_or(3000);
    let base_url = format!("http://127.0.0.1:{port}");

    if check_health(port) {
        return Ok(GatewayHandle {
            started: false,
            port,
            base_url,
            child: None,
            log_drain: None,
        });
    }

    let server_path = resolve_server_path_with_root(options, &runtime_root)?;
    if !server_path.exists() {
        return Err(format!(
            "Agent package not found at {}. Run 'sim-one install' first.",
            server_path.display()
        ));
    }

    let mut server = start_server(&server_path, port, &runtime_root)?;
    if let Err(error) = wait_for_health(port, &mut server.child) {
        stop_server(&mut server.child);
        server.log_drain.join();
        return Err(error);
    }
    if env::var_os("SIM_ONE_TUI_TEST_STARTUP").is_none()
        && env::var_os("SIM_ONE_TUI_TEST_PROMPTS").is_none()
    {
        server.log_drain.disable_forwarding();
    }

    Ok(GatewayHandle {
        started: true,
        port,
        base_url,
        child: Some(server.child),
        log_drain: Some(server.log_drain),
    })
}

pub fn resolve_server_path(options: &GatewayOptions) -> Result<PathBuf, String> {
    let runtime_root = resolve_runtime_root()?;
    resolve_server_path_with_root(options, &runtime_root)
}

fn resolve_server_path_with_root(
    options: &GatewayOptions,
    runtime_root: &Path,
) -> Result<PathBuf, String> {
    if let Some(path) = &options.server_path {
        return resolve_runtime_path(runtime_root, path);
    }

    if let Ok(path) = env::var("SIM_ONE_SERVER_PATH") {
        return resolve_runtime_path(runtime_root, Path::new(&path));
    }

    Ok(runtime_root
        .join("sim-one-alpha")
        .join("server.mjs"))
}

pub fn read_gateway_port_from_config(path: &Path) -> Option<u16> {
    let value: serde_json::Value = serde_json::from_str(&read_to_string(path).ok()?).ok()?;
    let port = value.get("gateway")?.get("port")?.as_u64()?;
    u16::try_from(port).ok().filter(|port| *port != 0)
}

fn read_gateway_port(runtime_root: &Path) -> Option<u16> {
    read_gateway_port_from_config(&runtime_root.join("gorombo.config.json"))
}

fn start_server(
    server_path: &Path,
    port: u16,
    runtime_root: &Path,
) -> Result<StartedServer, String> {
    let server_arg = server_path
        .canonicalize()
        .unwrap_or_else(|_| server_path.to_path_buf());
    let mut command = Command::new(resolve_node_executable()?);
    command.arg(server_arg);
    command.env("GOROMBO_RUNTIME_ROOT", runtime_root);
    command.env("PORT", port.to_string());
    command.current_dir(runtime_root);
    command.stdin(Stdio::null());
    command.stdout(Stdio::piped());
    command.stderr(Stdio::piped());
    let mut child = command
        .spawn()
        .map_err(|error| format!("Failed to start server: {error}"))?;
    let log_drain = ServerLogDrain::from_child(&mut child);
    Ok(StartedServer { child, log_drain })
}

pub fn resolve_server_cwd(server_path: &Path) -> Result<PathBuf, String> {
    let normalized = server_path
        .canonicalize()
        .unwrap_or_else(|_| server_path.to_path_buf());

    if let Some(server_dir) = normalized.parent() {
        let is_packaged_server =
            server_dir.file_name().and_then(|name| name.to_str()) == Some("sim-one-alpha");
        if is_packaged_server {
            if let Some(gorombo_dir) = server_dir.parent() {
                let is_gorombo_runtime =
                    gorombo_dir.file_name().and_then(|name| name.to_str()) == Some(".gorombo");
                if is_gorombo_runtime {
                    return Ok(gorombo_dir.to_path_buf());
                }
            }
        }
    }

    env::current_dir().map_err(|error| format!("Could not read current directory: {error}"))
}

pub fn resolve_runtime_root() -> Result<PathBuf, String> {
    if let Ok(configured) = env::var("GOROMBO_RUNTIME_ROOT") {
        if !configured.trim().is_empty() {
            return validate_runtime_root(PathBuf::from(configured), "GOROMBO_RUNTIME_ROOT");
        }
    }

    let executable = env::current_exe()
        .map_err(|error| format!("Could not resolve the TUI executable path: {error}"))?;
    if let Some(root) = find_ancestor_named(&executable, ".gorombo") {
        return validate_runtime_root(root, "packaged executable owner");
    }

    if let Some(project_root) = find_source_project_root(&executable) {
        return validate_runtime_root(project_root.join(".gorombo"), "source checkout");
    }

    Err(
        "Could not resolve the GOROMBO runtime root. Set GOROMBO_RUNTIME_ROOT to the absolute path of the owning .gorombo directory."
            .to_string(),
    )
}

fn validate_runtime_root(path: PathBuf, source: &str) -> Result<PathBuf, String> {
    if !path.is_absolute() {
        return Err(format!("{source} must be absolute: {}", path.display()));
    }
    if path.file_name().and_then(|name| name.to_str()) != Some(".gorombo") {
        return Err(format!("{source} must end in .gorombo: {}", path.display()));
    }
    Ok(path)
}

fn resolve_runtime_path(runtime_root: &Path, path: &Path) -> Result<PathBuf, String> {
    if path.is_absolute() {
        return Ok(path.to_path_buf());
    }

    let mut resolved = runtime_root.to_path_buf();
    for component in path.components() {
        match component {
            Component::CurDir => {}
            Component::Normal(value) if value != ".gorombo" => resolved.push(value),
            Component::Normal(_) => {
                return Err(format!(
                    "Relative runtime path must not include a nested .gorombo segment: {}",
                    path.display()
                ));
            }
            Component::ParentDir => {
                return Err(format!(
                    "Relative runtime path must not traverse outside the GOROMBO runtime root: {}",
                    path.display()
                ));
            }
            Component::RootDir | Component::Prefix(_) => unreachable!(),
        }
    }
    Ok(resolved)
}

fn find_ancestor_named(start: &Path, name: &str) -> Option<PathBuf> {
    let mut current = if start.is_dir() {
        start.to_path_buf()
    } else {
        start.parent()?.to_path_buf()
    };
    loop {
        if current.file_name().and_then(|value| value.to_str()) == Some(name) {
            return Some(current);
        }
        if !current.pop() {
            return None;
        }
    }
}

fn find_source_project_root(start: &Path) -> Option<PathBuf> {
    let mut current = if start.is_dir() {
        start.to_path_buf()
    } else {
        start.parent()?.to_path_buf()
    };
    loop {
        let package_path = current.join("package.json");
        if let Ok(contents) = read_to_string(package_path) {
            if let Ok(value) = serde_json::from_str::<serde_json::Value>(&contents) {
                if value.get("name").and_then(|name| name.as_str()) == Some("sim-one-alpha") {
                    return Some(current);
                }
            }
        }
        if !current.pop() {
            return None;
        }
    }
}

struct StartedServer {
    child: Child,
    log_drain: ServerLogDrain,
}

struct ServerLogDrain {
    forward: Arc<AtomicBool>,
    handles: Vec<JoinHandle<()>>,
}

impl ServerLogDrain {
    fn from_child(child: &mut Child) -> Self {
        let forward = Arc::new(AtomicBool::new(true));
        let mut handles = Vec::new();

        if let Some(stdout) = child.stdout.take() {
            handles.push(spawn_log_drain(
                stdout,
                Arc::clone(&forward),
                LogStream::Stdout,
            ));
        }
        if let Some(stderr) = child.stderr.take() {
            handles.push(spawn_log_drain(
                stderr,
                Arc::clone(&forward),
                LogStream::Stderr,
            ));
        }

        Self { forward, handles }
    }

    fn disable_forwarding(&self) {
        self.forward.store(false, Ordering::Relaxed);
    }

    fn join(self) {
        for handle in self.handles {
            let _ = handle.join();
        }
    }
}

#[derive(Clone, Copy)]
enum LogStream {
    Stdout,
    Stderr,
}

fn spawn_log_drain<R>(mut reader: R, forward: Arc<AtomicBool>, stream: LogStream) -> JoinHandle<()>
where
    R: Read + Send + 'static,
{
    thread::spawn(move || {
        let mut buffer = [0; 8192];
        loop {
            let size = match reader.read(&mut buffer) {
                Ok(0) => return,
                Ok(size) => size,
                Err(_) => return,
            };

            if !forward.load(Ordering::Relaxed) {
                continue;
            }

            match stream {
                LogStream::Stdout => {
                    let mut stdout = std::io::stdout().lock();
                    let _ = stdout.write_all(&buffer[..size]);
                    let _ = stdout.flush();
                }
                LogStream::Stderr => {
                    let mut stderr = std::io::stderr().lock();
                    let _ = stderr.write_all(&buffer[..size]);
                    let _ = stderr.flush();
                }
            }
        }
    })
}

pub fn resolve_node_executable() -> Result<PathBuf, String> {
    let mut candidates = Vec::new();

    if let Ok(path) = env::var("SIM_ONE_NODE") {
        candidates.push(PathBuf::from(path));
    }

    if let Ok(path) = env::var("PATH") {
        for dir in env::split_paths(&path) {
            candidates.push(dir.join(if cfg!(windows) { "node.exe" } else { "node" }));
        }
    }

    for nvm_root in nvm_roots() {
        collect_nvm_node_candidates(&nvm_root, &mut candidates);
    }

    let mut checked = Vec::new();
    for candidate in dedupe_paths(candidates) {
        if !candidate.exists() {
            continue;
        }

        match read_node_version(&candidate) {
            Some(version) if version.is_supported() => return Ok(candidate),
            Some(version) => checked.push(format!("{} ({})", candidate.display(), version)),
            None => checked.push(format!("{} (version unreadable)", candidate.display())),
        }
    }

    Err(format!(
        "SIM-ONE Alpha requires Node >= {MIN_NODE_MAJOR}.{MIN_NODE_MINOR}. \
         Set SIM_ONE_NODE to a Node 22 executable or put Node 22 on PATH. Checked: {}",
        if checked.is_empty() {
            "none".to_string()
        } else {
            checked.join(", ")
        }
    ))
}

fn nvm_roots() -> Vec<PathBuf> {
    let mut roots = Vec::new();
    if let Ok(path) = env::var("NVM_DIR") {
        roots.push(PathBuf::from(path));
    }
    if let Ok(home) = env::var("HOME") {
        roots.push(PathBuf::from(home).join(".nvm"));
    }
    roots.push(PathBuf::from("/root/.nvm"));
    dedupe_paths(roots)
}

fn collect_nvm_node_candidates(root: &Path, candidates: &mut Vec<PathBuf>) {
    let versions_dir = root.join("versions").join("node");
    let Ok(entries) = std::fs::read_dir(versions_dir) else {
        return;
    };

    let mut entries = entries
        .flatten()
        .map(|entry| entry.path())
        .collect::<Vec<_>>();
    entries.sort_by(|left, right| right.cmp(left));

    for version_dir in entries {
        candidates.push(version_dir.join("bin").join(if cfg!(windows) {
            "node.exe"
        } else {
            "node"
        }));
    }
}

fn read_node_version(node_path: &Path) -> Option<NodeVersion> {
    let output = Command::new(node_path)
        .arg("-p")
        .arg("process.versions.node")
        .stdin(Stdio::null())
        .stderr(Stdio::null())
        .output()
        .ok()?;
    if !output.status.success() {
        return None;
    }

    let stdout = String::from_utf8(output.stdout).ok()?;
    NodeVersion::parse(stdout.trim())
}

fn dedupe_paths(paths: Vec<PathBuf>) -> Vec<PathBuf> {
    let mut unique = Vec::new();
    for path in paths {
        if !unique.iter().any(|existing| existing == &path) {
            unique.push(path);
        }
    }
    unique
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct NodeVersion {
    major: u64,
    minor: u64,
    patch: u64,
}

impl NodeVersion {
    fn parse(value: &str) -> Option<Self> {
        let mut parts = value.trim_start_matches('v').split('.');
        Some(Self {
            major: parts.next()?.parse().ok()?,
            minor: parts.next()?.parse().ok()?,
            patch: parts.next().unwrap_or("0").parse().ok()?,
        })
    }

    fn is_supported(&self) -> bool {
        self.major > MIN_NODE_MAJOR
            || (self.major == MIN_NODE_MAJOR && self.minor >= MIN_NODE_MINOR)
    }
}

impl std::fmt::Display for NodeVersion {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(formatter, "v{}.{}.{}", self.major, self.minor, self.patch)
    }
}

fn wait_for_health(port: u16, child: &mut Child) -> Result<(), String> {
    let deadline = Instant::now() + Duration::from_secs(120);
    while Instant::now() < deadline {
        match child.try_wait() {
            Ok(Some(status)) => {
                return Err(format!(
                    "Server exited unexpectedly with status {status} before becoming healthy."
                ));
            }
            Ok(None) => {}
            Err(error) => return Err(format!("Could not inspect server child: {error}")),
        }

        if check_health(port) {
            return Ok(());
        }
        sleep(Duration::from_millis(500));
    }

    Err("Server did not become healthy within 120s.".to_string())
}

fn check_health(port: u16) -> bool {
    let Ok(mut stream) = TcpStream::connect(("127.0.0.1", port)) else {
        return false;
    };
    let _ = stream.set_read_timeout(Some(Duration::from_secs(5)));
    let _ = stream.set_write_timeout(Some(Duration::from_secs(5)));
    if stream
        .write_all(b"GET /health HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n")
        .is_err()
    {
        return false;
    }
    let _ = stream.shutdown(Shutdown::Write);

    let mut response = String::new();
    if stream.read_to_string(&mut response).is_err() {
        return false;
    }
    let Some((head, _)) = response.split_once("\r\n\r\n") else {
        return false;
    };
    parse_status_code(head, "Gateway health")
        .map(|status| (200..300).contains(&status))
        .unwrap_or(false)
}

fn stop_server(child: &mut Child) {
    if child.try_wait().ok().flatten().is_some() {
        return;
    }

    request_shutdown(child);
    let deadline = Instant::now() + Duration::from_secs(5);
    while Instant::now() < deadline {
        if child.try_wait().ok().flatten().is_some() {
            return;
        }
        sleep(Duration::from_millis(100));
    }

    let _ = child.kill();
    let _ = child.wait();
}

#[cfg(unix)]
fn request_shutdown(child: &mut Child) {
    const SIGTERM: i32 = 15;
    unsafe extern "C" {
        fn kill(pid: i32, sig: i32) -> i32;
    }

    let result = unsafe { kill(child.id() as i32, SIGTERM) };
    if result != 0 {
        eprintln!(
            "Failed to request server shutdown with SIGTERM: {}",
            std::io::Error::last_os_error()
        );
    }
}

#[cfg(not(unix))]
fn request_shutdown(child: &mut Child) {
    let _ = child.kill();
}
