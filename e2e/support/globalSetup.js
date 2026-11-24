import { writeFileSync } from 'node:fs';
import { request } from '@playwright/test';
import { cleanupTestData, runSql } from './db.js';
import { ADMIN_ROLE_ID, API_URL, PASSWORD, USERS } from './env.js';
import { STATE_FILE } from './state.js';

const register = async (api, email) => {
  const response = await api.post('/Account/register', {
    data: { email, password: PASSWORD, firstName: 'E2E', lastName: 'Test', birthDate: '1990-01-01' },
  });
  if (!response.ok()) throw new Error(`Registrazione ${email}: ${response.status()} ${await response.text()}`);
};

const login = async (api, email) => {
  const response = await api.post('/Account/login', { data: { email, password: PASSWORD } });
  if (!response.ok()) throw new Error(`Login ${email}: ${response.status()}`);
  return (await response.json()).token;
};

const createProduct = async (api, token, name, quantity) => {
  const response = await api.post('/Product', {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      name,
      manufacturerId: 1,
      description: `Prodotto di test ${name}`,
      price: 10,
      quantity,
      fullDescription: 'Creato dagli E2E, rimosso al termine.',
      subCategoryId: 1,
      productImages: [{ imageUrl: 'https://placehold.co/300x300?text=E2E' }],
    },
  });
  if (response.status() !== 201) throw new Error(`Prodotto ${name}: ${response.status()} ${await response.text()}`);
  return Number(response.headers().location.split('/').pop());
};

export default async () => {
  // Avanzi di un'esecuzione interrotta.
  cleanupTestData();

  const api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });

  for (const email of Object.values(USERS)) await register(api, email);

  // L'API non assegna ruoli: l'utente admin di test lo diventa via SQL (solo la sua riga).
  runSql(
    `UPDATE AspNetUserRoles SET RoleId = '${ADMIN_ROLE_ID}' ` +
      `WHERE UserId = (SELECT Id FROM AspNetUsers WHERE Email = '${USERS.admin}')`
  );
  const adminToken = await login(api, USERS.admin);

  // I prodotti con un ruolo nei flussi per primi: id più bassi, quindi nella prima pagina admin.
  const products = {
    checkout: await createProduct(api, adminToken, 'E2E Checkout', 50),
    lowStock: await createProduct(api, adminToken, 'E2E Stock basso', 2),
    reviews: await createProduct(api, adminToken, 'E2E Recensioni', 10),
    staleEdit: await createProduct(api, adminToken, 'E2E Modifica concorrente', 10),
  };
  // Abbastanza prodotti per avere più di una pagina (20 per pagina) nella lista admin.
  for (let i = 1; i <= 25; i += 1) {
    await createProduct(api, adminToken, `E2E Riempitivo ${String(i).padStart(2, '0')}`, 10);
  }

  const users = await api.get('/Account/UsersList', { headers: { Authorization: `Bearer ${adminToken}` } });
  const suspendedId = (await users.json()).users.find((u) => u.email === USERS.suspended).id;
  const suspend = await api.put(`/Account/${suspendedId}/suspend`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: { note: 'Sospeso dagli E2E' },
  });
  if (suspend.status() !== 204) throw new Error(`Sospensione: ${suspend.status()}`);

  writeFileSync(STATE_FILE, JSON.stringify({ products }, null, 2));
  await api.dispose();
};
