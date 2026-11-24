import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { API, problem, server } from '../../test/server';
import { makeToken } from '../../test/jwt';
import { loggedIn, renderWithProviders } from '../../test/render';
import LoginComponent from './LoginComponent';
import ReactivateComponent from './ReactivateComponent';
import WelcomeBackComponent from './WelcomeBackComponent';
import AccountInfoComponent from '../AccountInfoComponent';

vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const EMAIL = 'mario@test.local';

const loginAs = async (user) => {
  await user.type(screen.getByLabelText('Email'), EMAIL);
  await user.type(screen.getByLabelText('Password'), 'Password1!');
  await user.click(screen.getByRole('button', { name: 'Accedi' }));
};

const loginRoutes = {
  '/reactivate': <ReactivateComponent />,
  '/accountInfo': <p>Pagina account</p>,
};

describe('login page', () => {
  it('sends a deactivated account to the reactivation page with the email filled in', async () => {
    server.use(http.post(`${API}/Account/login`, () =>
      HttpResponse.json(problem(403, 'account_deactivated'), { status: 403 })));
    const user = userEvent.setup();
    renderWithProviders(<LoginComponent />, { path: '/account', route: '/account', routes: loginRoutes });

    await loginAs(user);

    expect(await screen.findByRole('heading', { name: /riattiva/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveValue(EMAIL);
  });

  it('tells a suspended account that access is denied', async () => {
    server.use(http.post(`${API}/Account/login`, () =>
      HttpResponse.json(problem(403, 'account_suspended'), { status: 403 })));
    const user = userEvent.setup();
    renderWithProviders(<LoginComponent />, { path: '/account', route: '/account', routes: loginRoutes });

    await loginAs(user);

    expect(await screen.findByRole('alert')).toHaveTextContent(/sospeso/i);
  });

  it('shows a generic message on wrong credentials', async () => {
    server.use(http.post(`${API}/Account/login`, () =>
      HttpResponse.json(problem(401, 'invalid_credentials'), { status: 401 })));
    const user = userEvent.setup();
    renderWithProviders(<LoginComponent />, { path: '/account', route: '/account', routes: loginRoutes });

    await loginAs(user);

    expect(await screen.findByRole('alert')).toHaveTextContent('Email o password non corretti.');
  });
});

describe('reactivation page', () => {
  it('reactivates after confirmation and shows the welcome page', async () => {
    server.use(http.post(`${API}/Account/reactivate`, () => HttpResponse.json({ token: makeToken({ email: EMAIL }) })));
    const user = userEvent.setup();
    const { store } = renderWithProviders(<ReactivateComponent />, {
      path: '/reactivate',
      route: { pathname: '/reactivate', state: { email: EMAIL } },
      routes: { '/welcome': <WelcomeBackComponent /> },
    });

    await user.type(screen.getByLabelText('Password'), 'Password1!');
    await user.click(screen.getByRole('button', { name: /riattiva il mio account/i }));

    expect(await screen.findByRole('heading', { name: /bentornato/i })).toBeInTheDocument();
    expect(store.getState().auth.isAuthenticated).toBe(true);
  });

  it('shows why a reactivation is refused', async () => {
    server.use(http.post(`${API}/Account/reactivate`, () =>
      HttpResponse.json(problem(403, 'account_suspended'), { status: 403 })));
    const user = userEvent.setup();
    renderWithProviders(<ReactivateComponent />, {
      path: '/reactivate',
      route: { pathname: '/reactivate', state: { email: EMAIL } },
    });

    await user.type(screen.getByLabelText('Password'), 'Password1!');
    await user.click(screen.getByRole('button', { name: /riattiva il mio account/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/sospeso/i);
  });
});

describe('self-deactivation from the account page', () => {
  const ordersHandler = http.get(`${API}/Order/me`, () => HttpResponse.json([]));

  it('a customer deactivates the own account with an optional reason and is logged out', async () => {
    let body;
    server.use(
      ordersHandler,
      http.delete(`${API}/Account/user-1`, async ({ request }) => {
        body = await request.json();
        return new HttpResponse(null, { status: 204 });
      })
    );
    const user = userEvent.setup();
    const { store } = renderWithProviders(<AccountInfoComponent />, {
      preloadedState: loggedIn(),
      routes: { '/account': <p>Login</p> },
    });

    await user.click(await screen.findByRole('button', { name: /disattiva il mio account/i }));
    await user.type(screen.getByLabelText(/motivo/i), 'Non mi serve più');
    await user.click(screen.getByRole('button', { name: /conferma disattivazione/i }));

    await vi.waitFor(() => expect(store.getState().auth.isAuthenticated).toBe(false));
    expect(body).toEqual({ note: 'Non mi serve più' });
  });

  it('is not offered to an admin', async () => {
    server.use(ordersHandler);

    renderWithProviders(<AccountInfoComponent />, { preloadedState: loggedIn({ role: 'Admin' }) });

    expect(await screen.findByText(/Admin/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /disattiva il mio account/i })).not.toBeInTheDocument();
  });
});
