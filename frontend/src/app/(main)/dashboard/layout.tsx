'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type DashboardLayoutProps = {
    children: ReactNode;
};

const GridIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
);
const BoxIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
);
const CalendarIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
);
const WalletIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
);
const UserIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const SettingsIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);
const LogoutIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
);
const SearchIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);
const BellIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);

const activeItemClass = 'flex items-center gap-3 bg-[#FCE6E3] px-4 py-3.5 rounded-2xl transition-colors';
const inactiveItemClass = 'flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 rounded-2xl transition-colors group';
const activeIconClass = 'w-4 h-4 text-[#2A2A2A]';
const inactiveIconClass = 'w-4 h-4 text-[#9CA3AF] group-hover:text-[#2A2A2A] transition-colors';
const activeLabelClass = 'text-[10px] font-bold tracking-widest text-[#2A2A2A] uppercase mt-0.5';
const inactiveLabelClass = 'text-[10px] font-bold tracking-widest text-[#9CA3AF] group-hover:text-[#2A2A2A] uppercase mt-0.5 transition-colors';

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    const isDashboardActive = pathname === '/dashboard';
    const isCatalogActive = pathname === '/dashboard/katalog' || pathname.startsWith('/dashboard/katalog/');

    return (
        <div className="flex h-[100dvh] w-full bg-[#F9FAFB] font-sans overflow-hidden">
            <aside className="w-[248px] bg-white border-r border-gray-100 flex flex-col h-full flex-shrink-0 z-20">
                <div className="p-6 pb-8 flex items-center gap-3">
                    <Image
                        src="/images/logogmbr.png"
                        alt="Planora"
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain"
                        priority
                    />
                    <div className="flex flex-col">
                        <span className="font-extrabold text-lg text-[#2A2A2A] tracking-tight leading-none mb-1">PLANORA</span>
                        <span className="text-[8px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">Vendor Console</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-bold tracking-[0.2em] text-[#D1D5DB] uppercase px-4 mb-2">MENU UTAMA</span>

                        <Link href="/dashboard" className={isDashboardActive ? activeItemClass : inactiveItemClass}>
                            <GridIcon className={isDashboardActive ? activeIconClass : inactiveIconClass} />
                            <span className={isDashboardActive ? activeLabelClass : inactiveLabelClass}>DASHBOARD</span>
                        </Link>

                        <Link href="/dashboard/katalog" className={isCatalogActive ? activeItemClass : inactiveItemClass}>
                            <BoxIcon className={isCatalogActive ? activeIconClass : inactiveIconClass} />
                            <span className={isCatalogActive ? activeLabelClass : inactiveLabelClass}>KATALOG JASA</span>
                        </Link>

                        <a href="#" className={inactiveItemClass}>
                            <CalendarIcon className={inactiveIconClass} />
                            <span className={inactiveLabelClass}>PESANAN & JADWAL</span>
                        </a>

                        <a href="#" className={inactiveItemClass}>
                            <WalletIcon className={inactiveIconClass} />
                            <span className={inactiveLabelClass}>KEUANGAN</span>
                        </a>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-bold tracking-[0.2em] text-[#D1D5DB] uppercase px-4 mb-2">PERSONAL</span>

                        <a href="#" className={inactiveItemClass}>
                            <UserIcon className={inactiveIconClass} />
                            <span className={inactiveLabelClass}>PROFIL STUDIO</span>
                        </a>

                        <a href="#" className={inactiveItemClass}>
                            <SettingsIcon className={inactiveIconClass} />
                            <span className={inactiveLabelClass}>PENGATURAN</span>
                        </a>
                    </div>
                </div>

                <div className="p-4 mt-auto">
                    <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FDF1F0] to-[#FAFAFC] border border-[#FDECEB] hover:border-[#FCE6E3] py-3.5 rounded-2xl transition-all group">
                        <LogoutIcon className="w-4 h-4 text-[#EF4444] group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold tracking-widest text-[#EF4444] uppercase mt-0.5">KELUAR</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-[78px] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-10 flex-shrink-0">
                    <div className="relative w-full max-w-[320px]">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="CARI DATA OPERASIONAL..."
                            className="w-full bg-[#F4F4F5] rounded-full py-2.5 pl-11 pr-4 text-[10px] font-bold tracking-widest text-[#2A2A2A] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#FCE6E3] transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            aria-label="Notifikasi"
                            title="Notifikasi"
                            className="relative w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            <BellIcon className="w-4 h-4" />
                            <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                        </button>

                        <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
                            <div className="flex flex-col text-right">
                                <span className="text-[11px] font-extrabold text-[#2A2A2A] tracking-wider">WAFA STUDIO</span>
                                <span className="text-[8px] font-bold tracking-[0.15em] text-[#A8A8A8] uppercase">Premium Partner</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#FCE6E3] text-[#2A2A2A] flex items-center justify-center font-bold text-sm shadow-sm">
                                W
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 min-h-0 overflow-hidden p-4 lg:p-5">
                    <div className="h-full overflow-hidden">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
