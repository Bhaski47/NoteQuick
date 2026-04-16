import React from "react";
import type { Viewport } from "next";


export const viewport: Viewport = {
  themeColor: "#4643B5",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      style={{
        colorScheme: "light",
        background: "#ffffff",
        minHeight: "100vh",
      }}
      className="light"
    >
      {children}
    </div>
  );
}
