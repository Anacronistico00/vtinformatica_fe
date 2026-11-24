import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { API, problem, server } from '../test/server';
import { api, ApiError, configureApiClient } from './apiClient';

describe('apiClient', () => {
  let token;
  let onUnauthorized;

  beforeEach(() => {
    token = null;
    onUnauthorized = vi.fn();
    configureApiClient({ getToken: () => token, onUnauthorized });
  });

  afterEach(() => {
    vi.stubEnv('VITE_API_URL', API);
  });

  it('calls VITE_API_URL + path and returns data and headers', async () => {
    server.use(
      http.get(`${API}/Product`, () =>
        HttpResponse.json([{ id: 1 }], { headers: { 'X-Total-Count': '42' } })
      )
    );

    const { data, headers } = await api.get('/Product');

    expect(data).toEqual([{ id: 1 }]);
    expect(headers.get('X-Total-Count')).toBe('42');
  });

  it('adds the bearer token when there is one', async () => {
    token = 'jwt-1';
    let authorization;
    server.use(
      http.get(`${API}/Cart/me`, ({ request }) => {
        authorization = request.headers.get('Authorization');
        return HttpResponse.json({});
      })
    );

    await api.get('/Cart/me');

    expect(authorization).toBe('Bearer jwt-1');
  });

  it('sends no Authorization without a token or with auth: false', async () => {
    const seen = [];
    server.use(
      http.post(`${API}/Account/login`, ({ request }) => {
        seen.push(request.headers.get('Authorization'));
        return HttpResponse.json({ token: 'x' });
      })
    );

    await api.post('/Account/login', { email: 'a' });
    token = 'jwt-1';
    await api.post('/Account/login', { email: 'a' }, { auth: false });

    expect(seen).toEqual([null, null]);
  });

  it('sends the body as JSON', async () => {
    let contentType;
    let body;
    server.use(
      http.post(`${API}/Cart/me/add`, async ({ request }) => {
        contentType = request.headers.get('Content-Type');
        body = await request.json();
        return HttpResponse.json({});
      })
    );

    await api.post('/Cart/me/add', { productId: 3, quantity: 1 });

    expect(contentType).toContain('application/json');
    expect(body).toEqual({ productId: 3, quantity: 1 });
  });

  it('returns null data on 204', async () => {
    server.use(http.delete(`${API}/Cart/me/clear`, () => new HttpResponse(null, { status: 204 })));

    const { data, status } = await api.delete('/Cart/me/clear');

    expect(status).toBe(204);
    expect(data).toBeNull();
  });

  it('throws ApiError with status, code and detail from ProblemDetails', async () => {
    server.use(
      http.post(`${API}/Order/me/from-cart`, () =>
        HttpResponse.json(problem(409, 'cart_empty', 'Il carrello è vuoto.'), {
          status: 409,
          headers: { 'Content-Type': 'application/problem+json' },
        })
      )
    );

    const error = await api.post('/Order/me/from-cart').catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 409, code: 'cart_empty', detail: 'Il carrello è vuoto.' });
  });

  it('keeps the field errors of validation_failed', async () => {
    server.use(
      http.post(`${API}/Product`, () =>
        HttpResponse.json(
          { ...problem(400, 'validation_failed'), errors: { Price: ['Il prezzo deve essere positivo.'] } },
          { status: 400 }
        )
      )
    );

    const error = await api.post('/Product', {}).catch((e) => e);

    expect(error.code).toBe('validation_failed');
    expect(error.errors).toEqual({ Price: ['Il prezzo deve essere positivo.'] });
  });

  it('gives a code from the status when the body is not ProblemDetails', async () => {
    server.use(http.get(`${API}/Product/1`, () => new HttpResponse('boom', { status: 500 })));

    const error = await api.get('/Product/1').catch((e) => e);

    expect(error).toMatchObject({ status: 500, code: 'internal_error' });
  });

  it('turns a network failure into ApiError network_error', async () => {
    server.use(http.get(`${API}/Product`, () => HttpResponse.error()));

    const error = await api.get('/Product').catch((e) => e);

    expect(error).toMatchObject({ status: 0, code: 'network_error' });
  });

  it('calls onUnauthorized on 401 when a token was sent', async () => {
    token = 'expired';
    server.use(
      http.get(`${API}/Cart/me`, () => HttpResponse.json(problem(401, 'unauthorized'), { status: 401 }))
    );

    await api.get('/Cart/me').catch(() => {});

    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('does not call onUnauthorized on 401 without a token (wrong login)', async () => {
    server.use(
      http.post(`${API}/Account/login`, () =>
        HttpResponse.json(problem(401, 'invalid_credentials'), { status: 401 })
      )
    );

    const error = await api.post('/Account/login', {}, { auth: false }).catch((e) => e);

    expect(error.code).toBe('invalid_credentials');
    expect(onUnauthorized).not.toHaveBeenCalled();
  });

  it('fails clearly when VITE_API_URL is missing', async () => {
    vi.stubEnv('VITE_API_URL', '');

    await expect(api.get('/Product')).rejects.toThrow('VITE_API_URL');
  });
});
