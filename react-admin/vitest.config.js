import { defineConfig } from 'vitest/config'

// Vitest config for unit tests in the React app.
export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov']
    }
  }
})
