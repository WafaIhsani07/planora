'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import AdminSidebar from '@/components/admin/AdminSidebar';

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
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
      // Hanya ADMIN yang boleh masuk ke area ini
      if ((session.user as { role?: string })?.role !== 'ADMIN') {
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
          MEMUAT DASHBOARD ADMIN...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF1F0] flex font-sans text-[#2A2A2A]">
      <AdminSidebar />
      <div className="ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-[#FDF1F0]">
          {children}
        </main>
      </div>
    </div>
  );
}