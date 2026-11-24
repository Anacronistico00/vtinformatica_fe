import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    restoreMocks: true,
    // Gli E2E (Playwright) girano a parte con npm run e2e.
    include: ['src/**/*.test.{js,jsx}'],
  },
})
