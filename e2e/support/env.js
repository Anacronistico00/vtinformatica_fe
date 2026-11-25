// Configurazione degli E2E da variabili d'ambiente. In locale SQL Server con autenticazione Windows (nessun segreto);
// in CI E2E_SQL_USER/E2E_SQL_PASSWORD per il container SQL Server del job.
export const API_URL = process.env.E2E_API_URL ?? 'https://localhost:7286';
// Porta propria (non la 5173 del dev server abituale): il BE avviato dagli E2E ammette questa origine.
export const FE_PORT = Number(process.env.E2E_FE_PORT ?? 5174);
export const FE_URL = `http://localhost:${FE_PORT}`;

export const SQLCMD = process.env.E2E_SQLCMD ?? 'sqlcmd';
export const SQL_SERVER = process.env.E2E_SQL_SERVER ?? '(local)';
export const SQL_DATABASE = process.env.E2E_SQL_DATABASE ?? 'VTInformatica';
export const SQL_USER = process.env.E2E_SQL_USER;
export const SQL_PASSWORD = process.env.E2E_SQL_PASSWORD;

export const PASSWORD = 'E2e-Password1!';

// Tutti i dati di test sono riconoscibili: email e2e.*@example.test, prodotti "E2E ...".
export const USERS = {
  admin: 'e2e.admin@example.test',
  buyer: 'e2e.buyer@example.test',
  lowStock: 'e2e.lowstock@example.test',
  deactivate: 'e2e.deactivate@example.test',
  suspended: 'e2e.suspended@example.test',
  reviewer: 'e2e.reviewer@example.test',
  other: 'e2e.other@example.test',
};

// Ruolo Admin: GUID fisso del seed del BE.
export const ADMIN_ROLE_ID = '98b4e551-a53d-40fc-9fa4-29d6dd582481';
