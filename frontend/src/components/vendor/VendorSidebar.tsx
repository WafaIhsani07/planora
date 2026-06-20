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
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Fetch real-time pending bookings count for badge
  useEffect(() => {
    getVendorBookings({ status: 'PENDING' })
      .then((res) => {
        if (res && res.data) {
          setPendingCount(res.data.length);
        }
      })
      .catch((err) => console.error('Gagal mengambil jumlah pesanan tertunda:', err));
  }, [pathname]);

  const handleLogout = async () => {
    clearSession();
    await signOut({ redirect: false, callbackUrl: '/login' });
    window.location.href = '/login';
  };

  return (
    <aside className={`bg-[#0A0A0A] fixed h-full z-50 flex flex-col transition-all duration-300 border-r border-white/5 ${isCollapsed ? 'w-20' : 'w-[280px]'}`}>
      {/* Logo Header */}
      <div className={`p-6 pb-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} border-b border-white/5 transition-all duration-300`}>
        {isCollapsed ? (
          <img src="/images/logogmbr.png" alt="Planora" className="h-8 w-8 object-contain" />
        ) : (
          <>
            <img src="/images/logogmbr.png" alt="Planora" className="h-9 w-auto object-contain" />
            <span className="text-xl font-bold italic tracking-tight text-white truncate font-logo">
              Planora
            </span>
          </>
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
            const path = pathname ?? '';
            const active = path === item.href || path.startsWith(`${item.href}/`);
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
          <div className="flex justify-center">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/5 bg-[#151515] px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#FF9A9E] transition-colors hover:bg-[#1B1B1B] cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              KELUAR
            </button>
          </div>
        ) : (
          <div className="flex items-center px-3 py-2">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/5 bg-[#151515] px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-[#FF9A9E] transition-colors hover:bg-[#1B1B1B]"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              KELUAR
            </button>
          </div>
        )}
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2A2A2A]/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-8 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-black text-[#2A2A2A]">Keluar dari akun?</h2>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-[#2A2A2A]/40 transition-all hover:bg-[#FCE6E3] hover:text-[#FF527B] cursor-pointer"
                aria-label="Tutup dialog logout"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-[#2A2A2A]/70">
              Kamu yakin ingin keluar dari akun vendor sekarang?
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[#2A2A2A]/50 transition-all hover:bg-gray-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-[#FF527B] px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-[#ff3f6d] cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
