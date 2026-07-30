# Contributing To SIM-ONE Alpha

SIM-ONE Alpha accepts bug reports, feature requests, documentation improvements,
and focused code contributions. This guide defines the standards for issues,
development, testing, and pull requests.

By participating in this project, you agree to follow the
[Code of Conduct](CODE_OF_CONDUCT.md).

## Open An Issue

Use [GitHub Issues](https://github.com/dansasser/sim-one-alpha/issues) for bug
reports, feature requests, and documentation problems. Search open and closed
issues before creating a new one.

Bug reports should include:

- the SIM-ONE Alpha version or commit;
- operating system and installation method;
- clear reproduction steps;
- expected and actual behavior;
- relevant logs or error output with secrets removed.

Feature requests should describe the problem, the intended user or workflow, and
the outcome the proposed change should provide. A pull request is a concrete
implementation proposal, not a substitute for an issue when the requested
product behavior still needs discussion.

Do not report vulnerabilities, credentials, private data, or other sensitive
information in a public issue. Follow the [Security Policy](SECURITY.md)
instead. Use [Support](SUPPORT.md) for installation help and usage questions.

## Prepare A Contributor Checkout

Start with the toolchain and checkout instructions in
[Build From Source](README.md#build-from-source). Repository development uses
Node.js 22.18 or newer and supports either npm, included with Node.js, or pnpm
10.10.0. Coding Worker process tests also require the Linux host setup in
[Linux Coding Worker Sandbox](docs/getting-started/installation.md#linux-coding-worker-sandbox).
Choose one package manager and use its command path consistently.

Prepare the dependency tree and generated local assets:

### npm

```bash
npm install
npm --prefix sim-one-cli install
npm run fetch-embedding-model
npm run wasm:build
```

### pnpm

```bash
pnpm install --frozen-lockfile
pnpm run fetch-embedding-model
pnpm run wasm:build
```

The embedding model and Rust/WebAssembly memory artifact are gitignored and must
be prepared in each checkout before the complete test suite can run.

Most deterministic checks do not require provider credentials. To run the live
development runtime, copy `sim-one.config.example` to the ignored
`sim-one.config`, set mode `0600`, and add only the values needed for the
behavior being tested. Never commit `sim-one.config` or place secrets in source,
fixtures, issues, logs, or pull requests.

## Run The Development Runtime

### npm

```bash
npm run dev
```

### pnpm

```bash
pnpm run dev
```

The concise repository entry point remains in the README
[Development](README.md#development) section.

## Follow The Architecture

Optionally use [DeepWiki](https://deepwiki.com/dansasser/sim-one-alpha) for
source-linked codebase exploration and repository-grounded questions. Its
generated content is an exploration aid, not required reading or a replacement
for the versioned architecture documentation.

Read the [documentation hub](docs/README.md) and
[architecture overview](docs/architecture/overview.md) before changing runtime
behavior. Changes must preserve the project contracts relevant to their scope,
including:

- Flue remains the runtime foundation and SIM-ONE remains the governance layer;
- the orchestrator governs and delegates while workers execute and report back;
- protocols are mandatory SQLite-backed runtime rules, not skills;
- connectors normalize trusted events and do not contain orchestration logic;
- tools execute capabilities, skills describe workflows, and registries provide
  discovery;
- secrets and runtime state remain outside source control.

Use the established product identity and naming conventions. Source and
documentation filenames use lowercase kebab-case. Prefer existing dependencies,
and document why any new dependency is necessary.

## Make A Focused Change

Create a branch from the current `main` branch. Keep each contribution limited
to one coherent problem and avoid unrelated refactors or generated-file churn.

Add or update tests for changed behavior. Update the README, product
documentation, references, and architecture documentation when a change affects
their public contract. Add a user-visible entry to the
[Changelog](CHANGELOG.md) when appropriate. Dependency, model, or bundled-asset
changes must also update [Third-Party Notices](THIRD_PARTY_NOTICES.md) when
their version, license, copyright notice, or redistribution terms change.
Preserve backward compatibility for persisted sessions, protocols, memory,
schedules, capabilities, and configuration unless the change includes an
approved migration.

Do not commit:

- `sim-one.config`, legacy `.env` files, API keys, tokens, credentials, or private data;
- runtime databases, authentication state, approval records, or logs;
- downloaded embedding models or generated Rust/WebAssembly build artifacts;
- editor, machine-specific, or unrelated generated files.

## Build The Complete Product

Build every product artifact before running the complete verification sequence.
The build produces the Rust/WebAssembly memory package, Flue runtime, SIM-ONE
TUI, CLI bundle, and platform launchers, then verifies that the `sim-one`
product command starts and exposes its command surface.

### npm

```bash
npm run build
npm run build:tui
npm --prefix sim-one-cli run build
node scripts/check-sim-one-product-command.mjs
```

### pnpm

```bash
pnpm run build
pnpm run build:tui
pnpm run build:cli
node scripts/check-sim-one-product-command.mjs
```

## Run Complete Verification

After the complete build, run the full project verification:

### npm

```bash
npm run docs:check
npm run typecheck
npm run test:unit
npm run cargo:test
npm run test:http
npm run test:tui
npm run test:tui:ratatui
npm run smoke:memory
```

### pnpm

```bash
pnpm run docs:check
pnpm run typecheck
pnpm run test:unit
pnpm run cargo:test
pnpm run test:http
pnpm run test:tui
pnpm run test:tui:ratatui
pnpm run smoke:memory
```

These checks cover TypeScript contracts, unit behavior, the Rust memory and TUI
crates, built HTTP integration, packaged TUI behavior, CLI-to-gateway behavior,
and the real Rust/WebAssembly structured-memory path. Product tests that call a
live model require valid provider credentials in the local environment.

Run focused checks while developing and add these checks when the affected area
requires them:

| Change area | npm | pnpm |
| --- | --- | --- |
| Rust/WebAssembly memory | `npm run cargo:test` and `npm run smoke:memory` | `pnpm run cargo:test` and `pnpm run smoke:memory` |
| SIM-ONE TUI | `npm run cargo:test`, `npm run build:tui`, `npm run test:tui`, and `npm run test:tui:ratatui` | `pnpm run cargo:test`, `pnpm run build:tui`, `pnpm run test:tui`, and `pnpm run test:tui:ratatui` |
| CLI or product command | `npm --prefix sim-one-cli run build` and `npm run test:tui` | `pnpm run build:cli` and `pnpm run test:tui` |
| HTTP routes or gateway behavior | `npm run test:http` and `npm run smoke:http` | `pnpm run test:http` and `pnpm run smoke:http` |
| LSP integration | `GOROMBO_LSP_REAL_SERVER_TESTS=1 npm run test:lsp` | `GOROMBO_LSP_REAL_SERVER_TESTS=1 pnpm run test:lsp` |

Run the repository's named scripts exactly as configured. Do not assume a
generic `lint` command exists. Live-model tests may require credentials supplied
through the local environment; never add those credentials to a contribution.

Do not claim a check passed unless it was run successfully. If a required check
cannot run, name the command, explain why, and identify what remains unverified
in the pull request.

## Submit A Pull Request

Pull requests must target `main`. Before submitting:

- rebase or merge the current `main` branch as appropriate;
- confirm the change is focused and contains no unrelated files;
- link the relevant issue when one exists;
- update tests and documentation for changed behavior;
- update the changelog and third-party notices when required;
- run and report the required verification;
- review the complete diff for secrets and accidental runtime state.

The pull-request description should explain:

- the problem being solved;
- the implementation and important design decisions;
- user-visible or compatibility impact;
- tests and checks run;
- any known limitation or unverified behavior.

Continuous integration must pass. Maintainers may request changes to behavior,
architecture, tests, documentation, scope, or compatibility before accepting a
contribution. Passing checks does not guarantee acceptance.

## Project Policies

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [Support](SUPPORT.md)
- [Changelog](CHANGELOG.md)
- [Third-Party Notices](THIRD_PARTY_NOTICES.md)
- [MIT License](LICENSE)

Contributions accepted into this repository are provided under the project's
MIT license.
