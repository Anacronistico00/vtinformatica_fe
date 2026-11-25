import { readFileSync, writeFileSync } from 'node:fs';
import { request } from '@playwright/test';
import baseSetup from '../support/globalSetup.js';
import { API_URL, PASSWORD, USERS } from '../support/env.js';
import { STATE_FILE } from '../support/state.js';

// Oltre al seed degli E2E servono stati che il seed non crea: un ordine, un carrello pieno, una recensione.
// Creati una volta sola qui, così desktop e mobile fotografano gli stessi dati.
const tokenFor = async (api, email) => {
  const response = await api.post('/Account/login', { data: { email, password: PASSWORD } });
  if (!response.ok()) throw new Error(`Login ${email}: ${response.status()}`);
  return (await response.json()).token;
};

const send = async (api, method, path, token, data) => {
  const response = await api.fetch(path, { method, headers: { Authorization: `Bearer ${token}` }, data });
  if (!response.ok()) throw new Error(`${method} ${path}: ${response.status()} ${await response.text()}`);
  return response;
};

export default async () => {
  await baseSetup();
  const state = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  const { products } = state;
  const api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });

  const buyer = await tokenFor(api, USERS.buyer);
  await send(api, 'POST', '/Cart/me/add', buyer, { productId: products.checkout, quantity: 2 });
  await send(api, 'POST', '/Order/me/from-cart', buyer, { customerComment: 'Consegna dopo le 18' });
  const orders = await (await send(api, 'GET', '/Order/me', buyer)).json();
  await send(api, 'POST', '/Cart/me/add', buyer, { productId: products.reviews, quantity: 1 });

  const reviewer = await tokenFor(api, USERS.reviewer);
  await send(api, 'POST', '/Review', reviewer, {
    productId: products.reviews,
    reviewRating: 4,
    reviewComment: 'Montaggio semplice, silenzioso anche sotto carico.',
  });

  writeFileSync(STATE_FILE, JSON.stringify({ ...state, orderId: orders[0].id }, null, 2));
  await api.dispose();
};
