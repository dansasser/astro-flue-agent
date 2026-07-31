# Acceptance Specification: Canonical Runtime Configuration

## ACC-CONFIG-001: Inventory Completeness

A deterministic scan of production TypeScript, Rust, CLI, scripts, model cards,
and capability token declarations finds no SIM-ONE-owned user configuration key
missing from the typed registry and `sim-one.config.example`.

## ACC-CONFIG-002: Local Owner Build

With credentials present only in repository-root `sim-one.config`, run the
production build and launch `./.gorombo/sim-one-cli/sim-one`. The gateway,
selected model, Telegram configuration status, and GitHub MCP configuration
status reflect the file without sourcing `.env` or exporting those keys.

## ACC-CONFIG-003: Missing Optional Integration

Omit Telegram and GitHub credentials. The TUI and HTTP gateway still start,
while Telegram and GitHub report their exact missing key names without exposing
other configuration.

## ACC-CONFIG-004: Required Provider Failure

Select a provider that requires credentials and omit its required keys. Startup
or preflight fails with the missing key names and provider identity, not a
downstream authentication error or an empty generic failure.

## ACC-CONFIG-005: Moved Runtime

Copy the complete local `.gorombo` tree to an unrelated directory, launch from
an arbitrary cwd, and prove that the copied `sim-one.config` is used while the
source `sim-one.config`, source `.env`, HOME, and caller cwd are not consulted.

## ACC-CONFIG-006: Release Secret Exclusion

Build a release archive while a real source `sim-one.config` exists. The archive
contains `sim-one.config.example`, excludes `sim-one.config` and every `.env`,
and passes content and path scans for owner secrets.

## ACC-CONFIG-007: Coding Worker Status

The Coding Worker configuration capability lists registered keys and returns
set, missing, invalid, or deprecated status without returning any configured
value.

## ACC-CONFIG-008: Coding Worker Update

A denied, missing, expired, or mismatched approval prevents a configuration
write. A current matching approval permits one atomic allowlisted update,
including a user-supplied secret, retains owner-only permissions, and emits a
redacted audit/progress event. The supplied value appears in neither the
approval record nor tool/progress output, and the capability cannot read it
back after the write.

## ACC-CONFIG-009: Telegram Source

Telegram token, webhook secret, approved/admin users, bot username, and mention
patterns are loaded only from the canonical configuration in production.

## ACC-CONFIG-010: GitHub Source

The official GitHub MCP and command-scoped private-clone fallback receive
`GITHUB_PERSONAL_ACCESS_TOKEN` from the trusted canonical configuration while
general Coding Worker shell tools and logs do not. A PAT supplied in a current
configuration request may pass only through the dedicated approval-gated
configuration update.

## ACC-CONFIG-011: Unsupported And Future Keys

Stale placeholders and unimplemented Gmail/Google settings are not reported as
working capabilities. Adding a future integration key without registry,
example, onboarding, and test coverage fails the configuration contract check.

## ACC-CONFIG-012: Legacy Source Rejection

Production launch with values present only in `.env` or `.gorombo/.env` does
not silently load them. Diagnostics direct the operator to `sim-one.config`.

## ACC-CONFIG-013: Test-Control Isolation

Test-only and command-scoped developer variables remain usable by their named
harnesses but are not presented as production onboarding settings.

## ACC-CONFIG-014: Documentation Agreement

README, installation, configuration, onboarding, product-TUI, architecture,
OpenWiki, example-file comments, and launcher diagnostics all name the same
source and runtime configuration paths.
