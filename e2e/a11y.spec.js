import { test } from '@playwright/test';
import { checkA11y, SCHEMES } from './support/axe.js';

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
