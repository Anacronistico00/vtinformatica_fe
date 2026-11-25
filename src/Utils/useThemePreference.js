import { useEffect, useState } from 'react';
import {
  applyTheme,
  DARK_QUERY,
  readThemePreference,
  resolveTheme,
  saveThemePreference,
} from './theme';

const darkQuery = () => window.matchMedia?.(DARK_QUERY);

/** Preferenza di tema (auto | light | dark), applicata a <html> e seguita in auto se cambia il sistema. */
const useThemePreference = () => {
  const [preference, setPreference] = useState(() => readThemePreference(window.localStorage));

  useEffect(() => {
    const query = darkQuery();
    const apply = () => applyTheme(document.documentElement, resolveTheme(preference, Boolean(query?.matches)));
    apply();
    if (preference !== 'auto' || !query) return undefined;
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, [preference]);

  const choose = (next) => {
    saveThemePreference(window.localStorage, next);
    setPreference(next);
  };

  return [preference, choose];
};

export default useThemePreference;
