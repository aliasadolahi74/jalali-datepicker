import { defineConfig } from 'vitest/config';

// Explicit config so vitest does not inherit vite.config.ts, which is the
// library *build* (lib entry, externals) and has nothing to do with tests.
export default defineConfig({
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    // Default to Node; component tests opt into jsdom with a file docblock.
    environment: 'node',
  },
});
