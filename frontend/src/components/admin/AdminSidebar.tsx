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
          <div className="bg-white rounded-[2rem] p-8 md:p-10 w-full max-w-[380px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#FDF1F0] border border-[#FCE6E3] rounded-[1.25rem] flex items-center justify-center mb-6">
              <LogOut className="w-6 h-6 text-[#EF4444] ml-1" />
            </div>
            <h3 className="text-2xl font-black italic tracking-tighter text-[#2A2A2A] uppercase mb-2">
              Keluar Akun
            </h3>
            <p className="text-[10px] font-bold tracking-wider text-[#A8A8A8] uppercase mb-8 leading-relaxed">
              Apakah Anda yakin ingin keluar dari <br /> Admin Planora?
            </p>
            <div className="flex flex-col w-full gap-3">
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="w-full flex justify-center items-center py-4 rounded-xl bg-[#EF4444] text-white text-[10px] font-bold tracking-widest uppercase hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? 'MEMPROSES...' : 'YA, KELUAR SEKARANG'}
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-4 rounded-xl bg-white border-2 border-gray-100 text-[#A8A8A8] hover:text-[#2A2A2A] hover:border-gray-300 text-[10px] font-bold tracking-widest uppercase transition-colors"
              >
                BATAL
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}