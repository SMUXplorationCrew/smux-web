import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    // .tsx included so component rendering can be tested. The rich-text converters
    // are the reason: whether editor formatting survives to the page is exactly the
    // kind of thing that silently regresses.
    include: ['tests/int/**/*.int.spec.{ts,tsx}', 'tests/unit/**/*.unit.spec.{ts,tsx}'],
  },
})
