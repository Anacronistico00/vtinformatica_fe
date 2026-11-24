import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { API, problem, server } from '../../test/server';
import { loggedIn, renderWithProviders } from '../../test/render';
import ProductInfo from './ProductInfo';
import ProductReviews from './ProductReviews';

vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
import { toast } from 'react-toastify';

const reviews = () => [
  { reviewId: 11, reviewRating: 5, reviewComment: 'Ottimo mouse', createdAt: '2026-11-20T10:00:00Z' },
  { reviewId: 12, reviewRating: 2, reviewComment: 'Si rompe subito', createdAt: '2026-11-21T10:00:00Z' },
];

const productWith = (list) => ({
  id: 5,
  name: 'Mouse ottico',
  description: 'Mouse',
  fullDescription: 'Mouse ottico completo',
  price: 10,
  quantity: 3,
  productImages: [{ imageUrl: 'https://img.test.local/a.png' }],
  subCategory: { id: 11, name: 'Mouse', categoryId: 2 },
  reviews: list,
});

const itemOf = (comment) => screen.getByText(comment).closest('li');

describe('ProductReviews', () => {
  let current;

  beforeEach(() => {
    current = reviews();
    server.use(
      http.get(`${API}/Product/5`, () => HttpResponse.json(productWith(current))),
      http.get(`${API}/Review/me`, () =>
        HttpResponse.json([{ reviewId: 11, productId: 5, reviewRating: 5, reviewComment: 'Ottimo mouse', createdAt: '2026-11-20T10:00:00Z' }]))
    );
  });

  it('shows ratings as stars and asks anonymous visitors to log in to write one', async () => {
    renderWithProviders(<ProductReviews productId={5} />);

    expect(await screen.findByText('Ottimo mouse')).toBeInTheDocument();
    expect(within(itemOf('Ottimo mouse')).getByLabelText('5 su 5')).toBeInTheDocument();
    expect(within(itemOf('Si rompe subito')).getByLabelText('2 su 5')).toBeInTheDocument();
    expect(screen.getByText(/accedi/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /modifica/i })).not.toBeInTheDocument();
  });

  it('offers edit and delete only on the own reviews', async () => {
    renderWithProviders(<ProductReviews productId={5} />, { preloadedState: loggedIn() });

    await screen.findByText('Ottimo mouse');
    expect(await within(itemOf('Ottimo mouse')).findByRole('button', { name: 'Modifica' })).toBeInTheDocument();
    expect(within(itemOf('Ottimo mouse')).getByRole('button', { name: 'Elimina' })).toBeInTheDocument();
    expect(within(itemOf('Si rompe subito')).queryByRole('button')).not.toBeInTheDocument();
  });

  it('creates a review with stars and comment, then reloads the list', async () => {
    let body;
    server.use(
      http.post(`${API}/Review`, async ({ request }) => {
        body = await request.json();
        current = [...current, { reviewId: 13, reviewRating: 4, reviewComment: 'Buono', createdAt: '2026-11-24T10:00:00Z' }];
        return HttpResponse.json({ reviewId: 13 }, { status: 201 });
      })
    );
    const user = userEvent.setup();
    renderWithProviders(<ProductReviews productId={5} />, { preloadedState: loggedIn() });

    await screen.findByText('Ottimo mouse');
    await user.click(screen.getByRole('button', { name: 'Voto 4' }));
    await user.type(screen.getByLabelText('La tua recensione'), 'Buono');
    await user.click(screen.getByRole('button', { name: 'Pubblica' }));

    await vi.waitFor(() => expect(body).toEqual({ productId: 5, reviewRating: 4, reviewComment: 'Buono' }));
    expect(await screen.findByText('Buono')).toBeInTheDocument();
  });

  it('edits the own review', async () => {
    let body;
    server.use(
      http.put(`${API}/Review/11`, async ({ request }) => {
        body = await request.json();
        return new HttpResponse(null, { status: 204 });
      })
    );
    const user = userEvent.setup();
    renderWithProviders(<ProductReviews productId={5} />, { preloadedState: loggedIn() });

    await screen.findByText('Ottimo mouse');
    await user.click(await within(itemOf('Ottimo mouse')).findByRole('button', { name: 'Modifica' }));
    const text = screen.getByLabelText('La tua recensione');
    expect(text).toHaveValue('Ottimo mouse');
    await user.clear(text);
    await user.type(text, 'Ottimo, ma rumoroso');
    await user.click(screen.getByRole('button', { name: 'Voto 3' }));
    await user.click(screen.getByRole('button', { name: 'Salva modifiche' }));

    await vi.waitFor(() => expect(body).toEqual({ reviewRating: 3, reviewComment: 'Ottimo, ma rumoroso' }));
  });

  it('deletes the own review after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    let deleted = false;
    server.use(
      http.delete(`${API}/Review/11`, () => {
        deleted = true;
        current = current.filter((r) => r.reviewId !== 11);
        return HttpResponse.json({ message: 'Comment correctly deleted!' });
      })
    );
    const user = userEvent.setup();
    renderWithProviders(<ProductReviews productId={5} />, { preloadedState: loggedIn() });

    await screen.findByText('Ottimo mouse');
    await user.click(await within(itemOf('Ottimo mouse')).findByRole('button', { name: 'Elimina' }));

    await vi.waitFor(() => expect(deleted).toBe(true));
    await vi.waitFor(() => expect(screen.queryByText('Ottimo mouse')).not.toBeInTheDocument());
  });

  it('shows the BE error by code', async () => {
    server.use(
      http.post(`${API}/Review`, () =>
        HttpResponse.json({ ...problem(400, 'validation_failed'), errors: { ReviewRating: ['Il voto deve essere compreso tra 1 e 5.'] } }, { status: 400 }))
    );
    const user = userEvent.setup();
    renderWithProviders(<ProductReviews productId={5} />, { preloadedState: loggedIn() });

    await screen.findByText('Ottimo mouse');
    await user.click(screen.getByRole('button', { name: 'Voto 4' }));
    await user.type(screen.getByLabelText('La tua recensione'), 'x');
    await user.click(screen.getByRole('button', { name: 'Pubblica' }));

    await vi.waitFor(() => expect(toast.error).toHaveBeenCalledWith('Il voto deve essere compreso tra 1 e 5.'));
  });
});

describe('ProductInfo', () => {
  it('loads the product by id when opened directly (no navigation state)', async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    server.use(
      http.get(`${API}/Product/5`, () => HttpResponse.json(productWith([]))),
      http.get(`${API}/Product/subcategory/11`, () => HttpResponse.json([]))
    );

    renderWithProviders(<ProductInfo />, { path: '/product/:id', route: '/product/5' });

    expect(await screen.findByRole('heading', { name: 'Mouse ottico' })).toBeInTheDocument();
  });
});
