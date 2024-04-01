'use client';

import { ObjectValues } from '@/lib/types';
import React, { ReactNode, useEffect, useState } from 'react';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

function preferredTheme(): Theme {
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    return THEMES.DARK;
  }

  return THEMES.LIGHT;
}

type Theme = ObjectValues<typeof THEMES>;

let themeLoaded = false;

export const ThemeContext = React.createContext({
  theme: THEMES.DARK,
  toggleTheme: () => {},
} as ThemeContextType);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  if (typeof window === 'undefined') {
    return children;
  }

  const [theme, setTheme] = useState<Theme>(preferredTheme());

  //TODO fix initial render flicker
  useEffect(() => {
    if (!themeLoaded) {
      const html = document.querySelector('html');
      html?.classList.add(theme);
      themeLoaded = true;
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    const html = document.querySelector('html');
    localStorage.setItem('theme', newTheme);
    html?.classList.remove(theme);
    html?.classList.add(newTheme);
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
