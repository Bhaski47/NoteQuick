import { Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/provider/ThemeProvider";
import SideBar from "@/components/SideBar/SideBar";
import { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import NavigationEvents from "@/components/NavigationEvents";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://notequick.vercel.app"),

  description: "Fast and simple note-taking app",

  openGraph: {
    title: "NoteQuick",
    description: "Fast and simple note-taking app",
    url: "https://notequick.vercel.app",
    siteName: "NoteQuick",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "NoteQuick",
    description: "Fast and simple note-taking app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} bg-light-backgroundColor dark:bg-dark-backgroundColor text-light-textPrimary dark:text-dark-textPrimary min-h-dvh`}
      >
        <NextTopLoader
          color="#6457F9"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #6457F9,0 0 5px #6457F9"
          zIndex={99999}
        />
        <NavigationEvents />
        <SideBar />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
