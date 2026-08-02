import { defineSubagent } from '@flue/runtime';

function TestWorker() {
  return 'Base instructions from the module.';
}

export default defineSubagent({
  name: 'test-worker',
  description: 'A test worker for automated testing.',
  agent: TestWorker,
});
