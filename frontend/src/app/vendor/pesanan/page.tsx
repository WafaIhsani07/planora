'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  List,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  CheckCircle,
  XCircle,
  X,
  MapPin,
  FileText,
  User,
  Clock,
  Mail,
  Phone,
} from 'lucide-react';
import { getVendorBookings, updateBookingStatus } from '@/services/vendor.service';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Menunggu',
  CONFIRMED: 'Dikonfirmasi',
  IN_PROGRESS: 'Berjalan',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-[#FCE6E3] text-[#FF527B]';
    case 'CONFIRMED':
    case 'IN_PROGRESS':
      return 'bg-[#FFF9E5] text-[#F59E0B]';
    case 'COMPLETED':
      return 'bg-[#E6F9F0] text-[#10B981]';
    default:
      return 'bg-slate-100 text-slate-400';
  }
};

const MONTH_NAMES = [
  'JANUARI',
  'FEBRUARI',
  'MARET',
  'APRIL',
  'MEI',
  'JUNI',
  'JULI',
  'AGUSTUS',
  'SEPTEMBER',
  'OKTOBER',
  'NOVEMBER',
  'DESEMBER',
];

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=200';

type CalendarDay = {
  key: string;
  day: string;
  isPrevMonth: boolean;
  isNextMonth: boolean;
  isEvent: boolean;
  bookings: any[];
};

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Build calendar days using real bookings list
function buildCalendarDays(cursor: Date, bookingsList: any[]): CalendarDay[] {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startOffset = firstDayOfMonth.getDay();
  const startDate = new Date(year, month, 1 - startOffset);

  // Group bookings by event date key "YYYY-MM-DD"
  const bookingMap: Record<string, any[]> = {};
  bookingsList.forEach((b) => {
    if (!b.eventDate) return;
    const d = new Date(b.eventDate);
    const dateKey = formatDateKey(d);
    if (!bookingMap[dateKey]) bookingMap[dateKey] = [];
    bookingMap[dateKey].push(b);
  });

  return Array.from({ length: 42 }, (_, index) => {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + index);

    const isPrevMonth =
      cellDate.getFullYear() < year ||
      (cellDate.getFullYear() === year && cellDate.getMonth() < month);
    const isNextMonth =
      cellDate.getFullYear() > year ||
      (cellDate.getFullYear() === year && cellDate.getMonth() > month);

    const dateKey = formatDateKey(cellDate);
    const dayBookings = bookingMap[dateKey] || [];

    return {
      key: dateKey,
      day: String(cellDate.getDate()).padStart(2, '0'),
      isPrevMonth,
      isNextMonth,
      isEvent: dayBookings.length > 0,
      bookings: dayBookings,
    };
  });
}

