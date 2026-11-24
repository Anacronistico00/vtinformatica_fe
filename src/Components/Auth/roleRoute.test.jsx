import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { loggedIn, renderWithProviders } from '../../test/render';
import RoleRoute from './roleRoute';

const guarded = (
  <RoleRoute requiredRole='Admin'>
    <p>Area admin</p>
  </RoleRoute>
);
const routes = { '/account': <p>Pagina di login</p>, '/not-authorized': <p>Non autorizzato</p> };

describe('RoleRoute', () => {
  it('sends an anonymous visitor to the login page (/account)', () => {
    renderWithProviders(guarded, { path: '/admin', route: '/admin', routes });

    expect(screen.getByText('Pagina di login')).toBeInTheDocument();
  });

  it('sends a non-admin to /not-authorized and lets an admin in', () => {
    const { unmount } = renderWithProviders(guarded, {
      path: '/admin', route: '/admin', routes, preloadedState: loggedIn({ role: 'Customer' }),
    });
    expect(screen.getByText('Non autorizzato')).toBeInTheDocument();
    unmount();

    renderWithProviders(guarded, { path: '/admin', route: '/admin', routes, preloadedState: loggedIn({ role: 'Admin' }) });
    expect(screen.getByText('Area admin')).toBeInTheDocument();
  });
});
