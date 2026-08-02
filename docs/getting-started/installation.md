# Installation

SIM-ONE Alpha `0.1.0 Beta` is in pre-release. The repository supports source
builds; the packaged release archive and `sim-one.sh` are not published yet.
See [Pre-Release Status](pre-release-status.md) for the exact release gates.

## Packaged Installation

The published release path conventionally installs the self-hosted runtime,
terminal interface, `sim-one` command, structured-memory engine, and bundled
retrieval assets under `~/.gorombo/`, then opens onboarding. The complete
`.gorombo` tree is relocatable after installation.

Release publication requires versioned assets and checksums. The final install
procedure downloads a specific release rather than mutable `latest` content,
verifies the checksum, and only then runs the installer:

```bash
VERSION=0.1.0
curl -fLO "https://github.com/dansasser/sim-one-alpha/releases/download/v${VERSION}/sim-one.sh"
curl -fLO "https://github.com/dansasser/sim-one-alpha/releases/download/v${VERSION}/SHA256SUMS"
sha256sum --check --ignore-missing SHA256SUMS
sh sim-one.sh
```

Do not run those commands until the corresponding GitHub release assets are
published. Node.js, npm, pnpm, Rust, and `wasm-pack` are not required for the
packaged installation. Coding Worker shell, Git, and verification commands
require Bubblewrap on Linux; those commands fail closed when Bubblewrap is
unavailable. The release installer must verify or install that host dependency
before enabling coding execution.

### Linux Coding Worker Sandbox

Install Bubblewrap before enabling Coding Worker shell, Git, or verification
commands:

```bash
sudo apt-get update
sudo apt-get install --yes bubblewrap
```

Ubuntu 24.04 enables AppArmor restrictions for unprivileged user namespaces.
On an affected host, install and load Ubuntu's targeted Bubblewrap profile:

```bash
sudo apt-get install --yes apparmor-profiles
sudo install -m 0644 \
  /usr/share/apparmor/extra-profiles/bwrap-userns-restrict \
  /etc/apparmor.d/bwrap-userns-restrict
sudo apparmor_parser --replace /etc/apparmor.d/bwrap-userns-restrict
```

Verify the boundary can create its namespace instead of relying on package
presence alone:

```bash
/usr/bin/bwrap --ro-bind / / --unshare-all --share-net -- /bin/true
```

The command must exit successfully. SIM-ONE fails Coding Worker child-process
execution closed when this boundary is missing or blocked; it never falls back
to unrestricted execution.

## Installed Files

The packaged runtime and mutable user data live under one `<runtime-root>`;
`~/.gorombo` is the conventional location.

| Path | Purpose |
| --- | --- |
| `<runtime-root>/gorombo.config.json` | Non-secret product configuration |
| `<runtime-root>/sim-one.config.example` | Complete non-secret configuration template |
| `<runtime-root>/sim-one.config` | Owner-only provider, connector, service, and deployment settings |
| `<runtime-root>/sim-one-alpha/` | Installed agent runtime and read-only persona assets |
| `<runtime-root>/sim-one-alpha/node_modules/` | Isolated production dependencies for the installed Flue Node runtime |
| `<runtime-root>/sim-one-cli/` | Product command |
| `<runtime-root>/sim-one-ratatui/` | Terminal interface |
| `<runtime-root>/workspace/` | Coding Worker repositories and projects |
| `<runtime-root>/db/` | Sessions, protocols, memory, schedules, and capability records |
| `<runtime-root>/capabilities/` | User- and agent-added skills, tools, and workers |
| `<runtime-root>/approvals/` | Mutation approval records |
| `<runtime-root>/auth/` | Command-scoped authentication helpers |
| `<runtime-root>/logs/` | Bounded operational diagnostics |
| `<runtime-root>/coding-worker/` | Coding Worker task and repository metadata |

Keep the runtime environment, databases, authentication state, and approval
records private. Move or back up the complete runtime root as one unit.

## Build From Source

Source builds require:

- Git;
- Node.js 22.18 or newer;
- pnpm 10;
- Rust stable with the `wasm32-unknown-unknown` target;
- `wasm-pack` 0.13.1;
- the Linux Coding Worker sandbox configured above for Coding Worker shell,
  Git, and verification commands.

Clone the repository:

```bash
git clone https://github.com/dansasser/sim-one-alpha.git
cd sim-one-alpha
```

Create the ignored owner configuration:

```bash
cp sim-one.config.example sim-one.config
chmod 600 sim-one.config
```

Fill in the provider and integration values required by the selected model and
enabled connectors, then build:

```bash
pnpm install
pnpm fetch-embedding-model
pnpm run wasm:build
pnpm run build
pnpm run build:tui
pnpm run build:cli
```

Launch the locally built product command:

```bash
./.gorombo/sim-one-cli/sim-one
```

The build produces the Vite-built Flue 2 runtime, terminal interface,
Rust/WebAssembly memory helper, bundled embedding assets, isolated production
`node_modules`, and unified product command. The Node output leaves package
dependencies external, so `pnpm run build` uses `pnpm deploy --prod` to place a portable
dependency tree beside `server.mjs`. A complete `.gorombo` build therefore does
not resolve runtime packages from the source checkout's `node_modules`.
Configure the source seed at `src/core/config/gorombo.config.json` before
building and place environment-style settings in checkout
`sim-one.config` as described in the
[Configuration Reference](../reference/configuration.md). The build copies the
JSON seed, canonical example, and local owner file into `.gorombo/`. The
packaged Node runtime, CLI, and TUI all load the owning runtime root's
`sim-one.config`; there is no `--env-path` production override.

## Verify The Source Build

A successful build is not enough by itself. Launch the terminal interface,
submit a prompt, and confirm an end-to-end response from the orchestrator.

For repository-level verification, use the complete command set in
[Contributing](../../CONTRIBUTING.md).

## Next Steps

- [Review pre-release availability](pre-release-status.md)
- [Review the onboarding release contract](onboarding.md)
- [Use the terminal interface and sessions](../guides/terminal-and-sessions.md)
- [Configure providers and runtime behavior](../reference/configuration.md)
- [Configure Telegram](../guides/connectors.md)
