'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Hourglass,
  Check,
  ShieldCheck,
  Percent,
  Download,
  HelpCircle,
} from 'lucide-react';

import DashboardLayout from '../DashboardLayout';

interface Transaction {
  id: string;
  eventName: string;
  date: string;
  packagePrice: number;
  commission: number;
  netBalance: number;
  status: 'ditahan' | 'dicairkan';
  invoiceNumber: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    eventName: 'Pernikahan Andini & Dimas',
    date: '12 Mei 2024',
    packagePrice: 8500000,
    commission: 425000,
    netBalance: 8075000,
    status: 'ditahan',
    invoiceNumber: '#PLR-240512',
  },
  {
    id: '2',
    eventName: 'Engagement Raka & Sarah',
    date: '05 Mei 2024',
    packagePrice: 4500000,
    commission: 225000,
    netBalance: 4275000,
    status: 'dicairkan',
    invoiceNumber: '#PLR-240505',
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function KeuanganPage() {
  const [filterStatus, setFilterStatus] = useState<'semua' | 'ditahan' | 'dicairkan'>('semua');

  const filteredTransactions = mockTransactions.filter((tx) => {
    if (filterStatus === 'semua') return true;
    return tx.status === filterStatus;
  });

  const totalIncome = mockTransactions.reduce((sum, tx) => sum + tx.packagePrice, 0);
  const totalHeld = mockTransactions
    .filter((tx) => tx.status === 'ditahan')
    .reduce((sum, tx) => sum + tx.netBalance, 0);
  const totalReady = mockTransactions
    .filter((tx) => tx.status === 'dicairkan')
    .reduce((sum, tx) => sum + tx.netBalance, 0);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-[34px] font-black tracking-tight text-[#2A2A2A]">
              Keuangan Bisnis
            </h1>
            <p className="text-[#2A2A2A]/40 text-xs font-bold uppercase tracking-[0.25em] mt-2">
              Pantau alur dana dan status pencairan anda secara real-time.
            </p>
          </div>
          <button className="bg-white border border-[#2A2A2A]/5 text-[#2A2A2A] px-8 py-4 rounded-[20px] font-bold text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm whitespace-nowrap cursor-pointer">
            <Download className="w-4 h-4 text-[#FF9A9E]" />
            Unduh Laporan Bulanan
          </button>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Pendapatan */}
          <div className="bg-white p-8 rounded-xl border border-[#2A2A2A]/5 shadow-sm flex flex-col justify-between min-h-[200px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Total Pendapatan
                </p>
                <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-2xl xl:text-3xl font-black tracking-tight text-[#2A2A2A]">
                {formatCurrency(totalIncome)}
              </h2>
              <p className="text-[10px] font-bold text-emerald-500 mt-2">↑ 18% dari bulan lalu</p>
            </div>
            <div className="pt-4 border-t border-slate-50">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center block">
                Omzet Mei 2024
              </span>
            </div>
          </div>

          {/* Dana Ditahan */}
          <div className="bg-white p-8 rounded-xl border border-[#2A2A2A]/5 shadow-sm flex flex-col justify-between min-h-[200px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Dana Ditahan
                </p>
                <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-400">
                  <Hourglass className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-2xl xl:text-3xl font-black tracking-tight text-[#2A2A2A]">
                {formatCurrency(totalHeld)}
              </h2>
              <p className="text-[10px] font-bold text-orange-400 mt-2">
                {mockTransactions.filter((tx) => tx.status === 'ditahan').length} Pesanan belum selesai
              </p>
            </div>
            <div className="pt-4 border-t border-slate-50">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center block">
                Status: Escrow Admin
              </span>
            </div>
          </div>

          {/* Siap Dicairkan */}
          <div className="bg-white p-8 rounded-xl border border-[#2A2A2A]/5 shadow-sm flex flex-col justify-between min-h-[200px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[9px] font-black text-[#FF527B] uppercase tracking-[0.3em]">
                  Siap Dicairkan
                </p>
                <div className="w-10 h-10 bg-[#FCE6E3] rounded-2xl flex items-center justify-center text-[#FF527B]">
                  <Check className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-2xl xl:text-3xl font-black tracking-tight text-[#2A2A2A]">
                {formatCurrency(totalReady)}
              </h2>
              <p className="text-[10px] font-bold text-[#FF527B] mt-2 italic">
                Menunggu Verifikasi Admin
              </p>
            </div>
            <div className="pt-4 border-t border-slate-50 text-center">
              <span className="text-[9px] font-black text-[#FF9A9E] uppercase tracking-widest">
                Dana Siap Ditransfer
              </span>
            </div>
          </div>

          {/* Rekening Tujuan */}
          <div className="bg-[#2A2A2A] p-8 rounded-xl text-white relative overflow-hidden flex flex-col justify-between min-h-[200px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF9A9E]/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
            <div className="relative z-10">
              <p className="text-[9px] font-black opacity-40 uppercase tracking-[0.3em] mb-4">
                Rekening Tujuan
              </p>
              <h4 className="text-sm font-black mb-1 text-[#FF9A9E]">BCA - WAFA DECORATION</h4>
              <p className="text-lg font-bold tracking-[0.2em]">8832 **** 1290</p>
            </div>
            <div className="relative z-10 pt-4 border-t border-white/5 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[8px] font-black opacity-40 uppercase tracking-widest">
                Rekening Terverifikasi
              </span>
            </div>
          </div>
        </div>

        {/* BANNER SISTEM PEMBAGIAN DANA */}
        <div className="bg-[#2A2A2A] p-6 md:p-8 rounded-xl text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden border border-white/5">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-[#333333] rounded-[24px] flex items-center justify-center flex-shrink-0">
              <Percent className="w-7 h-7 text-[#FF9A9E]" />
            </div>
            <div>
              <h5 className="text-xl font-black tracking-tight mb-1">Sistem Pembagian Dana Planora</h5>
              <p className="text-sm font-medium text-white/30">
                Anda menerima 95% dari total harga paket setelah potongan komisi platform 5%.
              </p>
            </div>
          </div>
          <div className="flex gap-3 relative z-10">
            <div className="text-center px-8 py-5 bg-[#252525] rounded-2xl border border-white/5 flex flex-col justify-center min-w-[140px]">
              <p className="text-[9px] font-black text-[#FF527B] uppercase mb-2 tracking-widest">
                Diterima Vendor
              </p>
              <p className="text-3xl font-black">95%</p>
            </div>
            <div className="text-center px-8 py-5 bg-[#252525] rounded-2xl border border-white/5 flex flex-col justify-center min-w-[140px]">
              <p className="text-[9px] font-black text-[#FF527B] uppercase mb-2 tracking-widest">
                Komisi Platform
              </p>
              <p className="text-3xl font-black">5%</p>
            </div>
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div className="bg-white rounded-xl border border-[#2A2A2A]/5 overflow-hidden shadow-sm">
          <div className="px-10 py-12 border-b border-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <h4 className="text-[13px] font-black text-[#2A2A2A] uppercase tracking-[0.3em]">
              Riwayat Pembayaran Masuk
            </h4>
            <div className="flex bg-slate-50 p-1 rounded-2xl w-fit">
              {(['semua', 'ditahan', 'dicairkan'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                    filterStatus === status
                      ? 'bg-[#2A2A2A] text-white shadow-md'
                      : 'text-slate-300 hover:text-[#2A2A2A] shadow-none'
                  }`}
                >
                  {status === 'semua' && 'Semua'}
                  {status === 'ditahan' && 'Ditahan'}
                  {status === 'dicairkan' && 'Dicairkan'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="text-[10px] font-black text-[#2A2A2A]/20 uppercase tracking-[0.2em] border-b-2 border-slate-50">
                  <th className="px-10 py-8">Detail Acara</th>
                  <th className="px-10 py-8">Harga Paket</th>
                  <th className="px-10 py-8">Komisi (5%)</th>
                  <th className="px-10 py-8">Saldo Bersih</th>
                  <th className="px-10 py-8">Status Dana</th>
                  <th className="px-10 py-8 text-center">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-[#FDF1F0]/30 transition-all border-b border-slate-50">
                    <td className="px-10 py-10">
                      <h5 className="text-base font-black text-[#2A2A2A] mb-1">{tx.eventName}</h5>
                      <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                        {tx.date} • {tx.invoiceNumber}
                      </p>
                    </td>
                    <td className="px-10 py-10 text-base font-bold text-slate-400">
                      {formatCurrency(tx.packagePrice)}
                    </td>
                    <td className="px-10 py-10 text-base font-bold text-[#FF527B]">
                      - {formatCurrency(tx.commission)}
                    </td>
                    <td className="px-10 py-10 text-xl font-black text-[#2A2A2A]">
                      {formatCurrency(tx.netBalance)}
                    </td>
                    <td className="px-10 py-10">
                      {tx.status === 'ditahan' ? (
                        <div className="flex items-center gap-3 text-orange-400 bg-white border border-orange-200 px-6 py-2.5 rounded-full inline-flex text-[10px] font-black uppercase tracking-widest">
                          <Hourglass className="w-4 h-4" />
                          Ditahan (Escrow)
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-emerald-500 bg-emerald-50 border border-emerald-100 px-6 py-2.5 rounded-full inline-flex text-[10px] font-black uppercase tracking-widest">
                          <Check className="w-4 h-4" />
                          Sudah Dicairkan
                        </div>
                      )}
                    </td>
                    <td className="px-10 py-10 text-center">
                      <button className="w-12 h-12 flex items-center justify-center mx-auto text-[#FF9A9E] hover:text-[#FF527B] transition-transform hover:scale-125 cursor-pointer">
                        <Download className="w-7 h-7" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-10 py-12 bg-slate-50/50 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed max-w-xl italic">
              *Pencairan dana dilakukan secara berkala oleh Admin Planora maksimal 1x24 jam setelah
              status acara dinyatakan selesai oleh kedua belah pihak.
            </p>
            <div className="flex items-center gap-3 text-emerald-500 whitespace-nowrap">
              <ShieldCheck className="w-6 h-6" />
              <span className="text-[11px] font-black uppercase tracking-widest">Transaksi Dilindungi</span>
            </div>
          </div>
        </div>

        {/* BOTTOM HELP CARD */}
        <div className="bg-white p-10 rounded-xl border border-[#2A2A2A]/5 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 bg-[#FCE6E3] rounded-2xl flex items-center justify-center text-[#FF527B] flex-shrink-0">
              <HelpCircle className="w-9 h-9" />
            </div>
            <div>
              <h5 className="text-xl font-black text-[#2A2A2A]">Punya pertanyaan tentang dana?</h5>
              <p className="text-base font-medium text-slate-400">
                Tim bantuan kami siap menjelaskan rincian komisi dan status pencairan Anda.
              </p>
            </div>
          </div>
          <button className="bg-[#2A2A2A] text-white px-12 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95 whitespace-nowrap cursor-pointer">
            Hubungi Admin Kami
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
