import assert from 'node:assert/strict';
import { join } from 'node:path';
import test from 'node:test';
import { dependencyLinkStaysInsideRoot } from './portable-node-modules.mjs';

test('dependency links stay inside the portable node_modules tree', () => {
  const root = join('/runtime', '.gorombo', 'sim-one-alpha', 'node_modules');
  const link = join(root, '.pnpm', 'node_modules', 'example');

  assert.equal(
    dependencyLinkStaysInsideRoot(
      link,
      '../example@1.0.0/node_modules/example',
      root,
    ),
    true,
  );
  assert.equal(
    dependencyLinkStaysInsideRoot(
      link,
      '../../../../../source-checkout/sim-one-cli',
      root,
    ),
    false,
  );
  assert.equal(
    dependencyLinkStaysInsideRoot(link, '/source-checkout/sim-one-cli', root),
    false,
  );
});
