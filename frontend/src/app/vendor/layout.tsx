'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { Menu } from 'lucide-react';
import VendorSidebar from '@/components/vendor/VendorSidebar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import NotificationDropdown from '@/components/NotificationDropdown';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/store/authStore';
import { getMyVendorProfile } from '@/services/vendor.service';
import { getUserProfile } from '@/services/user.service';

export default function VendorLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const [ready, setReady] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [businessName, setBusinessName] = useState('Vendor Toko');
  const [isPendingStatus, setIsPendingStatus] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    // Muat status terlipat dari localStorage jika ada
    const saved = localStorage.getItem('vendor-sidebar-collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  // Dengarkan event saat avatar diperbarui dari halaman Pengaturan
  useEffect(() => {
    const handleAvatarUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ avatarUrl: string | null }>;
      setAvatarUrl(customEvent.detail.avatarUrl || null);
    };
    window.addEventListener('vendor-avatar-updated', handleAvatarUpdate);
    return () => window.removeEventListener('vendor-avatar-updated', handleAvatarUpdate);
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
      
      // Ambil profil vendor + profil user secara paralel
      Promise.all([getMyVendorProfile(), getUserProfile()]).then(([profile, userProfile]) => {
        if (!mounted) return;
        if (profile) {
          setBusinessName(profile.businessName);
          setIsPendingStatus(profile.status === 'PENDING');
        } else {
          setBusinessName(session.user?.name || 'Vendor');
        }
        if (userProfile?.avatar) {
          setAvatarUrl(userProfile.avatar);
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
          {t('vendor_layout.loading')}
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
            <LanguageSwitcher />

            <NotificationDropdown />

            <div className="flex items-center gap-3 pl-5 border-l border-[#F1D7D3] group">
              {/* Avatar: tampilkan foto jika ada, fallback ke inisial */}
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={businessName}
                  className="w-9 h-9 rounded-xl object-cover border border-[#FF9A9E]/20"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[#FF9A9E]/20 text-[#FF9A9E] flex items-center justify-center font-bold text-sm border border-[#FF9A9E]/10">
                  {businessName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col text-left">
                <p className="text-xs font-black text-[#2A2A2A] tracking-tight leading-none mb-1">
                  {businessName}
                </p>
                <p className="text-[8px] font-bold text-[#2A2A2A]/40 uppercase tracking-widest">{t('vendor_layout.vendor')}</p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#FDF1F0]">
          {isPendingStatus && (
            <div className="bg-[#FFF9E5] border-b border-[#F59E0B]/20 p-4 px-8 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F59E0B]/10 flex items-center justify-center">
                  <span className="text-[#F59E0B] text-sm">⏳</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#D97706]">{t('vendor_layout.verification_title')}</h4>
                  <p className="text-[11px] font-medium text-[#D97706]/70 mt-0.5">
                    {t('vendor_layout.verification_desc')}
                  </p>
                </div>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
