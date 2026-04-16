import { Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/provider/ThemeProvider";
import SideBar from "@/components/SideBar/SideBar";

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
        <SideBar />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
