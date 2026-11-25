import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../test/render';
import FooterComponent from './FooterComponent';

describe('FooterComponent', () => {
  it('shows the full logo with its name, where there is room for the word', () => {
    renderWithProviders(<FooterComponent />);

    expect(screen.getByRole('img', { name: 'VT Informatica' })).toHaveAttribute('src', '/Images/logo-lockup.svg');
  });

  it('names the social links, which carry only an icon', () => {
    renderWithProviders(<FooterComponent />);

    for (const name of ['Facebook', 'Instagram', 'X', 'YouTube']) {
      expect(screen.getByRole('link', { name })).toBeInTheDocument();
    }
  });
});
