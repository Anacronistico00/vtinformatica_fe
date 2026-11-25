import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { API, server } from '../test/server';
import { renderWithProviders } from '../test/render';
import AllManufacturersComponent from './AllManufacturersComponent';
import HomeCategoryComponent from './Home/CategoryComponent';
import ManufacturerComponent from './Products/ManufacturerComponent';
import SubCategoryComponent from './Products/SubCategoryComponent';

// Pagine catalogo: una lista vuota è 200 [] (non un errore) e i dati si caricano una volta per id.

// Forma di GetProductDto del BE (description è obbligatoria).
const product = {
  id: 1,
  name: 'Mouse',
  description: 'Mouse ottico',
  price: 10,
  quantity: 3,
  productImages: [],
  manufacturer: null,
  category: { id: 2, name: 'Periferiche' },
  subCategory: { id: 7, name: 'Mouse gaming', categoryId: 2 },
};

describe('catalog pages', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  it('subcategory: empty list is "no products", not an error', async () => {
    server.use(
      http.get(`${API}/Product/subcategory/7`, () => HttpResponse.json([])),
      http.get(`${API}/SubCategory/7`, () => HttpResponse.json({ id: 7, name: 'Mouse', categoryId: 2 }))
    );

    renderWithProviders(<SubCategoryComponent />, { path: '/products/subcategory/:id', route: '/products/subcategory/7' });

    expect(await screen.findByText('Nessun prodotto disponibile.')).toBeInTheDocument();
    expect(screen.queryByText(/errore/i)).not.toBeInTheDocument();
  });

  it('subcategory: loads products and name once', async () => {
    const calls = vi.fn();
    server.use(
      http.get(`${API}/Product/subcategory/7`, () => {
        calls();
        return HttpResponse.json([product]);
      }),
      http.get(`${API}/SubCategory/7`, () => HttpResponse.json({ id: 7, name: 'Mouse gaming', categoryId: 2 }))
    );

    renderWithProviders(<SubCategoryComponent />, { path: '/products/subcategory/:id', route: '/products/subcategory/7' });

    expect(await screen.findByRole('heading', { name: /sottocategoria: Mouse gaming/ })).toBeInTheDocument();
    expect(await screen.findAllByText('Mouse')).not.toHaveLength(0);
    expect(calls).toHaveBeenCalledTimes(1);
  });

  it('manufacturer: empty list is "no products", not an error', async () => {
    server.use(
      http.get(`${API}/Product/manufacturer/4`, () => HttpResponse.json([])),
      http.get(`${API}/Manufacturer/4`, () =>
        HttpResponse.json({ manufacturerId: 4, manufacturerName: 'ASUS', manufacturerLogo: 'x' })
      )
    );

    renderWithProviders(<ManufacturerComponent />, { path: '/products/manufacturer/:id', route: '/products/manufacturer/4' });

    expect(await screen.findByText(/ASUS/)).toBeInTheDocument();
    expect(await screen.findByText('Nessun prodotto disponibile.')).toBeInTheDocument();
  });

  it('all manufacturers: lists every brand with a link to its products', async () => {
    server.use(
      http.get(`${API}/Manufacturer`, () =>
        HttpResponse.json({
          manufacturers: [
            { manufacturerId: 1, manufacturerName: 'Intel', manufacturerLogo: 'https://logos.test/intel.png' },
            { manufacturerId: 4, manufacturerName: 'ASUS', manufacturerLogo: 'https://logos.test/asus.png' },
          ],
        })
      )
    );

    renderWithProviders(<AllManufacturersComponent />, { path: '/manufacturers', route: '/manufacturers' });

    expect(await screen.findByRole('link', { name: 'Intel' })).toHaveAttribute('href', '/products/manufacturer/1');
    expect(screen.getByRole('link', { name: 'ASUS' })).toHaveAttribute('href', '/products/manufacturer/4');
  });

  it('home categories: loads the categories once', async () => {
    const calls = vi.fn();
    server.use(
      http.get(`${API}/Category`, () => {
        calls();
        return HttpResponse.json([{ id: 1, name: 'Componenti PC', subCategories: [] }]);
      })
    );

    renderWithProviders(<HomeCategoryComponent />);

    expect(await screen.findByText('Componenti PC')).toBeInTheDocument();
    expect(calls).toHaveBeenCalledTimes(1);
  });
});
