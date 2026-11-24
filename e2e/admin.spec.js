import { expect, test } from '@playwright/test';
import { setStock } from './support/db.js';
import { USERS } from './support/env.js';
import { readState } from './support/state.js';
import { loginAndWait, toast } from './support/ui.js';

test('lista prodotti paginata: X-Total-Count letto attraverso il CORS reale', async ({ page }) => {
  await loginAndWait(page, USERS.admin);

  const firstPage = page.waitForResponse((r) => r.url().includes('/Product?page=1&pageSize=20'));
  await page.goto('/admin/products');
  const response = await firstPage;
  const total = Number(response.headers()['x-total-count']);
  expect(total).toBeGreaterThan(20);

  const pages = Math.ceil(total / 20);
  await expect(page.getByText(`Pagina 1 di ${pages}`)).toBeVisible();
  await page.getByRole('button', { name: '2', exact: true }).click();
  await expect(page.getByText(`Pagina 2 di ${pages}`)).toBeVisible();
  await expect(page.getByText(/E2E Riempitivo/).first()).toBeVisible();
});

test('modifica prodotto con stock cambiato nel frattempo → 409 stock_conflict', async ({ page }) => {
  const { products } = readState();
  await loginAndWait(page, USERS.admin);
  await page.goto('/admin/products');

  const card = page.locator('.card', { hasText: 'E2E Modifica concorrente' });
  await card.getByRole('button', { name: 'Modifica' }).click();
  await expect(page.getByLabel('Quantità Disponibile')).toHaveValue('10');

  // Una vendita cambia lo stock mentre l'admin ha il form aperto.
  setStock(products.staleEdit, 7);
  await page.getByLabel('Quantità Disponibile').fill('15');
  await page.getByRole('button', { name: 'Aggiorna' }).click();

  await expect(toast(page, 'Lo stock è stato modificato nel frattempo')).toBeVisible();
});
