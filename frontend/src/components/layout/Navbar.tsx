import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const { t } = useLanguage();

  const links = [
    { href: "/events", label: t('nav.events') },
    { href: "/bookings", label: t('nav.bookings') },
    { href: "/dashboard", label: t('nav.dashboard') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold text-brand-900">
          Planora
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium text-slate-600">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-brand-800">
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}