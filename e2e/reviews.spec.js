import { expect, test } from '@playwright/test';
import { USERS } from './support/env.js';
import { readState } from './support/state.js';
import { loginAndWait, toast } from './support/ui.js';

const reviewItem = (page, text) => page.locator('li', { hasText: text });

test('recensioni: crea, modifica ed elimina solo la propria', async ({ page, browser }) => {
  const { products } = readState();
  page.on('dialog', (dialog) => dialog.accept());
  await loginAndWait(page, USERS.reviewer);
  await page.goto(`/product/${products.reviews}`);

  await page.getByRole('button', { name: 'Voto 4' }).click();
  await page.getByLabel('La tua recensione').fill('Recensione E2E');
  await page.getByRole('button', { name: 'Pubblica' }).click();
  await expect(toast(page, 'Recensione pubblicata.')).toBeVisible();
  await expect(reviewItem(page, 'Recensione E2E').getByLabel('4 su 5')).toBeVisible();

  await reviewItem(page, 'Recensione E2E').getByRole('button', { name: 'Modifica' }).click();
  await page.getByRole('button', { name: 'Voto 2' }).click();
  await page.getByLabel('La tua recensione').fill('Recensione E2E modificata');
  await page.getByRole('button', { name: 'Salva modifiche' }).click();
  await expect(reviewItem(page, 'Recensione E2E modificata').getByLabel('2 su 5')).toBeVisible();

  // Un altro utente la vede, ma senza azioni.
  const otherContext = await browser.newContext({ ignoreHTTPSErrors: true });
  const other = await otherContext.newPage();
  await loginAndWait(other, USERS.other);
  await other.goto(`/product/${products.reviews}`);
  await expect(reviewItem(other, 'Recensione E2E modificata')).toBeVisible();
  await expect(reviewItem(other, 'Recensione E2E modificata').getByRole('button')).toHaveCount(0);
  await otherContext.close();

  await reviewItem(page, 'Recensione E2E modificata').getByRole('button', { name: 'Elimina' }).click();
  await expect(toast(page, 'Recensione eliminata.')).toBeVisible();
  await expect(page.getByText('Recensione E2E modificata')).toHaveCount(0);
});
