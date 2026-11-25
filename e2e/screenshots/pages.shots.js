import { mkdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { USERS } from '../support/env.js';
import { readState } from '../support/state.js';
import { loginAndWait } from '../support/ui.js';

// Una foto a pagina intera per ogni pagina, per viewport (project) e tema (SHOTS_THEME).
// Nome file: <gruppo>-<pagina>-<viewport>-<tema>.png, stabile tra "prima", direzioni e "dopo".
const DIR = process.env.SHOTS_DIR ?? 'docs/restyle/before';
const THEME = process.env.SHOTS_THEME ?? 'light';
// SHOTS_ONLY: nomi separati da virgola (es. public-home,public-product) per fotografare solo quelle pagine.
const ONLY = process.env.SHOTS_ONLY?.split(',').map((name) => name.trim()).filter(Boolean);

// I toast dipendono dai tempi, non dalla pagina: restano fuori dalle foto.
const HIDE = '.Toastify { visibility: hidden !important; }';

const settle = async (page) => {
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.spinner-border')).toHaveCount(0);
  // Scorre fino in fondo per caricare le immagini lazy, poi torna su.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    window.scrollTo(0, 0);
    await document.fonts.ready;
    const pending = [...document.images].filter((img) => !img.complete);
    await Promise.all(pending.map((img) => new Promise((resolve) => { img.onload = img.onerror = resolve; })));
  });
  await page.waitForLoadState('networkidle');
};

const shoot = async (page, testInfo, name, path) => {
  if (ONLY && !ONLY.includes(name)) return;
  await page.goto(path);
  await settle(page);
  mkdirSync(DIR, { recursive: true });
  await page.screenshot({
    path: `${DIR}/${name}-${testInfo.project.name}-${THEME}.png`,
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
    style: HIDE,
  });
};

test('pagine pubbliche', async ({ page }, testInfo) => {
  const { products } = readState();
  const pages = [
    ['public-home', '/'],
    ['public-category', '/products/category/1'],
    ['public-subcategory', '/products/subcategory/1'],
    ['public-manufacturers', '/manufacturers'],
    ['public-manufacturer', '/products/manufacturer/1'],
    ['public-search', '/search/E2E'],
    ['public-product', `/product/${products.reviews}`],
    ['public-cart-empty', '/cart'],
    ['public-login', '/account'],
    ['public-register', '/register'],
    ['public-reactivate', '/reactivate'],
    ['public-not-authorized', '/not-authorized'],
    ['public-not-found', '/pagina-inesistente'],
  ];
  for (const [name, path] of pages) await shoot(page, testInfo, name, path);
});

test('pagine account', async ({ page }, testInfo) => {
  const { products, orderId } = readState();
  await loginAndWait(page, USERS.buyer);
  const pages = [
    ['account-info', '/accountInfo'],
    ['account-cart', '/cart'],
    ['account-orders', '/orders'],
    ['account-order-detail', `/orderInfo/${orderId}`],
    ['account-product-reviews', `/product/${products.reviews}`],
  ];
  for (const [name, path] of pages) await shoot(page, testInfo, name, path);
});

test('pagine admin', async ({ page }, testInfo) => {
  await loginAndWait(page, USERS.admin);
  const pages = [
    ['admin-dashboard', '/admin'],
    ['admin-products', '/admin/products'],
    ['admin-categories', '/admin/categories'],
    ['admin-subcategories', '/admin/subcategories'],
    ['admin-manufacturers', '/admin/manufacturers'],
    ['admin-users', '/admin/users'],
  ];
  for (const [name, path] of pages) await shoot(page, testInfo, name, path);
});
