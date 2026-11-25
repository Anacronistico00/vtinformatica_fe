import { expect, test } from '@playwright/test';
import { setStock } from './support/db.js';
import { USERS } from './support/env.js';
import { readState } from './support/state.js';
import { loginAndWait, toast } from './support/ui.js';

const confirmDialogs = (page) => page.on('dialog', (dialog) => dialog.accept());

test('login → carrello → checkout → ordine in "i miei ordini"', async ({ page }) => {
  const { products } = readState();
  confirmDialogs(page);
  await loginAndWait(page, USERS.buyer);

  await page.goto(`/product/${products.checkout}`);
  await expect(page.getByRole('heading', { name: 'E2E Checkout' })).toBeVisible();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByRole('button', { name: 'Aggiungi al carrello' }).click();
  await expect(toast(page, 'Prodotto aggiunto al carrello.')).toBeVisible();

  await page.goto('/cart');
  await expect(page.getByText('E2E Checkout')).toBeVisible();
  await expect(page.getByText('quantità: 2 pz')).toBeVisible();
  await page.getByLabel("Note per l'ordine (facoltative)").fill('Consegna dopo le 18');
  await page.getByRole('button', { name: "Completa l'ordine" }).click();
  await expect(toast(page, 'Ordine creato con successo!')).toBeVisible();
  await expect(page.getByText('Il tuo carrello è vuoto.')).toBeVisible();

  await page.goto('/accountInfo');
  await expect(page.getByText('Totale ordini: 1')).toBeVisible();
  await page.getByRole('link', { name: 'Visualizza tutti i tuoi ordini' }).click();
  await expect(page.getByText('Ordine n°:')).toBeVisible();
  await expect(page.getByText('20.00')).toBeVisible();
});

test('checkout con stock diventato insufficiente → 409 con il motivo', async ({ page }) => {
  const { products } = readState();
  confirmDialogs(page);
  await loginAndWait(page, USERS.lowStock);

  await page.goto(`/product/${products.lowStock}`);
  await page.getByRole('button', { name: '+' }).click();
  await page.getByRole('button', { name: 'Aggiungi al carrello' }).click();
  await page.goto('/cart');
  await expect(page.getByText('quantità: 2 pz')).toBeVisible();

  // Un altro acquisto concorrente lascia un solo pezzo.
  setStock(products.lowStock, 1);
  await page.getByRole('button', { name: "Completa l'ordine" }).click();

  await expect(toast(page, 'lo stock del prodotto non è sufficiente')).toBeVisible();
  await expect(page.getByText('E2E Stock basso')).toBeVisible();
});

test('il menu Categorie funziona anche aprendo direttamente una pagina interna', async ({ page }) => {
  const { products } = readState();
  await page.goto(`/product/${products.checkout}`);
  await page.locator('.site-nav').getByRole('button', { name: 'Categorie' }).click();
  await expect(page.getByRole('link', { name: /Componenti PC/ })).toBeVisible();
});

test('"Aggiungi al carrello" resta disabilitato con una quantità non valida', async ({ page }) => {
  const { products } = readState();
  await page.goto(`/product/${products.lowStock}`);
  const add = page.getByRole('button', { name: 'Aggiungi al carrello' });
  await expect(add).toBeEnabled();
  await page.getByRole('spinbutton', { name: 'Quantità' }).fill('0');
  await expect(add).toBeDisabled();
  await page.getByRole('spinbutton', { name: 'Quantità' }).fill('3');
  await expect(add).toBeDisabled();
});
