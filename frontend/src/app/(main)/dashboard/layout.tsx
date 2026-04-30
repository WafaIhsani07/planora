'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

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
      <div className="grid h-screen place-items-center bg-[#FDF1F0]">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">MEMUAT DASHBOARD VENDOR...</span>
      </div>
    );
  }

  return <>{children}</>;
}
