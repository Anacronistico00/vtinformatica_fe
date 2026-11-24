import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { describe, expect, it } from 'vitest';
import { makeToken } from '../../test/jwt';
import { makePersistConfig } from '../../Utils/PersistConfig';
import rootReducer from './rootReducer';

// Rehydrate reale di redux-persist con uno storage in memoria, nel formato di persist:root.
const memoryStorage = (slices) => {
  const data = {
    'persist:root': JSON.stringify(
      Object.fromEntries(Object.entries(slices).map(([key, value]) => [key, JSON.stringify(value)]))
    ),
  };
  return {
    getItem: async (key) => data[key] ?? null,
    setItem: async (key, value) => {
      data[key] = value;
    },
    removeItem: async (key) => {
      delete data[key];
    },
  };
};

const rehydrate = async (slices) => {
  const store = configureStore({
    reducer: persistReducer(makePersistConfig(memoryStorage(slices)), rootReducer),
    middleware: (getDefault) => getDefault({ serializableCheck: false }),
  });
  await new Promise((resolve) => {
    const persistor = persistStore(store, null, resolve);
    return persistor;
  });
  return store.getState();
};

const ONE_DAY = 24 * 60 * 60 * 1000;

describe('persisted state on reopening the app', () => {
  it('an expired session leaves a usable logged-out auth slice (not undefined)', async () => {
    const state = await rehydrate({
      auth: { user: { email: 'a@test.local', role: 'Customer' }, token: makeToken({ expiresInSeconds: -60 }), isAuthenticated: true },
    });

    expect(state.auth).toEqual({ user: null, token: null, isAuthenticated: false });
  });

  it('a stale cart falls back to the empty cart (not undefined)', async () => {
    const state = await rehydrate({
      cart: { items: [{ id: 1 }], totalPrice: 10, loading: false, error: null, _persistedAt: Date.now() - ONE_DAY },
    });

    expect(state.cart).toMatchObject({ items: [], totalPrice: 0 });
  });

  it('a valid session is restored', async () => {
    const token = makeToken({ expiresInSeconds: 600 });
    const state = await rehydrate({
      auth: { user: { email: 'a@test.local', role: 'Customer' }, token, isAuthenticated: true },
    });

    expect(state.auth).toMatchObject({ token, isAuthenticated: true });
  });
});
