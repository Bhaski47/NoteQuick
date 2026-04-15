"use client";

import { ThemeProvider } from "next-themes";
import { HeroProvider } from "./HeroProvider";

import NextTopLoader from "nextjs-toploader";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextTopLoader color="#6457F9" height={3} showSpinner={false} />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <HeroProvider>{children}</HeroProvider>
      </ThemeProvider>
    </>
  );
}
