import { defineConfig, devices } from '@playwright/test';
import { API_URL, FE_PORT, FE_URL } from './e2e/support/env.js';

// E2E solo in locale: BE e DB veri (vedi e2e/README.md). Un worker: i flussi condividono il DB.
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.js',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  globalSetup: './e2e/support/globalSetup.js',
  globalTeardown: './e2e/support/globalTeardown.js',
  use: {
    baseURL: FE_URL,
    // Il BE locale usa il certificato di sviluppo di ASP.NET Core.
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'dotnet run --project ../VTInformatica/VTInformatica --launch-profile https',
      url: `${API_URL}/Category`,
      ignoreHTTPSErrors: true,
      // Un BE già avviato a mano deve ammettere FE_URL nel CORS (Cors__AllowedOrigins__1).
      reuseExistingServer: true,
      timeout: 180_000,
      env: { Cors__AllowedOrigins__1: FE_URL },
    },
    {
      command: `npm run dev -- --port ${FE_PORT} --strictPort`,
      url: FE_URL,
      reuseExistingServer: false,
      env: { VITE_API_URL: API_URL },
    },
  ],
});
