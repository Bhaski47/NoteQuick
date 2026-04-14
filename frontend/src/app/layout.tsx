import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { HeroProvider } from "@/provider/HeroProvider";
import NextTopLoader from "nextjs-toploader";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={manrope.variable}>
        <NextTopLoader color="#6457F9" height={3} showSpinner={false} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <HeroProvider>{children}</HeroProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
