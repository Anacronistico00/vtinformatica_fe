import { describe, expect, it } from 'vitest';
import authReducer from './Auth';
import { LOGIN_SUCCESS, LOGOUT } from '../Actions/authActions';

describe('authReducer', () => {
  it('stores user and token on login, clears them on logout', () => {
    const user = { email: 'a@test.local', role: 'Customer' };

    const loggedIn = authReducer(undefined, {
      type: LOGIN_SUCCESS,
      payload: { user, token: 'jwt', isAuthenticated: true },
    });
    const loggedOut = authReducer(loggedIn, { type: LOGOUT });

    expect(loggedIn).toMatchObject({ user, token: 'jwt', isAuthenticated: true });
    expect(loggedOut).toMatchObject({ user: null, token: null, isAuthenticated: false });
  });
});
