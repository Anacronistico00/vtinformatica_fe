import { http, HttpResponse } from 'msw';
import { toast } from 'react-toastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { API, problem, server } from '../../test/server';
import { loggedIn } from '../../test/render';
import { makeStore } from '../../test/store';
import { deleteCategory } from './CategoriesActions';
import { deleteManufacturer } from './ManufacturersActions';
import { fetchProductsPage, updateProduct } from './ProductsAction';
import { restoreOrder } from './OrderAction';
import { deleteSubCategory } from './SubCategoriesActions';

vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const admin = () => makeStore(loggedIn({ role: 'Admin' }));
const inUse = () => HttpResponse.json(problem(409, 'resource_in_use'), { status: 409 });

describe('backoffice errors by code', () => {
  beforeEach(() => vi.clearAllMocks());

  it.each([
    ['category', `${API}/Category/3`, deleteCategory, 'categories'],
    ['subcategory', `${API}/SubCategory/3`, deleteSubCategory, 'subcategories'],
    ['manufacturer', `${API}/Manufacturer/3`, deleteManufacturer, 'manufacturers'],
  ])('deleting a %s still in use explains why (409 resource_in_use)', async (_, url, action, slice) => {
    server.use(http.delete(url, inUse));
    const store = admin();

    await store.dispatch(action(3));

    expect(store.getState()[slice].error).toMatch(/prodotti collegati/i);
  });

  it('updateProduct with a stale stock returns stock_conflict and says so', async () => {
    server.use(
      http.put(`${API}/Product/5`, () => HttpResponse.json(problem(409, 'stock_conflict'), { status: 409 }))
    );

    const result = await admin().dispatch(updateProduct(5, { name: 'x', quantity: 3, expectedQuantity: 10 }));

    expect(result).toMatchObject({ ok: false, code: 'stock_conflict' });
    expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/modificato nel frattempo/i));
  });

  it('restoring an order without stock explains why (409 insufficient_stock)', async () => {
    server.use(
      http.put(`${API}/Order/4/restore`, () =>
        HttpResponse.json(problem(409, 'insufficient_stock'), { status: 409 }))
    );

    await admin().dispatch(restoreOrder(4));

    expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/non è sufficiente/i));
  });
});

describe('admin product pagination', () => {
  it('fetchProductsPage asks for page and pageSize and keeps the total', async () => {
    let query;
    server.use(
      http.get(`${API}/Product`, ({ request }) => {
        query = new URL(request.url).searchParams;
        return HttpResponse.json([{ id: 21 }], { headers: { 'X-Total-Count': '41' } });
      })
    );
    const store = admin();

    await store.dispatch(fetchProductsPage(2));

    expect(query.get('page')).toBe('2');
    expect(query.get('pageSize')).toBe('20');
    expect(store.getState().products.adminPage).toEqual({ items: [{ id: 21 }], total: 41, page: 2, pageSize: 20 });
  });
});
