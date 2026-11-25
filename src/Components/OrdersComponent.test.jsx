import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API, server } from '../test/server';
import { loggedIn, renderWithProviders } from '../test/render';
import OrdersComponent from './OrdersComponent';

const order = (id, orderNumber) => ({
  id,
  orderNumber,
  createdAt: '2026-01-10T10:00:00Z',
  isDeleted: false,
  items: [
    { quantity: 1, product: { name: 'Mouse', price: 20, productImages: [{ imageUrl: 'https://img.test.local/a.png' }] } },
  ],
});

describe('OrdersComponent', () => {
  it('loads the orders on mount and replaces a stale list', async () => {
    server.use(http.get(`${API}/Order/me`, () => HttpResponse.json([order(2, 'ORD-NEW')])));
    renderWithProviders(<OrdersComponent />, {
      preloadedState: {
        ...loggedIn(),
        orders: { loading: false, order: null, orders: [order(1, 'ORD-OLD')], error: null },
      },
    });

    expect(await screen.findByText(/ORD-NEW/)).toBeInTheDocument();
    expect(screen.queryByText(/ORD-OLD/)).not.toBeInTheDocument();
  });

  it('shows the empty message when the user has no orders', async () => {
    server.use(http.get(`${API}/Order/me`, () => HttpResponse.json([])));
    renderWithProviders(<OrdersComponent />, { preloadedState: loggedIn() });

    expect(await screen.findByText('Non hai ancora effettuato ordini.')).toBeInTheDocument();
  });
});
