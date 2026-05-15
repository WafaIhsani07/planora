'use client';

import { useEffect, useState } from 'react';
import { getVendorBookings, updateBookingStatus } from '@/services/vendor.service';
import { ClipboardList, CheckCircle, XCircle } from 'lucide-react';

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
  PENDING: 'text-amber-600 bg-amber-50 border-amber-200',
  CONFIRMED: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  IN_PROGRESS: 'text-blue-600 bg-blue-50 border-blue-200',
  COMPLETED: 'text-emerald-700 bg-emerald-100 border-emerald-300',
  CANCELLED: 'text-red-500 bg-red-50 border-red-200',
};

type TabFilter = 'SEMUA' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export default function VendorPesananPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>('SEMUA');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const fetchBookings = async () => {
    try {
      const status = activeTab === 'SEMUA' ? undefined : activeTab;
      const data = await getVendorBookings({ status });
      const bookingList = Array.isArray(data) ? data : data?.bookings ?? [];
      setBookings(bookingList);
    } catch (err) {
      console.error('Gagal memuat pesanan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchBookings();
  }, [activeTab]);

  const handleConfirm = async (id: string) => {
    setProcessingId(id);
    try {
      await updateBookingStatus(id, 'CONFIRMED');
      await fetchBookings();
    } catch (err) {
      console.error('Gagal mengkonfirmasi:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Tolak pesanan ini?')) return;
    setProcessingId(id);
    try {
      await updateBookingStatus(id, 'CANCELLED');
      await fetchBookings();
      setSelectedBooking(null);
    } catch (err) {
      console.error('Gagal membatalkan:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const tabs: TabFilter[] = ['SEMUA', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  if (isLoading && bookings.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center" data-testid="loading-spinner">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9A9E]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 py-6">
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#2A2A2A]/40 uppercase mb-2 block">
          MANAJEMEN TRANSAKSI
        </span>
        <h1 className="text-4xl font-black italic tracking-tighter text-[#2A2A2A]">PESANAN<br />MASUK.</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            id={`tab-${tab.toLowerCase()}`}
            onClick={() => setActiveTab(tab)}
            className={`px-4 h-9 rounded-full text-[9px] font-bold tracking-widest uppercase transition-colors ${
              activeTab === tab
                ? 'bg-[#2A2A2A] text-white'
                : 'bg-white border border-gray-100 text-[#2A2A2A]/40 hover:text-[#2A2A2A]'
            }`}
          >
            {tab === 'SEMUA' ? 'SEMUA' : STATUS_LABEL[tab] ?? tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_-8px_rgba(255,154,158,0.15)] border border-white p-6">
        {bookings.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-4">
            <ClipboardList className="w-12 h-12 text-[#FF9A9E]/40" />
            <p className="text-sm text-gray-400 font-medium">Tidak ada pesanan yang ditemukan.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-50">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center gap-4 py-5">
                {/* Left info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-[#2A2A2A] uppercase tracking-wider truncate">
                      {booking.customer?.name ?? '-'}
                    </span>
                    <span className={`shrink-0 text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${STATUS_COLOR[booking.status] ?? ''}`}>
                      {STATUS_LABEL[booking.status] ?? booking.status}
                    </span>
                  </div>
                  <span className="text-[9px] font-medium text-[#2A2A2A]/40 block">{booking.layanan?.name ?? '-'}</span>
                  <span className="text-[9px] font-medium text-[#2A2A2A]/30 block">
                    {new Date(booking.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                {/* Price */}
                <div className="shrink-0 text-right">
                  <span className="text-[12px] font-extrabold text-[#2A2A2A] block">{formatCurrency(booking.totalPrice)}</span>
                  <span className="text-[8px] font-medium text-[#2A2A2A]/30 block">{booking.customer?.email ?? ''}</span>
                </div>

                {/* Actions (only for PENDING) */}
                {booking.status === 'PENDING' && (
                  <div className="shrink-0 flex gap-2">
                    <button
                      id={`btn-confirm-${booking.id}`}
                      disabled={processingId === booking.id}
                      onClick={() => handleConfirm(booking.id)}
                      title="Konfirmasi pesanan"
                      className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-600 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      id={`btn-cancel-${booking.id}`}
                      disabled={processingId === booking.id}
                      onClick={() => handleCancel(booking.id)}
                      title="Tolak pesanan"
                      className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 disabled:opacity-50 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
