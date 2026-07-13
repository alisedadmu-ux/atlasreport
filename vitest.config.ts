import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', '.nuxt'],
    coverage: {
      provider: 'v8',
      include: ['app/utils/**', 'app/composables/**', 'server/utils/**']
    }
  }
})