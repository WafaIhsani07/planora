'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const GridIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
);
const BoxIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
);
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);
const WalletIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
);
const SettingsAltIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
const ImageIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
);
const MessageSquareIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const LogoutIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

export default function VendorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { name: 'DASHBOARD', path: '/dashboard', icon: GridIcon },
    { name: 'PESANAN', path: '/dashboard/jadwal', icon: CalendarIcon },
    { name: 'PAKET LAYANAN', path: '/dashboard/katalog', icon: BoxIcon },
    { name: 'PORTOFOLIO', path: '/dashboard/portofolio', icon: ImageIcon },
    { name: 'ULASAN', path: '/dashboard/ulasan', icon: MessageSquareIcon },
    { name: 'KEUANGAN', path: '/dashboard/keuangan', icon: WalletIcon },
    { name: 'PENGATURAN', path: '/dashboard/pengaturan', icon: SettingsAltIcon },
  ];

  const checkIsActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  const handleConfirmLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    const signOutResult = await signOut({ redirect: false, callbackUrl: '/login' });
    setShowLogoutModal(false);
    router.replace(signOutResult.url ?? '/login');
    router.refresh();
  };

  return (
    <>
      <aside className="w-[280px] bg-[linear-gradient(180deg,#FFFDFD_0%,#FFFFFF_100%)] border-r border-[#F4E5E3] flex flex-col h-full flex-shrink-0 z-20 shadow-[0_10px_40px_-25px_rgba(255,154,158,0.45)]">
        <div className="p-8 pb-8 flex items-center gap-3 border-b border-[#F7E8E6]">
          <div className="w-10 h-10 bg-[#2A2A2A] rounded-2xl flex items-center justify-center shadow-[0_10px_20px_-12px_rgba(42,42,42,0.65)]">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-[#2A2A2A] tracking-tight leading-none mb-1">PLANORA</span>
            <span className="text-[8px] font-bold tracking-[0.22em] text-[#FF7F97] uppercase">Vendor Console</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#D1D5DB] uppercase px-4 mb-2">NAVIGASI</span>
            {menuItems.map((item) => {
              const isActive = checkIsActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-colors group ${
                    isActive ? 'bg-[#FCE6E3] shadow-[0_10px_25px_-18px_rgba(255,154,158,0.55)]' : 'hover:bg-[#FFF8F7]'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#2A2A2A]' : 'text-[#9CA3AF] group-hover:text-[#2A2A2A]'
                  }`} />
                  <span className={`text-[10px] font-bold tracking-widest uppercase mt-0.5 transition-colors ${
                    isActive ? 'text-[#2A2A2A]' : 'text-[#9CA3AF] group-hover:text-[#2A2A2A]'
                  }`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-6 mt-auto">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FDF1F0] to-[#FFFDFD] border border-[#FDECEB] hover:border-[#FCE6E3] py-3.5 rounded-2xl transition-all group shadow-[0_12px_30px_-22px_rgba(255,154,158,0.55)]"
          >
            <LogoutIcon className="w-4 h-4 text-[#EF4444] group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold tracking-widest text-[#EF4444] uppercase mt-0.5">KELUAR</span>
          </button>
        </div>
      </aside>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2A2A2A]/80 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-[2rem] p-8 md:p-10 w-full max-w-[380px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col items-center text-center transform scale-100 opacity-100 transition-all">
            <div className="w-16 h-16 bg-[#FDF1F0] border border-[#FCE6E3] shadow-inner rounded-[1.25rem] flex items-center justify-center mb-6">
              <LogoutIcon className="w-6 h-6 text-[#EF4444] ml-1" />
            </div>

            <h3 className="text-2xl font-black italic tracking-tighter text-[#2A2A2A] uppercase mb-2">
              Keluar Akun
            </h3>
            <p className="text-[10px] font-bold tracking-wider text-[#A8A8A8] uppercase mb-8 leading-relaxed">
              Apakah Anda yakin ingin keluar dari <br/> Vendor Console Planora?
            </p>

            <div className="flex flex-col w-full gap-3">
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="w-full flex justify-center items-center py-4 rounded-xl bg-[#EF4444] text-white text-[10px] font-bold tracking-widest uppercase hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 disabled:cursor-not-allowed disabled:opacity-75"
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