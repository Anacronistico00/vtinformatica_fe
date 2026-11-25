import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { USERS } from '../support/env.js';
import { readState } from '../support/state.js';
import { loginAndWait } from '../support/ui.js';
import { accountPages, adminPages, publicPages } from './pageList.js';

// Rapporto axe (tutte le gravità) sulle stesse pagine delle foto, in docs/restyle/axe-<AXE_LABEL>.json.
// Serve a confrontare prima e dopo il restyle: non fallisce mai, conta soltanto.
// AXE_LABEL: before | after. SHOTS_THEME: light | dark (prefers-color-scheme emulato).
const LABEL = process.env.AXE_LABEL ?? 'after';
const THEME = process.env.SHOTS_THEME ?? 'light';
const FILE = `docs/restyle/axe-${LABEL}.json`;

const record = (name, violations) => {
  const impacts = { minor: 0, moderate: 0, serious: 0, critical: 0 };
  for (const violation of violations) impacts[violation.impact] += 1;
  const all = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : {};
  all[THEME] = { ...all[THEME], [name]: { ...impacts, rules: violations.map((v) => `${v.id} (${v.impact})`) } };
  mkdirSync('docs/restyle', { recursive: true });
  writeFileSync(FILE, `${JSON.stringify(all, null, 2)}\n`);
};

const audit = async (page, pages) => {
  for (const [name, path] of pages) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.spinner-border')).toHaveCount(0);
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    record(name, violations);
  }
};

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(!process.env.AXE_LABEL, 'rapporto axe solo su richiesta (AXE_LABEL)');
  test.skip(testInfo.project.name !== 'desktop', 'axe gira una volta sola, a 1440');
  await page.route('https://media.ldlc.com/**', (route) => route.abort());
});

test('axe pagine pubbliche', async ({ page }) => audit(page, publicPages(readState())));

test('axe pagine account', async ({ page }) => {
  await loginAndWait(page, USERS.buyer);
  await audit(page, accountPages(readState()));
});

test('axe pagine admin', async ({ page }) => {
  await loginAndWait(page, USERS.admin);
  await audit(page, adminPages());
});
