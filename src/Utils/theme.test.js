import { describe, expect, it } from 'vitest';
import { readThemePreference, resolveTheme, saveThemePreference, THEME_KEY } from './theme';

const memoryStorage = (initial = {}) => {
  const data = { ...initial };
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
    removeItem: (key) => {
      delete data[key];
    },
    data,
  };
};

const blockedStorage = {
  getItem: () => {
    throw new Error('SecurityError');
  },
  setItem: () => {
    throw new Error('SecurityError');
  },
  removeItem: () => {
    throw new Error('SecurityError');
  },
};

describe('readThemePreference', () => {
  it('legge una preferenza valida', () => {
    expect(readThemePreference(memoryStorage({ [THEME_KEY]: 'dark' }))).toBe('dark');
  });

  it('torna ad auto se il valore manca o non è valido', () => {
    expect(readThemePreference(memoryStorage())).toBe('auto');
    expect(readThemePreference(memoryStorage({ [THEME_KEY]: 'sepia' }))).toBe('auto');
  });

  it('torna ad auto se lo storage è bloccato', () => {
    expect(readThemePreference(blockedStorage)).toBe('auto');
  });
});

describe('saveThemePreference', () => {
  it('salva chiaro e scuro, e auto rimuove la chiave', () => {
    const storage = memoryStorage();
    saveThemePreference(storage, 'light');
    expect(storage.data[THEME_KEY]).toBe('light');
    saveThemePreference(storage, 'auto');
    expect(THEME_KEY in storage.data).toBe(false);
  });

  it('non lancia se lo storage è bloccato', () => {
    expect(() => saveThemePreference(blockedStorage, 'dark')).not.toThrow();
  });
});

describe('resolveTheme', () => {
  it('in auto segue il sistema', () => {
    expect(resolveTheme('auto', true)).toBe('dark');
    expect(resolveTheme('auto', false)).toBe('light');
  });

  it('una scelta esplicita vince sul sistema', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });
});