export default function VendorPesananPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams?.get('view');
  
  const [pesananView, setPesananView] = useState<'list' | 'calendar'>('list');
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [calendarCursor, setCalendarCursor] = useState(() => new Date(2026, 4, 1));
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch all bookings from backend
  const fetchBookings = async () => {
    try {
      const data = await getVendorBookings();
      const bookingList = Array.isArray(data) ? data : data?.bookings ?? [];
      setBookings(bookingList);
    } catch (err) {
      console.error('Gagal memuat pesanan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (viewParam === 'calendar') {
      setPesananView('calendar');
    } else {
      setPesananView('list');
    }
  }, [viewParam]);

  // Actions
  const handleConfirm = async (id: string) => {
    setProcessingId(id);
    try {
      await updateBookingStatus(id, 'CONFIRMED');
      await fetchBookings();
      setSelectedBooking((prev: any) => prev && prev.id === id ? { ...prev, status: 'CONFIRMED' } : prev);
    } catch (err) {
      console.error('Gagal mengkonfirmasi pesanan:', err);
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
      setSelectedBooking((prev: any) => prev && prev.id === id ? { ...prev, status: 'CANCELLED' } : prev);
    } catch (err) {
      console.error('Gagal menolak pesanan:', err);
    } finally {
      setProcessingId(null);
    }
  };

  // Filter & Pagination logic
  const filteredBookings = useMemo(() => {
    if (filterStatus === 'Semua') return bookings;
    if (filterStatus === 'Menunggu') return bookings.filter((b) => b.status === 'PENDING');
    if (filterStatus === 'Dikonfirmasi') return bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS');
    if (filterStatus === 'Selesai') return bookings.filter((b) => b.status === 'COMPLETED');
    return bookings;
  }, [bookings, filterStatus]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const calendarDays = useMemo(
    () => buildCalendarDays(calendarCursor, bookings),
    [calendarCursor, bookings]
  );

  const calendarTitle = `${MONTH_NAMES[calendarCursor.getMonth()]} ${calendarCursor.getFullYear()}`;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FDF1F0]" data-testid="loading-spinner">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9A9E]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 py-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-[2rem] font-extrabold tracking-tight leading-tight text-[#2A2A2A]">
            {pesananView === 'calendar' ? 'Jadwal' : 'Pesanan'}
          </h1>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2A2A2A]/35">
            {pesananView === 'calendar' ? 'PANTAU DAN KELOLA JADWAL ACARA ANDA.' : 'PANTAU DAN KELOLA DAFTAR PESANAN ANDA.'}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-[#2A2A2A]/5 p-1 rounded-2xl shadow-sm">
            <button
              onClick={() => {
                setPesananView('list');
                router.push('/vendor/pesanan?view=list');
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                pesananView === 'list'
                  ? 'bg-[#FF9A9E] text-white shadow-sm'
                  : 'text-[#2A2A2A]/30 hover:bg-slate-50'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Daftar
            </button>
            <button
              onClick={() => {
                setPesananView('calendar');
                router.push('/vendor/pesanan?view=calendar');
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                pesananView === 'calendar'
                  ? 'bg-[#FF9A9E] text-white shadow-sm'
                  : 'text-[#2A2A2A]/30 hover:bg-slate-50'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" /> Kalender
            </button>
          </div>
        </div>
      </div>

      {pesananView === 'list' ? (
        <>
          {/* Status Tabs Filter */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            {[
              { name: 'Semua', count: bookings.length },
              { name: 'Menunggu', count: bookings.filter((b) => b.status === 'PENDING').length },
              { name: 'Dikonfirmasi', count: bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS').length },
              { name: 'Selesai', count: bookings.filter((b) => b.status === 'COMPLETED').length },
            ].map((status) => (
              <button
                key={status.name}
                onClick={() => {
                  setFilterStatus(status.name);
                  setCurrentPage(1);
                }}
                className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap rounded-full border-2 cursor-pointer ${
                  filterStatus === status.name
                    ? 'bg-[#FF9A9E] text-white border-[#FF9A9E]'
                    : 'bg-white text-[#2A2A2A]/60 border-[#2A2A2A]/10 hover:border-[#2A2A2A]/30'
                }`}
              >
                {status.name}
                <span
                  className={`w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-black ${
                    filterStatus === status.name
                      ? 'bg-white text-[#FF9A9E]'
                      : 'bg-[#2A2A2A]/10 text-[#2A2A2A]/60'
                  }`}
                >
                  {status.count}
                </span>
              </button>
            ))}
          </div>

          {/* Table list */}
          <div className="bg-white rounded-xl border border-[#2A2A2A]/5 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead>
                  <tr className="bg-slate-50/40 text-[10px] font-black text-[#2A2A2A]/30 uppercase tracking-[0.2em] border-b border-slate-50">
                    <th className="px-10 py-6 text-left">Pesanan</th>
                    <th className="px-10 py-6 text-center">Klien</th>
                    <th className="px-10 py-6 text-center">Tanggal Acara</th>
                    <th className="px-10 py-6 text-center">Paket</th>
                    <th className="px-10 py-6 text-center min-w-[180px]">Total</th>
                    <th className="px-10 py-6 text-center">Status</th>
                    <th className="px-10 py-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-slate-400 font-bold uppercase text-xs tracking-wider">
                        Tidak ada pesanan untuk kategori ini.
                      </td>
                    </tr>
                  ) : (
                    paginatedBookings.map((booking) => {
                      const eventName = booking.layanan?.name || 'Paket Acara';
                      const bookingCode = `#PLR-${booking.id.slice(0, 8).toUpperCase()}`;
                      const formattedDate = new Date(booking.eventDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      });
                      const categoryName = booking.layanan?.kategori?.name || 'WEDDING';

                      return (
                        <tr key={booking.id} className="group hover:bg-[#FDF1F0]/20 transition-all">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                              <img
                                src={booking.layanan?.images?.[0] || DEFAULT_IMAGE}
                                className="w-12 h-12 flex-shrink-0 rounded-xl object-cover shadow-sm transition-transform group-hover:scale-105"
                                alt="Order"
                              />
                              <div>
                                <h4 className="font-black text-[#2A2A2A] text-[14px] mb-0.5">{eventName}</h4>
                                <p className="text-[10px] font-bold text-[#2A2A2A]/30 tracking-widest uppercase">{bookingCode}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6 text-center">
                            <p className="text-sm font-black text-[#2A2A2A]">{booking.customer?.name || 'Klien Planora'}</p>
                          </td>
                          <td className="px-10 py-6 text-center">
                            <div className="space-y-1">
                              <p className="text-sm font-black text-[#2A2A2A]">{formattedDate}</p>
                              <p className="text-[10px] font-bold text-[#2A2A2A]/40 uppercase">08.00 - 16.00</p>
                            </div>
                          </td>
                          <td className="px-10 py-6 text-center">
                            <div className="space-y-1">
                              <p className="text-sm font-black text-[#2A2A2A]">{eventName}</p>
                              <p className="text-[10px] font-bold text-[#2A2A2A]/40 uppercase">{categoryName}</p>
                            </div>
                          </td>
                          <td className="px-10 py-6 text-center min-w-[180px]">
                            <p className="text-sm font-black text-[#2A2A2A] whitespace-nowrap">
                              {formatCurrency(Number(booking.totalPrice))}
                            </p>
                          </td>
                          <td className="px-10 py-6 text-center">
                            <div
                              className={`inline-block px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${getStatusStyle(
                                booking.status
                              )}`}
                            >
                              {STATUS_LABEL[booking.status] || booking.status}
                            </div>
                          </td>
                          <td className="px-10 py-6 text-center">
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="px-5 py-2.5 rounded-xl bg-white border border-[#2A2A2A]/5 text-[9px] font-black uppercase tracking-widest text-[#2A2A2A]/60 hover:bg-[#2A2A2A] hover:text-white transition-all shadow-sm cursor-pointer"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-10 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-8 bg-white">
                <p className="text-[11px] font-bold text-[#2A2A2A]/30 uppercase tracking-[0.15em]">
                  Menampilkan <span className="text-[#2A2A2A]">{startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredBookings.length)}</span> dari{' '}
                  <span className="text-[#2A2A2A]">{filteredBookings.length}</span> pesanan
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-3 rounded-xl border border-slate-100 text-slate-300 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-10 h-10 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                        p === currentPage
                          ? 'bg-[#FCE6E3] text-[#FF527B] shadow-sm'
                          : 'text-[#2A2A2A]/30 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-xl border border-slate-100 text-[#2A2A2A]/40 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Calendar View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#2A2A2A]/5 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black tracking-tight text-[#2A2A2A]">{calendarTitle}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCalendarCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                  className="p-2 rounded-lg border border-[#2A2A2A]/10 text-[#2A2A2A]/40 hover:bg-[#2A2A2A]/5 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCalendarCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                  className="p-2 rounded-lg border border-[#2A2A2A]/10 text-[#2A2A2A]/40 hover:bg-[#2A2A2A]/5 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="border border-[#2A2A2A]/5 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-7 bg-[#FAFAFC] border-b border-[#2A2A2A]/5">
                {['MING', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'].map((day) => (
                  <div
                    key={day}
                    className="border-r border-[#2A2A2A]/5 py-3 text-center text-[8px] font-bold tracking-[0.18em] text-[#2A2A2A]/30 uppercase last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 auto-rows-[100px] bg-white">
                {calendarDays.map((date) => (
                  <div
                    key={date.key}
                    onClick={() => {
                      if (date.isEvent && date.bookings.length > 0) {
                        setSelectedBooking(date.bookings[0]);
                      }
                    }}
                    className={`border-b border-r border-[#2A2A2A]/5 p-3 h-full flex flex-col last:border-r-0 ${
                      date.isPrevMonth || date.isNextMonth ? 'bg-[#FAFAFC]' : 'bg-white'
                    } ${date.isEvent ? 'hover:bg-[#FDF1F0]/50 cursor-pointer' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className={`text-[12px] font-bold ${
                          date.isPrevMonth || date.isNextMonth ? 'text-[#2A2A2A]/20' : 'text-[#2A2A2A]/60'
                        }`}
                      >
                        {date.day}
                      </span>
                      {date.isEvent && (
                        <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-[#FFF9E5] text-[#F59E0B]">
                          ✓
                        </span>
                      )}
                    </div>

                    {date.isEvent && date.bookings.map((b) => (
                      <div key={b.id} className="mt-auto space-y-1.5 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#FF9A9E] flex-shrink-0" />
                          <p className="text-[10px] font-black text-[#2A2A2A] leading-tight line-clamp-1 truncate">
                            {b.layanan?.name || 'Acara'}
                          </p>
                        </div>
                        <p className="text-[8px] font-bold text-[#2A2A2A]/60">08.00 - 16.00</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Near Bookings Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-[#2A2A2A]/5 shadow-sm p-6 h-fit sticky top-8">
            <h3 className="text-xl font-black text-[#2A2A2A] mb-6 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#FF9A9E]" />
              Pesanan Terdekat
            </h3>

            <div className="space-y-4">
              {bookings
                .filter((o) => o.status === 'CONFIRMED')
                .slice(0, 5)
                .map((o) => {
                  const formattedDate = new Date(o.eventDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={o.id}
                      onClick={() => setSelectedBooking(o)}
                      className="p-4 rounded-xl border border-[#2A2A2A]/5 hover:border-[#FF9A9E]/30 hover:bg-[#FDF1F0]/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src={o.layanan?.images?.[0] || DEFAULT_IMAGE}
                          alt={o.layanan?.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-[#2A2A2A] line-clamp-1">{o.layanan?.name || 'Acara'}</h4>
                          <p className="text-xs font-bold text-[#2A2A2A]/50 mt-0.5">{o.customer?.name || 'Klien'}</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-[#2A2A2A]/60">
                        <div>📅 {formattedDate}</div>
                        <div>🕐 08.00 - 16.00</div>
                        <div className="pt-2 border-t border-[#2A2A2A]/10">
                          💰{' '}
                          <span className="font-black text-[#2A2A2A]">{formatCurrency(Number(o.totalPrice))}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-[#2A2A2A]/10 flex items-center gap-2">
                        <span className="inline-block px-3 py-1 bg-[#FFF9E5] text-[#F59E0B] text-[9px] font-black rounded-lg">
                          ✓ DIKONFIRMASI
                        </span>
                      </div>
                    </div>
                  );
                })}
              {bookings.filter((o) => o.status === 'CONFIRMED').length === 0 && (
                <p className="text-xs text-slate-400 font-bold uppercase text-center py-6">
                  Tidak ada pesanan terkonfirmasi terdekat.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Booking Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2A2A2A]/60 backdrop-blur-[4px] px-4">
          <div className="w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-white shadow-2xl animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-[#2A2A2A]/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-[#FF9A9E] uppercase tracking-widest">
                  Detail Transaksi #{selectedBooking.id.slice(0, 8).toUpperCase()}
                </span>
                <h3 className="text-2xl font-black text-[#2A2A2A] mt-1">Detail Informasi Pesanan</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6 max-h-[500px] overflow-y-auto no-scrollbar">
              {/* Status Section */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-[#2A2A2A]/5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Transaksi</span>
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusStyle(selectedBooking.status)}`}>
                  {STATUS_LABEL[selectedBooking.status] || selectedBooking.status}
                </span>
              </div>

              {/* Client Info */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-[#2A2A2A]/30 uppercase tracking-[0.2em] border-b border-[#2A2A2A]/5 pb-2">Informasi Klien</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Nama</p>
                      <p className="text-xs font-black text-[#2A2A2A] truncate">{selectedBooking.customer?.name || 'Klien'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Email</p>
                      <p className="text-xs font-black text-[#2A2A2A] truncate">{selectedBooking.customer?.email || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] font-bold text-slate-400 uppercase">No. Telepon</p>
                      <p className="text-xs font-black text-[#2A2A2A] truncate">{selectedBooking.customer?.phone || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Waktu Acara</p>
                      <p className="text-xs font-black text-[#2A2A2A] truncate">08.00 - 16.00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-[#2A2A2A]/30 uppercase tracking-[0.2em] border-b border-[#2A2A2A]/5 pb-2">Rincian Paket & Acara</h4>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Lokasi Acara</p>
                    <p className="text-xs font-black text-[#2A2A2A] leading-relaxed mt-0.5">{selectedBooking.eventAddress || 'Alamat tidak ditentukan'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Catatan Tambahan</p>
                    <p className="text-xs font-black text-[#2A2A2A] leading-relaxed mt-0.5">{selectedBooking.notes || 'Tidak ada catatan tambahan'}</p>
                  </div>
                </div>
              </div>

              {/* Total Price */}
              <div className="border-t border-[#2A2A2A]/5 pt-6 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-[#2A2A2A]/30 uppercase tracking-widest">Total Transaksi</p>
                  <p className="text-2xl font-black text-[#FF527B] mt-1">{formatCurrency(Number(selectedBooking.totalPrice))}</p>
                </div>
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider text-right max-w-[150px]">
                  Sudah termasuk seluruh biaya layanan & pajak.
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            {selectedBooking.status === 'PENDING' && (
              <div className="p-8 border-t border-[#2A2A2A]/5 bg-slate-50/50 flex items-center gap-3">
                <button
                  type="button"
                  disabled={processingId === selectedBooking.id}
                  onClick={() => handleCancel(selectedBooking.id)}
                  className="flex-1 rounded-2xl border border-red-200 bg-white px-5 py-4 text-[10px] font-black uppercase tracking-widest text-[#FF527B] hover:bg-red-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" /> Tolak
                </button>
                <button
                  type="button"
                  disabled={processingId === selectedBooking.id}
                  onClick={() => handleConfirm(selectedBooking.id)}
                  className="flex-1 rounded-2xl bg-[#2A2A2A] px-5 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-[#2A2A2A]/10 transition-all hover:bg-[#FF527B] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" /> Terima Pesanan
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
