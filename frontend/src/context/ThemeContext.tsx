'use client';
import { Theme } from '@/types';
import React from 'react';
import { useTheme as useNextTheme } from 'next-themes';

type ThemeContextType = {
  theme: Theme | 'system';
  setTheme: (theme: Theme | 'system') => void;
  resolvedTheme: Theme;
};


export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const useTheme = (): ThemeContextType => {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  return {
    theme: (theme as Theme | 'system') ?? 'system',
    setTheme: (t) => setTheme(t),
    resolvedTheme: (resolvedTheme as Theme) ?? 'light',
  };
};