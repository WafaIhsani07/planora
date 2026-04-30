'use client';

import React from 'react';
import {
  ShoppingBag,
  Image as ImageIcon,
  Settings,
  Clock,
  CheckCircle2,
  CreditCard,
  ArrowUpRight,
  Briefcase,
  Star,
  Wallet,
} from 'lucide-react';

export default function DashboardClient() {
  const vendorName = 'Wafa Decoration';

  const summaryCards = [
    {
      title: 'Total Pesanan',
      value: '28',
      trend: '15%',
      icon: ShoppingBag,
      color: 'text-[#FF527B]',
      bg: 'bg-[#FCE6E3]',
    },
    {
      title: 'Pesanan Aktif',
      value: '12',
      link: 'Lihat pesanan',
      icon: Clock,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      title: 'Pesanan Selesai',
      value: '36',
      link: 'Lihat riwayat',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Total Pendapatan',
      value: 'Rp 28.750.000',
      trend: '18%',
      icon: CreditCard,
      color: 'text-[#FF527B]',
      bg: 'bg-[#FCE6E3]',
    },
  ];

  const recentOrders = [
    {
      name: 'Pernikahan A & D',
      date: '12 Mei 2024',
      location: 'Gedung Graha Saba',
      status: 'MENUNGGU KONFIRMASI',
      amount: 'Rp 8.500.000',
      statusColor: 'bg-[#FCE6E3] text-[#FF527B]',
      img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=100',
    },
    {
      name: 'Lamaran R & S',
      date: '11 Mei 2024',
      location: 'Hotel Santika Premiere',
      status: 'BERLANGSUNG',
      amount: 'Rp 5.250.000',
      statusColor: 'bg-orange-50 text-orange-600',
      img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=100',
    },
    {
      name: 'Pernikahan M & F',
      date: '9 Mei 2024',
      location: 'Gedung Serbaguna',
      status: 'SELESAI',
      amount: 'Rp 12.000.000',
      statusColor: 'bg-emerald-50 text-emerald-600',
      img: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=100',
    },
    {
      name: 'Ulang Tahun Aisyah',
      date: '7 Mei 2024',
      location: 'Rumah Pribadi',
      status: 'DIBATALKAN',
      amount: 'Rp 2.000.000',
      statusColor: 'bg-slate-100 text-slate-500',
      img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=100',
    },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col mb-2">
        <h1 className="text-xl font-bold tracking-tight text-[#2A2A2A]">
          Selamat datang, {vendorName}! 👋
        </h1>
        <p className="text-[#2A2A2A]/40 text-xs font-semibold uppercase tracking-wide mt-0.5">
          Kelola bisnis dan pesanan Anda dengan mudah.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col justify-between hover:shadow-sm transition-all h-full"
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2.5 rounded-lg ${card.bg} ${card.color}`}>
                <card.icon className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wide text-[#2A2A2A]/20">
                {card.title}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2A2A2A] mb-1.5">{card.value}</h3>
              {card.trend ? (
                <p className="text-[9px] font-semibold text-emerald-500 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> {card.trend}
                </p>
              ) : (
                <button className="text-[9px] font-bold text-[#FF9A9E] uppercase tracking-tight hover:underline">
                  {card.link}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Grid Utama (Pesanan & Grafik) */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* Recent Orders Section */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <h3 className="text-sm font-bold tracking-tight text-[#2A2A2A]">Pesanan Terbaru</h3>
            <button className="text-[10px] font-bold text-[#FF9A9E] uppercase tracking-wide hover:text-[#FF527B] transition-colors">
              LIHAT SEMUA
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order, i) => (
              <div
                key={i}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={order.img}
                    className="w-12 h-12 rounded-lg object-cover shadow-sm flex-shrink-0"
                    alt="Acara"
                  />
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-[#2A2A2A] text-sm truncate mb-0.5">
                      {order.name}
                    </h4>
                    <p className="text-[9px] font-semibold text-[#2A2A2A]/40 leading-relaxed">
                      {order.date} • {order.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <div className={`px-3 py-1 rounded-full text-[8px] font-bold tracking-wide whitespace-nowrap ${order.statusColor}`}>
                    {order.status}
                  </div>
                  <p className="text-sm font-bold text-[#2A2A2A]">
                    {order.amount.replace('Rp ', '')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Revenue & Schedule */}
        <div className="lg:col-span-5 space-y-4">
          {/* Revenue Chart */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#2A2A2A]/30">
                PENDAPATAN BULANAN
              </h3>
              <button className="text-[9px] font-bold text-[#FF9A9E] uppercase tracking-tight hover:text-[#FF527B]">
                LAPORAN
              </button>
            </div>
            <div className="mb-6">
              <h4 className="text-2xl font-bold text-[#2A2A2A]">Rp 28.750.000</h4>
              <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1 mt-0.5">
                <ArrowUpRight className="w-3 h-3" /> 18% dari bulan lalu
              </p>
            </div>
            <div className="h-28 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path
                  d="M0,35 Q10,32 18,22 T35,28 T50,15 T68,25 T85,12 T100,28"
                  fill="none"
                  stroke="#FF9A9E"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M0,35 Q10,32 18,22 T35,28 T50,15 T68,25 T85,12 T100,28 L100,40 L0,40 Z"
                  fill="url(#pinkGradFill)"
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="pinkGradFill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FF9A9E', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#FF9A9E', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                <circle cx="18" cy="22" r="1.5" fill="#FF527B" />
                <circle cx="50" cy="15" r="1.5" fill="#FF527B" />
                <circle cx="85" cy="12" r="1.5" fill="#FF527B" />
              </svg>
              <div className="flex justify-between text-[8px] font-bold text-[#2A2A2A]/20 mt-3 uppercase tracking-wide px-1">
                <span>1 MEI</span>
                <span>15 MEI</span>
                <span>31 MEI</span>
              </div>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#2A2A2A]/30">
                JADWAL TERDEKAT
              </h3>
              <button className="text-[9px] font-bold text-[#FF9A9E] uppercase tracking-tight hover:text-[#FF527B]">
                KALENDER
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-[#FCE6E3] rounded-lg flex flex-col items-center justify-center border border-[#FF9A9E]/20 flex-shrink-0">
                <span className="text-lg font-bold text-[#FF527B]">15</span>
                <span className="text-[9px] font-bold uppercase text-[#FF527B] tracking-tight">
                  MEI
                </span>
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-[#2A2A2A] truncate mb-0.5">
                  Pernikahan A & D
                </h4>
                <p className="text-[9px] font-semibold text-[#2A2A2A]/40 flex items-center gap-2">
                  <Clock className="w-3 h-3" /> 08.00 - 16.00 WIB
                </p>
                <p className="text-[9px] font-semibold text-[#2A2A2A]/40">Gedung Graha Saba</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return renderDashboard();
}
