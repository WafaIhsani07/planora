"use client";

import { useEffect, useState } from 'react';
import {
  TrendingUp,
  UserCheck,
  Users,
  ClipboardList,
  Download,
  CheckCircle,
  UserPlus,
  Clock,
  Terminal,
} from 'lucide-react';
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
          getPendingVendors()
        ]);
        setStats(statsData);
        setPendingVendors(vendorsData);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9A9E]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 py-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#2A2A2A]/40 uppercase mb-2 block">
            RINGKASAN EKOSISTEM DIGITAL
          </span>
          <h1 className="text-4xl md:text-[2.75rem] leading-[1.05] font-black italic tracking-tighter text-[#2A2A2A]">
            SUPERVISI <br /> OPERASIONAL GLOBAL.
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 h-11 rounded-full border border-[#2A2A2A]/10 text-[#2A2A2A] text-[10px] font-bold tracking-widest uppercase hover:bg-white transition-colors shadow-sm bg-white/60">
            HEALTH CHECK
          </button>
          <button className="flex items-center gap-2 px-5 h-11 rounded-full bg-[#2A2A2A] text-white text-[10px] font-bold tracking-widest uppercase hover:bg-[#1a1a1a] transition-colors shadow-lg shadow-[#2A2A2A]/20">
            <Download className="w-4 h-4" />
            REKAP DATA
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Volume Transaksi */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-8px_rgba(255,154,158,0.2)] border border-white flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#2A2A2A]/40 uppercase">
              Volume Transaksi
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FDF1F0] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#FF9A9E]" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black italic tracking-tighter text-[#2A2A2A]">
              {stats?.totalRevenue ? formatCurrency(stats.totalRevenue) : 'Rp 0'}
            </span>
            <p className="text-[10px] font-semibold text-emerald-500 mt-1 flex items-center gap-1">
              Data Real-time
            </p>
          </div>
        </div>

        {/* Antrean Verifikasi */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-8px_rgba(255,154,158,0.2)] border-2 border-[#FF9A9E]/20 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF9A9E]/5 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#2A2A2A]/40 uppercase">
              Antrean Verifikasi
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FDF1F0] flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-[#FF9A9E]" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black italic tracking-tighter text-[#2A2A2A]">
              {stats?.pendingVendors ?? 0} Vendor
            </span>
            <p className="text-[10px] font-semibold text-[#FF9A9E] mt-1">
              Menunggu persetujuan
            </p>
          </div>
        </div>

        {/* Total Pengguna */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-8px_rgba(255,154,158,0.2)] border border-white flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#2A2A2A]/40 uppercase">
              Total Pengguna
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FDF1F0] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#FF9A9E]" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black italic tracking-tighter text-[#2A2A2A]">
              {stats?.totalUsers ?? 0}
            </span>
            <p className="text-[10px] font-semibold text-emerald-500 mt-1">
              Pengguna Terdaftar
            </p>
          </div>
        </div>

        {/* Pesanan Aktif */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-8px_rgba(255,154,158,0.2)] border border-white flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#2A2A2A]/40 uppercase">
              Pesanan Aktif
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FDF1F0] flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-[#FF9A9E]" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black italic tracking-tighter text-[#2A2A2A]">
              {stats?.totalBookings ?? 0}
            </span>
            <p className="text-[10px] font-semibold text-emerald-500 mt-1">
              Total Pemesanan
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Verifikasi Vendor */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_4px_20px_-8px_rgba(255,154,158,0.15)] border border-white p-6 flex flex-col">
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-50">
            <div>
              <h3 className="text-base font-black italic tracking-tighter text-[#2A2A2A] uppercase mb-0.5">
                Verifikasi Vendor Baru
              </h3>
              <span className="text-[9px] font-bold tracking-[0.15em] text-[#2A2A2A]/30 uppercase">
                Menunggu persetujuan admin
              </span>
            </div>
            <button className="text-[9px] font-bold tracking-[0.15em] text-[#FF9A9E] hover:text-[#FF527B] uppercase transition-colors">
              LIHAT SEMUA
            </button>
          </div>

          <div className="flex flex-col w-full">
            <div className="flex pb-3 border-b border-gray-50">
              <div className="w-[40%] text-[9px] font-bold tracking-[0.15em] text-[#2A2A2A]/30 uppercase">Nama Bisnis & Owner</div>
              <div className="w-[20%] text-[9px] font-bold tracking-[0.15em] text-[#2A2A2A]/30 uppercase">Kategori</div>
              <div className="w-[20%] text-[9px] font-bold tracking-[0.15em] text-[#2A2A2A]/30 uppercase">Lokasi</div>
              <div className="w-[20%] text-[9px] font-bold tracking-[0.15em] text-[#2A2A2A]/30 uppercase text-right">Aksi</div>
            </div>

            {pendingVendors.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 font-medium">
                Tidak ada vendor yang menunggu verifikasi saat ini.
              </div>
            ) : (
              pendingVendors.slice(0, 5).map((vendor, i, arr) => (
                <div
                  key={vendor.id}
                  className={`flex items-center py-4 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <div className="w-[40%] flex flex-col">
                    <span className="text-[11px] font-extrabold text-[#2A2A2A] mb-0.5">{vendor.businessName}</span>
                    <span className="text-[9px] font-medium text-[#2A2A2A]/40">{vendor.user?.name ?? 'Tanpa Nama'}</span>
                  </div>
                  <div className="w-[20%]">
                    <span className="text-[10px] font-bold text-[#2A2A2A]/50">{vendor.status}</span>
                  </div>
                  <div className="w-[20%]">
                    <span className="text-[10px] font-bold text-[#2A2A2A]/50">{vendor.city ?? 'Belum diset'}</span>
                  </div>
                  <div className="w-[20%] flex justify-end">
                    <a href={`/admin/verifikasi`} className="px-4 py-2 bg-[#2A2A2A] text-white text-[9px] font-bold tracking-widest uppercase rounded-xl hover:bg-[#FF9A9E] hover:text-white transition-colors">
                      PERIKSA
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-5">

          {/* Log Aktivitas */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_-8px_rgba(255,154,158,0.15)] border border-white p-6 flex flex-col">
            <h3 className="text-base font-black italic tracking-tighter text-[#2A2A2A] uppercase mb-5">
              Log Aktivitas
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EAF5EF] flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#2A2A2A] uppercase mb-0.5">
                    Pembayaran PLN-29302 Terverifikasi
                  </span>
                  <span className="text-[8px] font-medium text-[#2A2A2A]/30 uppercase tracking-wider">
                    2 menit yang lalu
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EBF3FF] flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#2A2A2A] uppercase mb-0.5">
                    Vendor Baru Mendaftar
                  </span>
                  <span className="text-[8px] font-medium text-[#2A2A2A]/30 uppercase tracking-wider">
                    15 menit yang lalu
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FDF1F0] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#FF9A9E]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#2A2A2A] uppercase mb-0.5">
                    Backup Data Mingguan Selesai
                  </span>
                  <span className="text-[8px] font-medium text-[#2A2A2A]/30 uppercase tracking-wider">
                    2 jam yang lalu
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* API Status */}
          <div className="bg-[#2A2A2A] rounded-2xl shadow-[0_10px_30px_-10px_rgba(42,42,42,0.4)] p-6 flex flex-col relative overflow-hidden">
            <Terminal className="absolute -bottom-6 -right-6 w-28 h-28 text-white opacity-5 pointer-events-none -rotate-12" />
            <h3 className="text-base font-black italic tracking-tighter text-white uppercase mb-5 relative z-10">
              Integrasi API
            </h3>
            <div className="flex flex-col gap-3 relative z-10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-bold tracking-[0.15em] text-white/40 uppercase">
                  Mobile Latency
                </span>
                <span className="text-[11px] font-black text-emerald-400 tracking-wider">12MS</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-[#FF9A9E] rounded-full relative">
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/30 animate-pulse rounded-full" />
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 mb-1">
                <span className="text-[9px] font-bold tracking-[0.15em] text-white/40 uppercase">
                  Web Latency
                </span>
                <span className="text-[11px] font-black text-emerald-400 tracking-wider">8MS</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[92%] bg-[#FF9A9E] rounded-full relative">
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/30 animate-pulse rounded-full" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="pb-2 text-center">
        <p className="text-[8px] font-bold tracking-[0.3em] text-[#2A2A2A]/20 uppercase">
          PLANORA ECOSYSTEM • ADMIN COMMAND • 2026
        </p>
      </div>

    </div>
  );
}