import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';

const BLOCKING = ['serious', 'critical'];

/** Attende che la pagina abbia finito di caricare dati e immagini, poi gira axe (WCAG 2.1 A e AA). */
export const checkA11y = async (page, label) => {
  // Le immagini dei prodotti di test arrivano da un sito esterno: se è lento non si aspetta oltre 10 s, i dati dell'API sono già qui.
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
  await expect(page.locator('.spinner-border')).toHaveCount(0);
  // Una pagina andata in errore e rimasta vuota non ha violazioni: deve avere contenuto.
  await expect(page.locator('.main-content'), `Pagina vuota: ${label}`).toHaveText(/\S/);
  // Transizioni finite (modali, dropdown): a metà dissolvenza il contrasto misurato non è quello reale.
  await page.evaluate(() => Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => {}))));
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const blocking = violations
    .filter((violation) => BLOCKING.includes(violation.impact))
    .map((violation) => `${violation.id} (${violation.impact}): ${violation.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
  expect(blocking, `Violazioni axe serious/critical in ${label}`).toEqual([]);
};

export const SCHEMES = ['light', 'dark'];
