import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API, problem, server } from '../../test/server';
import { makeToken } from '../../test/jwt';
import { makeStore } from '../../test/store';
import { loggedIn } from '../../test/render';
import { deactivateSelf, login, reactivate } from './authActions';
import { fetchUsers, suspendUser, unsuspendUser } from './usersActions';

const EMAIL = 'mario@test.local';

describe('login outcomes', () => {
  it.each([
    ['account_deactivated', /disattivato/i],
    ['account_suspended', /sospeso/i],
  ])('403 %s is returned to the caller with its message', async (code, text) => {
    server.use(
      http.post(`${API}/Account/login`, () => HttpResponse.json(problem(403, code), { status: 403 }))
    );
    const store = makeStore();

    const result = await store.dispatch(login(EMAIL, 'Password1!'));

    expect(result).toMatchObject({ ok: false, code });
    expect(result.message).toMatch(text);
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });

  it('wrong credentials give a generic message', async () => {
    server.use(
      http.post(`${API}/Account/login`, () =>
        HttpResponse.json(problem(401, 'invalid_credentials'), { status: 401 })
      )
    );

    const result = await makeStore().dispatch(login(EMAIL, 'wrong'));

    expect(result).toEqual({ ok: false, code: 'invalid_credentials', message: 'Email o password non corretti.' });
  });
});

describe('reactivation and self-deactivation', () => {
  it('reactivate posts the credentials and logs the user in', async () => {
    let body;
    const token = makeToken({ email: EMAIL });
    server.use(
      http.post(`${API}/Account/reactivate`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ token });
      })
    );
    const store = makeStore();

    const result = await store.dispatch(reactivate(EMAIL, 'Password1!'));

    expect(body).toEqual({ email: EMAIL, password: 'Password1!' });
    expect(result).toEqual({ ok: true });
    expect(store.getState().auth).toMatchObject({ isAuthenticated: true, token, user: { email: EMAIL } });
  });

  it('reactivate of a suspended account is refused', async () => {
    server.use(
      http.post(`${API}/Account/reactivate`, () =>
        HttpResponse.json(problem(403, 'account_suspended'), { status: 403 })
      )
    );

    const result = await makeStore().dispatch(reactivate(EMAIL, 'Password1!'));

    expect(result).toMatchObject({ ok: false, code: 'account_suspended' });
  });

  it('deactivateSelf deletes the own account (id from the token) with the note, then logs out', async () => {
    let body;
    server.use(
      http.delete(`${API}/Account/user-1`, async ({ request }) => {
        body = await request.json();
        return new HttpResponse(null, { status: 204 });
      })
    );
    const store = makeStore(loggedIn());

    const result = await store.dispatch(deactivateSelf('Non mi serve più'));

    expect(result).toEqual({ ok: true });
    expect(body).toEqual({ note: 'Non mi serve più' });
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });
});

describe('users backoffice', () => {
  const admin = () => makeStore(loggedIn({ role: 'Admin' }));

  it('fetchUsers returns the list of users', async () => {
    server.use(
      http.get(`${API}/Account/UsersList`, () =>
        HttpResponse.json({ message: 'ok', users: [{ id: 'u1', email: 'a@test.local', isActive: true }] })
      )
    );
    admin();

    expect(await fetchUsers()).toEqual([{ id: 'u1', email: 'a@test.local', isActive: true }]);
  });

  it('suspendUser sends the mandatory note, unsuspendUser revokes it', async () => {
    const calls = [];
    server.use(
      http.put(`${API}/Account/u1/suspend`, async ({ request }) => {
        calls.push(['suspend', await request.json()]);
        return new HttpResponse(null, { status: 204 });
      }),
      http.put(`${API}/Account/u1/unsuspend`, () => {
        calls.push(['unsuspend']);
        return new HttpResponse(null, { status: 204 });
      })
    );
    admin();

    await suspendUser('u1', 'Abuso dei resi');
    await unsuspendUser('u1');

    expect(calls).toEqual([['suspend', { note: 'Abuso dei resi' }], ['unsuspend']]);
  });
});
