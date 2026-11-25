import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ThemeToggle from './ThemeToggle';
import { THEME_KEY } from '../../Utils/theme';

// prefers-color-scheme simulato: jsdom non implementa matchMedia.
const systemTheme = (dark) => {
  const listeners = new Set();
  const query = {
    matches: dark,
    addEventListener: (_, listener) => listeners.add(listener),
    removeEventListener: (_, listener) => listeners.delete(listener),
  };
  window.matchMedia = vi.fn(() => query);
  return {
    change: (nextDark) => {
      query.matches = nextDark;
      listeners.forEach((listener) => listener());
    },
  };
};

const theme = () => document.documentElement.getAttribute('data-bs-theme');

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-bs-theme');
  });

  afterEach(() => {
    delete window.matchMedia;
  });

  it('in auto applica il tema del sistema e lo segue quando cambia', () => {
    const system = systemTheme(true);
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'Tema: Auto' })).toBeInTheDocument();
    expect(theme()).toBe('dark');

    act(() => system.change(false));
    expect(theme()).toBe('light');
  });

  it('Scuro si applica, resta salvato e ignora il sistema', async () => {
    const system = systemTheme(false);
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole('button', { name: 'Tema: Auto' }));
    await userEvent.click(screen.getByRole('button', { name: 'Scuro' }));

    expect(theme()).toBe('dark');
    expect(localStorage.getItem(THEME_KEY)).toBe('dark');
    expect(screen.getByRole('button', { name: 'Tema: Scuro' })).toBeInTheDocument();

    act(() => system.change(false));
    expect(theme()).toBe('dark');
  });

  it('riparte dalla preferenza salvata', () => {
    systemTheme(true);
    localStorage.setItem(THEME_KEY, 'light');
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'Tema: Chiaro' })).toBeInTheDocument();
    expect(theme()).toBe('light');
  });

  it('tornare ad Auto rimuove la preferenza', async () => {
    systemTheme(false);
    localStorage.setItem(THEME_KEY, 'dark');
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole('button', { name: 'Tema: Scuro' }));
    await userEvent.click(screen.getByRole('button', { name: 'Auto' }));

    expect(localStorage.getItem(THEME_KEY)).toBeNull();
    expect(theme()).toBe('light');
  });
});
