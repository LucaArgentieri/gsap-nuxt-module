import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Nuxt fixtures each allocate a local server port. Serial files avoid
    // port-allocation races and make browser lifecycle tests deterministic.
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/runtime/build.d.ts'],
      reporter: ['text', 'json-summary'],
      thresholds: {
        statements: 89,
        branches: 75,
        functions: 83,
        lines: 90,
      },
    },
  },
})
