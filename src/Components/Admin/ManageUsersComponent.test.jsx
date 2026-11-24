import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { API, problem, server } from '../../test/server';
import { loggedIn, renderWithProviders } from '../../test/render';
import ManageUsersComponent from './ManageUsersComponent';

vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
import { toast } from 'react-toastify';

const ADMIN_EMAIL = 'admin@test.local';

const users = () => [
  { id: 'admin-id', email: ADMIN_EMAIL, fullName: 'Ada Admin', role: 'Admin', isActive: true, deactivationReason: null },
  { id: 'u1', email: 'cliente@test.local', fullName: 'Carlo Cliente', role: 'Customer', isActive: true, deactivationReason: null },
  { id: 'u2', email: 'sospeso@test.local', fullName: 'Sara Sospesa', role: 'Customer', isActive: false,
    deactivationReason: 'Admin', deactivationNote: 'Frode', deactivatedAt: '2026-11-20T10:00:00Z' },
];

const rowOf = (email) => screen.getByText(email).closest('tr');

const renderPage = () =>
  renderWithProviders(<ManageUsersComponent />, { preloadedState: loggedIn({ role: 'Admin', email: ADMIN_EMAIL }) });

describe('ManageUsersComponent', () => {
  it('lists users with their state and no actions on admins', async () => {
    server.use(http.get(`${API}/Account/UsersList`, () => HttpResponse.json({ message: 'ok', users: users() })));

    renderPage();

    expect(await screen.findByText('cliente@test.local')).toBeInTheDocument();
    expect(within(rowOf('sospeso@test.local')).getByText('Sospeso')).toBeInTheDocument();
    expect(within(rowOf('sospeso@test.local')).getByText('Frode')).toBeInTheDocument();
    expect(within(rowOf(ADMIN_EMAIL)).queryByRole('button')).not.toBeInTheDocument();
  });

  it('suspends with a mandatory note and reloads the list', async () => {
    let body;
    let listCalls = 0;
    server.use(
      http.get(`${API}/Account/UsersList`, () => {
        listCalls += 1;
        return HttpResponse.json({ message: 'ok', users: users() });
      }),
      http.put(`${API}/Account/u1/suspend`, async ({ request }) => {
        body = await request.json();
        return new HttpResponse(null, { status: 204 });
      })
    );
    const user = userEvent.setup();
    renderPage();

    await user.click(within(await screen.findByText('cliente@test.local').then((el) => el.closest('tr')))
      .getByRole('button', { name: 'Sospendi' }));
    const confirm = screen.getByRole('button', { name: 'Conferma sospensione' });
    expect(confirm).toBeDisabled();
    await user.type(screen.getByLabelText(/nota/i), 'Abuso dei resi');
    await user.click(confirm);

    await vi.waitFor(() => expect(body).toEqual({ note: 'Abuso dei resi' }));
    await vi.waitFor(() => expect(listCalls).toBe(2));
  });

  it('revokes a suspension and shows BE errors by code', async () => {
    server.use(
      http.get(`${API}/Account/UsersList`, () => HttpResponse.json({ message: 'ok', users: users() })),
      http.put(`${API}/Account/u2/unsuspend`, () =>
        HttpResponse.json(problem(409, 'not_suspended'), { status: 409 }))
    );
    const user = userEvent.setup();
    renderPage();

    await screen.findByText('sospeso@test.local');
    await user.click(within(rowOf('sospeso@test.local')).getByRole('button', { name: 'Revoca sospensione' }));

    await vi.waitFor(() => expect(toast.error).toHaveBeenCalledWith("L'account non è sospeso."));
  });
});
