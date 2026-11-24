import { setupServer } from 'msw/node';

// Base URL dell'API nei test: le richieste fuori da questo host falliscono (onUnhandledRequest: 'error').
export const API = 'http://api.test';

export const server = setupServer();

/** Corpo di errore come lo produce il BE: ProblemDetails con code e traceId. */
export const problem = (status, code, detail) => ({
  type: 'about:blank',
  title: 'Errore',
  status,
  detail,
  code,
  traceId: 'test-trace',
});
