'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Download,
  HandCoins,
  CheckCircle,
  Terminal,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
  ShieldCheck,
} from 'lucide-react';

type AdminDashboardViewProps = {
  stats: any;
  pendingVendors: any[];
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatNumber(value: number | string) {
  return new Intl.NumberFormat('id-ID').format(Number(value ?? 0));
}

function formatDashboardDate(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export default function AdminDashboardView({ stats, pendingVendors }: AdminDashboardViewProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const totalRevenue = Number(stats?.totalRevenue ?? 0);
  const totalBookings = Number(stats?.totalBookings ?? 0);
  const totalUsers = Number(stats?.totalUsers ?? 0);
  const pendingVendorCount = Number(stats?.pendingVendors ?? pendingVendors.length ?? 0);
  const totalVendors = Number(stats?.totalVendors ?? Math.max(pendingVendors.length, pendingVendorCount));
  const escrowValue = Number(stats?.escrowBalance ?? Math.max(totalRevenue * 0.017, 0));
  const readyToWithdraw = Number(stats?.readyToWithdraw ?? 4275000);
  const monthlyCommission = Number(stats?.monthlyCommission ?? 2000000);
  const pendingPayments = Number(stats?.pendingPayments ?? 18);

  const activityItems = [
    { title: 'Vendor baru mendaftar', subtitle: pendingVendors[0]?.businessName ?? 'Eterna Photography', time: '10 menit yang lalu', icon: UserPlus, tone: 'pink' },
    { title: 'Pembayaran DP dikonfirmasi', subtitle: 'ORD-240518-021', time: '25 menit yang lalu', icon: CheckCircle, tone: 'emerald' },
    { title: 'Pesanan selesai', subtitle: 'ORD-240517-018', time: '1 jam yang lalu', icon: ClipboardList, tone: 'violet' },
    { title: 'Pencairan dana ke vendor', subtitle: 'Wafa Decoration', time: '2 jam yang lalu', icon: HandCoins, tone: 'blue' },
    { title: 'Ulasan baru diterima', subtitle: 'dari Andini Putri', time: '3 jam yang lalu', icon: Terminal, tone: 'amber' },
  ];

  const taskCards = [
    { title: 'Menunggu Verifikasi Vendor', value: formatNumber(pendingVendorCount), icon: UserCheck, tone: 'red', href: '/admin/verifikasi' },
    { title: 'Menunggu Verifikasi Pembayaran', value: formatNumber(pendingPayments), icon: CreditCard, tone: 'indigo', href: '/admin/verifikasi-pembayaran' },
    { title: 'Dana Siap Dicairkan', value: formatCurrency(readyToWithdraw), icon: Download, tone: 'amber', href: '/admin/pencairan-dana' },
    { title: 'Komisi Platform Bulan Ini', value: formatCurrency(monthlyCommission), icon: Terminal, tone: 'violet', href: '/admin/laporan-keuangan' },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentDate(new Date());
    }, 60 * 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 bg-[#FDF1F0] p-8 lg:p-10">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-[2rem] font-black tracking-[-0.04em] leading-[1.05] text-[#2A2A2A]">
              Selamat datang, Admin Planora! 👋
            </h1>
            <p className="mt-1 text-[13px] font-semibold text-[#2A2A2A]/70 md:text-sm">
              Berikut ringkasan aktivitas platform Planora hari ini.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#F4D7D4] bg-white px-4 py-3 shadow-sm">
            <Calendar className="h-4 w-4 text-[#A8A8A8]" />
            <span className="text-xs font-extrabold text-[#2A2A2A]">{formatDashboardDate(currentDate)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 xl:grid-cols-5">
          {[
            { label: 'Total Vendor', value: formatNumber(totalVendors), icon: TrendingUp, iconWrap: 'bg-red-50 text-red-500', hint: '12% dari minggu lalu' },
            { label: 'Total Customer', value: formatNumber(totalUsers), icon: Users, iconWrap: 'bg-indigo-50 text-indigo-500', hint: '16% dari minggu lalu' },
            { label: 'Total Pesanan', value: formatNumber(totalBookings), icon: ClipboardList, iconWrap: 'bg-amber-50 text-amber-500', hint: '18% dari minggu lalu' },
            { label: 'Total Pendapatan', value: formatCurrency(totalRevenue), icon: Wallet, iconWrap: 'bg-emerald-50 text-emerald-500', hint: '20% dari minggu lalu' },
            { label: 'Dana Ditanam (Escrow)', value: formatCurrency(escrowValue), icon: ShieldCheck, iconWrap: 'bg-amber-50 text-amber-500', hint: '20% dari minggu lalu' },
          ].map((card) => {
            const Icon = card.icon;
            const compact = card.label === 'Total Pendapatan' || card.label === 'Dana Ditanam (Escrow)';

            return (
              <div key={card.label} className="flex h-40 flex-col justify-between rounded-2xl border border-[#F4D7D4] bg-white p-5 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)]">
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl p-2.5 ${card.iconWrap}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#A8A8A8]">{card.label}</span>
                </div>
                <div>
                  <h3 className={`font-black tracking-tight text-[#2A2A2A] ${compact ? 'text-xl xl:text-2xl' : 'text-2xl'}`}>{card.value}</h3>
                  <p className="mt-2 flex items-center gap-1 text-[9px] font-bold text-emerald-500">
                    <TrendingUp className="h-3 w-3" /> {card.hint}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="h-full space-y-6 rounded-2xl border border-[#F4D7D4] bg-white p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] lg:col-span-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-wider text-[#2A2A2A]">Grafik Pendapatan</h4>
              <div className="relative">
                <select className="appearance-none rounded-xl border border-[#F4D7D4] bg-[#FDF1F0] px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-[#A8A8A8] focus:outline-none">
                  <option>7 Hari Terakhir</option>
                  <option>30 Hari Terakhir</option>
                </select>
              </div>
            </div>

            <div className="relative pt-4">
              <svg viewBox="0 0 500 200" className="mx-auto h-56 w-full max-w-[760px] overflow-visible md:h-60">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF9A9E" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#FF9A9E" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="40" x2="500" y2="40" stroke="#F4D7D4" strokeWidth="1.5" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#F4D7D4" strokeWidth="1.5" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#F4D7D4" strokeWidth="1.5" />
                <line x1="0" y1="160" x2="500" y2="160" stroke="#F4D7D4" strokeWidth="1.5" />
                <path d="M 0 130 C 40 100, 45 150, 80 160 C 120 170, 140 130, 160 130 C 180 130, 200 130, 220 120 C 240 110, 260 80, 280 90 C 310 100, 330 110, 350 100 C 370 90, 410 40, 440 20 L 440 200 L 0 200 Z" fill="url(#chartGradient)" />
                <path d="M 0 130 C 40 100, 45 150, 80 160 C 120 170, 140 130, 160 130 C 180 130, 200 130, 220 120 C 240 110, 260 80, 280 90 C 310 100, 330 110, 350 100 C 370 90, 410 40, 440 20" fill="none" stroke="#FF9A9E" strokeWidth="3" />
                <circle cx="0" cy="130" r="5" fill="#FF9A9E" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="80" cy="160" r="5" fill="#FF9A9E" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="160" cy="130" r="5" fill="#FF9A9E" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="220" cy="120" r="5" fill="#FF9A9E" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="280" cy="90" r="5" fill="#FF9A9E" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="350" cy="100" r="5" fill="#FF9A9E" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="440" cy="20" r="5" fill="#FF9A9E" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
              <div className="mx-auto flex max-w-[760px] justify-between px-1 pt-3 text-[10px] font-extrabold text-[#A8A8A8]">
                <span>12 Mei</span>
                <span>13 Mei</span>
                <span>14 Mei</span>
                <span>15 Mei</span>
                <span>16 Mei</span>
                <span>17 Mei</span>
                <span>18 Mei</span>
              </div>
            </div>
          </div>

          <div className="h-full space-y-6 rounded-2xl border border-[#F4D7D4] bg-white p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] lg:col-span-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-wider text-[#2A2A2A]">Aktivitas Terbaru</h4>
              <button type="button" className="text-xs font-bold uppercase tracking-wider text-[#FF9A9E] hover:underline">
                Lihat Semua
              </button>
            </div>

            <div className="space-y-4">
              {activityItems.map((item) => {
                const Icon = item.icon;
                const toneClass = item.tone === 'emerald'
                  ? 'bg-emerald-50 text-emerald-500'
                  : item.tone === 'violet'
                    ? 'bg-purple-50 text-purple-500'
                    : item.tone === 'blue'
                      ? 'bg-blue-50 text-blue-500'
                      : item.tone === 'amber'
                        ? 'bg-amber-50 text-amber-500'
                        : 'bg-pink-50 text-pink-500';

                return (
                  <div key={item.title} className="flex items-start gap-3.5">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="text-[11px] font-black leading-tight text-[#2A2A2A]">{item.title}</p>
                      <p className="mt-0.5 truncate text-[10px] font-bold text-[#A8A8A8]">{item.subtitle}</p>
                    </div>
                    <span className="mt-0.5 shrink-0 text-[9px] font-bold text-[#C7B5B0]">{item.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-8 pb-4 lg:grid-cols-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 lg:col-span-12">
            {taskCards.map((task) => {
              const Icon = task.icon;
              const iconClass = task.tone === 'indigo' ? 'bg-indigo-50 text-indigo-500' : task.tone === 'amber' ? 'bg-amber-50 text-amber-500' : task.tone === 'violet' ? 'bg-purple-50 text-purple-500' : 'bg-red-50 text-red-500';

              return (
                <div key={task.title} className="group flex h-40 flex-col justify-between rounded-2xl border border-[#F4D7D4] bg-white p-5 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)]">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#A8A8A8] leading-none">{task.title}</p>
                    <h3 className="text-2xl font-black text-[#2A2A2A]">{task.value}</h3>
                  </div>
                  <Link href={task.href} className="mt-2 flex items-center gap-1.5 text-left text-[10px] font-black uppercase tracking-widest text-[#FF9A9E] transition-colors hover:text-[#FF527B]">
                    Lihat detail
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
