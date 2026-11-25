import { expect, test } from '@playwright/test';
import { checkA11y, SCHEMES } from './support/axe.js';
import { USERS } from './support/env.js';
import { readState } from './support/state.js';
import { loginAndWait } from './support/ui.js';

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
