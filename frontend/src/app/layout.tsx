import type { Metadata } from "next";
import "../styles/globals.css";
import ScrollObserver from "@/components/ScrollObserver";

export const metadata: Metadata = {
  title: "Planora",
  description: "Platform marketplace layanan event",
  icons: {
    icon: "/images/logogmbr.png",
    shortcut: "/images/logogmbr.png",
    apple: "/images/logogmbr.png",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <ScrollObserver />
      </body>
    </html>
  );
}