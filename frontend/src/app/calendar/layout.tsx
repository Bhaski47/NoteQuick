import { Manrope } from "next/font/google";
import SideBar from "@/components/SideBar/SideBar";
import { Metadata, Viewport } from "next";
export const metadata: Metadata = {
  title: "Notequick | Settings",
  description: "Customize your settings",
};

export const viewport: Viewport = {
  themeColor: "#4643B5",
};

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className={`${manrope.variable} font-manrope`}>
        <SideBar />
        <div className={`w-full bg-light-backgroundColor dark:bg-dark-backgroundColor`}>{children}</div>
      </div>
  );
}
