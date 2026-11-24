import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { problem, server } from '../../test/server';
import { makeToken } from '../../test/jwt';
import { makeStore } from '../../test/store';
import { login } from './authActions';
import { addToCart, getCart } from './CartActions';
import { CreateOrder } from './OrderAction';
import { fetchProducts } from './ProductsAction';

// Comportamento attuale delle actions verso l'API: deve restare uguale quando le chiamate
// passano dal client unico. Gli handler accettano qualsiasi origin (*/...).

const EMAIL = 'mario@test.local';

const loginHandler = (token) =>
  http.post('*/Account/login', () => HttpResponse.json({ token, expires: '2099-01-01T00:00:00Z' }));

const loggedInStore = async (token = makeToken({ email: EMAIL })) => {
  server.use(loginHandler(token));
  const store = makeStore();
  await store.dispatch(login(EMAIL, 'Password1!'));
  return { store, token };
};

const emptyCart = { email: EMAIL, totalPrice: 0, items: [] };

describe('login', () => {
  it('sends the credentials and stores user, role and token', async () => {
    let body;
    const token = makeToken({ email: EMAIL, role: 'Admin' });
    server.use(
      http.post('*/Account/login', async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ token });
      })
    );
    const store = makeStore();

    const result = await store.dispatch(login(EMAIL, 'Password1!'));

    expect(result).toEqual({ ok: true });
    expect(body).toEqual({ email: EMAIL, password: 'Password1!' });
    expect(store.getState().auth).toMatchObject({
      isAuthenticated: true,
      token,
      user: { email: EMAIL, role: 'Admin', birthDate: '1990-01-01' },
    });
  });

  it('returns a failure and stays logged out on 401', async () => {
    server.use(
      http.post('*/Account/login', () =>
        HttpResponse.json(problem(401, 'invalid_credentials'), { status: 401 })
      )
    );
    const store = makeStore();

    const result = await store.dispatch(login(EMAIL, 'wrong'));

    expect(result.ok).toBe(false);
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });
});

describe('cart', () => {
  it('getCart loads the cart of the logged-in user with the bearer token', async () => {
    const { store, token } = await loggedInStore();
    let authorization;
    server.use(
      http.get('*/Cart/*', ({ request }) => {
        authorization = request.headers.get('Authorization');
        return HttpResponse.json({
          email: EMAIL,
          totalPrice: 30,
          items: [{ id: 7, quantity: 3, product: { name: 'Mouse', price: 10, productImages: [] } }],
        });
      })
    );

    await store.dispatch(getCart());

    expect(authorization).toBe(`Bearer ${token}`);
    expect(store.getState().cart).toMatchObject({ totalPrice: 30, loading: false });
    expect(store.getState().cart.items).toHaveLength(1);
  });

  it('addToCart posts product and quantity, then reloads the cart', async () => {
    const { store } = await loggedInStore();
    let body;
    let reloaded = false;
    server.use(
      http.post('*/Cart/*/add', async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ message: 'Item Added succesfully!' });
      }),
      http.get('*/Cart/*', () => {
        reloaded = true;
        return HttpResponse.json(emptyCart);
      })
    );

    await store.dispatch(addToCart(5, 2));
    await new Promise((r) => setTimeout(r, 0));

    expect(body).toEqual({ productId: 5, quantity: 2 });
    expect(reloaded).toBe(true);
  });

  it('getCart without a logged-in user ends in the error state', async () => {
    const store = makeStore();

    await store.dispatch(getCart());

    expect(store.getState().cart.error).toBeTruthy();
  });
});

describe('orders', () => {
  it('CreateOrder posts the checkout and reloads the cart', async () => {
    const { store } = await loggedInStore();
    let ordered = false;
    server.use(
      http.post('*/Order/me/from-cart', () => {
        ordered = true;
        return HttpResponse.json(
          { id: 1, orderNumber: 'AB12CD34', customerEmail: EMAIL, items: [], isDeleted: false },
          { status: 201 }
        );
      }),
      http.get('*/Cart/*', () => HttpResponse.json(emptyCart))
    );

    await store.dispatch(CreateOrder());

    expect(ordered).toBe(true);
    expect(store.getState().orders).toMatchObject({ loading: false, error: null });
  });
});

describe('products', () => {
  it('fetchProducts loads the public catalogue without a token', async () => {
    let authorization = 'not-called';
    server.use(
      http.get('*/Product', ({ request }) => {
        authorization = request.headers.get('Authorization');
        return HttpResponse.json([{ id: 1, name: 'Mouse' }]);
      })
    );
    const store = makeStore();

    await store.dispatch(fetchProducts());

    expect(authorization).toBeNull();
    expect(store.getState().products.products).toEqual([{ id: 1, name: 'Mouse' }]);
  });
});
