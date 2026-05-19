"use client";

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminDashboardView from '@/components/admin/AdminDashboardView';
import { getDashboardStats, getPendingVendors } from '@/services/admin.service';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, vendorsData] = await Promise.all([
          getDashboardStats(),
          getPendingVendors(),
        ]);

        setStats(statsData);
        setPendingVendors(vendorsData);
      } catch (error) {
        console.error('Gagal mengambil data dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FDF1F0]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#FF9A9E]" />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <AdminHeader hideSearch />
      <AdminDashboardView stats={stats} pendingVendors={pendingVendors} />
    </div>
  );
}
