import { Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/provider/ThemeProvider";
import SideBar from "@/components/SideBar/SideBar";
import { Metadata } from "next";

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
      <body className={manrope.variable}>
        <SideBar />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
