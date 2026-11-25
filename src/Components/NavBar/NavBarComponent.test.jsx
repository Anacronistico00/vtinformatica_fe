import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { API, server } from '../../test/server';
import { loggedIn, renderWithProviders } from '../../test/render';
import NavBarComponent from './NavBarComponent';

const categories = [
  { id: 1, name: 'Componenti PC', subCategories: [{ id: 3, name: 'CPU', categoryId: 1 }] },
  { id: 2, name: 'Periferiche', subCategories: [] },
];

describe('NavBarComponent', () => {
  beforeEach(() => {
    server.use(http.get(`${API}/Category`, () => HttpResponse.json(categories)));
  });

  it('loads the categories itself: the Categorie menu is there on a direct visit to any page', async () => {
    renderWithProviders(<NavBarComponent />);

    // Una nella barra desktop e una nel menu mobile.
    expect(await screen.findAllByRole('button', { name: 'Categorie' })).toHaveLength(2);
  });

  it('keeps the Categorie menu while another category request is running', () => {
    renderWithProviders(<NavBarComponent />, { preloadedState: { categories: { categories, category: null, loading: true, error: null } } });

    expect(screen.getAllByRole('button', { name: 'Categorie' })).toHaveLength(2);
  });

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
