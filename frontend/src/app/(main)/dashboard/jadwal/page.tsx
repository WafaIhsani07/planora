'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '../DashboardLayout';
import { vendorOrders, type Order, type OrderStatus } from '@/lib/orders';
import {
  ShoppingBag,
  List,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>
);
const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
);
const CalendarPlusIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><line x1="12" x2="12" y1="14" y2="18" /><line x1="10" x2="14" y1="16" y2="16" /></svg>
);
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
);
const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

const getStatusStyle = (status: OrderStatus) => {
  switch (status) {
    case 'Menunggu':
      return 'bg-[#FCE6E3] text-[#FF527B]';
    case 'Dikonfirmasi':
      return 'bg-[#FFF9E5] text-[#F59E0B]';
    case 'Selesai':
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

type CalendarDay = {
  key: string;
  day: string;
  isPrevMonth: boolean;
  isNextMonth: boolean;
  isEvent: boolean;
  eventName?: string;
  eventStatus?: OrderStatus;
  order?: Order;
};

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildCalendarDays(cursor: Date, orders: Order[]): CalendarDay[] {
  // Buat map order berdasarkan tanggal (format: "YYYY-MM-DD")
  // Filter hanya pesanan "Dikonfirmasi"
  const confirmedOrders = orders.filter((order) => order.status === 'Dikonfirmasi');
  const orderMap: Record<string, Order[]> = {};
  confirmedOrders.forEach((order) => {
    const [datePart] = order.date.split(' ');
    const monthMap: Record<string, string> = {
      'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04',
      'Mei': '05', 'Juni': '06', 'Juli': '07', 'Agustus': '08',
      'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12',
    };
    const parts = order.date.split(' ');
    const day = String(parseInt(parts[0])).padStart(2, '0');
    const month = monthMap[parts[1]];
    const year = parts[2];
    const dateKey = `${year}-${month}-${day}`;
    if (!orderMap[dateKey]) orderMap[dateKey] = [];
    orderMap[dateKey].push(order);
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startOffset = firstDayOfMonth.getDay();
  const startDate = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + index);

    const isCurrentMonth =
      cellDate.getFullYear() === year && cellDate.getMonth() === month;
    const isPrevMonth =
      cellDate.getFullYear() < year ||
      (cellDate.getFullYear() === year && cellDate.getMonth() < month);
    const isNextMonth =
      cellDate.getFullYear() > year ||
      (cellDate.getFullYear() === year && cellDate.getMonth() > month);

    const dateKey = formatDateKey(cellDate);
    const ordersOnDate = orderMap[dateKey] || [];
    const firstOrder = ordersOnDate[0];

    return {
      key: dateKey,
      day: String(cellDate.getDate()).padStart(2, '0'),
      isPrevMonth,
      isNextMonth,
      isEvent: ordersOnDate.length > 0,
      eventName: firstOrder?.name,
      eventStatus: firstOrder?.status,
      order: firstOrder,
    };
  });
}

export default function PesananPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams?.get('view');
  const [pesananView, setPesananView] = useState<'list' | 'calendar'>(() => {
    if (viewParam === 'calendar') return 'calendar';
    if (viewParam === 'list') return 'list';
    return 'list';
  });
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [calendarCursor, setCalendarCursor] = useState(() => new Date(2026, 4, 1));

  const calendarDays = useMemo(
    () => buildCalendarDays(calendarCursor, vendorOrders),
    [calendarCursor],
  );

  const calendarTitle = `${MONTH_NAMES[calendarCursor.getMonth()]} ${calendarCursor.getFullYear()}`;

  const filteredOrders = filterStatus === 'Semua'
    ? vendorOrders
    : vendorOrders.filter((order) => order.status === filterStatus);

  React.useEffect(() => {
    if (viewParam === 'calendar') {
      setPesananView('calendar');
      return;
    }

    if (viewParam === 'list') {
      setPesananView('list');
    }
  }, [viewParam]);

  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Reset page if out of bounds
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-[2rem] font-extrabold tracking-tight leading-tight text-[#2A2A2A]">{pesananView === 'calendar' ? 'Jadwal' : 'Pesanan'}</h1>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2A2A2A]/35">{pesananView === 'calendar' ? 'Pantau dan kelola jadwal acara Anda.' : 'Pantau dan kelola daftar pesanan Anda.'}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white border border-[#2A2A2A]/5 p-1 rounded-2xl shadow-sm">
              <button
                onClick={() => router.push('/dashboard/jadwal?view=list')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${pesananView === 'list'
                    ? 'bg-[#FF9A9E] text-white shadow-sm'
                    : 'text-[#2A2A2A]/30 hover:bg-slate-50'
                  }`}
              >
                <List className="w-3.5 h-3.5" /> Daftar
              </button>
              <button
                onClick={() => router.push('/dashboard/jadwal?view=calendar')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${pesananView === 'calendar'
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
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              {[
                { name: 'Semua', count: null },
                { name: 'Menunggu', count: vendorOrders.filter((o) => o.status === 'Menunggu').length },
                { name: 'Dikonfirmasi', count: vendorOrders.filter((o) => o.status === 'Dikonfirmasi').length },
                { name: 'Selesai', count: vendorOrders.filter((o) => o.status === 'Selesai').length },
              ].map((status) => (
                <button
                  key={status.name}
                  onClick={() => {
                    setFilterStatus(status.name);
                    setCurrentPage(1);
                  }}
                  className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap rounded-full border-2 cursor-pointer ${filterStatus === status.name
                      ? 'bg-[#FF9A9E] text-white border-[#FF9A9E]'
                      : 'bg-white text-[#2A2A2A]/60 border-[#2A2A2A]/10 hover:border-[#2A2A2A]/30'
                    }`}
                >
                  {status.name}
                  {status.count !== null && (
                    <span
                      className={`w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-black ${filterStatus === status.name
                          ? 'bg-white text-[#FF9A9E]'
                          : 'bg-[#2A2A2A]/10 text-[#2A2A2A]/60'
                        }`}
                    >
                      {status.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div key={filterStatus} className="bg-white rounded-xl border border-[#2A2A2A]/5 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1100px]">
                  <thead>
                    <tr className="bg-slate-50/40 text-[10px] font-black text-[#2A2A2A]/30 uppercase tracking-[0.2em] border-b border-slate-50">
                      <th className="px-10 py-6 text-center">Pesanan</th>
                      <th className="px-10 py-6 text-center">Klien</th>
                      <th className="px-10 py-6 text-center">Tanggal Acara</th>
                      <th className="px-10 py-6 text-center">Paket</th>
                      <th className="px-10 py-6 text-center min-w-[180px]">Total</th>
                      <th className="px-10 py-6 text-center">Status</th>
                      <th className="px-10 py-6 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginatedOrders.map((order, idx) => (
                      <tr key={order.id} className="group hover:bg-[#FDF1F0]/20 transition-all">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={order.img}
                              className="w-12 h-12 flex-shrink-0 rounded-xl object-cover shadow-sm transition-transform group-hover:scale-105"
                              alt="Order"
                            />
                            <div>
                              <h4 className="font-black text-[#2A2A2A] text-[14px] mb-0.5">{order.name}</h4>
                              <p className="text-[10px] font-bold text-[#2A2A2A]/30 tracking-widest uppercase">{order.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-center">
                          <p className="text-sm font-black text-[#2A2A2A]">{order.client}</p>
                        </td>
                        <td className="px-10 py-6 text-center">
                          <div className="space-y-1">
                            <p className="text-sm font-black text-[#2A2A2A]">{order.date}</p>
                            <p className="text-[10px] font-bold text-[#2A2A2A]/40 uppercase">{order.time}</p>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-center">
                          <div className="space-y-1">
                            <p className="text-sm font-black text-[#2A2A2A]">{order.package}</p>
                            <p className="text-[10px] font-bold text-[#2A2A2A]/40 uppercase">{order.type}</p>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-center min-w-[180px]">
                          <p className="text-sm font-black text-[#2A2A2A] whitespace-nowrap">{order.amount}</p>
                        </td>
                        <td className="px-10 py-6 text-center">
                          <div className={`inline-block px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${getStatusStyle(order.status)}`}>
                            {order.status}
                          </div>
                        </td>
                        <td className="px-10 py-6 text-center">
                          <button
                            onClick={() => router.push(`/dashboard/jadwal/${encodeURIComponent(order.id)}`)}
                            className="px-5 py-2.5 rounded-xl bg-white border border-[#2A2A2A]/5 text-[9px] font-black uppercase tracking-widest text-[#2A2A2A]/60 hover:bg-[#2A2A2A] hover:text-white transition-all shadow-sm cursor-pointer"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-10 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-8 bg-white">
                <p className="text-[11px] font-bold text-[#2A2A2A]/30 uppercase tracking-[0.15em]">
                  Menampilkan <span className="text-[#2A2A2A]">{startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredOrders.length)}</span> dari{' '}
                  <span className="text-[#2A2A2A]">{filteredOrders.length}</span> pesanan
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-3 rounded-xl border border-slate-100 text-slate-300 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-10 h-10 rounded-xl text-[11px] font-black transition-all cursor-pointer ${p === currentPage
                          ? 'bg-[#FCE6E3] text-[#FF527B] shadow-sm'
                          : 'text-[#2A2A2A]/30 hover:bg-slate-50'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-xl border border-slate-100 text-[#2A2A2A]/40 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#2A2A2A]/5 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black tracking-tight text-[#2A2A2A]">{calendarTitle}</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCalendarCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} className="p-2 rounded-lg border border-[#2A2A2A]/10 text-[#2A2A2A]/40 hover:bg-[#2A2A2A]/5 transition-colors cursor-pointer">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setCalendarCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} className="p-2 rounded-lg border border-[#2A2A2A]/10 text-[#2A2A2A]/40 hover:bg-[#2A2A2A]/5 transition-colors cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="border border-[#2A2A2A]/5 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-7 bg-[#FAFAFC] border-b border-[#2A2A2A]/5">
                  {['MING', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'].map((day) => (
                    <div key={day} className="border-r border-[#2A2A2A]/5 py-3 text-center text-[8px] font-bold tracking-[0.18em] text-[#2A2A2A]/30 uppercase last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 auto-rows-[100px] bg-white">
                  {calendarDays.map((date) => (
                    <Link
                      key={date.key}
                      href={date.isEvent && date.order ? `/dashboard/jadwal/${encodeURIComponent(date.order.id)}?view=calendar` : '#'}
                      className={`border-b border-r border-[#2A2A2A]/5 p-3 h-full flex flex-col last:border-r-0 ${date.isPrevMonth || date.isNextMonth ? 'bg-[#FAFAFC]' : 'bg-white'} ${date.isEvent ? 'hover:bg-[#FDF1F0]/50 cursor-pointer' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-[12px] font-bold ${date.isPrevMonth || date.isNextMonth ? 'text-[#2A2A2A]/20' : 'text-[#2A2A2A]/60'}`}>
                          {date.day}
                        </span>
                        {date.isEvent && <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-[#FFF9E5] text-[#F59E0B]">✓</span>}
                      </div>

                      {date.isEvent && date.order && (
                        <div className="mt-auto space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#FF9A9E]"></div>
                            <p className="text-[10px] font-black text-[#2A2A2A] leading-tight line-clamp-2">{date.order.name}</p>
                          </div>
                          <p className="text-[8px] font-bold text-[#2A2A2A]/60">{date.order.time}</p>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 bg-white rounded-xl border border-[#2A2A2A]/5 shadow-sm p-6 h-fit sticky top-8">
              <h3 className="text-xl font-black text-[#2A2A2A] mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#FF9A9E]" />
                Pesanan Terdekat
              </h3>

              <div className="space-y-4">
                {vendorOrders
                  .filter((o) => o.status === 'Dikonfirmasi')
                  .sort((a, b) => {
                    const monthMap: Record<string, number> = { 'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5, 'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11 };
                    const [dayA, monthA, yearA] = a.date.split(' ');
                    const [dayB, monthB, yearB] = b.date.split(' ');
                    const dateA = new Date(parseInt(yearA), monthMap[monthA], parseInt(dayA));
                    const dateB = new Date(parseInt(yearB), monthMap[monthB], parseInt(dayB));
                    return dateA.getTime() - dateB.getTime();
                  })
                  .slice(0, 5)
                  .map((o) => (
                    <div key={o.id} className="p-4 rounded-xl border border-[#2A2A2A]/5 hover:border-[#FF9A9E]/30 hover:bg-[#FDF1F0]/30 transition-all group">
                      <div className="flex items-start gap-3 mb-3">
                        <img src={o.img} alt={o.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-[#2A2A2A] line-clamp-1">{o.name}</h4>
                          <p className="text-xs font-bold text-[#2A2A2A]/50 mt-0.5">{o.client}</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-[#2A2A2A]/60">
                        <div>📅 {o.date}</div>
                        <div>🕐 {o.time}</div>
                        <div className="pt-2 border-t border-[#2A2A2A]/10">💰 <span className="font-black text-[#2A2A2A]">{o.amount}</span></div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-[#2A2A2A]/10 flex items-center gap-2">
                        <span className="inline-block px-3 py-1.5 bg-[#FFF9E5] text-[#F59E0B] text-[9px] font-black rounded-lg">✓ DIKONFIRMASI</span>
                        <button
                          type="button"
                          onClick={() => router.push(`/dashboard/jadwal/${encodeURIComponent(o.id)}?view=calendar`)}
                          className="ml-auto px-4 py-2 rounded-xl bg-white border border-[#2A2A2A]/5 text-[9px] font-black uppercase tracking-widest text-[#2A2A2A]/60 hover:bg-[#2A2A2A] hover:text-white transition-all shadow-sm active:bg-[#2A2A2A] active:text-white"
                        >
                          Detail
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {vendorOrders.filter((o) => o.status === 'Dikonfirmasi').length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-[10px] font-bold text-[#2A2A2A]/40">Tidak ada pesanan yang dikonfirmasi</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
