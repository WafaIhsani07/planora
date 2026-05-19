'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  CreditCard,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { getVendorBookings, getMyVendorProfile } from '@/services/vendor.service';

export default function DashboardClient() {
  const [vendorName, setVendorName] = useState('Vendor');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [upcomingEvent, setUpcomingEvent] = useState<any>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [profile, bookings] = await Promise.all([
          getMyVendorProfile(),
          getVendorBookings(),
        ]);

        if (profile?.businessName) {
          setVendorName(profile.businessName);
        }

        if (bookings && Array.isArray(bookings)) {
          // Calculate Stats
          const validBookings = bookings.filter((b: any) => b.status !== 'CANCELLED');
          const activeBookings = bookings.filter((b: any) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS');
          const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED');
          
          const totalRevenue = bookings
            .filter((b: any) => b.status !== 'PENDING' && b.status !== 'CANCELLED')
            .reduce((sum: number, b: any) => sum + (Number(b.totalPrice) || 0), 0);

          setStats({
            totalOrders: validBookings.length,
            activeOrders: activeBookings.length,
            completedOrders: completedBookings.length,
            totalRevenue,
          });

          // Recent Orders (Last 3 valid bookings)
          const sortedRecent = [...validBookings].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRecentOrders(sortedRecent.slice(0, 3));

          // Upcoming Event
          const sortedUpcoming = [...activeBookings].sort(
            (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
          );
          if (sortedUpcoming.length > 0) {
            setUpcomingEvent(sortedUpcoming[0]);
          }
        }
      } catch (error) {
        console.error('Gagal memuat data dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string, format: 'full' | 'day' | 'month' | 'time') => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (format === 'full') {
      return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    }
    if (format === 'day') {
      return date.getDate().toString();
    }
    if (format === 'month') {
      return new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(date);
    }
    if (format === 'time') {
      return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(date) + ' WIB';
    }
    return '';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Menunggu';
      case 'CONFIRMED': return 'Dikonfirmasi';
      case 'IN_PROGRESS': return 'Berjalan';
      case 'COMPLETED': return 'Selesai';
      case 'CANCELLED': return 'Dibatalkan';
      default: return status;
    }
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
      case 'CANCELLED':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-slate-100 text-slate-400';
    }
  };

  const summaryCards = [
    {
      title: 'Total Pesanan',
      value: stats.totalOrders.toString(),
      trend: '',
      link: 'Lihat semua',
      linkUrl: '/vendor/pesanan',
      icon: ShoppingBag,
      color: 'text-[#FF527B]',
      bg: 'bg-[#FCE6E3]',
    },
    {
      title: 'Pesanan Aktif',
      value: stats.activeOrders.toString(),
      trend: '',
      link: 'Lihat pesanan',
      linkUrl: '/vendor/pesanan?status=aktif',
      icon: Clock,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      title: 'Pesanan Selesai',
      value: stats.completedOrders.toString(),
      trend: '',
      link: 'Lihat riwayat',
      linkUrl: '/vendor/pesanan?status=selesai',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Total Pendapatan',
      value: formatCurrency(stats.totalRevenue),
      trend: '',
      link: 'Laporan',
      linkUrl: '/vendor/keuangan',
      icon: CreditCard,
      color: 'text-[#FF527B]',
      bg: 'bg-[#FCE6E3]',
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40" data-testid="loading-spinner">
        <RefreshCw className="w-12 h-12 text-[#FF9A9E] animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-[#2A2A2A]/40">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col mb-3">
        <h1 className="text-3xl md:text-[2rem] font-extrabold tracking-tight leading-tight text-[#2A2A2A]">
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
                <Link href={card.linkUrl} className="text-[9px] font-bold text-[#FF9A9E] uppercase tracking-tight hover:underline">
                  {card.link}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Grid Utama (Pesanan & Grafik) */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* Recent Orders Section */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#2A2A2A]/5 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-slate-50">
            <h3 className="text-sm font-bold tracking-tight text-[#2A2A2A]">Pesanan Terbaru</h3>
            <Link href="/vendor/pesanan" className="text-[10px] font-bold uppercase tracking-wide no-underline transition-colors hover:!text-[#FF527B]" style={{color: '#FF9A9E'}}>
              LIHAT SEMUA
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center p-6">
                <ShoppingBag className="w-10 h-10 text-slate-200 mb-3" />
                <p className="text-sm font-bold text-slate-400">Belum ada pesanan terbaru.</p>
              </div>
            ) : (
              <table className="w-full text-left table-fixed border-collapse min-w-[820px] lg:min-w-0">
                <thead>
                  <tr className="bg-slate-50/40 text-[9px] lg:text-[10px] font-black text-[#2A2A2A]/30 uppercase tracking-[0.18em] border-b border-slate-50">
                    <th className="px-5 py-4 text-center">Pesanan</th>
                    <th className="px-5 py-4 text-center">Klien</th>
                    <th className="px-5 py-4 text-center">Tanggal Acara</th>
                    <th className="px-5 py-4 text-center">Paket</th>
                    <th className="px-5 py-4 text-center min-w-[140px]">Total</th>
                    <th className="px-5 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => (
                    <tr key={order.id} className="group hover:bg-[#FDF1F0]/20 transition-all border-b border-slate-50 last:border-0">
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-3">
                          <img
                            src={order.layanan?.images?.[0] || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=200"}
                            className="w-10 h-10 flex-shrink-0 rounded-lg object-cover shadow-sm transition-transform group-hover:scale-105"
                            alt="Acara"
                          />
                          <div>
                            <h4 className="font-black text-[#2A2A2A] text-[13px] mb-0.5 truncate max-w-[120px]">{order.layanan?.name || 'Paket'}</h4>
                            <p className="text-[10px] font-bold text-[#2A2A2A]/40 tracking-widest uppercase">
                              #PLR-{order.id.substring(Math.max(0, order.id.length - 6)).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-center">
                        <p className="text-[13px] font-black text-[#2A2A2A] truncate">{order.customer?.name || 'Pelanggan'}</p>
                      </td>
                      <td className="px-5 py-4 align-top text-center">
                        <div className="space-y-1">
                          <p className="text-[13px] font-black text-[#2A2A2A] whitespace-nowrap">{formatDate(order.eventDate, 'full')}</p>
                          <p className="text-[9px] font-bold text-[#2A2A2A]/40 uppercase whitespace-nowrap">{formatDate(order.eventDate, 'time')}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-center">
                        <div className="space-y-1">
                          <p className="text-[13px] font-black text-[#2A2A2A] truncate max-w-[100px] mx-auto">{order.layanan?.name || 'Layanan'}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-center min-w-[140px]">
                        <p className="text-[13px] font-black text-[#2A2A2A] whitespace-nowrap">{formatCurrency(order.totalPrice)}</p>
                      </td>
                      <td className="px-5 py-4 align-top text-center">
                        <div className={`inline-block px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-wider whitespace-nowrap ${getStatusStyle(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column - Revenue & Schedule */}
        <div className="lg:col-span-5 space-y-4">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-xl border border-[#2A2A2A]/5 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#2A2A2A]/35">
                Total Pendapatan
              </h3>
              <Link href="/vendor/keuangan" className="text-[9px] font-bold uppercase tracking-tight no-underline transition-colors hover:!text-[#FF527B]" style={{color: '#FF9A9E'}}>
                Laporan
              </Link>
            </div>
            <div className="mb-8">
              <h4 className="text-3xl font-extrabold text-[#2A2A2A]">{formatCurrency(stats.totalRevenue)}</h4>
              <p className="text-[11px] font-semibold text-[#FF9A9E] mt-1">
                Akumulasi seluruh transaksi berjalan
              </p>
            </div>
            <div className="relative h-32 w-full bg-gradient-to-b from-[#FDF1F0] to-white rounded-xl p-4">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <line x1="0" y1="10" x2="100" y2="10" stroke="#F1D7D3" strokeWidth="0.5" />
                <line x1="0" y1="20" x2="100" y2="20" stroke="#F1D7D3" strokeWidth="0.5" />
                <line x1="0" y1="30" x2="100" y2="30" stroke="#F1D7D3" strokeWidth="0.5" />
                
                <path
                  d="M0,38 L15,35 L30,28 L45,30 L60,18 L75,10 L100,5"
                  fill="none"
                  stroke="#FF527B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                <path
                  d="M0,38 L15,35 L30,28 L45,30 L60,18 L75,10 L100,5 L100,40 L0,40 Z"
                  fill="url(#chartGradient)"
                  opacity="0.12"
                />
                
                <circle cx="15" cy="35" r="2" fill="#FF527B" />
                <circle cx="45" cy="30" r="2" fill="#FF527B" />
                <circle cx="75" cy="10" r="2" fill="#FF527B" />
                <circle cx="100" cy="5" r="2" fill="#FF527B" />
                
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FF527B', stopOpacity: 0.4 }} />
                    <stop offset="100%" style={{ stopColor: '#FF527B', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="bg-white p-6 rounded-xl border border-[#2A2A2A]/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#2A2A2A]/35">
                Jadwal Terdekat
              </h3>
              <Link href="/vendor/pesanan" className="text-[9px] font-bold uppercase tracking-tight no-underline transition-colors hover:!text-[#FF527B]" style={{color: '#FF9A9E'}}>
                Pesanan
              </Link>
            </div>
            
            {upcomingEvent ? (
              <div className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                <div className="w-14 h-14 bg-[#FCE6E3] rounded-xl flex flex-col items-center justify-center border border-[#FF9A9E]/20 flex-shrink-0">
                  <span className="text-lg font-bold text-[#FF527B]">{formatDate(upcomingEvent.eventDate, 'day')}</span>
                  <span className="text-[9px] font-bold uppercase text-[#FF527B] tracking-tight">
                    {formatDate(upcomingEvent.eventDate, 'month')}
                  </span>
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-[#2A2A2A] truncate mb-0.5">
                    {upcomingEvent.layanan?.name || 'Pesanan'} - {upcomingEvent.customer?.name}
                  </h4>
                  <p className="text-[9px] font-semibold text-[#2A2A2A]/40 flex items-center gap-2 mb-0.5">
                    <Clock className="w-3 h-3" /> {formatDate(upcomingEvent.eventDate, 'time')}
                  </p>
                  <p className="text-[9px] font-semibold text-[#2A2A2A]/40 truncate pr-2">
                    {upcomingEvent.eventAddress || 'Lokasi belum diatur'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400">Belum ada jadwal acara terdekat.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
