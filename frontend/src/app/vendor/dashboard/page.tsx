'use client';

import { useEffect, useState } from 'react';
import { getMyVendorProfile, getMyLayanan, getVendorBookings } from '@/services/vendor.service';
import { Package, ClipboardList, Star, TrendingUp, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Menunggu',
  CONFIRMED: 'Dikonfirmasi',
  IN_PROGRESS: 'Berjalan',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
};
const STATUS_COLOR: Record<string, string> = {
  PENDING: 'text-amber-500 bg-amber-50',
  CONFIRMED: 'text-emerald-600 bg-emerald-50',
  IN_PROGRESS: 'text-blue-600 bg-blue-50',
  COMPLETED: 'text-emerald-700 bg-emerald-100',
  CANCELLED: 'text-red-500 bg-red-50',
};

export default function VendorDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [layanan, setLayanan] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileData, layananData, bookingsData] = await Promise.all([
          getMyVendorProfile(),
          getMyLayanan(),
          getVendorBookings(),
        ]);
        setProfile(profileData);
        setLayanan(layananData ?? []);
        setBookings(Array.isArray(bookingsData) ? bookingsData : bookingsData?.bookings ?? []);
      } catch (err) {
        console.error('Gagal memuat data dashboard vendor:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center" data-testid="loading-spinner">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9A9E]"></div>
      </div>
    );
  }

  const totalRevenue = bookings
    .filter((b) => b.status === 'COMPLETED' || b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + Number(b.totalPrice ?? 0), 0);

  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;
  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;
  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="flex flex-col gap-8 p-8 py-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#2A2A2A]/40 uppercase mb-2 block">
            RINGKASAN BISNIS ANDA
          </span>
          <h1 className="text-4xl md:text-[2.75rem] leading-[1.05] font-black italic tracking-tighter text-[#2A2A2A]">
            SELAMAT DATANG,<br />
            <span className="text-[#FF9A9E]">{profile?.businessName?.toUpperCase() ?? 'VENDOR'}.</span>
          </h1>
        </div>

        {/* Vendor Status Badge */}
        <div className={`flex items-center gap-2 px-5 h-11 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm border ${
          profile?.status === 'VERIFIED'
            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
            : 'bg-amber-50 text-amber-600 border-amber-200'
        }`}>
          <CheckCircle className="w-4 h-4" />
          {profile?.status === 'VERIFIED' ? 'Terverifikasi' : 'Menunggu Verifikasi'}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-8px_rgba(255,154,158,0.2)] border border-white flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#2A2A2A]/40 uppercase">Total Pendapatan</span>
            <div className="w-9 h-9 rounded-xl bg-[#FDF1F0] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#FF9A9E]" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black italic tracking-tighter text-[#2A2A2A]">
              {formatCurrency(totalRevenue)}
            </span>
            <p className="text-[10px] font-semibold text-emerald-500 mt-1">Dari pesanan selesai</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-8px_rgba(255,154,158,0.2)] border-2 border-[#FF9A9E]/20 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#2A2A2A]/40 uppercase">Antrean Pesanan</span>
            <div className="w-9 h-9 rounded-xl bg-[#FDF1F0] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#FF9A9E]" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black italic tracking-tighter text-[#2A2A2A]">{pendingCount}</span>
            <p className="text-[10px] font-semibold text-[#FF9A9E] mt-1">Menunggu konfirmasi</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-8px_rgba(255,154,158,0.2)] border border-white flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#2A2A2A]/40 uppercase">Total Layanan</span>
            <div className="w-9 h-9 rounded-xl bg-[#FDF1F0] flex items-center justify-center">
              <Package className="w-4 h-4 text-[#FF9A9E]" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black italic tracking-tighter text-[#2A2A2A]">{layanan.length}</span>
            <p className="text-[10px] font-semibold text-[#2A2A2A]/40 mt-1">Produk aktif</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-8px_rgba(255,154,158,0.2)] border border-white flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#2A2A2A]/40 uppercase">Rating</span>
            <div className="w-9 h-9 rounded-xl bg-[#FDF1F0] flex items-center justify-center">
              <Star className="w-4 h-4 text-[#FF9A9E]" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black italic tracking-tighter text-[#2A2A2A]">
              {profile?.rating?.toFixed(1) ?? '0.0'}
            </span>
            <p className="text-[10px] font-semibold text-[#2A2A2A]/40 mt-1">
              {completedCount} ulasan
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_4px_20px_-8px_rgba(255,154,158,0.15)] border border-white p-6 flex flex-col">
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-50">
            <div>
              <h3 className="text-base font-black italic tracking-tighter text-[#2A2A2A] uppercase mb-0.5">Pesanan Terbaru</h3>
              <span className="text-[9px] font-bold tracking-[0.15em] text-[#2A2A2A]/30 uppercase">5 Pesanan Terakhir</span>
            </div>
            <Link href="/vendor/pesanan" className="text-[9px] font-bold tracking-[0.15em] text-[#FF9A9E] hover:text-[#FF527B] uppercase transition-colors flex items-center gap-1">
              LIHAT SEMUA <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {recentBookings.length === 0 ? (
              <p className="py-6 text-center text-xs text-gray-400 font-medium">Belum ada pesanan masuk.</p>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-extrabold text-[#2A2A2A] mb-0.5">{booking.customer?.name ?? '-'}</span>
                    <span className="text-[9px] font-medium text-[#2A2A2A]/40">{booking.layanan?.name ?? '-'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-extrabold text-[#2A2A2A]">{formatCurrency(booking.totalPrice)}</span>
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_COLOR[booking.status] ?? 'text-gray-500 bg-gray-50'}`}>
                      {STATUS_LABEL[booking.status] ?? booking.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Layanan Saya */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-8px_rgba(255,154,158,0.15)] border border-white p-6 flex flex-col">
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-50">
            <h3 className="text-base font-black italic tracking-tighter text-[#2A2A2A] uppercase">Layanan Saya</h3>
            <Link href="/vendor/layanan" className="text-[9px] font-bold tracking-[0.15em] text-[#FF9A9E] hover:text-[#FF527B] uppercase flex items-center gap-1">
              KELOLA <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {layanan.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-xs text-gray-400 font-medium mb-3">Belum ada layanan terdaftar.</p>
                <Link href="/vendor/layanan" className="text-[9px] font-black tracking-widest uppercase px-4 py-2 bg-[#2A2A2A] text-white rounded-xl hover:bg-[#FF9A9E] transition-colors">
                  + TAMBAH LAYANAN
                </Link>
              </div>
            ) : (
              layanan.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold text-[#2A2A2A]">{item.name}</span>
                    <span className="text-[8px] font-medium text-[#2A2A2A]/40">{item.kategori?.name ?? 'Umum'}</span>
                  </div>
                  <span className="text-[10px] font-black text-[#FF9A9E]">{formatCurrency(item.price)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-2 text-center">
        <p className="text-[8px] font-bold tracking-[0.3em] text-[#2A2A2A]/20 uppercase">
          PLANORA ECOSYSTEM • VENDOR PANEL • 2026
        </p>
      </div>
    </div>
  );
}
