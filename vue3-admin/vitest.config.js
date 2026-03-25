import { defineConfig } from 'vitest/config'

// Vitest config for unit tests in the Vue app.
export default defineConfig({
  test: {
    environment: 'node',
    // Enable coverage reports for quality checks in CI.
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
