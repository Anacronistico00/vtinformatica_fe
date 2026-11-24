import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { API, server } from '../../test/server';
import { loggedIn, renderWithProviders } from '../../test/render';
import ManageProductsComponent from './ManageProductsComponent';

vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

// Comportamento attuale della gestione prodotti, prima del refactor.

const categories = [
  { id: 1, name: 'Componenti PC', subCategories: [] },
  { id: 2, name: 'Periferiche', subCategories: [] },
];
const subcategories = [
  { id: 1, name: 'CPU', categoryId: 1 },
  { id: 11, name: 'Mouse', categoryId: 2 },
];
const manufacturers = [{ manufacturerId: 1, manufacturerName: 'Intel', manufacturerLogo: 'x' }];

const product = (id, name, categoryId, subCategoryId, quantity = 10) => ({
  id,
  name,
  description: `Descrizione ${name}`,
  fullDescription: `Completa ${name}`,
  price: 100,
  quantity,
  manufacturerId: 1,
  manufacturer: manufacturers[0],
  category: { id: categoryId, name: categories.find((c) => c.id === categoryId).name },
  subCategory: { id: subCategoryId, name: 'x', categoryId },
  productImages: [{ imageUrl: 'https://img.test.local/a.png' }],
  reviews: [],
});

const catalogue = [product(1, 'Intel i9', 1, 1), product(2, 'Mouse ottico', 2, 11, 4)];

const preloadedState = {
  ...loggedIn({ role: 'Admin' }),
  categories: { categories, loading: false, error: null },
  manufacturers: { manufacturers, loading: false, error: null },
};

const sectionOf = (categoryName) => screen.getByRole('heading', { name: categoryName }).parentElement;

describe('ManageProductsComponent (characterization)', () => {
  beforeEach(() => {
    server.use(
      http.get(`${API}/SubCategory`, () => HttpResponse.json(subcategories)),
      http.get(`${API}/Product`, () => HttpResponse.json(catalogue, { headers: { 'X-Total-Count': '2' } })),
      http.get(`${API}/Category`, () => HttpResponse.json(categories)),
      http.get(`${API}/Manufacturer`, () => HttpResponse.json({ message: 'ok', manufacturers }))
    );
  });

  it('lists products under their category', async () => {
    renderWithProviders(<ManageProductsComponent />, { preloadedState });

    expect(await screen.findByText('Intel i9')).toBeInTheDocument();
    expect(within(sectionOf('Componenti PC')).getByText('Intel i9')).toBeInTheDocument();
    expect(within(sectionOf('Periferiche')).getByText('Mouse ottico')).toBeInTheDocument();
  });

  it('edits a product with the values of the form', async () => {
    let body;
    server.use(
      http.put(`${API}/Product/2`, async ({ request }) => {
        body = await request.json();
        return new HttpResponse(null, { status: 204 });
      })
    );
    const user = userEvent.setup();
    renderWithProviders(<ManageProductsComponent />, { preloadedState });

    await screen.findByText('Mouse ottico');
    await user.click(within(sectionOf('Periferiche')).getByRole('button', { name: 'Modifica' }));
    const name = screen.getByDisplayValue('Mouse ottico');
    await user.clear(name);
    await user.type(name, 'Mouse wireless');
    await user.click(screen.getByRole('button', { name: 'Aggiorna' }));

    await vi.waitFor(() => expect(body).toMatchObject({ name: 'Mouse wireless', subCategoryId: 11 }));
  });

  it('deletes a product after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    let deleted = false;
    server.use(
      http.delete(`${API}/Product/1`, () => {
        deleted = true;
        return new HttpResponse(null, { status: 204 });
      })
    );
    const user = userEvent.setup();
    renderWithProviders(<ManageProductsComponent />, { preloadedState });

    await screen.findByText('Intel i9');
    await user.click(within(sectionOf('Componenti PC')).getByRole('button', { name: 'Elimina' }));

    await vi.waitFor(() => expect(deleted).toBe(true));
  });
});
