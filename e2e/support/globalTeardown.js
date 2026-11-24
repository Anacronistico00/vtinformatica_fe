import { rmSync } from 'node:fs';
import { cleanupTestData, countTestData } from './db.js';
import { STATE_FILE } from './state.js';

export default async () => {
  cleanupTestData();
  rmSync(STATE_FILE, { force: true });
  const left = countTestData();
  if (left !== '0 0') throw new Error(`Dati E2E rimasti nel DB (utenti, prodotti): ${left}`);
};
