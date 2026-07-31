import {
  lstatSync,
  readdirSync,
  readlinkSync,
  rmSync,
} from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';

export function findExternalDependencyLinks(nodeModulesRoot) {
  const root = resolve(nodeModulesRoot);
  const externalLinks = [];
  visitDirectory(root, root, externalLinks);
  return externalLinks;
}

export function removeExternalDependencyLinks(nodeModulesRoot) {
  const externalLinks = findExternalDependencyLinks(nodeModulesRoot);
  for (const link of externalLinks) {
    rmSync(link.path, { force: true });
  }
  return externalLinks;
}

export function dependencyLinkStaysInsideRoot(linkPath, target, nodeModulesRoot) {
  const root = resolve(nodeModulesRoot);
  const resolvedTarget = isAbsolute(target)
    ? resolve(target)
    : resolve(dirname(linkPath), target);
  const relativeTarget = relative(root, resolvedTarget);
  return (
    relativeTarget === '' ||
    (
      relativeTarget !== '..' &&
      !relativeTarget.startsWith(`..${sep}`) &&
      !isAbsolute(relativeTarget)
    )
  );
}

function visitDirectory(directory, root, externalLinks) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) {
      const target = readlinkSync(entryPath);
      if (!dependencyLinkStaysInsideRoot(entryPath, target, root)) {
        externalLinks.push({
          path: entryPath,
          target,
        });
      }
      continue;
    }

    if (entry.isDirectory() && lstatSync(entryPath).isDirectory()) {
      visitDirectory(entryPath, root, externalLinks);
    }
  }
}
