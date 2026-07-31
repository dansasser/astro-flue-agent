import { readFileSync } from 'node:fs';
import { extname, relative } from 'node:path';

export interface CapabilityPackageScanFinding {
  path: string;
  line: number;
  category: 'secret' | 'host-path' | 'unsafe-source';
  severity: 'error';
  message: string;
}

const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[opusr]_[A-Za-z0-9]{20,}\b/,
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/,
  /\bBearer\s+[A-Za-z0-9._~+/=-]{20,}\b/,
  /\bAKIA[A-Z0-9]{16}\b/,
  /\b(?:api[_-]?key|access[_-]?key|secret|token|password|private[_-]?key)\b\s*[:=]\s*["'`]?[A-Za-z0-9+/_=-]{12,}/i,
];

const hostPathPatterns = [
  /(?:^|[\s"'`(=:[,])\/(?:opt|root|home|etc|var|usr|tmp|srv|mnt|media|run|dev)(?:\/[^\s"'`),;\]}]+)?/,
  /(?:^|[\s"'`(=:[,])[A-Za-z]:\\[^\s"'`),;\]}]+/i,
  /(?:^|[\s"'`(=:[,])~\/[^\s"'`),;\]}]+/,
];

const executableSourceExtensions = new Set([
  '.bash',
  '.bat',
  '.cjs',
  '.cmd',
  '.cts',
  '.js',
  '.jsx',
  '.mjs',
  '.mts',
  '.pl',
  '.ps1',
  '.py',
  '.rb',
  '.sh',
  '.ts',
  '.tsx',
  '.zsh',
]);

export function scanCapabilityPackage(
  root: string,
  files: string[],
): CapabilityPackageScanFinding[] {
  const findings: CapabilityPackageScanFinding[] = [];
  for (const file of files) {
    const content = readFileSync(file);
    const path = relative(root, file).split('\\').join('/');
    if (content.includes(0)) {
      if (isExecutableSource(file, content)) {
        findings.push({
          path,
          line: 1,
          category: 'unsafe-source',
          severity: 'error',
          message: 'NUL byte in executable capability file',
        });
      }
      continue;
    }
    let text: string;
    try {
      text = new TextDecoder('utf-8', { fatal: true }).decode(content);
    } catch {
      if (isExecutableSource(file, content)) {
        findings.push({
          path,
          line: 1,
          category: 'unsafe-source',
          severity: 'error',
          message: 'invalid UTF-8 in executable capability file',
        });
      }
      continue;
    }
    text.split(/\r?\n/).forEach((line, index) => {
      if (secretPatterns.some((pattern) => pattern.test(line))) {
        findings.push({
          path,
          line: index + 1,
          category: 'secret',
          severity: 'error',
          message: 'possible credential value',
        });
      }
      if (hostPathPatterns.some((pattern) => pattern.test(line))) {
        findings.push({
          path,
          line: index + 1,
          category: 'host-path',
          severity: 'error',
          message: 'machine-specific absolute host path',
        });
      }
    });
  }
  return findings;
}

function isExecutableSource(file: string, content: Buffer): boolean {
  return executableSourceExtensions.has(extname(file).toLowerCase())
    || content.subarray(0, 2).toString('ascii') === '#!';
}
