'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminStatCard from '@/components/admin/AdminStatCard';
import FilterTabs from '@/components/admin/FilterTabs';
import StatusBadge from '@/components/admin/StatusBadge';

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
);
const ReceiptIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2Z" /><path d="M8 6h8" /><path d="M8 10h8" /><path d="M8 14h5" /></svg>
);
const WalletIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 7V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1" /><path d="M16 12h5" /><circle cx="18" cy="12" r="1" /></svg>
);
const ArrowDownIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>
);

type ReportTab = 'semua' | 'transaksi' | 'pencairan' | 'refund';

const transactions = [
  { ref: 'TRX-2026-041', type: 'Transaksi Booking', source: 'Wafa Media Studio', amount: 'Rp 5.500.000', status: 'selesai', date: '14 APR 2026' },
  { ref: 'TRX-2026-042', type: 'Pencairan Dana', source: 'Catering Jaya Raya', amount: 'Rp 12.000.000', status: 'pencairan', date: '14 APR 2026' },
  { ref: 'TRX-2026-043', type: 'Refund', source: 'Dekor Elegan', amount: 'Rp 1.250.000', status: 'refund', date: '13 APR 2026' },
];

const statusMap: Record<string, 'blue' | 'emerald' | 'red'> = {
  selesai: 'emerald',
  pencairan: 'blue',
  refund: 'red',
};

export default function AdminLaporanKeuanganPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('semua');

  const filtered = transactions.filter((transaction) => {
    if (activeTab === 'semua') return true;
    return transaction.status === activeTab;
  });

  return (
    <>
      <AdminHeader searchPlaceholder="CARI NOMOR TRANSAKSI ATAU NAMA VENDOR..." />

      <div className="p-8 pb-16">
        <div className="max-w-[1300px] mx-auto flex flex-col gap-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#2A2A2A]/40 uppercase mb-2 block">
                LAPORAN SEMUA ARUS DANA
              </span>
              <h1 className="text-4xl md:text-[2.75rem] leading-[1.05] font-black italic tracking-tighter text-[#2A2A2A]">
                LAPORAN <br /> KEUANGAN.
              </h1>
            </div>

            <div className="flex items-center bg-white rounded-full px-8 py-2 border border-gray-100 shadow-sm h-14">
              <div className="flex flex-col items-center justify-center pr-8 border-r border-gray-100">
                <span className="text-[8px] font-bold tracking-widest text-[#A8A8A8] uppercase">GMV BULAN INI</span>
                <span className="text-base font-black text-[#2A2A2A] leading-none mt-1">Rp 2.45M</span>
              </div>
              <div className="flex flex-col items-center justify-center pl-8">
                <span className="text-[8px] font-bold tracking-widest text-[#A8A8A8] uppercase">FEE PLATFORM</span>
                <span className="text-base font-black text-emerald-500 leading-none mt-1">Rp 124.5M</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <AdminStatCard icon={<TrendingUpIcon className="w-4 h-4" />} label="Total Transaksi" value="425" />
            <AdminStatCard icon={<ReceiptIcon className="w-4 h-4" />} label="Total Fee Platform" value="Rp 124.5M" valueClassName="text-[#FF9A9E]" iconWrapClassName="bg-[#FDF1F0] text-[#FF9A9E]" cardBorderClassName="border-[#FCE6E3]" />
            <AdminStatCard icon={<WalletIcon className="w-4 h-4" />} label="Total Pencairan" value="Rp 840.2M" valueClassName="text-emerald-500" iconWrapClassName="bg-emerald-50 text-emerald-500" cardBorderClassName="border-emerald-100/50" />
          </div>

          <div className="bg-white rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <FilterTabs
                active={activeTab}
                onChange={setActiveTab}
                tabs={[
                  { label: 'SEMUA', value: 'semua' },
                  { label: 'TRANSAKSI', value: 'transaksi' },
                  { label: 'PENCAIRAN', value: 'pencairan' },
                  { label: 'REFUND', value: 'refund' },
                ]}
              />

              <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">
                PERIODE: APRIL 2026
              </span>
            </div>

            <div className="flex flex-col w-full mb-10">
              <div className="flex items-center pb-5 border-b border-gray-100">
                <div className="w-[22%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">Referensi</div>
                <div className="w-[28%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">Jenis & Sumber</div>
                <div className="w-[18%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">Nominal</div>
                <div className="w-[16%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">Tanggal</div>
                <div className="w-[16%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase text-right pr-2">Status</div>
              </div>

              {filtered.map((transaction, index, arr) => (
                <div key={transaction.ref} className={`flex items-center py-5 ${index < arr.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-[#FDF1F0]/30 transition-colors rounded-xl px-2`}>
                  <div className="w-[22%] flex flex-col">
                    <span className="text-[11px] font-extrabold text-[#2A2A2A] mb-0.5 tracking-widest uppercase">{transaction.ref}</span>
                    <span className="text-[8px] font-medium text-[#2A2A2A]/30 uppercase tracking-wider">Ledger entry</span>
                  </div>
                  <div className="w-[28%] flex flex-col">
                    <span className="text-[11px] font-bold text-[#2A2A2A]">{transaction.type}</span>
                    <span className="text-[9px] font-medium text-[#2A2A2A]/40">{transaction.source}</span>
                  </div>
                  <div className="w-[18%]">
                    <span className="text-[11px] font-bold text-[#2A2A2A] tracking-wider">{transaction.amount}</span>
                  </div>
                  <div className="w-[16%]">
                    <span className="text-[10px] font-bold text-[#2A2A2A]/60 uppercase tracking-wider">{transaction.date}</span>
                  </div>
                  <div className="w-[16%] flex justify-end">
                    <StatusBadge text={transaction.status === 'selesai' ? 'SELESAI' : transaction.status === 'pencairan' ? 'PENCAIRAN' : 'REFUND'} variant={statusMap[transaction.status]} rounded="md" />
                  </div>
                </div>
              ))}
            </div>

            <AdminPagination pages={[1, 2, 3, 4]} currentPage={1} />
          </div>
        </div>
      </div>
    </>
  );
}