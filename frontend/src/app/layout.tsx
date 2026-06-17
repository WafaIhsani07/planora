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

import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <LanguageProvider>
          {children}
          <ScrollObserver />
          <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { background: '#2A2A2A', color: '#fff', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' } }} />
        </LanguageProvider>
      </body>
    </html>
  );
}