import { createRequire as createModuleRequire } from 'node:module';
import { join } from 'node:path';
import type {
  ModifierLike,
  Node,
  NodeArray,
  SyntaxKind,
} from 'typescript';
import {
  createGoromboRuntimePaths,
  resolveGoromboRuntimeRoot,
} from '../../core/config/runtime-root.js';

const ts = loadTypeScript();

export function hasExportedFlueFactory(
  content: string,
  factoryName: 'defineTool' | 'defineAgentProfile',
): boolean {
  const source = ts.createSourceFile(
    'index.mjs',
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  const factoryBindings = new Set<string>();
  const factoryValues = new Set<string>();
  const namedExports = new Set<string>();

  for (const statement of source.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      statement.moduleSpecifier.text === '@flue/runtime' &&
      statement.importClause?.namedBindings &&
      ts.isNamedImports(statement.importClause.namedBindings)
    ) {
      for (const element of statement.importClause.namedBindings.elements) {
        if ((element.propertyName ?? element.name).text === factoryName) {
          factoryBindings.add(element.name.text);
        }
      }
    }
  }
  if (factoryBindings.size === 0) {
    return false;
  }

  for (const statement of source.statements) {
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (
          ts.isIdentifier(declaration.name) &&
          declaration.initializer &&
          isFactoryExportValue(declaration.initializer, factoryBindings)
        ) {
          factoryValues.add(declaration.name.text);
          if (hasModifier(statement.modifiers, ts.SyntaxKind.ExportKeyword)) {
            namedExports.add(declaration.name.text);
          }
        }
      }
      continue;
    }
    if (
      ts.isExportDeclaration(statement) &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause)
    ) {
      for (const element of statement.exportClause.elements) {
        namedExports.add((element.propertyName ?? element.name).text);
      }
    }
  }

  for (const statement of source.statements) {
    if (ts.isExportAssignment(statement)) {
      if (
        isFactoryExportValue(statement.expression, factoryBindings) ||
        (ts.isIdentifier(statement.expression) &&
          factoryValues.has(statement.expression.text))
      ) {
        return true;
      }
    }
  }

  return [...factoryValues].some((name) => namedExports.has(name));
}

function isFactoryExportValue(
  node: Node,
  factoryBindings: Set<string>,
): boolean {
  if (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    factoryBindings.has(node.expression.text)
  ) {
    return true;
  }
  if (ts.isParenthesizedExpression(node)) {
    return isFactoryExportValue(node.expression, factoryBindings);
  }
  if (ts.isArrayLiteralExpression(node)) {
    return (
      node.elements.length > 0
      && node.elements.every((element) =>
        isFactoryExportValue(element, factoryBindings),
      )
    );
  }
  return false;
}

function hasModifier(
  modifiers: NodeArray<ModifierLike> | undefined,
  kind: SyntaxKind,
): boolean {
  return modifiers?.some((modifier) => modifier.kind === kind) ?? false;
}

function loadTypeScript(): typeof import('typescript') {
  const candidates = [
    createModuleRequire(import.meta.url),
    createModuleRequire(
      join(
        createGoromboRuntimePaths(
          resolveGoromboRuntimeRoot({ modulePath: import.meta.url }),
        ).packagedServer,
        'package.json',
      ),
    ),
  ];
  for (const requireFrom of candidates) {
    try {
      return requireFrom('typescript') as typeof import('typescript');
    } catch {
      continue;
    }
  }
  throw new Error(
    'TypeScript parser is unavailable for capability contract validation.',
  );
}
