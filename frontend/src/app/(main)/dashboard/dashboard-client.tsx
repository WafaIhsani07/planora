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
import { useLanguage } from '@/context/LanguageContext';

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
  const [chartPoints, setChartPoints] = useState<{x: number, y: number}[]>([
    {x: 0, y: 38}, {x: 15, y: 35}, {x: 30, y: 28}, {x: 45, y: 30}, {x: 60, y: 18}, {x: 75, y: 10}, {x: 100, y: 5}
    {x: 0, y: 38}, {x: 15, y: 35}, {x: 30, y: 28}, {x: 45, y: 30}, {x: 60, y: 18}, {x: 75, y: 10}, {x: 100, y: 5}
  ]);
  const { t } = useLanguage();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [profile, bookingsData] = await Promise.all([
          getMyVendorProfile(),
          getVendorBookings(),
        ]);
        
        const bookings = Array.isArray(bookingsData) ? bookingsData : bookingsData?.data || [];

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

          // Calculate Dynamic Chart Points (Last 7 Days)
          const last7Days = Array.from({length: 7}).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
          });
          
          const revenueByDay = last7Days.map(dayStr => {
            const dailySum = validBookings
              .filter((b: any) => b.status !== 'PENDING' && b.createdAt.startsWith(dayStr))
              .reduce((sum: number, b: any) => sum + (Number(b.totalPrice) || 0), 0);
            return dailySum;
          });
          
          const maxRev = Math.max(...revenueByDay, 1000); // minimum scale
          const points = revenueByDay.map((rev, i) => {
            const x = i * (100 / 6); // 0, 16.66, 33.33... 100
            const y = 38 - (rev / maxRev) * 33; // 5 to 38
            return { x, y };
          });
          setChartPoints(points);
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
      case 'PENDING': return t('dashboard.status.pending');
      case 'CONFIRMED': return t('dashboard.status.confirmed');
      case 'IN_PROGRESS': return t('dashboard.status.inProgress');
      case 'COMPLETED': return t('dashboard.status.completed');
      case 'CANCELLED': return t('dashboard.status.cancelled');
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
      title: t('dashboard.cards.totalOrders'),
      value: stats.totalOrders.toString(),
      trend: '',
      link: t('dashboard.links.viewAll'),
      linkUrl: '/vendor/pesanan',
      icon: ShoppingBag,
      color: 'text-[#FF527B]',
      bg: 'bg-[#FCE6E3]',
    },
    {
      title: t('dashboard.cards.activeOrders'),
      value: stats.activeOrders.toString(),
      trend: '',
      link: t('dashboard.links.viewOrders'),
      linkUrl: '/vendor/pesanan?status=aktif',
      icon: Clock,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      title: t('dashboard.cards.completedOrders'),
      value: stats.completedOrders.toString(),
      trend: '',
      link: t('dashboard.links.viewHistory'),
      linkUrl: '/vendor/pesanan?status=selesai',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      title: t('dashboard.cards.totalRevenue'),
      value: formatCurrency(stats.totalRevenue),
      trend: '',
      link: t('dashboard.links.report'),
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
        <p className="text-xs font-bold uppercase tracking-widest text-[#2A2A2A]/40">{t('dashboard.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col mb-3">
        <h1 className="text-3xl md:text-[2rem] font-black tracking-[-0.04em] leading-[1.05] text-[#2A2A2A]">
          {t('dashboard.welcome')} {vendorName}!
        </h1>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2A2A2A]/35">
          {t('dashboard.manageSubtitle')}
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
            <h3 className="text-sm font-bold tracking-tight text-[#2A2A2A]">{t('dashboard.recentOrders.title')}</h3>
            <Link href="/vendor/pesanan" className="text-[10px] font-bold uppercase tracking-wide no-underline transition-colors hover:!text-[#FF527B]" style={{color: '#FF9A9E'}}>
              {t('dashboard.links.viewAll')}
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center p-6">
                <ShoppingBag className="w-10 h-10 text-slate-200 mb-3" />
                <p className="text-sm font-bold text-slate-400">{t('dashboard.recentOrders.empty')}</p>
              </div>
            ) : (
              <table className="w-full text-left table-auto border-collapse min-w-[820px]">
                <thead>
                  <tr className="bg-slate-50/40 text-[9px] lg:text-[10px] font-black text-[#2A2A2A]/30 uppercase tracking-[0.18em] border-b border-slate-50">
                    <th className="px-5 py-4 text-left">{t('dashboard.recentOrders.table.order')}</th>
                    <th className="px-5 py-4 text-left">{t('dashboard.recentOrders.table.client')}</th>
                    <th className="px-5 py-4 text-left">{t('dashboard.recentOrders.table.date')}</th>
                    <th className="px-5 py-4 text-left">{t('dashboard.recentOrders.table.package')}</th>
                    <th className="px-5 py-4 text-right min-w-[140px]">{t('dashboard.recentOrders.table.total')}</th>
                    <th className="px-5 py-4 text-center">{t('dashboard.recentOrders.table.status')}</th>
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
                          <div className="min-w-0 flex-1">
                            <h4 className="font-black text-[#2A2A2A] text-[13px] mb-0.5 truncate">{order.layanan?.name || 'Paket'}</h4>
                            <p className="text-[10px] font-bold text-[#2A2A2A]/40 tracking-widest uppercase truncate">
                              #PLR-{order.id.substring(Math.max(0, order.id.length - 6)).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-left max-w-[150px]">
                        <p className="text-[13px] font-black text-[#2A2A2A] truncate">{order.customer?.name || 'Pelanggan'}</p>
                      </td>
                      <td className="px-5 py-4 align-top text-left">
                        <div className="space-y-1">
                          <p className="text-[13px] font-black text-[#2A2A2A] whitespace-nowrap">{formatDate(order.eventDate, 'full')}</p>
                          <p className="text-[9px] font-bold text-[#2A2A2A]/40 uppercase whitespace-nowrap">{formatDate(order.eventDate, 'time')}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-left max-w-[150px]">
                        <div className="space-y-1">
                          <p className="text-[13px] font-black text-[#2A2A2A] truncate">{order.layanan?.name || 'Layanan'}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-right min-w-[140px]">
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
                {t('dashboard.revenueTitle')}
              </h3>
              <Link href="/vendor/keuangan" className="text-[9px] font-bold uppercase tracking-tight no-underline transition-colors hover:!text-[#FF527B]" style={{color: '#FF9A9E'}}>
                {t('dashboard.links.report')}
              </Link>
            </div>
            <div className="mb-8">
              <h4 className="text-3xl font-extrabold text-[#2A2A2A]">{formatCurrency(stats.totalRevenue)}</h4>
              <p className="text-[11px] font-semibold text-[#FF9A9E] mt-1">
                {t('dashboard.revenueDesc')}
              </p>
            </div>
            <div className="relative h-32 w-full bg-gradient-to-b from-[#FDF1F0] to-white rounded-xl p-4">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <line x1="0" y1="10" x2="100" y2="10" stroke="#F1D7D3" strokeWidth="0.5" />
                <line x1="0" y1="20" x2="100" y2="20" stroke="#F1D7D3" strokeWidth="0.5" />
                <line x1="0" y1="30" x2="100" y2="30" stroke="#F1D7D3" strokeWidth="0.5" />
                
                <path
                  d={`M${chartPoints.map(p => `${p.x},${p.y}`).join(' L')}`}
                  fill="none"
                  stroke="#FF527B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                <path
                  d={`M${chartPoints.map(p => `${p.x},${p.y}`).join(' L')} L100,40 L0,40 Z`}
                  fill="url(#chartGradient)"
                  opacity="0.12"
                />
                
                {chartPoints.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#FF527B" />
                ))}
                
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
                {t('dashboard.upcoming.title')}
              </h3>
              <Link href="/vendor/pesanan" className="text-[9px] font-bold uppercase tracking-tight no-underline transition-colors hover:!text-[#FF527B]" style={{color: '#FF9A9E'}}>
                {t('dashboard.links.orders')}
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
                    {upcomingEvent.eventAddress || t('dashboard.upcoming.noLocation')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400">{t('dashboard.upcoming.empty')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
