// Preferenza di tema dell'utente. Sta in una chiave localStorage propria, fuori da Redux Persist
// (che scade dopo un'ora): una preferenza deve sopravvivere alla sessione.
// public/theme-init.js applica la stessa logica prima del primo paint: le due vanno tenute allineate.
export const THEME_KEY = 'vt-theme';
export const THEME_PREFERENCES = ['auto', 'light', 'dark'];
export const DARK_QUERY = '(prefers-color-scheme: dark)';

export const readThemePreference = (storage) => {
  try {
    const value = storage?.getItem(THEME_KEY);
    return THEME_PREFERENCES.includes(value) ? value : 'auto';
  } catch {
    // localStorage può essere bloccato (modalità privata, cookie disattivati).
    return 'auto';
  }
};

export const saveThemePreference = (storage, preference) => {
  try {
    if (preference === 'auto') storage?.removeItem(THEME_KEY);
    else storage?.setItem(THEME_KEY, preference);
  } catch {
    // Senza storage la scelta vale solo per questa pagina.
  }
};

export const resolveTheme = (preference, prefersDark) =>
  preference === 'auto' ? (prefersDark ? 'dark' : 'light') : preference;

export const applyTheme = (root, theme) => root.setAttribute('data-bs-theme', theme);
