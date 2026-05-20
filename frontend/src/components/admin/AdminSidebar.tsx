'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Layers,
  LogOut,
  CreditCard,
  HandCoins,
  ReceiptText,
  Settings,
} from 'lucide-react';
import { adminTokens } from './designTokens';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  activeMatch?: string[];
};

const navGroups: Array<{ title: string; items: NavItem[] }> = [
  {
    title: 'OVERVIEW',
    items: [
      {
        href: '/admin/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        activeMatch: ['/admin/dashboard'],
      },
    ],
  },
  {
    title: 'VERIFIKASI',
    items: [
      {
        href: '/admin/verifikasi',
        label: 'Verifikasi Vendor',
        icon: ShieldCheck,
        activeMatch: ['/admin/verifikasi'],
      },
      {
        href: '/admin/verifikasi-pembayaran',
        label: 'Verifikasi Pembayaran',
        icon: CreditCard,
        activeMatch: ['/admin/verifikasi-pembayaran'],
      },
      {
        href: '/admin/pencairan-dana',
        label: 'Pencairan Dana',
        icon: HandCoins,
        activeMatch: ['/admin/pencairan-dana'],
      },
    ],
  },
  {
    title: 'MANAJEMEN',
    items: [
      {
        href: '/admin/manajemen-kategori',
        label: 'Manajemen Kategori',
        icon: Layers,
        activeMatch: ['/admin/manajemen-kategori'],
      },
      {
        href: '/admin/manajemen-user',
        label: 'Manajemen User',
        icon: Users,
        activeMatch: ['/admin/manajemen-user'],
      },
      {
        href: '/admin/laporan-keuangan',
        label: 'Laporan Keuangan',
        icon: ReceiptText,
        activeMatch: ['/admin/laporan-keuangan'],
      },
    ],
  },
  {
    title: 'AKUN',
    items: [
      {
        href: '/admin/pengaturan',
        label: 'Pengaturan',
        icon: Settings,
        activeMatch: ['/admin/pengaturan'],
      },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isSidebarOpen = true;

  const isActive = (item: NavItem) =>
    item.activeMatch?.some(
      (match) => pathname === match || pathname.startsWith(`${match}/`)
    ) ?? (pathname === item.href || pathname.startsWith(`${item.href}/`));

  const handleConfirmLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setShowLogoutModal(false);
    // Redirect langsung ke login setelah logout
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  return (
    <>
      <aside className={`w-[280px] bg-[#0A0A0A] border-r border-white/5 flex flex-col fixed h-screen left-0 top-0 z-50`}>
        <div className="p-8 pb-8 flex items-center gap-3 border-b border-white/5">
          <Image
            src="/images/logogmbr.png"
            alt="Planora"
            width={160}
            height={42}
            priority
            className="h-9 w-auto"
          />
          {isSidebarOpen && (
            <span className="text-xl font-bold italic tracking-tight text-white truncate font-logo">
              Planora
            </span>
          )}
        </div>

        <nav className="flex-1 px-6 overflow-hidden flex flex-col gap-2.5">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-3">
              <span className="text-[9px] font-bold tracking-[0.2em] text-white/40 uppercase px-3 mb-1.5 block">
                {group.title}
              </span>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all group cursor-pointer ${
                          active ? 'bg-[#FF9A9E] hover:bg-[#FF9A9E]/90' : 'hover:bg-white/5'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 flex-shrink-0 transition-colors ${
                            active ? 'text-white' : 'text-white/60 group-hover:text-white'
                          }`}
                        />
                        <div className="flex flex-1 justify-between items-center min-w-0">
                          <span
                            className={`text-xs truncate transition-colors ${
                              active ? 'text-white' : 'text-white/60 group-hover:text-white'
                            }`}
                          >
                            {item.label}
                          </span>
                          {item.badge ? (
                            <span
                              className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black ${
                                active ? 'bg-white/30 text-white' : 'bg-[#FF9A9E] text-white'
                              }`}
                            >
                              {item.badge}
                            </span>
                          ) : null}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className="flex items-center justify-center px-3 py-2">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/5 bg-[#151515] px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-[#FF9A9E] transition-colors hover:bg-[#1B1B1B] whitespace-nowrap"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              KELUAR
            </button>
          </div>
        </div>
      </aside>

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
              Kamu yakin ingin keluar dari akun admin sekarang?
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[#2A2A2A]/50 transition-all hover:bg-gray-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="flex-1 rounded-xl bg-[#FF527B] px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-[#ff3f6d] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? 'Memproses...' : 'Ya, Keluar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}