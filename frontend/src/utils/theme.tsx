'use server'
import { cookies } from 'next/headers';

export type Theme = 'light' | 'dark' | 'system';

export async function getThemeFromCookies(): Promise<Theme | 'system'> {
  const cookieStore = cookies();
  return ((await cookieStore).get('theme')?.value as Theme) || 'system';
}

export async function setThemeToCookies(theme: Theme | 'system') {
  (await cookies()).set('theme', theme);
}