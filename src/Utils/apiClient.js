// Unico punto di accesso HTTP all'API: base URL da VITE_API_URL, token Bearer,
// errori del BE (ProblemDetails con "code") trasformati in ApiError.
// Il client non importa lo store: token e reazione al 401 arrivano da configureApiClient,
// così non ci sono import circolari e il client si testa da solo.

let config = {
  getToken: () => null,
  onUnauthorized: () => {},
};

export const configureApiClient = (options) => {
  config = { ...config, ...options };
};

const DEFAULT_CODES = {
  400: 'bad_request',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not_found',
  409: 'conflict',
};

export class ApiError extends Error {
  constructor({ status, code, title, detail, errors }) {
    super(detail || title || code);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.title = title;
    this.detail = detail;
    this.errors = errors;
  }

  static fromResponse(status, body) {
    const problem = body && typeof body === 'object' ? body : {};
    const fallback = status >= 500 ? 'internal_error' : DEFAULT_CODES[status] || 'error';
    return new ApiError({
      status,
      code: problem.code || fallback,
      title: problem.title,
      detail: problem.detail,
      errors: problem.errors,
    });
  }
}

const baseUrl = () => {
  const url = import.meta.env.VITE_API_URL;
  if (!url) {
    throw new Error('VITE_API_URL non configurato: copiare .env.example in .env.local e impostare l\'URL del backend.');
  }
  return url.replace(/\/+$/, '');
};

const parseBody = async (response) => {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  const contentType = response.headers.get('Content-Type') || '';
  if (contentType.includes('json')) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  return text;
};

export const request = async (path, { method = 'GET', body, auth = true } = {}) => {
  const url = `${baseUrl()}${path}`;
  const token = auth ? config.getToken() : null;

  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError({ status: 0, code: 'network_error', detail: 'Server non raggiungibile.' });
  }

  // Solo se la richiesta aveva un token: un 401 del login (credenziali errate) non è una sessione scaduta.
  if (response.status === 401 && token) {
    config.onUnauthorized();
  }

  const data = await parseBody(response);
  if (!response.ok) {
    throw ApiError.fromResponse(response.status, data);
  }

  return { data, headers: response.headers, status: response.status };
};

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, body, options) => request(path, { ...options, method: 'DELETE', body }),
};
