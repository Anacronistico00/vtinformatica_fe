import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { API, server } from '../../test/server';
import { loggedIn, renderWithProviders } from '../../test/render';
import NavBarComponent from './NavBarComponent';

describe('NavBarComponent', () => {
  it('renders for an anonymous visitor without asking for a cart', async () => {
    const cartRequests = vi.fn();
    server.use(http.get(`${API}/Cart/*`, () => {
      cartRequests();
      return HttpResponse.json({ items: [], totalPrice: 0 });
    }));

    renderWithProviders(<NavBarComponent />);
    await new Promise((r) => setTimeout(r, 0));

    expect(screen.getByAltText('VT Informatica')).toBeInTheDocument();
    expect(cartRequests).not.toHaveBeenCalled();
  });

  it('shows the cart count of a logged-in user', async () => {
    server.use(http.get(`${API}/Cart/me`, () => HttpResponse.json({
      email: 'mario@test.local',
      totalPrice: 20,
      items: [{ id: 1, quantity: 2, product: { name: 'Mouse', price: 10, productImages: [] } }],
    })));

    renderWithProviders(<NavBarComponent />, { preloadedState: loggedIn() });

    expect(await screen.findByText('1')).toBeInTheDocument();
  });
});
