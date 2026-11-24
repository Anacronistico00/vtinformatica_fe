import { http, HttpResponse } from 'msw';
import { toast } from 'react-toastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { API, problem, server } from '../../test/server';
import { makeToken } from '../../test/jwt';
import { makeStore } from '../../test/store';
import { addToCart, getCart } from './CartActions';
import { CreateOrder, deleteOrder, fetchOrders } from './OrderAction';

vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const loggedInStore = () =>
  makeStore({ auth: { user: { email: 'mario@test.local', role: 'Customer' }, token: makeToken(), isAuthenticated: true } });

const emptyCart = { email: 'mario@test.local', totalPrice: 0, items: [] };
const settle = () => new Promise((r) => setTimeout(r, 0));

describe('API contract: identity from the token (/me routes)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getCart reads GET /Cart/me', async () => {
    server.use(http.get(`${API}/Cart/me`, () => HttpResponse.json({ ...emptyCart, totalPrice: 5 })));
    const store = loggedInStore();

    await store.dispatch(getCart());

    expect(store.getState().cart).toMatchObject({ totalPrice: 5, error: null });
  });

  it('addToCart posts to /Cart/me/add and keeps the BE message out of the cart lines', async () => {
    server.use(
      http.post(`${API}/Cart/me/add`, () => HttpResponse.json({ message: 'Item Added succesfully!' })),
      http.get(`${API}/Cart/me`, () => HttpResponse.json(emptyCart))
    );
    const store = loggedInStore();

    await store.dispatch(addToCart(5, 2));
    expect(store.getState().cart.items).toEqual([]);
    await settle();

    expect(store.getState().cart.items).toEqual([]);
    expect(store.getState().cart.totalPrice).toBe(0);
  });

  it('addToCart with not enough stock shows why (409 insufficient_stock)', async () => {
    server.use(
      http.post(`${API}/Cart/me/add`, () =>
        HttpResponse.json(problem(409, 'insufficient_stock'), { status: 409 })
      )
    );
    const store = loggedInStore();

    await store.dispatch(addToCart(5, 99));

    expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/disponibil/i));
  });

  it('CreateOrder posts to /Order/me/from-cart with the optional comment', async () => {
    let body;
    server.use(
      http.post(`${API}/Order/me/from-cart`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ id: 1, items: [] }, { status: 201 });
      }),
      http.get(`${API}/Cart/me`, () => HttpResponse.json(emptyCart))
    );
    const store = loggedInStore();

    await store.dispatch(CreateOrder({ customerComment: 'Citofono rotto' }));

    expect(body).toEqual({ customerComment: 'Citofono rotto' });
    expect(store.getState().orders.error).toBeNull();
  });

  it('CreateOrder on an empty cart shows why (409 cart_empty)', async () => {
    server.use(
      http.post(`${API}/Order/me/from-cart`, () => HttpResponse.json(problem(409, 'cart_empty'), { status: 409 }))
    );
    const store = loggedInStore();

    await store.dispatch(CreateOrder());

    expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/carrello è vuoto/i));
  });

  it('fetchOrders reads GET /Order/me', async () => {
    server.use(http.get(`${API}/Order/me`, () => HttpResponse.json([{ id: 3 }])));
    const store = loggedInStore();

    await store.dispatch(fetchOrders());

    expect(store.getState().orders.orders).toEqual([{ id: 3 }]);
  });

  it('deleteOrder reloads the own orders from /Order/me', async () => {
    let reloaded = false;
    server.use(
      http.put(`${API}/Order/3/delete`, () => HttpResponse.json({ message: 'Order correctly deleted.' })),
      http.get(`${API}/Order/me`, () => {
        reloaded = true;
        return HttpResponse.json([]);
      })
    );
    const store = loggedInStore();

    await store.dispatch(deleteOrder(3));
    await settle();

    expect(reloaded).toBe(true);
  });
});
