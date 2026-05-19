'use client';

import React, { useEffect, useMemo, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { getAllPayments, getMonitoringStats } from '@/services/admin.service';

type ReportTab = 'semua' | 'paid' | 'pending' | 'refund' | 'failed';

type PaymentRow = {
  id: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  amount: number;
  method: string;
  createdAt: string;
  booking?: {
    id: string;
    customer?: { id: string; name?: string | null; email?: string | null };
    vendor?: { id: string; businessName?: string | null };
    layanan?: { id: string; name?: string | null };
  };
};

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
);
const ReceiptIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2Z" /><path d="M8 6h8" /><path d="M8 10h8" /><path d="M8 14h5" /></svg>
);
const WalletIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 7V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1" /><path d="M16 12h5" /><circle cx="18" cy="12" r="1" /></svg>
);
const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

function formatRangeDate(dateString: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

function shortenId(id?: string | null) {
  if (!id) return '-';
  if (id.length <= 14) return id;
  const start = id.slice(0, 6);
  const end = id.slice(-4);
  return `${start}...${end}`;
}

const statusMap: Record<PaymentRow['status'], 'blue' | 'emerald' | 'red'> = {
  PENDING: 'blue',
  PAID: 'emerald',
  FAILED: 'red',
  REFUNDED: 'red',
};

const tabToStatus: Record<ReportTab, PaymentRow['status'] | null> = {
  semua: null,
  paid: 'PAID',
  pending: 'PENDING',
  refund: 'REFUNDED',
  failed: 'FAILED',
};

export default function AdminLaporanKeuanganPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('semua');
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [monthOpen, setMonthOpen] = useState(false);
  const [currentYearView, setCurrentYearView] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const fetchFinancialData = async () => {
      setIsLoading(true);
      try {
        const [monitoringStats, paymentResult] = await Promise.all([
          getMonitoringStats(),
          getAllPayments({ page: 1, limit: 100 }),
        ]);

        setStats(monitoringStats);
        setPayments((paymentResult.payments ?? []) as PaymentRow[]);
      } catch (error) {
        console.error('Gagal mengambil laporan keuangan:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [activeTab, perPage]);

  // default selected month to the latest payment's month after payments load
  useEffect(() => {
    if (!payments || payments.length === 0) return;
    const latest = payments.reduce((a, b) => (new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? a : b));
    const d = new Date(latest.createdAt);
    const firstOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    setSelectedMonth(firstOfMonth);
    setCurrentYearView(firstOfMonth.getFullYear());
  }, [payments]);

  useEffect(() => {
    if (selectedMonth) setCurrentYearView(selectedMonth.getFullYear());
  }, [selectedMonth]);

  function formatMonthLabel(date: Date) {
    return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
  }

  const months = useMemo(() => {
    if (!payments || payments.length === 0) {
      // fallback: current year months
      const now = new Date();
      return Array.from({ length: now.getMonth() + 1 }, (_, i) => new Date(now.getFullYear(), i, 1));
    }

    const years = payments.map((p) => new Date(p.createdAt).getFullYear());
    const earliestInData = Math.min(...years);
    const latest = Math.max(...years);
    // ensure previous year is always included
    const earliest = Math.min(earliestInData, latest - 1);

    const list: Date[] = [];
    for (let y = latest; y >= earliest; y--) {
      // months from January (0) to December (11) so they appear starting with Januari
      for (let m = 0; m < 12; m++) {
        // only include months up to current month for the latest year
        if (y === new Date().getFullYear() && m > new Date().getMonth()) break;
        list.push(new Date(y, m, 1));
      }
    }

    return list;
  }, [payments]);

  const groupedMonths = useMemo(() => {
    const map = new Map<number, Date[]>();
    months.forEach((m) => {
      const y = m.getFullYear();
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(m);
    });

    return Array.from(map.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([year, ms]) => ({ year, months: ms.sort((a, b) => a.getMonth() - b.getMonth()) }));
  }, [months]);

  const filteredPayments = useMemo(() => {
    // apply month filter first
    let list = payments;
    if (selectedMonth) {
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth();
      const start = new Date(year, month, 1).getTime();
      const end = new Date(year, month + 1, 0, 23, 59, 59).getTime();
      list = list.filter((p) => {
        const t = new Date(p.createdAt).getTime();
        return t >= start && t <= end;
      });
    }

    const targetStatus = tabToStatus[activeTab];
    if (!targetStatus) return list;
    return list.filter((payment) => payment.status === targetStatus);
  }, [payments, activeTab, selectedMonth]);

  const counts = useMemo(() => ({
    semua: payments.length,
    paid: payments.filter((payment) => payment.status === 'PAID').length,
    pending: payments.filter((payment) => payment.status === 'PENDING').length,
    refund: payments.filter((payment) => payment.status === 'REFUNDED').length,
    failed: payments.filter((payment) => payment.status === 'FAILED').length,
  }), [payments]);

  const paidTotal = payments.filter((payment) => payment.status === 'PAID').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const pendingTotal = payments.filter((payment) => payment.status === 'PENDING').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const refundedTotal = payments.filter((payment) => payment.status === 'REFUNDED').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const failedTotal = payments.filter((payment) => payment.status === 'FAILED').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const sortedPayments = [...payments].sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime());
  const periodStart = sortedPayments[0]?.createdAt ?? new Date().toISOString();
  const periodEnd = sortedPayments[sortedPayments.length - 1]?.createdAt ?? new Date().toISOString();

  const total = filteredPayments.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const startIndex = total === 0 ? 0 : (page - 1) * perPage + 1;
  const endIndex = total === 0 ? 0 : Math.min(page * perPage, total);
  const pagedPayments = filteredPayments.slice((page - 1) * perPage, page * perPage);
  const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1);

  const totalTransactions = Number(stats?.totalTransactions ?? payments.length);
  const totalRevenue = Number(stats?.totalRevenue ?? paidTotal);
  const refundedCount = Number(stats?.refundedCount ?? counts.refund);

  const handleDownloadReport = () => {
    const rows = [
      ['Invoice', 'Vendor', 'Customer', 'Layanan', 'Nominal', 'Status', 'Tanggal'],
      ...filteredPayments.map((payment) => [
        payment.booking?.id ?? payment.id,
        payment.booking?.vendor?.businessName ?? '-',
        payment.booking?.customer?.name ?? payment.booking?.customer?.email ?? '-',
        payment.booking?.layanan?.name ?? '-',
        String(payment.amount ?? 0),
        payment.status,
        payment.createdAt,
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan-keuangan-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FDF1F0]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#FF9A9E]" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader hideSearch />

      <div className="flex-1 overflow-y-auto p-8 pb-16">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A8A8A8]">
                LAPORAN KEUANGAN
              </span>
              <h1 className="mt-2 text-3xl md:text-4xl font-black text-[#2A2A2A]">
                Laporan Keuangan
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#6B6B6B]">
                Ringkasan pemasukan, komisi, dan status transaksi dalam periode tertentu.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMonthOpen((v) => !v)}
                  className="inline-flex h-14 items-center gap-3 rounded-2xl border border-[#E6E8EB] bg-white px-5 text-sm font-bold text-[#2A2A2A] shadow-sm transition-colors hover:bg-gray-50"
                >
                  <svg className="h-5 w-5 text-[#A8A8A8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M3 10h18" />
                  </svg>
                  {selectedMonth ? formatMonthLabel(selectedMonth) : `${formatRangeDate(periodStart)} - ${formatRangeDate(periodEnd)}`}
                  <svg className="h-4 w-4 text-[#A8A8A8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {monthOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border bg-white p-3 shadow-lg">
                    <div className="flex items-center justify-between px-3">
                      <button type="button" onClick={() => setCurrentYearView((y) => y - 1)} className="p-1 text-sm text-[#6B6B6B] hover:bg-gray-100 rounded">‹</button>
                      <div className="text-sm font-bold">{currentYearView}</div>
                      <button type="button" onClick={() => setCurrentYearView((y) => y + 1)} className="p-1 text-sm text-[#6B6B6B] hover:bg-gray-100 rounded">›</button>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 px-1">
                      {Array.from({ length: 12 }).map((_, idx) => {
                        const monthDate = new Date(currentYearView, idx, 1);
                        const isFuture = monthDate.getFullYear() > new Date().getFullYear() || (monthDate.getFullYear() === new Date().getFullYear() && monthDate.getMonth() > new Date().getMonth());
                        const isSelected = selectedMonth && selectedMonth.getFullYear() === monthDate.getFullYear() && selectedMonth.getMonth() === monthDate.getMonth();
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => { if (!isFuture) { setSelectedMonth(monthDate); setMonthOpen(false); } }}
                            disabled={isFuture}
                            className={`flex items-center justify-center rounded-md px-2 py-2 text-sm ${isSelected ? 'bg-[#F4F6F7] font-bold' : 'hover:bg-gray-50'} ${isFuture ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            {new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(monthDate)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleDownloadReport}
                className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-[#FFB3BE] bg-white px-6 text-sm font-bold text-[#FF5E7E] transition-colors hover:bg-[#FFF5F6]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v12" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
                Unduh Laporan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard icon={<TrendingUpIcon className="h-4 w-4" />} label="Total Pemasukan" value={formatCurrency(totalRevenue)} valueClassName="text-[#2A2A2A]" iconWrapClassName="bg-[#FFF5F6] text-[#FF5E7E]" cardBorderClassName="border-[#FCE6E3]" />
            <AdminStatCard icon={<ReceiptIcon className="h-4 w-4" />} label="Total Komisi Planora" value={formatCurrency(Math.round(totalRevenue * 0.05))} valueClassName="text-[#2A2A2A]" iconWrapClassName="bg-emerald-50 text-emerald-500" cardBorderClassName="border-emerald-100/50" />
            <AdminStatCard icon={<WalletIcon className="h-4 w-4" />} label="Dana Tertahan (Escrow)" value={formatCurrency(pendingTotal)} valueClassName="text-[#2A2A2A]" iconWrapClassName="bg-blue-50 text-blue-500" cardBorderClassName="border-blue-100/50" />
            <AdminStatCard icon={<ClockIcon className="h-4 w-4" />} label="Transaksi Berhasil" value={String(counts.paid)} valueClassName="text-[#2A2A2A]" iconWrapClassName="bg-violet-50 text-violet-500" cardBorderClassName="border-violet-100/50" />
          </div>

          {/* Search box moved below stat cards (sentence case placeholder) */}
          <div className="mt-6 w-full">
            <div className="relative w-full">
              <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D8A7A0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <input
                type="text"
                placeholder="Cari nomor transaksi atau nama vendor..."
                aria-label="Cari nomor transaksi atau nama vendor"
                className="w-full rounded-2xl border border-[#F4D7D4] bg-white/80 py-3 pl-12 pr-4 text-sm font-semibold text-[#2A2A2A] placeholder-[#D8A7A0] transition-all focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/15"
              />
            </div>
          </div>

          <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)]">
            <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex flex-wrap items-center gap-3">
                {([
                  { label: 'SEMUA', value: 'semua' },
                  { label: 'SUKSES', value: 'paid' },
                  { label: 'MENUNGGU', value: 'pending' },
                  { label: 'REFUND', value: 'refund' },
                  { label: 'GAGAL', value: 'failed' },
                ] as Array<{ label: string; value: ReportTab }>).map((tab) => {
                  const active = activeTab === tab.value;
                  const count = counts[tab.value];

                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setActiveTab(tab.value)}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${active ? 'bg-[#FF9A9E] text-white shadow-[0_8px_24px_-6px_rgba(255,94,126,0.24)]' : 'border border-[#F4D7D4] bg-white text-[#A8A8A8]'}`}
                    >
                      <span>{tab.label}</span>
                      <span className={`${active ? 'bg-white text-[#FF5E7E]' : 'bg-[#F4F4F6] text-[#A8A8A8]'} flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* label removed per request */}
            </div>

            <div className="mb-10 flex flex-col w-full">
              <div className="flex items-center border-b border-gray-100 pb-5">
                <div className="w-[18%] text-[9px] font-bold uppercase tracking-[0.2em] text-[#A8A8A8]">Invoice</div>
                <div className="w-[24%] text-[9px] font-bold uppercase tracking-[0.2em] text-[#A8A8A8]">Vendor</div>
                <div className="w-[20%] text-[9px] font-bold uppercase tracking-[0.2em] text-[#A8A8A8]">Customer</div>
                <div className="w-[14%] text-[9px] font-bold uppercase tracking-[0.2em] text-[#A8A8A8]">Nominal</div>
                <div className="w-[14%] text-[9px] font-bold uppercase tracking-[0.2em] text-[#A8A8A8]">Tanggal</div>
                <div className="w-[10%] pr-2 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-[#A8A8A8]">Status</div>
              </div>

              {pagedPayments.length === 0 ? (
                <div className="py-20 text-center text-xs font-bold uppercase tracking-widest text-slate-300">
                  Tidak ada transaksi pada filter ini
                </div>
              ) : (
                pagedPayments.map((payment, index) => (
                  <div key={payment.id} className={`flex items-center rounded-xl px-2 py-5 transition-colors hover:bg-[#FDF1F0]/30 ${index < pagedPayments.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="flex w-[18%] min-w-0 flex-col">
                        <span title={payment.booking?.id ?? payment.id} className="mb-0.5 text-[11px] font-extrabold uppercase tracking-widest text-[#2A2A2A] truncate">
                          {shortenId(payment.booking?.id ?? payment.id)}
                        </span>
                        <span className="text-[8px] font-medium uppercase tracking-wider text-[#2A2A2A]/30 truncate">
                          {payment.method}
                        </span>
                      </div>
                    <div className="flex w-[24%] flex-col">
                      <span className="text-[11px] font-bold text-[#2A2A2A]">
                        {payment.booking?.vendor?.businessName ?? '-'}
                      </span>
                      <span className="text-[9px] font-medium text-[#2A2A2A]/40">{payment.booking?.layanan?.name ?? 'Layanan belum tercatat'}</span>
                    </div>
                    <div className="flex w-[20%] flex-col">
                      <span className="text-[11px] font-bold text-[#2A2A2A]">
                        {payment.booking?.customer?.name ?? '-'}
                      </span>
                      <span className="text-[9px] font-medium text-[#2A2A2A]/40">
                        {payment.booking?.customer?.email ?? '-'}
                      </span>
                    </div>
                    <div className="w-[14%]">
                      <span className="text-[11px] font-bold tracking-wider text-[#2A2A2A]">
                        {formatCurrency(Number(payment.amount || 0))}
                      </span>
                    </div>
                    <div className="w-[14%]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A2A2A]/60">
                        {formatDate(payment.createdAt)}
                      </span>
                    </div>
                    <div className="flex w-[10%] justify-end">
                      <StatusBadge
                        text={payment.status === 'PAID' ? 'SUKSES' : payment.status === 'PENDING' ? 'MENUNGGU' : payment.status === 'REFUNDED' ? 'REFUND' : 'GAGAL'}
                        variant={statusMap[payment.status]}
                        rounded="md"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-col gap-4 border-t border-[#F4D7D4]/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="text-sm font-semibold text-[#A8A8A8]">
                Menampilkan {startIndex} - {endIndex} dari {total} data
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border border-[#E6E8EB] bg-white text-[#A8A8A8] transition-colors ${page === 1 ? 'cursor-not-allowed opacity-40' : 'hover:bg-gray-50 hover:text-[#2A2A2A]'}`}
                  aria-label="Sebelumnya"
                >
                  ‹
                </button>

                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold transition-colors ${pageNumber === page ? 'border-[#FF9A9E] bg-[#FF9A9E] text-white' : 'border-[#E6E8EB] bg-white text-[#2A2A2A] hover:bg-gray-50'}`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page >= totalPages}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border border-[#E6E8EB] bg-white text-[#A8A8A8] transition-colors ${page >= totalPages ? 'cursor-not-allowed opacity-40' : 'hover:bg-gray-50 hover:text-[#2A2A2A]'}`}
                  aria-label="Selanjutnya"
                >
                  ›
                </button>
              </div>

              <div className="relative self-start sm:self-auto">
                <select
                  value={perPage}
                  onChange={(event) => setPerPage(Number(event.target.value))}
                  className="appearance-none rounded-xl border border-[#E6E8EB] bg-white px-4 py-2 pr-10 text-sm font-semibold text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/15"
                >
                  <option value={10}>10 / halaman</option>
                  <option value={20}>20 / halaman</option>
                  <option value={30}>30 / halaman</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8A8A8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
