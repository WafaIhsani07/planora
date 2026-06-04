'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBookings } from '@/services/bookings.service';
import { Calendar, MapPin, RefreshCw, ShoppingBag, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));
};

const getBookingStatusInfo = (status: string) => {
  switch (status) {
    case 'PENDING': return { label: 'Menunggu Pembayaran', cls: 'bg-[#FCE6E3] text-[#FF527B]' };
    case 'CONFIRMED': return { label: 'Dikonfirmasi', cls: 'bg-[#FFF9E5] text-[#F59E0B]' };
    case 'IN_PROGRESS': return { label: 'Sedang Berlangsung', cls: 'bg-blue-50 text-blue-600' };
    case 'COMPLETED': return { label: 'Selesai', cls: 'bg-[#E6F9F0] text-[#10B981]' };
    case 'CANCELLED': return { label: 'Dibatalkan', cls: 'bg-slate-100 text-slate-500' };
    default: return { label: status, cls: 'bg-slate-100 text-slate-400' };
  }
};

const getPaymentStatusInfo = (payment: any) => {
  if (!payment) return null;
  switch (payment.status) {
    case 'PENDING': return { label: '⏳ Bukti Bayar Menunggu Verifikasi', cls: 'bg-amber-50 text-amber-600 border border-amber-200' };
    case 'PAID': return { label: '✅ Pembayaran Lunas', cls: 'bg-emerald-50 text-emerald-600 border border-emerald-200' };
    case 'FAILED': return { label: '❌ Pembayaran Ditolak', cls: 'bg-red-50 text-red-500 border border-red-200' };
    case 'REFUNDED': return { label: '↩️ Dana Dikembalikan', cls: 'bg-purple-50 text-purple-600 border border-purple-200' };
    default: return null;
  }
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=150';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('Semua');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBookings();
        const list = Array.isArray(data)
          ? data
          : data?.data ?? data?.bookings ?? [];
        setBookings(list);
      } catch (err) {
        console.error('Gagal memuat pesanan:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filters = [
    { label: 'Semua', count: bookings.length },
    { label: 'Menunggu', count: bookings.filter((b) => b.status === 'PENDING').length },
    { label: 'Aktif', count: bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS').length },
    { label: 'Selesai', count: bookings.filter((b) => b.status === 'COMPLETED').length },
    { label: 'Dibatalkan', count: bookings.filter((b) => b.status === 'CANCELLED').length },
  ];

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'Semua') return true;
    if (filterStatus === 'Menunggu') return b.status === 'PENDING';
    if (filterStatus === 'Aktif') return b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS';
    if (filterStatus === 'Selesai') return b.status === 'COMPLETED';
    if (filterStatus === 'Dibatalkan') return b.status === 'CANCELLED';
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <RefreshCw className="w-12 h-12 text-[#FF9A9E] animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Memuat Pesanan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FDF1F0] rounded-xl flex items-center justify-center text-[#FF9A9E]">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#2A2A2A] tracking-tight">Daftar Pesanan Saya</h1>
            <p className="text-xs font-bold text-[#2A2A2A]/35 uppercase tracking-widest">Pantau status booking kamu secara real-time.</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {filters.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilterStatus(f.label)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 cursor-pointer ${
              filterStatus === f.label
                ? 'bg-[#FF9A9E] text-white border-[#FF9A9E]'
                : 'bg-white text-[#2A2A2A]/50 border-[#2A2A2A]/10 hover:border-[#2A2A2A]/25'
            }`}
          >
            {f.label}
            <span className={`w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center ${
              filterStatus === f.label ? 'bg-white text-[#FF9A9E]' : 'bg-[#2A2A2A]/10 text-[#2A2A2A]/50'
            }`}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[32px] border border-[#2A2A2A]/5 shadow-sm">
          <ShoppingBag className="w-14 h-14 text-[#FF9A9E]/40 mx-auto mb-4" />
          <h3 className="text-lg font-black text-[#2A2A2A] mb-1">Belum Ada Pesanan</h3>
          <p className="text-sm text-slate-400 mb-6">
            {filterStatus === 'Semua'
              ? 'Kamu belum memiliki pesanan. Temukan vendor dan buat booking pertamamu!'
              : `Tidak ada pesanan dengan status "${filterStatus}".`}
          </p>
          {filterStatus === 'Semua' && (
            <Link
              href="/vendors"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF9A9E] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#FF527B] transition-all shadow-lg shadow-[#FF9A9E]/20"
            >
              Temukan Vendor <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const statusInfo = getBookingStatusInfo(booking.status);
            const paymentInfo = getPaymentStatusInfo(booking.payment);
            const bookingCode = `#PLR-${booking.id.slice(0, 8).toUpperCase()}`;

            return (
              <Link
                key={booking.id}
                href={`/bookings/${encodeURIComponent(booking.id)}`}
                className="group bg-white border border-[#2A2A2A]/5 rounded-[28px] p-6 flex flex-col md:flex-row items-start md:items-center gap-5 hover:shadow-lg hover:border-[#FF9A9E]/20 transition-all duration-300 cursor-pointer shadow-sm"
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm">
                  <img
                    src={booking.layanan?.images?.[0] || DEFAULT_IMAGE}
                    alt={booking.layanan?.name || 'Layanan'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black text-[#FF9A9E] uppercase tracking-widest">{bookingCode}</span>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${statusInfo.cls}`}>
                      {statusInfo.label}
                    </span>
                    {paymentInfo && (
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${paymentInfo.cls}`}>
                        {paymentInfo.label}
                      </span>
                    )}
                    {booking.status === 'PENDING' && !booking.payment && (
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-50 text-slate-400 border border-slate-100">
                        Belum Upload Bukti Bayar
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-[#2A2A2A] truncate">
                    {booking.layanan?.name || 'Paket Layanan'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400">
                    Oleh: {booking.vendor?.businessName || 'Vendor'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-400">
                    {booking.eventDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#FF9A9E]" />
                        {formatDate(booking.eventDate)}
                      </span>
                    )}
                    {booking.eventAddress && (
                      <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                        <MapPin className="w-3.5 h-3.5 text-[#FF9A9E] flex-shrink-0" />
                        {booking.eventAddress}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Price + Arrow */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</p>
                    <p className="text-lg font-black text-[#2A2A2A]">{formatCurrency(Number(booking.totalPrice))}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-[#2A2A2A]/5 flex items-center justify-center text-[#2A2A2A]/30 group-hover:bg-[#FF9A9E] group-hover:text-white group-hover:border-[#FF9A9E] transition-all shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}