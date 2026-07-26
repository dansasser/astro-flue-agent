# Security Policy

SIM-ONE Alpha coordinates model calls, local tools, connectors, credentials,
protocols, approvals, memory, and user-controlled data. Security reports must
be handled privately so users have time to protect their systems before details
are made public.

## Supported Versions

| Version | Security support |
| --- | --- |
| 0.1.x Beta | Supported |
| Earlier development snapshots | Not supported |

Security fixes are made against the supported release line. Reproduce a report
against the latest available 0.1.x release when possible.

## Report A Vulnerability

Email [contact@gorombo.com](mailto:contact@gorombo.com) with the subject
`[SIM-ONE Alpha Security]` followed by a short description.

Do not disclose the issue in a public GitHub issue, pull request, discussion,
log, screenshot, or other public channel. Do not include working credentials,
private user data, or access tokens unless the maintainers explicitly request a
secure transfer method.

Include:

- the affected SIM-ONE Alpha version or commit;
- the installation method and operating system;
- the affected component, such as the gateway, connector, authentication,
  protocol system, approval path, capability registry, worker, TUI, API, memory,
  or dependency;
- clear reproduction steps or a minimal proof of concept;
- the expected and observed behavior;
- the likely impact and attack conditions;
- any known mitigation or workaround;
- how you would like to be credited, or whether you prefer to remain anonymous.

## What Happens Next

The maintainers will:

1. acknowledge and review the report;
2. reproduce and assess the affected release and impact;
3. coordinate questions, remediation, and disclosure with the reporter;
4. prepare a fix or mitigation for supported versions;
5. publish an advisory or release note when disclosure is appropriate.

Response and remediation time depend on severity, reproducibility, affected
dependencies, and release complexity. This policy does not promise a fixed
service-level agreement.

## Research Expectations

Use good-faith methods that avoid privacy violations, data destruction,
service disruption, social engineering, credential theft, persistence, or
access beyond what is necessary to demonstrate the issue. Stop testing and
report the issue if you encounter private data or gain unintended access.

Reports about vulnerabilities in an upstream framework, library, or model
should also follow that project's disclosure process. Contact SIM-ONE Alpha
maintainers when the dependency issue affects this product's configuration,
integration, or distributed release.

For non-security bugs, installation help, and usage questions, use
[Support](SUPPORT.md).
