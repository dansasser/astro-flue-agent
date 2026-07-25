#!/usr/bin/env python3
"""Validate release and architecture documentation without external packages."""

from __future__ import annotations

import hashlib
import re
import sys
import unicodedata
from collections import Counter
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
DOCS_ROOT = ROOT / "docs"
ARCHITECTURE_ROOT = DOCS_ROOT / "architecture"

EXPECTED_README_SECTIONS = (
    "Table of Contents",
    "Status",
    "What Is SIM-ONE Alpha?",
    "SIM-ONE Alpha vs OpenClaw and Hermes Agent",
    "Why Governance Matters",
    "Features",
    "Quick Start",
    "Installation",
    "Configuration",
    "Usage",
    "Architecture",
    "Extensibility",
    "Documentation",
    "Development",
    "Contributing",
    "Author",
    "Code of Conduct",
    "Security",
    "Support",
    "Changelog",
    "License",
    "Gorombo And The SIM-ONE Framework",
)

CURRENT_STATE_PATTERNS = (
    re.compile(r"\broadmap\b", re.IGNORECASE),
    re.compile(r"\bplanned\b", re.IGNORECASE),
    re.compile(r"\bdeferred\b", re.IGNORECASE),
    re.compile(r"\bcurrent state vs target\b", re.IGNORECASE),
    re.compile(r"\bnot built\b", re.IGNORECASE),
    re.compile(r"\bnot implemented\b", re.IGNORECASE),
    re.compile(r"\bphase\s+[0-9]+\b", re.IGNORECASE),
)

SOURCE_PREFIXES = (
    "src/",
    "crates/",
    "sim-one-cli/",
    "tui/",
    "scripts/",
    "docs/",
    "development-graph.json",
    "development-graph.md",
    "package.json",
    "rust-toolchain.toml",
)

# These are intentionally non-live references: one records a removed directory,
# and one demonstrates where a contributor would create a new model card.
NONLIVE_SOURCE_REFERENCES = {
    ("gorombo-flue-map.md", "src/services/"),
    ("model-system.md", "src/core/models/providers/ollama-cloud/cards/new-model.ts"),
}

INLINE_LINK_RE = re.compile(r"!?\[[^\]\n]*\]\(([^)\n]+)\)")
REFERENCE_LINK_RE = re.compile(r"^\s*\[[^\]\n]+\]:\s*(\S+)", re.MULTILINE)
HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*#*\s*$", re.MULTILINE)
FENCE_RE = re.compile(r"^\s*```", re.MULTILINE)
CODE_REFERENCE_RE = re.compile(r"`([^`\n]+)`")
HTML_ANCHOR_RE = re.compile(
    r"<(?:a\s+(?:name|id)|[a-z][^>]*\s+id)=[\"']([^\"']+)[\"']",
    re.IGNORECASE,
)


class DocumentationError(Exception):
    """Raised for a deterministic documentation contract violation."""


def markdown_files() -> list[Path]:
    return [ROOT / "README.md", *sorted(DOCS_ROOT.rglob("*.md"))]


