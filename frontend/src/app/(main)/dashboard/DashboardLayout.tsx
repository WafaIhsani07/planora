'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  ShoppingBag,
  Image as ImageIcon,
  Settings,
  Bell,
  LogOut,
  Star,
  Wallet,
  Briefcase,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayoutWrapper({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();

  const vendorName = 'Wafa Decoration';

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Pesanan', href: '/dashboard/jadwal', icon: ShoppingBag, badge: 3 },
    { name: 'Paket Layanan', href: '/dashboard/katalog', icon: Briefcase },
    { name: 'Portofolio', href: '/dashboard/portofolio', icon: ImageIcon },
    { name: 'Ulasan', href: '/dashboard/ulasan', icon: Star },
    { name: 'Keuangan', href: '/dashboard/keuangan', icon: Wallet },
    { name: 'Pengaturan', href: '/dashboard/pengaturan', icon: Settings },
  ];

  const handleLogout = async () => {
    const result = await signOut({ redirect: false, callbackUrl: '/login' });
    window.location.href = result.url || '/login';
  };

  return (
    <div className="min-h-screen bg-[#FDF1F0] flex font-sans text-[#2A2A2A]">
      {/* SIDEBAR */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-[#2A2A2A] transition-all duration-300 flex flex-col fixed h-full z-50`}
      >
        {/* Logo Section */}
        <div className="p-6 pb-6 flex items-center gap-3 border-b border-white/5">
          <Image
            src="/images/logogmbr.png"
            alt="Planora"
            width={160}
            height={42}
            priority
            className="h-9 w-auto"
          />
          {isSidebarOpen && (
            <span
              className="text-xl font-bold italic tracking-tight text-white truncate font-logo"
            >
              Planora
            </span>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 overflow-y-auto custom-scrollbar mt-6">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all group ${
                      isActive
                        ? 'bg-[#FF9A9E] hover:bg-[#FF8A8E]'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 flex-shrink-0 transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-white/60 group-hover:text-white'
                      }`}
                    />
                    {isSidebarOpen && (
                      <div className="flex flex-1 justify-between items-center min-w-0">
                        <span
                          className={`text-sm truncate transition-colors ${
                            isActive
                              ? 'text-white'
                              : 'text-white/60 group-hover:text-white'
                          }`}
                        >
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black ${
                            isActive
                              ? 'bg-white/30 text-white'
                              : 'bg-[#FF527B] text-white'
                          }`}>
                            {item.badge}
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

        {/* Profile Sidebar Footer */}
        <div className="p-3 border-t border-white/5">
          <div
            className={`flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5 ${
              !isSidebarOpen && 'justify-center'
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300"
              className="w-8 h-8 rounded-md object-cover border border-white/10 flex-shrink-0"
              alt="Vendor Logo"
            />
            {isSidebarOpen && (
              <div className="overflow-hidden text-left min-w-0">
                <p className="text-xs font-semibold truncate text-white">{vendorName}</p>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center gap-1 text-[8px] text-[#FF9A9E] font-bold uppercase tracking-tight hover:text-[#FF527B] transition-colors whitespace-nowrap"
                >
                  <LogOut className="w-2.5 h-2.5" /> KELUAR
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className={`flex-1 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* TOPBAR */}
        <header className="h-16 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 border-b border-[#2A2A2A]/5">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 text-[#2A2A2A] hover:bg-gray-100 rounded-md transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-6">
            <button className="relative p-1.5 text-[#2A2A2A]/40 hover:text-[#FF9A9E] transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#FF527B] text-white text-[6px] flex items-center justify-center rounded-full border border-white font-bold">
                3
              </span>
            </button>

            <div className="flex items-center gap-2.5 pl-4 border-l border-gray-200 cursor-pointer group">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300"
                className="w-8 h-8 rounded-lg object-cover border border-gray-200 transition-transform group-hover:scale-105 flex-shrink-0"
                alt="Vendor Logo"
              />
              <div className="flex flex-col text-left hidden sm:flex">
                <p className="text-xs font-semibold text-[#2A2A2A]">
                  {vendorName}
                </p>
                <p className="text-[8px] font-medium text-[#2A2A2A]/40 uppercase tracking-tight">Vendor</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-[#FDF1F0]">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2A2A2A]/80 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 md:p-10 w-full max-w-[380px] shadow-2xl">
            <h2 className="text-xl font-extrabold text-[#2A2A2A] mb-2">Keluar?</h2>
            <p className="text-sm text-gray-600 mb-8">
              Apakah kamu yakin ingin keluar dari akun Planora kamu?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-[#FF9A9E] px-4 py-3 font-bold text-white transition hover:bg-[#FF7F97]"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
