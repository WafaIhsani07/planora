'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import VendorSidebar from '@/components/VendorSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const session = await getSession();

      if (!isMounted) {
        return;
      }

      if (!session) {
        router.replace('/login');
        return;
      }

      setIsCheckingSession(false);
    };

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isCheckingSession) {
    return (
      <div className="grid h-screen place-items-center bg-[#F9FAFB]">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">MEMUAT DASHBOARD...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] font-sans overflow-hidden relative">
      <VendorSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#FAFAFC]">
        {children}
      </div>
    </div>
  );
}
