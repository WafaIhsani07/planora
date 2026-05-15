import type { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
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