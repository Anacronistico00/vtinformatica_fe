import { defineConfig } from '@playwright/test';
import base from './playwright.config.js';

// Screenshot delle pagine per il confronto visivo (docs/restyle): stessi server e stessi dati di seed degli E2E.
// SHOTS_DIR sceglie la cartella di destinazione, SHOTS_THEME il prefers-color-scheme emulato (light | dark).
const theme = process.env.SHOTS_THEME ?? 'light';

export default defineConfig({
  ...base,
  testDir: './e2e/screenshots',
  testMatch: '**/*.shots.js',
  globalSetup: './e2e/screenshots/globalSetup.js',
  timeout: 120_000,
  reporter: [['list']],
  use: { ...base.use, colorScheme: theme, reducedMotion: 'reduce', trace: 'off' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
});
