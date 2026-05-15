'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminStatCard from '@/components/admin/AdminStatCard';
import FilterTabs from '@/components/admin/FilterTabs';
import StatusBadge from '@/components/admin/StatusBadge';

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
);
const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
);
const XCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
);
const EyeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);

type PaymentTab = 'semua' | 'menunggu' | 'valid' | 'ditolak';

const payments = [
  { invoice: 'INV/2026/04/021', vendor: 'Wafa Media Studio', customer: 'Andi Pratama', amount: 'Rp 5.500.000', method: 'Transfer BCA', status: 'valid', date: '14 APR 2026' },
  { invoice: 'INV/2026/04/022', vendor: 'Catering Jaya Raya', customer: 'Siti Aminah', amount: 'Rp 12.000.000', method: 'Transfer Mandiri', status: 'menunggu', date: '14 APR 2026' },
  { invoice: 'INV/2026/04/023', vendor: 'Dekor Elegan', customer: 'Budi Santoso', amount: 'Rp 7.500.000', method: 'Virtual Account', status: 'ditolak', date: '13 APR 2026' },
];

const statusMap: Record<string, 'blue' | 'emerald' | 'red'> = {
  valid: 'emerald',
  menunggu: 'blue',
  ditolak: 'red',
};

export default function AdminVerifikasiPembayaranPage() {
  const [activeTab, setActiveTab] = useState<PaymentTab>('semua');

  const filteredPayments = payments.filter((payment) => {
    if (activeTab === 'semua') return true;
    return payment.status === activeTab;
  });

  return (
    <>
      <AdminHeader searchPlaceholder="CARI INVOICE ATAU NOMINAL PEMBAYARAN..." />

      <div className="p-8 pb-16">
        <div className="max-w-[1300px] mx-auto flex flex-col gap-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#2A2A2A]/40 uppercase mb-2 block">
                KONTROL VALIDASI PEMBAYARAN
              </span>
              <h1 className="text-4xl md:text-[2.75rem] leading-[1.05] font-black italic tracking-tighter text-[#2A2A2A]">
                VERIFIKASI <br /> PEMBAYARAN.
              </h1>
            </div>

            <div className="flex items-center bg-white rounded-full px-8 py-2 border border-gray-100 shadow-sm h-14">
              <div className="flex flex-col items-center justify-center pr-8 border-r border-gray-100">
                <span className="text-[8px] font-bold tracking-widest text-[#A8A8A8] uppercase">MENUNGGU</span>
                <span className="text-base font-black text-[#FF9A9E] leading-none mt-1">12</span>
              </div>
              <div className="flex flex-col items-center justify-center pl-8">
                <span className="text-[8px] font-bold tracking-widest text-[#A8A8A8] uppercase">DITERIMA HARI INI</span>
                <span className="text-base font-black text-emerald-500 leading-none mt-1">28</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <AdminStatCard icon={<ClockIcon className="w-4 h-4" />} label="Total Menunggu" value="12 Pembayaran" />
            <AdminStatCard icon={<CheckCircleIcon className="w-4 h-4" />} label="Terverifikasi" value="246 Pembayaran" valueClassName="text-emerald-500" iconWrapClassName="bg-emerald-50 text-emerald-500" cardBorderClassName="border-emerald-100/50" />
            <AdminStatCard icon={<XCircleIcon className="w-4 h-4" />} label="Ditolak" value="8 Pembayaran" valueClassName="text-red-500" iconWrapClassName="bg-[#FDF1F0] text-red-500" cardBorderClassName="border-red-100/50" />
          </div>

          <div className="bg-white rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <FilterTabs
                active={activeTab}
                onChange={setActiveTab}
                tabs={[
                  { label: 'SEMUA', value: 'semua' },
                  { label: 'MENUNGGU', value: 'menunggu' },
                  { label: 'VALID', value: 'valid' },
                  { label: 'DITOLAK', value: 'ditolak' },
                ]}
              />

              <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">
                PENINJAUAN BUKTI TRANSFER
              </span>
            </div>

            <div className="flex flex-col w-full mb-10">
              <div className="flex items-center pb-5 border-b border-gray-100">
                <div className="w-[25%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">Invoice</div>
                <div className="w-[25%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">Vendor</div>
                <div className="w-[20%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">Metode</div>
                <div className="w-[15%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">Tanggal</div>
                <div className="w-[15%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase text-right pr-2">Aksi</div>
              </div>

              {filteredPayments.map((payment, index, arr) => (
                <div key={payment.invoice} className={`flex items-center py-5 ${index < arr.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-[#FDF1F0]/30 transition-colors rounded-xl px-2`}>
                  <div className="w-[25%] flex flex-col">
                    <span className="text-[11px] font-extrabold text-[#2A2A2A] mb-0.5 tracking-widest uppercase">{payment.invoice}</span>
                    <span className="text-[8px] font-medium text-[#2A2A2A]/30 uppercase tracking-wider">{payment.customer}</span>
                  </div>
                  <div className="w-[25%] flex flex-col">
                    <span className="text-[11px] font-bold text-[#2A2A2A]">{payment.vendor}</span>
                    <span className="text-[8px] font-medium text-[#2A2A2A]/30 uppercase tracking-wider">Menunggu validasi admin</span>
                  </div>
                  <div className="w-[20%]">
                    <span className="text-[10px] font-bold text-[#2A2A2A]/60 uppercase tracking-wider">{payment.method}</span>
                  </div>
                  <div className="w-[15%]">
                    <span className="text-[10px] font-bold text-[#2A2A2A]/60 uppercase tracking-wider">{payment.date}</span>
                  </div>
                  <div className="w-[15%] flex justify-end gap-2">
                    <StatusBadge text={payment.status === 'menunggu' ? 'MENUNGGU' : payment.status === 'valid' ? 'VALID' : 'DITOLAK'} variant={statusMap[payment.status]} rounded="md" />
                    <button type="button" className="w-9 h-9 bg-[#FAFAFC] hover:bg-gray-100 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#2A2A2A] transition-colors cursor-pointer">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <AdminPagination pages={[1, 2, 3]} currentPage={1} />
          </div>
        </div>
      </div>
    </>
  );
}