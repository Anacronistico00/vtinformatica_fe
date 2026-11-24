import { expect } from '@playwright/test';
import { PASSWORD } from './env.js';

export const login = async (page, email, password = PASSWORD) => {
  await page.goto('/account');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Accedi' }).click();
};

export const loginAndWait = async (page, email) => {
  await login(page, email);
  await expect(page).toHaveURL(/\/accountInfo$/);
};

/** Toast di react-toastify con il testo indicato. */
export const toast = (page, text) => page.locator('.Toastify__toast').filter({ hasText: text });
