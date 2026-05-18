'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  LogOut,
  Store,
  Image as ImageIcon,
  Star,
  Wallet,
  Settings,
  Menu,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { signOut } from 'next-auth/react';
import { getVendorBookings } from '@/services/vendor.service';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/vendor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/vendor/pesanan', label: 'Pesanan', icon: ClipboardList, hasBadge: true },
  { href: '/vendor/layanan', label: 'Paket Layanan', icon: Package },
  { href: '/vendor/portofolio', label: 'Portofolio', icon: ImageIcon },
  { href: '/vendor/ulasan', label: 'Ulasan', icon: Star },
  { href: '/vendor/keuangan', label: 'Keuangan', icon: Wallet },
  { href: '/vendor/pengaturan', label: 'Pengaturan', icon: Settings },
];

interface VendorSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function VendorSidebar({ isCollapsed, toggleSidebar }: VendorSidebarProps) {
  const pathname = usePathname();
  const { clearSession, user } = useAuthStore();
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch real-time pending bookings count for badge
  useEffect(() => {
    getVendorBookings({ status: 'PENDING' })
      .then((data) => {
        if (data) {
          setPendingCount(data.length);
        }
      })
      .catch((err) => console.error('Gagal mengambil jumlah pesanan tertunda:', err));
  }, [pathname]);

  const handleLogout = async () => {
    clearSession();
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <aside className={`bg-[#0A0A0A] fixed h-full z-50 flex flex-col transition-all duration-300 border-r border-white/5 ${isCollapsed ? 'w-20' : 'w-[280px]'}`}>
      {/* Logo Header */}
      <div className={`p-6 pb-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} border-b border-white/5 transition-all duration-300`}>
        {isCollapsed ? (
          <img src="/images/logogmbr.png" alt="Planora" className="h-8 w-8 object-contain" />
        ) : (
          <img src="/images/logogmbr.png" alt="Planora" className="h-9 w-auto object-contain" />
        )}
      </div>


      {/* Navigation Links */}
      <nav className="flex-1 px-4 mt-6 overflow-y-auto no-scrollbar">
        {!isCollapsed && (
          <span className="text-[9px] font-bold tracking-[0.2em] text-white/40 uppercase px-3 mb-3 block">
            NAVIGASI
          </span>
        )}
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'
                  } rounded-xl font-semibold text-sm transition-all group ${
                    active 
                      ? 'bg-[#FF9A9E] text-white shadow-lg shadow-[#FF9A9E]/20 hover:bg-[#FF8A8E]' 
                      : 'hover:bg-white/10 text-white/60 hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-white/60 group-hover:text-white'}`} />
                  {!isCollapsed && (
                    <div className="flex flex-1 justify-between items-center min-w-0">
                      <span className={`text-sm truncate transition-opacity duration-300 ${active ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                        {item.label}
                      </span>
                      {item.hasBadge && pendingCount > 0 && (
                        <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black ${
                          active ? 'bg-white/30 text-white' : 'bg-[#FF527B] text-white'
                        }`}>
                          {pendingCount}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Profile with Logout */}
      <div className="p-3 border-t border-white/5">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF9A9E]/20 text-[#FF9A9E] flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() ?? 'V'}
            </div>
            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500 hover:border-red-500 text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-md bg-[#FF9A9E] flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() ?? 'V'}
            </div>
            <div className="overflow-hidden text-left min-w-0 flex-1">
              <p className="text-xs font-semibold truncate text-white">{user?.name ?? 'Vendor'}</p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-[8px] text-[#FF9A9E] font-bold uppercase tracking-widest hover:text-[#FF527B] transition-colors mt-0.5"
              >
                <LogOut className="w-2.5 h-2.5" /> KELUAR
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
