'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import VendorSidebar from '@/components/vendor/VendorSidebar';

export default function VendorLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

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
      setReady(true);
    });
    return () => { mounted = false; };
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
      <VendorSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-[#FDF1F0]">
          {children}
        </main>
      </div>
    </div>
  );
}
