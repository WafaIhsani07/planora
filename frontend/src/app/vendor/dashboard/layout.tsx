import type { ReactNode } from 'react';
import VendorSidebar from '@/components/vendor/VendorSidebar';

export default function VendorLayout({ children }: { children: ReactNode }) {
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
