import SideBar from "@/components/SideBar/SideBar";
import { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";

export const metadata: Metadata = {
  title: "Notequick | Settings",
  description: "Customize your settings",
};

export const viewport: Viewport = {
  themeColor: "#4643B5",
  // colorScheme:'only light'
};

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`overflow-y-hidden ${manrope.variable} font-manrope`}>
      {/* <HeroProvider> */}
        <SideBar />
        <div className="w-full bg-light-backgroundColor dark:bg-dark-backgroundColor">
          {children}
        </div>
      {/* </HeroProvider> */}
    </div>
  );
}
