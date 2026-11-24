import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { API, problem, server } from '../test/server';
import { loggedIn, renderWithProviders } from '../test/render';
import CartComponent from './CartComponent';

vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const cartWithOneItem = {
  email: 'mario@test.local',
  totalPrice: 20,
  items: [{ id: 1, quantity: 2, product: { name: 'Mouse', price: 10, productImages: [] } }],
};

describe('CartComponent', () => {
  it('sends the optional note with the checkout', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    let body;
    server.use(
      http.get(`${API}/Cart/me`, () => HttpResponse.json(cartWithOneItem)),
      http.post(`${API}/Order/me/from-cart`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ id: 9, items: [] }, { status: 201 });
      })
    );
    const user = userEvent.setup();
    renderWithProviders(<CartComponent />, { preloadedState: loggedIn() });

    await user.type(await screen.findByLabelText(/note per l'ordine/i), 'Citofono rotto');
    await user.click(screen.getByRole('button', { name: /completa l'ordine/i }));

    await vi.waitFor(() => expect(body).toEqual({ customerComment: 'Citofono rotto' }));
  });

  it('limits the note to 500 characters', async () => {
    server.use(http.get(`${API}/Cart/me`, () => HttpResponse.json(cartWithOneItem)));
    renderWithProviders(<CartComponent />, { preloadedState: loggedIn() });

    expect(await screen.findByLabelText(/note per l'ordine/i)).toHaveAttribute('maxLength', '500');
  });

  it('shows the error to a logged-in user instead of asking to log in', async () => {
    server.use(
      http.get(`${API}/Cart/me`, () => HttpResponse.json(problem(500, 'internal_error'), { status: 500 }))
    );

    renderWithProviders(<CartComponent />, { preloadedState: loggedIn() });

    expect(await screen.findByText(/errore del server/i)).toBeInTheDocument();
    expect(screen.queryByText(/accedi ora/i)).not.toBeInTheDocument();
  });

  it('asks an anonymous visitor to log in', async () => {
    renderWithProviders(<CartComponent />);

    expect(await screen.findByText(/accedi ora/i)).toBeInTheDocument();
  });
});
