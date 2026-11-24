import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { makeStore } from './store';
import { makeToken } from './jwt';

/** Stato auth come dopo un login riuscito. */
export const loggedIn = ({ role = 'Customer', email = 'mario@test.local' } = {}) => ({
  auth: { user: { email, role, birthDate: '1990-01-01' }, token: makeToken({ email, role }), isAuthenticated: true },
});

/**
 * Rende un componente con store reale e router in memoria.
 * `routes` aggiunge altre rotte (es. la destinazione di un redirect).
 */
export const renderWithProviders = (
  ui,
  { preloadedState, path = '/', route = '/', routes = {}, store = makeStore(preloadedState) } = {}
) => {
  const result = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={ui} />
          {Object.entries(routes).map(([routePath, element]) => (
            <Route key={routePath} path={routePath} element={element} />
          ))}
        </Routes>
      </MemoryRouter>
    </Provider>
  );
  return { store, ...result };
};
