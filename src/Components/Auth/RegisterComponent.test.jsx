import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { API, problem, server } from '../../test/server';
import { renderWithProviders } from '../../test/render';
import RegisterComponent from './RegisterComponent';

const fillForm = async (user) => {
  await user.type(screen.getByLabelText(/^nome/i), 'Mario');
  await user.type(screen.getByLabelText(/cognome/i), 'Rossi');
  await user.type(screen.getByLabelText(/email/i), 'mario@test.local');
  await user.type(screen.getByLabelText(/^password/i), 'Password1!');
  await user.type(screen.getByLabelText(/conferma/i), 'Password1!');
  await user.type(screen.getByLabelText(/data di nascita/i), '1990-01-01');
};

describe('RegisterComponent', () => {
  it('has no fiscal code field and does not send it', async () => {
    let body;
    server.use(
      http.post(`${API}/Account/register`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ message: 'ok' });
      })
    );
    const user = userEvent.setup();
    renderWithProviders(<RegisterComponent />, { routes: { '/': <p>Home</p> }, path: '/register', route: '/register' });

    expect(screen.queryByLabelText(/codice fiscale/i)).not.toBeInTheDocument();
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /registr/i }));

    expect(await screen.findByText('Home')).toBeInTheDocument();
    expect(body).toEqual({
      firstName: 'Mario',
      lastName: 'Rossi',
      email: 'mario@test.local',
      password: 'Password1!',
      birthDate: '1990-01-01',
    });
  });

  it('tells the user why the registration failed (code from the BE)', async () => {
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
    server.use(
      http.post(`${API}/Account/register`, () =>
        HttpResponse.json(problem(400, 'email_already_registered'), { status: 400 })
      )
    );
    const user = userEvent.setup();
    renderWithProviders(<RegisterComponent />, { path: '/register', route: '/register' });

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /registr/i }));

    await vi.waitFor(() => expect(alert).toHaveBeenCalledWith('Email già registrata.'));
  });
});
