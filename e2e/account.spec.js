import { expect, test } from '@playwright/test';
import { PASSWORD, USERS } from './support/env.js';
import { login, loginAndWait, toast } from './support/ui.js';

test('disattivazione self → login → riattivazione → benvenuto', async ({ page }) => {
  await loginAndWait(page, USERS.deactivate);

  await page.getByRole('button', { name: 'Disattiva il mio account' }).click();
  await page.getByLabel('Motivo (facoltativo)').fill('Prova E2E');
  await page.getByRole('button', { name: 'Conferma disattivazione' }).click();
  await expect(toast(page, 'Account disattivato')).toBeVisible();

  await login(page, USERS.deactivate);
  await expect(page.getByRole('heading', { name: 'Riattiva il tuo account' })).toBeVisible();
  await expect(page.getByLabel('Email')).toHaveValue(USERS.deactivate);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Riattiva il mio account' }).click();

  await expect(page.getByRole('heading', { name: 'Bentornato!' })).toBeVisible();
  await page.getByRole('link', { name: 'Il mio account' }).click();
  await expect(page.getByText(`Username: ${USERS.deactivate}`)).toBeVisible();
});

test('account sospeso → messaggio di negazione', async ({ page }) => {
  await login(page, USERS.suspended);

  await expect(page.getByRole('alert').filter({ hasText: 'sospeso' })).toBeVisible();
  await expect(page).toHaveURL(/\/account$/);
});

test('sessione scaduta (token con exp passato in localStorage) → utente non loggato', async ({ page }) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': USERS.buyer,
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Admin',
      exp: Math.floor(Date.now() / 1000) - 60,
    })
  ).toString('base64url');
  const expiredToken = `${header}.${payload}.signature`;

  // Stato persistito come lo scrive redux-persist: ogni slice serializzato a parte.
  await page.addInitScript((token) => {
    window.localStorage.setItem(
      'persist:root',
      JSON.stringify({
        auth: JSON.stringify({
          user: { email: 'e2e.buyer@example.test', role: 'Admin' },
          token,
          isAuthenticated: true,
          _persistedAt: Date.now(),
        }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      })
    );
  }, expiredToken);

  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto('/accountInfo');

  await expect(page.getByRole('link', { name: 'Accedi' })).toBeVisible();
  await expect(page.getByRole('link', { name: /admin/i })).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});