def relative(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def without_fenced_blocks(text: str) -> str:
    output = []
    in_fence = False
    for line in text.splitlines(keepends=True):
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
            output.append("\n" if line.endswith("\n") else "")
            continue
        output.append(("\n" if line.endswith("\n") else "") if in_fence else line)
    return "".join(output)


def parse_link_target(raw: str) -> str:
    target = raw.strip()
    if target.startswith("<"):
        closing = target.find(">")
        if closing != -1:
            return target[1:closing]
    return target.split(maxsplit=1)[0]


def github_slug(text: str) -> str:
    text = re.sub(r"!\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"<[^>]+>", "", text)
    text = text.replace("`", "").replace("*", "").replace("_", "")
    text = text.strip().lower()
    text = "".join(
        char
        for char in text
        if char in {" ", "-"} or not unicodedata.category(char).startswith(("P", "S"))
    )
    return re.sub(r"\s", "-", text).strip("-")


def anchors_for(path: Path) -> set[str]:
    if path.suffix.lower() != ".md":
        return set()
    text = without_fenced_blocks(path.read_text(encoding="utf-8"))
    anchors = {unquote(value) for value in HTML_ANCHOR_RE.findall(text)}
    counts: Counter[str] = Counter()
    for _, heading in HEADING_RE.findall(text):
        base = github_slug(heading)
        if not base:
            continue
        suffix = counts[base]
        anchors.add(base if suffix == 0 else f"{base}-{suffix}")
        counts[base] += 1
    return anchors


def validate_local_links(files: list[Path]) -> int:
    errors: list[str] = []
    checked = 0
    anchor_cache: dict[Path, set[str]] = {}

    for source in files:
        text = without_fenced_blocks(source.read_text(encoding="utf-8"))
        raw_targets = INLINE_LINK_RE.findall(text) + REFERENCE_LINK_RE.findall(text)
        for raw_target in raw_targets:
            target = parse_link_target(raw_target)
            parsed = urlsplit(target)
            if parsed.scheme or target.startswith("//"):
                continue

            path_text = unquote(parsed.path)
            fragment = unquote(parsed.fragment)
            if not path_text and not fragment:
                continue

            destination = source if not path_text else (source.parent / path_text).resolve()
            checked += 1
            try:
                destination.relative_to(ROOT)
            except ValueError:
                errors.append(f"{relative(source)}: link escapes repository: {target}")
                continue

            if not destination.exists():
                errors.append(f"{relative(source)}: missing link target: {target}")
                continue

            if fragment:
                anchors = anchor_cache.setdefault(destination, anchors_for(destination))
                if fragment not in anchors:
                    errors.append(
                        f"{relative(source)}: missing anchor #{fragment} in "
                        f"{relative(destination)}"
                    )

    if errors:
        raise DocumentationError("\n".join(errors))
    return checked


def validate_architecture_index() -> int:
    index_path = ARCHITECTURE_ROOT / "README.md"
    index_text = without_fenced_blocks(index_path.read_text(encoding="utf-8"))
    expected = {
        path.name for path in ARCHITECTURE_ROOT.glob("*.md") if path.name != "README.md"
    }
    linked = {
        unquote(urlsplit(parse_link_target(raw)).path)
        for raw in INLINE_LINK_RE.findall(index_text)
        if unquote(urlsplit(parse_link_target(raw)).path).endswith(".md")
        and "/" not in unquote(urlsplit(parse_link_target(raw)).path)
    }
    missing = sorted(expected - linked)
    nonexistent = sorted(
        target for target in linked if not (ARCHITECTURE_ROOT / target).exists()
    )
    if missing or nonexistent:
        details = []
        if missing:
            details.append(f"architecture index missing: {', '.join(missing)}")
        if nonexistent:
            details.append(f"architecture index has nonexistent targets: {', '.join(nonexistent)}")
        raise DocumentationError("\n".join(details))
    return len(expected)


def production_files() -> list[Path]:
    paths = [ROOT / "README.md", DOCS_ROOT / "README.md"]
    for directory in ("getting-started", "guides", "reference"):
        paths.extend(sorted((DOCS_ROOT / directory).rglob("*.md")))
    paths.extend(
        [
            DOCS_ROOT / "operations" / "telegram-connector.md",
            DOCS_ROOT / "operations" / "troubleshooting.md",
        ]
    )
    return paths


def validate_production_terminology() -> None:
    errors = []
    pattern = re.compile(r"\b(?:Ratatui|Ink)\b")
    for path in production_files():
        text = without_fenced_blocks(path.read_text(encoding="utf-8"))
        for line_number, line in enumerate(text.splitlines(), 1):
            if pattern.search(line):
                errors.append(
                    f"{relative(path)}:{line_number}: implementation-specific TUI terminology"
                )
    if errors:
        raise DocumentationError("\n".join(errors))


def validate_readme_order() -> None:
    text = (ROOT / "README.md").read_text(encoding="utf-8")
    actual = tuple(
        match.group(1).strip()
        for match in re.finditer(r"^##\s+(.+?)\s*$", text, re.MULTILINE)
    )
    if actual != EXPECTED_README_SECTIONS:
        raise DocumentationError(
            "README section order differs from the release contract:\n"
            f"expected={EXPECTED_README_SECTIONS}\nactual={actual}"
        )


def validate_current_state_language() -> None:
    errors = []
    current_files = [ROOT / "README.md", DOCS_ROOT / "README.md"]
    current_files.extend(sorted(ARCHITECTURE_ROOT.glob("*.md")))
    for path in current_files:
        text = without_fenced_blocks(path.read_text(encoding="utf-8"))
        for line_number, line in enumerate(text.splitlines(), 1):
            for pattern in CURRENT_STATE_PATTERNS:
                if pattern.search(line):
                    errors.append(
                        f"{relative(path)}:{line_number}: current-state wording: "
                        f"{pattern.pattern}"
                    )
    if errors:
        raise DocumentationError("\n".join(errors))


def validate_source_references() -> int:
    errors = []
    checked = 0
    encountered_nonlive: set[tuple[str, str]] = set()

    for path in sorted(ARCHITECTURE_ROOT.glob("*.md")):
        for raw in CODE_REFERENCE_RE.findall(path.read_text(encoding="utf-8")):
            target = raw.rstrip(".,:;")
            if not target.startswith(SOURCE_PREFIXES):
                continue
            if any(char in target for char in "<>*{}|") or any(char.isspace() for char in target):
                continue
            checked += 1
            key = (path.name, target)
            if key in NONLIVE_SOURCE_REFERENCES:
                encountered_nonlive.add(key)
                continue
            if not (ROOT / target.split("#", 1)[0]).exists():
                errors.append(f"{relative(path)}: unresolved source reference: {target}")

    stale_exceptions = sorted(NONLIVE_SOURCE_REFERENCES - encountered_nonlive)
    if stale_exceptions:
        errors.extend(
            f"stale non-live source exception: {filename}: {target}"
            for filename, target in stale_exceptions
        )
    if errors:
        raise DocumentationError("\n".join(errors))
    return checked


def validate_markdown_structure(files: list[Path]) -> None:
    errors = []
    required_single_h1 = {
        ROOT / "README.md",
        DOCS_ROOT / "README.md",
        *ARCHITECTURE_ROOT.glob("*.md"),
    }
    for path in files:
        text = path.read_text(encoding="utf-8")
        if len(FENCE_RE.findall(text)) % 2:
            errors.append(f"{relative(path)}: unbalanced fenced code block")
        if path in required_single_h1:
            prose = without_fenced_blocks(text)
            h1_count = len(re.findall(r"^#\s+.+$", prose, re.MULTILINE))
            if h1_count != 1:
                errors.append(f"{relative(path)}: expected one H1, found {h1_count}")
    if errors:
        raise DocumentationError("\n".join(errors))


def documentation_snapshot(files: list[Path]) -> str:
    digest = hashlib.sha256()
    for path in files:
        digest.update(relative(path).encode("utf-8"))
        digest.update(b"\0")
        digest.update(hashlib.sha256(path.read_bytes()).hexdigest().encode("ascii"))
        digest.update(b"\n")
    return digest.hexdigest()


def main() -> int:
    files = markdown_files()
    try:
        link_count = validate_local_links(files)
        architecture_count = validate_architecture_index()
        validate_production_terminology()
        validate_readme_order()
        validate_current_state_language()
        source_count = validate_source_references()
        validate_markdown_structure(files)
    except (DocumentationError, OSError, UnicodeError) as error:
        print("Documentation validation: FAIL", file=sys.stderr)
        print(error, file=sys.stderr)
        return 1

    print("Documentation validation: PASS")
    print(f"Markdown files: {len(files)}")
    print(f"Local links checked: {link_count}")
    print(f"Architecture documents indexed: {architecture_count}")
    print(f"Architecture source references checked: {source_count}")
    print(f"Documentation snapshot SHA-256: {documentation_snapshot(files)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
