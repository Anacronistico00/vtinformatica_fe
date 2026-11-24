import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { problem, server } from '../../test/server';
import { makeToken } from '../../test/jwt';
import { makeStore } from '../../test/store';
import expireTransform from '../../Utils/PersistConfig';
import { login } from './authActions';
import { getCart } from './CartActions';

const loginAs = async (store, token) => {
  server.use(http.post('*/Account/login', () => HttpResponse.json({ token })));
  await store.dispatch(login('mario@test.local', 'Password1!'));
};

describe('session', () => {
  it('keeps the token only in the auth slice (no raw keys in localStorage)', async () => {
    const store = makeStore();

    await loginAs(store, makeToken());

    expect(store.getState().auth.token).toBeTruthy();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
    expect(localStorage.getItem('birthDate')).toBeNull();
  });

  it('logs out and clears the cart when the API rejects the token (401)', async () => {
    const store = makeStore();
    await loginAs(store, makeToken());
    server.use(
      http.get('*/Cart/*', () => HttpResponse.json(problem(401, 'unauthorized'), { status: 401 }))
    );

    await store.dispatch(getCart());

    expect(store.getState().auth).toMatchObject({ isAuthenticated: false, token: null, user: null });
    expect(store.getState().cart.items).toEqual([]);
  });

  it('drops a persisted session whose token is expired (exp of the JWT)', () => {
    const expired = { user: { email: 'a' }, token: makeToken({ expiresInSeconds: -60 }), isAuthenticated: true };
    const valid = { user: { email: 'a' }, token: makeToken({ expiresInSeconds: 600 }), isAuthenticated: true };

    expect(expireTransform.out(expired, 'auth')).toBeUndefined();
    expect(expireTransform.out(valid, 'auth')).toMatchObject({ isAuthenticated: true });
  });
});
