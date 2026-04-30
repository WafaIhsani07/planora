'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '../DashboardLayout';
import {
  ShoppingBag,
  List,
  Calendar as CalendarIcon,
  MoreHorizontal,
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

type OrderStatus = 'Menunggu' | 'Dikonfirmasi' | 'Selesai';
type PaymentStatus = 'menunggu' | 'dikonfirmasi' | 'selesai';

interface Order {
  id: string;
  name: string;
  client: string;
  date: string;
  time: string;
  package: string;
  type: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  amount: string;
  img: string;
}

const mockOrders: Order[] = [
  {
    id: '#PLR-240512-001',
    name: 'Pernikahan A & D',
    client: 'Andini Putri',
    date: '12 Mei 2026',
    time: '08.00 - 16.00',
    package: 'Paket Dekorasi',
    type: 'Premium',
    status: 'Menunggu',
    paymentStatus: 'menunggu',
    amount: 'Rp 8.500.000',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: '#PLR-240511-002',
    name: 'Lamaran R & S',
    client: 'Raka Pratama',
    date: '11 Mei 2026',
    time: '13.00 - 17.00',
    package: 'Paket Dekorasi',
    type: 'Standard',
    status: 'Dikonfirmasi',
    paymentStatus: 'dikonfirmasi',
    amount: 'Rp 5.250.000',
    img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: '#PLR-240509-003',
    name: 'Pernikahan M & F',
    client: 'Farah Quinn',
    date: '9 Mei 2026',
    time: '08.00 - 15.00',
    package: 'Paket Dekorasi',
    type: 'Premium',
    status: 'Selesai',
    paymentStatus: 'selesai',
    amount: 'Rp 12.000.000',
    img: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: '#PLR-240507-004',
    name: 'Ulang Tahun Aisyah',
    client: 'Budi Santoso',
    date: '7 Mei 2026',
    time: '16.00 - 20.00',
    package: 'Paket Dekorasi',
    type: 'Basic',
    status: 'Menunggu',
    paymentStatus: 'menunggu',
    amount: 'Rp 2.000.000',
    img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: '#PLR-240505-005',
    name: 'Pernikahan B & C',
    client: 'Citra Kirana',
    date: '5 Mei 2026',
    time: '08.00 - 16.00',
    package: 'Paket Dekorasi',
    type: 'Premium',
    status: 'Selesai',
    paymentStatus: 'selesai',
    amount: 'Rp 9.000.000',
    img: 'https://images.unsplash.com/photo-1519222970733-f546218fa6d7?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: '#PLR-240520-006',
    name: 'Aqiqah Rafasya',
    client: 'Rina Aprilia',
    date: '20 Mei 2026',
    time: '10.00 - 14.00',
    package: 'Paket Dekorasi',
    type: 'Standard',
    status: 'Dikonfirmasi',
    paymentStatus: 'dikonfirmasi',
    amount: 'Rp 3.750.000',
    img: 'https://images.unsplash.com/photo-1467226623193-bfe1b0c0dc1d?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: '#PLR-240525-007',
    name: 'Resepsi Nikah I & M',
    client: 'Dimas Putra',
    date: '25 Mei 2026',
    time: '17.00 - 22.00',
    package: 'Paket Dekorasi Premium',
    type: 'Premium',
    status: 'Selesai',
    paymentStatus: 'selesai',
    amount: 'Rp 15.000.000',
    img: 'https://images.unsplash.com/photo-1519167758481-83f19106048c?auto=format&fit=crop&q=80&w=100',
  },
];

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
  const orderMap: Record<string, Order[]> = {};
  orders.forEach((order) => {
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
  const [pesananView, setPesananView] = useState<'list' | 'calendar'>('list');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [calendarCursor, setCalendarCursor] = useState(() => new Date(2026, 4, 1));

  const calendarDays = useMemo(
    () => buildCalendarDays(calendarCursor, mockOrders),
    [calendarCursor],
  );

  const calendarTitle = `${MONTH_NAMES[calendarCursor.getMonth()]} ${calendarCursor.getFullYear()}`;

  const filteredOrders = filterStatus === 'Semua'
    ? mockOrders
    : mockOrders.filter((order) => order.status === filterStatus);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-[34px] font-black tracking-tight text-[#2A2A2A]">Manajemen Pesanan</h1>
            <p className="text-[#2A2A2A]/40 text-xs font-bold uppercase tracking-[0.25em]">PANTAU DAN KELOLA JADWAL ACARAMU.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white border border-[#2A2A2A]/5 p-1 rounded-2xl shadow-sm">
              <button
                onClick={() => setPesananView('list')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  pesananView === 'list'
                    ? 'bg-[#FF9A9E] text-white shadow-sm'
                    : 'text-[#2A2A2A]/30 hover:bg-slate-50'
                }`}
              >
                <List className="w-3.5 h-3.5" /> Daftar
              </button>
              <button
                onClick={() => setPesananView('calendar')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
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
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-[#2A2A2A]/5 pb-1 overflow-x-auto no-scrollbar">
              {[
                { name: 'Semua', count: null },
                { name: 'Menunggu', count: mockOrders.filter((o) => o.status === 'Menunggu').length },
                { name: 'Dikonfirmasi', count: mockOrders.filter((o) => o.status === 'Dikonfirmasi').length },
                { name: 'Selesai', count: mockOrders.filter((o) => o.status === 'Selesai').length },
              ].map((status) => (
                <button
                  key={status.name}
                  onClick={() => setFilterStatus(status.name)}
                  className={`relative px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${
                    filterStatus === status.name
                      ? 'text-[#FF527B]'
                      : 'text-[#2A2A2A]/40 hover:text-[#2A2A2A]'
                  }`}
                >
                  {status.name}
                  {status.count !== null && (
                    <span
                      className={`w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-black ${
                        filterStatus === status.name
                          ? 'bg-[#FF527B] text-white'
                          : 'bg-[#2A2A2A]/5 text-[#2A2A2A]/40'
                      }`}
                    >
                      {status.count}
                    </span>
                  )}
                  {filterStatus === status.name && (
                    <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#FF527B] rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[40px] border border-[#2A2A2A]/5 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1100px]">
                  <thead>
                    <tr className="bg-slate-50/40 text-[10px] font-black text-[#2A2A2A]/30 uppercase tracking-[0.2em] border-b border-slate-50">
                      <th className="px-10 py-6 text-left">Pesanan</th>
                      <th className="px-10 py-6 text-left">Klien</th>
                      <th className="px-10 py-6 text-left">Tanggal Acara</th>
                      <th className="px-10 py-6 text-left">Paket</th>
                      <th className="px-10 py-6 text-left">Total</th>
                      <th className="px-10 py-6 text-left">Status</th>
                      <th className="px-10 py-6 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredOrders.map((order, idx) => (
                      <tr key={idx} className="group hover:bg-[#FDF1F0]/20 transition-all">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={order.img}
                              className="w-12 h-12 rounded-xl object-cover shadow-sm transition-transform group-hover:scale-105"
                              alt="Order"
                            />
                            <div>
                              <h4 className="font-black text-[#2A2A2A] text-[14px] mb-0.5">{order.name}</h4>
                              <p className="text-[10px] font-bold text-[#2A2A2A]/30 tracking-widest uppercase">{order.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <p className="text-sm font-black text-[#2A2A2A]">{order.client}</p>
                        </td>
                        <td className="px-10 py-6">
                          <div className="space-y-1">
                            <p className="text-sm font-black text-[#2A2A2A]">{order.date}</p>
                            <p className="text-[10px] font-bold text-[#2A2A2A]/40 uppercase">{order.time}</p>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="space-y-1">
                            <p className="text-sm font-black text-[#2A2A2A]">{order.package}</p>
                            <p className="text-[10px] font-bold text-[#2A2A2A]/40 uppercase">{order.type}</p>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <p className="text-sm font-black text-[#2A2A2A]">{order.amount}</p>
                        </td>
                        <td className="px-10 py-6">
                          <div className={`inline-block px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${getStatusStyle(order.status)}`}>
                            {order.status}
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => router.push(`/dashboard/jadwal/${order.id}`)}
                              className="px-5 py-2.5 rounded-xl bg-white border border-[#2A2A2A]/5 text-[9px] font-black uppercase tracking-widest text-[#2A2A2A]/60 hover:bg-[#2A2A2A] hover:text-white transition-all shadow-sm"
                            >
                              Detail
                            </button>
                            <button className="p-2.5 rounded-lg bg-slate-50/50 text-[#2A2A2A]/20 hover:bg-[#FCE6E3] hover:text-[#FF527B] transition-all">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-10 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-8 bg-white">
                <p className="text-[11px] font-bold text-[#2A2A2A]/30 uppercase tracking-[0.15em]">
                  Menampilkan <span className="text-[#2A2A2A]">1 - {Math.min(5, filteredOrders.length)}</span> dari{' '}
                  <span className="text-[#2A2A2A]">{filteredOrders.length}</span> pesanan
                </p>
                <div className="flex items-center gap-2">
                  <button className="p-3 rounded-xl border border-slate-100 text-slate-300 hover:bg-slate-50 transition-all shadow-sm">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[1, 2, 3, 4, 5].map((p) => (
                    <button
                      key={p}
                      className={`w-10 h-10 rounded-xl text-[11px] font-black transition-all ${
                        p === 1
                          ? 'bg-[#FCE6E3] text-[#FF527B] shadow-sm'
                          : 'text-[#2A2A2A]/30 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button className="p-3 rounded-xl border border-slate-100 text-[#2A2A2A]/40 hover:bg-slate-50 transition-all shadow-sm">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-[40px] border border-[#2A2A2A]/5 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black tracking-tight text-[#2A2A2A]">{calendarTitle}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCalendarCursor(
                      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                    )
                  }
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setCalendarCursor(
                      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                    )
                  }
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="w-full flex flex-col border border-gray-100 rounded-2xl overflow-hidden">
              {/* Day headers */}
              <div className="grid grid-cols-7 bg-[#FAFAFC] border-b border-gray-100">
                {['MING', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'].map((day) => (
                  <div
                    key={day}
                    className="border-r border-gray-100 py-3 text-center text-[8px] font-bold tracking-[0.18em] text-[#A8A8A8] uppercase last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 auto-rows-[120px] bg-white">
                {calendarDays.map((date) => {
                  const cellContent = (
                    <div
                      className={`border-b border-r border-gray-100 p-3 transition-all last:border-r-0 group hover:bg-[#FDF1F0]/50 cursor-pointer h-full flex flex-col ${
                        date.isPrevMonth || date.isNextMonth
                          ? 'bg-[#FAFAFC]'
                          : date.isEvent
                            ? 'bg-white'
                            : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span
                          className={`text-[12px] font-bold ${
                            date.isPrevMonth || date.isNextMonth
                              ? 'text-gray-300'
                              : 'text-gray-700'
                          }`}
                        >
                          {date.day}
                        </span>
                        {date.isEvent && date.eventStatus && (
                          <span
                            className={`text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap ${
                              date.eventStatus === 'Menunggu'
                                ? 'bg-[#FCE6E3] text-[#FF527B]'
                                : date.eventStatus === 'Dikonfirmasi'
                                  ? 'bg-[#FFF9E5] text-[#F59E0B]'
                                  : 'bg-[#E6F9F0] text-[#10B981]'
                            }`}
                          >
                            {date.eventStatus === 'Menunggu' && '⏳'}
                            {date.eventStatus === 'Dikonfirmasi' && '✓'}
                            {date.eventStatus === 'Selesai' && '✓✓'}
                          </span>
                        )}
                      </div>

                      {date.isEvent && date.order ? (
                        <div className="mt-auto space-y-1.5 group-hover:scale-105 transition-transform origin-top-left">
                          <p className="text-[10px] font-black text-[#2A2A2A] leading-tight line-clamp-2">
                            {date.order.name}
                          </p>
                          <p className="text-[8px] font-bold text-[#2A2A2A]/60">
                            {date.order.time}
                          </p>
                          <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-gray-100">
                            <img
                              src={date.order.img}
                              alt={date.order.name}
                              className="w-6 h-6 rounded object-cover"
                            />
                            <span className="text-[7px] font-bold text-[#2A2A2A]/50 truncate">
                              {date.order.client}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );

                  return (
                    <div key={date.key}>
                      {date.isEvent && date.order ? (
                        <div
                          onClick={() => router.push(`/dashboard/jadwal/${date.order.id}`)}
                          className="block"
                        >
                          {cellContent}
                        </div>
                      ) : (
                        cellContent
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
