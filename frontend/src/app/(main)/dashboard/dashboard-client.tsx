'use client';

import React from 'react';
import Link from 'next/link';
import { vendorOrders } from '@/lib/orders';
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

  const getStatusStyle = (status: string) => {
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

  const recentOrders = vendorOrders;

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col mb-3">
        <h1 className="text-3xl md:text-[2rem] font-black tracking-[-0.04em] leading-[1.05] text-[#2A2A2A]">
          Selamat datang, {vendorName}!
        </h1>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2A2A2A]/35">
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
                <Link href="/dashboard/jadwal?view=list" className="text-[9px] font-bold text-[#FF9A9E] uppercase tracking-tight hover:underline">
                  {card.link}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Grid Utama (Pesanan & Grafik) */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* Recent Orders Section (matches Pesanan style) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#2A2A2A]/5 shadow-sm overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-tight text-[#2A2A2A]">Pesanan Terbaru</h3>
            <Link href="/dashboard/jadwal?view=list" className="text-[10px] font-bold uppercase tracking-wide no-underline transition-colors hover:!text-[#FF527B]" style={{color: '#FF9A9E'}}>
              LIHAT SEMUA
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-fixed border-collapse min-w-[820px] lg:min-w-0">
              <thead>
                <tr className="bg-slate-50/40 text-[9px] lg:text-[10px] font-black text-[#2A2A2A]/30 uppercase tracking-[0.18em]">
                  <th className="px-5 py-4 text-center">Pesanan</th>
                  <th className="px-5 py-4 text-center">Klien</th>
                  <th className="px-5 py-4 text-center">Tanggal Acara</th>
                  <th className="px-5 py-4 text-center">Paket</th>
                  <th className="px-5 py-4 text-center min-w-[140px]">Total</th>
                  <th className="px-5 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 3).map((order, idx) => (
                  <tr key={idx} className="group hover:bg-[#FDF1F0]/20 transition-all">
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.img}
                          className="w-10 h-10 flex-shrink-0 rounded-lg object-cover shadow-sm transition-transform group-hover:scale-105"
                          alt="Acara"
                        />
                        <div>
                          <h4 className="font-black text-[#2A2A2A] text-[13px] mb-0.5">{order.name}</h4>
                          <p className="text-[10px] font-bold text-[#2A2A2A]/40 tracking-widest uppercase">{order.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top text-center">
                      <p className="text-[13px] font-black text-[#2A2A2A]">{order.client}</p>
                    </td>
                    <td className="px-5 py-4 align-top text-center">
                      <div className="space-y-1">
                        <p className="text-[13px] font-black text-[#2A2A2A]">{order.date}</p>
                        <p className="text-[9px] font-bold text-[#2A2A2A]/40 uppercase">{order.time}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top text-center">
                      <div className="space-y-1">
                        <p className="text-[13px] font-black text-[#2A2A2A]">{order.package}</p>
                        <p className="text-[9px] font-bold text-[#2A2A2A]/40 uppercase">{order.type}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top text-center min-w-[140px]">
                      <p className="text-[13px] font-black text-[#2A2A2A] whitespace-nowrap">{order.amount}</p>
                    </td>
                    <td className="px-5 py-4 align-top text-center">
                      <div className={`inline-block px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-wider whitespace-nowrap ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Revenue & Schedule */}
        <div className="lg:col-span-5 space-y-4">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-xl border border-[#2A2A2A]/5 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#2A2A2A]/35">
                Pendapatan Bulanan
              </h3>
              <Link href="/dashboard/keuangan" className="text-[9px] font-bold uppercase tracking-tight no-underline transition-colors hover:!text-[#FF527B]" style={{color: '#FF9A9E'}}>
                Laporan
              </Link>
            </div>
            <div className="mb-8">
              <h4 className="text-3xl font-extrabold text-[#2A2A2A]">Rp 28.750.000</h4>
              <p className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1.5 mt-1">
                <ArrowUpRight className="w-4 h-4" /> 18% dari bulan lalu
              </p>
            </div>
            <div className="relative h-32 w-full bg-gradient-to-b from-[#FDF1F0] to-white rounded-xl p-4">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                {/* Grid Lines */}
                <line x1="0" y1="10" x2="100" y2="10" stroke="#F1D7D3" strokeWidth="0.5" />
                <line x1="0" y1="20" x2="100" y2="20" stroke="#F1D7D3" strokeWidth="0.5" />
                <line x1="0" y1="30" x2="100" y2="30" stroke="#F1D7D3" strokeWidth="0.5" />
                
                {/* Main Path */}
                <path
                  d="M0,28 C15,25 20,20 30,18 C40,16 45,22 55,14 C65,8 75,20 100,16"
                  fill="none"
                  stroke="#FF527B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Gradient Fill */}
                <path
                  d="M0,28 C15,25 20,20 30,18 C40,16 45,22 55,14 C65,8 75,20 100,16 L100,40 L0,40 Z"
                  fill="url(#chartGradient)"
                  opacity="0.12"
                />
                
                {/* Data Point Circles */}
                <circle cx="30" cy="18" r="2" fill="#FF527B" />
                <circle cx="55" cy="14" r="2" fill="#FF527B" />
                <circle cx="100" cy="16" r="2" fill="#FF527B" />
                
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FF527B', stopOpacity: 0.4 }} />
                    <stop offset="100%" style={{ stopColor: '#FF527B', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* X-Axis Labels */}
              <div className="flex justify-between text-[8px] font-bold text-[#2A2A2A]/30 uppercase tracking-wide mt-2 px-1">
                <span>1 MEI</span>
                <span>15 MEI</span>
                <span>31 MEI</span>
              </div>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="bg-white p-6 rounded-xl border border-[#2A2A2A]/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#2A2A2A]/35">
                Jadwal Terdekat
              </h3>
              <Link href="/dashboard/jadwal?view=calendar" className="text-[9px] font-bold uppercase tracking-tight no-underline transition-colors hover:!text-[#FF527B]" style={{color: '#FF9A9E'}}>
                Kalender
              </Link>
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
