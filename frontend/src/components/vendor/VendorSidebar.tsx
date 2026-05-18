'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  LogOut,
  Store,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

import { signOut } from 'next-auth/react';

const navItems = [
  { href: '/vendor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/vendor/layanan', label: 'Kelola Layanan', icon: Package },
  { href: '/vendor/pesanan', label: 'Pesanan Masuk', icon: ClipboardList },
];

export default function VendorSidebar() {
  const pathname = usePathname();
  const { clearSession, user } = useAuthStore();

  const handleLogout = async () => {
    clearSession();
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <aside className="w-64 bg-[#2A2A2A] fixed h-full z-50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#FF9A9E] flex items-center justify-center">
          <Store className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-white tracking-tight">PLANORA</span>
          <span className="text-[9px] font-bold tracking-widest text-white/30 uppercase">Vendor Panel</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-6 overflow-y-auto">
        <span className="text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase px-3 mb-2 block">MENU</span>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all group ${
                    active ? 'bg-[#FF9A9E]' : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-white/60 group-hover:text-white'}`} />
                  <span className={`text-sm ${active ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5">
          <div className="w-8 h-8 rounded-md bg-[#FF9A9E] flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? 'V'}
          </div>
          <div className="overflow-hidden text-left min-w-0 flex-1">
            <p className="text-xs font-semibold truncate text-white">{user?.name ?? 'Vendor'}</p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-[8px] text-[#FF9A9E] font-bold uppercase tracking-tight hover:text-[#FF527B] transition-colors"
            >
              <LogOut className="w-2.5 h-2.5" /> KELUAR
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
