# Installation

SIM-ONE Alpha `0.1.0 Beta` is in pre-release. The repository supports source
builds; the packaged release archive and `sim-one.sh` are not published yet.
See [Pre-Release Status](pre-release-status.md) for the exact release gates.

## Packaged Installation

The published release path installs the self-hosted runtime, terminal
interface, `sim-one` command, structured-memory engine, and bundled retrieval
assets under `~/.gorombo/`, then opens onboarding.

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
packaged installation.

## Installed Files

The packaged runtime and mutable user data live under `~/.gorombo/`.

| Path | Purpose |
| --- | --- |
| `~/.gorombo/sim-one-alpha/` | Installed agent runtime and product configuration |
| `~/.gorombo/sim-one-cli/` | Product command |
| `~/.gorombo/db/` | Sessions, protocols, memory, schedules, and capability records |
| `~/.gorombo/capabilities/` | User- and agent-added skills, tools, and workers |
| `~/.gorombo/auth/` | Product-managed authentication state |
| `~/.gorombo/logs/` | Bounded operational diagnostics |
| `~/.gorombo/.env` | Provider, connector, and service secrets |

Keep `~/.gorombo/.env`, databases, authentication state, and approval records
private. Back up the runtime data directory before moving an installation.

## Build From Source

Source builds require:

- Git;
- Node.js 22.18 or newer;
- npm or pnpm 10;
- Rust stable with the `wasm32-unknown-unknown` target;
- `wasm-pack` 0.13.1.

Clone the repository:

```bash
git clone https://github.com/dansasser/sim-one-alpha.git
cd sim-one-alpha
```

Choose one package-manager path.

### npm

```bash
npm install
npm --prefix sim-one-cli install
npm run fetch-embedding-model
npm run wasm:build
npm run build
npm run build:tui
npm --prefix sim-one-cli run build
```

### pnpm

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

Both build paths produce the Flue runtime, terminal interface, Rust/WebAssembly
memory helper, bundled embedding assets, and unified product command. Configure
the source seed at `src/core/config/gorombo.config.json` before building and
place secrets in the checkout `.env` as described in the
[Configuration Reference](../reference/configuration.md). The build copies the
seed to `.gorombo/sim-one-alpha/gorombo.config.json`, which is the file loaded
by the locally built server.

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
