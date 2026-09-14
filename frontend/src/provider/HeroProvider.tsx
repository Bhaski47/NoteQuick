'use client';
import { HeroUIProvider, ToastProvider } from '@heroui/react';

export function HeroProvider({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider
        placement="top-right"
        toastOffset={24}
        maxVisibleToasts={5}
      />
      {children}
    </HeroUIProvider>
  );
}