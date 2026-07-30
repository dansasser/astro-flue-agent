import { readFileSync } from 'node:fs';
import { relative } from 'node:path';

export interface CapabilityPackageScanFinding {
  path: string;
  line: number;
  category: 'secret' | 'host-path';
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

export function scanCapabilityPackage(
  root: string,
  files: string[],
): CapabilityPackageScanFinding[] {
  const findings: CapabilityPackageScanFinding[] = [];
  for (const file of files) {
    const content = readFileSync(file);
    if (content.includes(0)) {
      continue;
    }
    const path = relative(root, file).split('\\').join('/');
    content.toString('utf8').split(/\r?\n/).forEach((line, index) => {
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
