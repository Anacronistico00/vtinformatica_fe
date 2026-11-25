import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/render';
import HamburgerDropdown from './HamburgerDropdown';

describe('HamburgerDropdown', () => {
  it('shows only the icon: the accessible name comes from aria-label, no visible text under it', () => {
    renderWithProviders(<HamburgerDropdown />);

    const toggle = screen.getByRole('button', { name: 'Apri menu' });
    expect(toggle).toHaveTextContent('');
    expect(screen.queryByText(/men[uù]$/i)).not.toBeInTheDocument();
  });

  it('reports whether the menu is open', async () => {
    renderWithProviders(<HamburgerDropdown />);

    const toggle = screen.getByRole('button', { name: 'Apri menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });
});
