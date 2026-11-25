import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { API, server } from '../../test/server';
import { renderWithProviders } from '../../test/render';
import { loggedIn } from '../../test/render';
import ProductInfo from './ProductInfo';

vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
import { toast } from 'react-toastify';

// Forma di GetProductDto del BE (la lista recensioni arriva dentro lo stesso prodotto).
const product = {
  id: 5,
  name: 'Mouse X',
  description: 'Mouse ottico',
  fullDescription: 'Mouse ottico a 6 tasti',
  price: 10,
  quantity: 3,
  productImages: [{ imageUrl: 'https://img.test/1.png' }, { imageUrl: 'https://img.test/2.png' }],
  manufacturer: { manufacturerId: 1, manufacturerName: 'Logi', manufacturerLogo: 'https://img.test/logo.png' },
  category: { id: 1, name: 'Periferiche' },
  subCategory: { id: 7, name: 'Mouse', categoryId: 1 },
  reviews: [],
};

const renderProduct = (overrides = {}, options = {}) => {
  server.use(
    http.get(`${API}/Product/5`, () => HttpResponse.json({ ...product, ...overrides })),
    http.get(`${API}/Product/subcategory/7`, () => HttpResponse.json([]))
  );
  renderWithProviders(<ProductInfo />, { path: '/product/:id', route: '/product/5', ...options });
};

describe('ProductInfo', () => {
  it('keeps price, availability, quantity and add to cart in one purchase box', async () => {
    renderProduct();

    const price = await screen.findByText('10.00 €');
    const box = price.closest('.buy-box');
    expect(box).not.toBeNull();
    expect(box).toHaveTextContent('3 pezzi');
    expect(box.querySelector('input[aria-label="Quantità"]')).not.toBeNull();
    expect(box.querySelector('button.btn-primary')).toHaveTextContent('Aggiungi al carrello');
  });

  it('changes the main image from the thumbnails, by keyboard-reachable buttons', async () => {
    renderProduct();

    const main = await screen.findByRole('img', { name: 'Mouse X' });
    expect(main).toHaveAttribute('src', 'https://img.test/1.png');

    await userEvent.click(screen.getByRole('button', { name: 'Immagine 2' }));

    expect(screen.getByRole('img', { name: 'Mouse X' })).toHaveAttribute('src', 'https://img.test/2.png');
    expect(screen.getByRole('button', { name: 'Immagine 2' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('opens the enlarged images in a dialog and closes it with Escape', async () => {
    renderProduct();

    await userEvent.click(await screen.findByRole('button', { name: 'Ingrandisci immagine' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveTextContent('Mouse X');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('confirms with a toast when the product is added to the cart', async () => {
    let added = null;
    server.use(
      http.post(`${API}/Cart/me/add`, async ({ request }) => {
        added = await request.json();
        return HttpResponse.json({ items: [], totalPrice: 0 });
      }),
      http.get(`${API}/Cart/me`, () => HttpResponse.json({ items: [], totalPrice: 0 })),
      http.get(`${API}/Review/me`, () => HttpResponse.json([]))
    );
    renderProduct({}, { preloadedState: loggedIn() });

    await userEvent.click(await screen.findByRole('button', { name: 'Aggiungi al carrello' }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Prodotto aggiunto al carrello.'));
    expect(added).toEqual({ productId: 5, quantity: 1 });
  });

  it('disables add to cart for a quantity that is zero, empty, fractional or above the stock', async () => {
    renderProduct();
    const add = await screen.findByRole('button', { name: 'Aggiungi al carrello' });
    const input = screen.getByRole('spinbutton', { name: 'Quantità' });
    expect(add).toBeEnabled();

    for (const invalid of ['0', '', '1.5', '4']) {
      await userEvent.clear(input);
      if (invalid) await userEvent.type(input, invalid);
      expect(add, `quantità "${invalid}"`).toBeDisabled();
    }

    await userEvent.clear(input);
    await userEvent.type(input, '3');
    expect(add).toBeEnabled();
  });

  it('disables add to cart when the product is out of stock', async () => {
    renderProduct({ quantity: 0 });

    expect(await screen.findByText('Non disponibile')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aggiungi al carrello' })).toBeDisabled();
  });
});
