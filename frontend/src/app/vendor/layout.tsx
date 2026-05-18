'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { Bell, Menu } from 'lucide-react';
import VendorSidebar from '@/components/vendor/VendorSidebar';
import { useAuthStore } from '@/store/authStore';
import { getMyVendorProfile } from '@/services/vendor.service';

export default function VendorLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [ready, setReady] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [businessName, setBusinessName] = useState('Vendor Toko');

  useEffect(() => {
    // Muat status terlipat dari localStorage jika ada
    const saved = localStorage.getItem('vendor-sidebar-collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('vendor-sidebar-collapsed', String(next));
      return next;
    });
  };

  useEffect(() => {
    let mounted = true;
    getSession().then((session) => {
      if (!mounted) return;
      if (!session) {
        router.replace('/login');
        return;
      }
      // Hanya vendor yang boleh masuk ke area ini
      if ((session.user as { role?: string })?.role !== 'VENDOR') {
        router.replace('/login');
        return;
      }
      
      // Ambil profil vendor asli untuk nama bisnis
      getMyVendorProfile().then((profile) => {
        if (profile && mounted) {
          setBusinessName(profile.businessName);
        } else if (mounted) {
          setBusinessName(session.user?.name || 'Wafa Decoration');
        }
      });
      
      setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, [router]);

  if (!ready) {
    return (
      <div className="grid h-screen place-items-center bg-[#FDF1F0]">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">
          MEMUAT DASHBOARD VENDOR...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF1F0] flex font-sans text-[#2A2A2A]">
      {/* SIDEBAR */}
      <VendorSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      {/* MAIN CONTENT AREA */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-[280px]'} flex flex-col min-h-screen overflow-hidden`}>
        {/* TOPBAR */}
        <header className="h-16 bg-[#FDF1F0] px-8 flex items-center justify-between sticky top-0 z-45 border-b border-[#F1D7D3]">
          <button
            onClick={toggleSidebar}
            className="p-2 text-[#2A2A2A] hover:bg-black/5 rounded-xl transition cursor-pointer"
            title={isCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-[#2A2A2A]/40 hover:text-[#FF9A9E] transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF527B] rounded-full border border-[#FDF1F0]" />
            </button>

            <div className="flex items-center gap-3 pl-5 border-l border-[#F1D7D3] group">
              <div className="w-9 h-9 rounded-xl bg-[#FF9A9E]/20 text-[#FF9A9E] flex items-center justify-center font-bold text-sm border border-[#FF9A9E]/10">
                {businessName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <p className="text-xs font-black text-[#2A2A2A] tracking-tight leading-none mb-1">
                  {businessName}
                </p>
                <p className="text-[8px] font-bold text-[#2A2A2A]/40 uppercase tracking-widest">Vendor</p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#FDF1F0]">
          {children}
        </main>
      </div>
    </div>
  );
}
