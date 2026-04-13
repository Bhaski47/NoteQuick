import SideBar from "@/components/SideBar/SideBar";
import { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";

export const metadata: Metadata = {
  title: "Notequick | Tasks",
  description: "Add Your Todo's",
};

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const viewport: Viewport = {
  themeColor: "#4643B5",
};

export default function TaskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${manrope.variable} font-manrope`}>
        <SideBar />
        <div
          className={`w-full bg-light-backgroundColor dark:bg-dark-backgroundColor`}
        >
          {children}
        </div>
    </div>
  );
}
