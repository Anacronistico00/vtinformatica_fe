import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/render';
import CarouselComponent from './CarouselComponent';

// Il carosello della home mostra le categorie del catalogo: titolo e sottocategorie vengono dallo store.
const categories = [
  {
    id: 1,
    name: 'Componenti PC',
    subCategories: [
      { id: 3, name: 'CPU', categoryId: 1 },
      { id: 4, name: 'Schede video', categoryId: 1 },
    ],
  },
  { id: 2, name: 'Periferiche', subCategories: [{ id: 9, name: 'Monitor', categoryId: 2 }] },
  { id: 6, name: 'PC Assemblati', subCategories: [{ id: 21, name: 'Mini PC', categoryId: 6 }] },
];

const stateWith = (list) => ({ categories: { categories: list, category: null, loading: false, error: null } });

describe('CarouselComponent', () => {
  it('shows a slide per featured category with its subcategories as links', () => {
    renderWithProviders(<CarouselComponent />, { preloadedState: stateWith(categories) });

    const slide = screen.getByRole('heading', { name: 'Componenti PC' }).closest('.banner');
    expect(within(slide).getByRole('link', { name: 'CPU' })).toHaveAttribute('href', '/products/subcategory/3');
    expect(within(slide).getByRole('link', { name: 'Schede video' })).toHaveAttribute('href', '/products/subcategory/4');
    expect(within(slide).getByRole('link', { name: 'Vedi i componenti' })).toHaveAttribute('href', '/products/category/1');
  });

  it('shows the three slides in a fixed order, whatever the order of the catalogue', () => {
    renderWithProviders(<CarouselComponent />, { preloadedState: stateWith(categories) });

    const titles = screen.getAllByRole('heading', { level: 2, hidden: true }).map((h) => h.textContent);
    expect(titles).toEqual(['Componenti PC', 'PC Assemblati', 'Periferiche']);
  });

  it('skips a slide whose category does not exist and renders nothing without categories', () => {
    const { unmount } = renderWithProviders(<CarouselComponent />, { preloadedState: stateWith([categories[0]]) });
    expect(screen.getAllByRole('heading', { level: 2, hidden: true })).toHaveLength(1);
    unmount();

    const { container } = renderWithProviders(<CarouselComponent />);
    expect(container).toBeEmptyDOMElement();
  });

  it('does not load anything from third-party sites', () => {
    const { container } = renderWithProviders(<CarouselComponent />, { preloadedState: stateWith(categories) });

    expect(container.querySelectorAll('img')).toHaveLength(0);
  });
});
