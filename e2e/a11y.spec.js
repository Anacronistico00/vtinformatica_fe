import { expect, test } from '@playwright/test';
import { checkA11y, SCHEMES } from './support/axe.js';
import { USERS } from './support/env.js';
import { readState } from './support/state.js';
import { loginAndWait, toast } from './support/ui.js';

// Accessibilità (axe, WCAG 2.1 A e AA) di ogni gruppo di pagine, in tema chiaro e scuro.
// Il tema segue prefers-color-scheme (preferenza "auto"): emulateMedia lo cambia prima di aprire la pagina.
const audit = (group, pages) => {
  for (const scheme of SCHEMES) {
    test(`a11y ${group} (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      for (const [name, path] of pages) {
        await page.goto(path);
        await checkA11y(page, `${group}/${name} (${scheme})`);
      }
    });
  }
};

audit('layout', [
  ['home', '/'],
  ['non autorizzato', '/not-authorized'],
  ['non trovata', '/pagina-inesistente'],
]);

audit('catalogo e ricerca', [
  ['categoria', '/products/category/1'],
  ['sottocategoria', '/products/subcategory/1'],
  ['marchi', '/manufacturers'],
  ['marchio', '/products/manufacturer/1'],
  ['ricerca', '/search/E2E'],
  ['ricerca senza risultati', '/search/nessunprodottoconquestonome'],
]);

for (const scheme of SCHEMES) {
  test(`a11y scheda prodotto (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto(`/product/${readState().products.reviews}`);
    await checkA11y(page, `scheda prodotto (${scheme})`);

    await page.getByRole('button', { name: 'Ingrandisci immagine' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await checkA11y(page, `scheda prodotto, immagini ingrandite (${scheme})`);
  });

  test(`a11y scheda prodotto con accesso e modulo recensione (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await loginAndWait(page, USERS.reviewer);
    await page.goto(`/product/${readState().products.reviews}`);
    await expect(page.getByLabel('La tua recensione')).toBeVisible();
    await checkA11y(page, `scheda prodotto da loggato (${scheme})`);
  });
}

audit('carrello da anonimo', [['carrello', '/cart']]);

// Flusso intero con un utente che gli altri E2E non usano per carrello e ordini.
for (const scheme of SCHEMES) {
  test(`a11y carrello, checkout e ordini (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    page.on('dialog', (dialog) => dialog.accept());
    await loginAndWait(page, USERS.other);

    await page.goto(`/product/${readState().products.checkout}`);
    await page.getByRole('button', { name: 'Aggiungi al carrello' }).click();
    await page.goto('/cart');
    await expect(page.getByText('E2E Checkout')).toBeVisible();
    await checkA11y(page, `carrello pieno (${scheme})`);

    await page.getByRole('button', { name: "Completa l'ordine" }).click();
    await expect(toast(page, 'Ordine creato con successo!')).toBeVisible();
    await checkA11y(page, `carrello con avviso di ordine creato (${scheme})`);

    await page.goto('/orders');
    await expect(page.getByText('Ordine n°:').first()).toBeVisible();
    await checkA11y(page, `i miei ordini (${scheme})`);

    await page.getByText('Ordine n°:').first().click();
    await expect(page.getByRole('heading', { name: /Dettaglio Ordine/ })).toBeVisible();
    await checkA11y(page, `dettaglio ordine (${scheme})`);

    await page.getByRole('button', { name: 'Annulla Ordine' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await checkA11y(page, `dettaglio ordine, conferma di annullamento (${scheme})`);
  });
}
