import type { Metadata } from "next";
import Footer from "@/components/Footer";
import "../styles/globals.css";

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
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <Footer />
      </body>
    </html>
  );
}