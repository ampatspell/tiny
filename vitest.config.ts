import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: ['**/migrations/*.ts'],
    },
    alias: {
      $lib: 'src/lib',
    },
  },
});
