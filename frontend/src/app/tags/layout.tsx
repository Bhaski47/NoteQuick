import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Notequick | Tags",
  description: "Customize your tags",
};

export const viewport: Viewport = {
  themeColor: "#4643B5",
};


export default function TagsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="sm:ml-[15%] min-h-dvh w-full sm:w-[85%] bg-light-backgroundColor dark:bg-dark-backgroundColor flex flex-col">
      {children}
    </main>
  );
}
