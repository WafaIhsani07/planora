'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Hourglass,
  Check,
  ShieldCheck,
  Percent,
  Download,
  HelpCircle,
  RefreshCw,
  Wallet,
  X,
  CreditCard
} from 'lucide-react';
import { getVendorBookings, getMyVendorProfile, getMyWithdrawals, requestWithdrawal } from '@/services/vendor.service';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  eventName: string;
  date: string;
  packagePrice: number;
  commission: number;
  netBalance: number;
  status: 'ditahan' | 'selesai';
  invoiceNumber: string;
}

interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  bankName: string;
  bankAccount: string;
  bankHolder: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDateForDisplay = (value: string | Date | null | undefined) => {
  if (!value) return '';
  try {
    const dateObj = typeof value === 'string' ? new Date(value) : value;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(dateObj);
  } catch {
    return String(value);
  }
};

export default function KeuanganPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pesanan' | 'penarikan'>('pesanan');
  const [filterStatus, setFilterStatus] = useState<'semua' | 'ditahan' | 'selesai'>('semua');
  
  // Withdrawal Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadFinancialData() {
    try {
      setLoading(true);
      const [fetchedBookings, fetchedProfile, fetchedWithdrawals] = await Promise.all([
        getVendorBookings(),
        getMyVendorProfile(),
        getMyWithdrawals(),
      ]);
      const finalBookings = Array.isArray(fetchedBookings) ? fetchedBookings : fetchedBookings?.data || [];
      setBookings(finalBookings);
      setProfile(fetchedProfile || null);
      setWithdrawals(fetchedWithdrawals || []);
    } catch (error) {
      console.error('Gagal mengambil data keuangan:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFinancialData();
  }, []);

  // Map bookings into active transaction list
  const transactions: Transaction[] = bookings
    .filter((b: any) => b.status !== 'PENDING' && b.status !== 'CANCELLED')
    .map((b: any) => {
      const packagePrice = Number(b.totalPrice) || 0;
      const commission = packagePrice * 0.05;
      const netBalance = packagePrice * 0.95;
      const eventName = b.layanan?.name || 'Paket Layanan';
      const customerName = b.customer?.name || 'Pelanggan';

      return {
        id: b.id,
        eventName: `${eventName} (${customerName})`,
        date: formatDateForDisplay(b.eventDate),
        packagePrice,
        commission,
        netBalance,
        status: b.status === 'COMPLETED' ? 'selesai' : 'ditahan',
        invoiceNumber: `#PLR-${b.id.substring(Math.max(0, b.id.length - 6)).toUpperCase()}`,
      };
    });

  const filteredTransactions = transactions.filter((tx) => {
    if (filterStatus === 'semua') return true;
    return tx.status === filterStatus;
  });

  // Calculate statistics
  const totalIncome = transactions
    .filter((tx) => tx.status === 'selesai')
    .reduce((sum, tx) => sum + tx.netBalance, 0);

  const totalHeld = transactions
    .filter((tx) => tx.status === 'ditahan')
    .reduce((sum, tx) => sum + tx.netBalance, 0);

  const activeBalance = Number(profile?.balance) || 0;

  // Bank Info from Profile
  const bankName = profile?.bankName || 'BELUM DIATUR';
  const bankAccount = profile?.bankAccount || 'BELUM DIATUR';
  const bankHolder = profile?.bankHolder || profile?.businessName || 'BELUM DIATUR';

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error('Jumlah penarikan tidak valid');
      return;
    }
    if (amount > activeBalance) {
      toast.error('Saldo tidak mencukupi');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestWithdrawal(amount);
      if (res) {
        setIsModalOpen(false);
        setWithdrawAmount('');
        // Refresh data
        await loadFinancialData();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40" data-testid="loading-spinner">
        <RefreshCw className="w-12 h-12 text-[#FF9A9E] animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-[#2A2A2A]/40">Memuat data keuangan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-8 py-6 relative">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-[2rem] font-extrabold tracking-tight leading-tight text-[#2A2A2A]">
            Keuangan Bisnis
          </h1>
          <p className="text-[#2A2A2A]/35 text-[11px] font-bold uppercase tracking-[0.18em] mt-1">
            PANTAU ALUR DANA DAN STATUS PENCAIRAN ANDA SECARA REAL-TIME.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF527B] text-white px-8 py-4 rounded-[20px] font-bold text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-[#ff3b68] transition-all shadow-md whitespace-nowrap cursor-pointer"
        >
          <Wallet className="w-4 h-4" />
          Tarik Dana
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Saldo Aktif */}
        <div className="bg-white p-8 rounded-xl border border-[#2A2A2A]/5 shadow-sm flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[9px] font-black text-[#FF527B] uppercase tracking-[0.3em]">
                Saldo Aktif
              </p>
              <div className="w-10 h-10 bg-[#FCE6E3] rounded-2xl flex items-center justify-center text-[#FF527B]">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <h2 className="text-2xl xl:text-3xl font-black tracking-tight text-[#2A2A2A]">
              {formatCurrency(activeBalance)}
            </h2>
            <p className="text-[10px] font-bold text-[#FF527B] mt-2 italic">
              Tersedia untuk ditarik
            </p>
          </div>
          <div className="pt-4 border-t border-slate-50 text-center">
            <span className="text-[9px] font-black text-[#FF9A9E] uppercase tracking-widest">
              Dompet Planora
            </span>
          </div>
        </div>

        {/* Total Pendapatan (Bersih) */}
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
            <p className="text-[10px] font-bold text-emerald-500 mt-2">Pendapatan bersih (95%)</p>
          </div>
          <div className="pt-4 border-t border-slate-50">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center block">
              Dari Pesanan Selesai
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
              {transactions.filter((tx) => tx.status === 'ditahan').length} Pesanan berjalan (Escrow)
            </p>
          </div>
          <div className="pt-4 border-t border-slate-50">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center block">
              Status: Menunggu Acara Selesai
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
            <h4 className="text-sm font-black mb-1 text-[#FF9A9E] uppercase">{bankName}</h4>
            <p className="text-lg font-bold tracking-[0.05em] overflow-hidden text-ellipsis whitespace-nowrap" title={bankAccount}>
              {bankAccount}
            </p>
            <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase truncate max-w-full">
              a.n. {bankHolder}
            </p>
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
              Anda menerima 95% dari total harga paket setelah potongan komisi platform 5%. Saldo akan masuk ke Dompet Planora setelah acara dinyatakan selesai.
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

      {/* TAB NAVIGATION */}
      <div className="flex border-b border-[#2A2A2A]/10 mt-8 mb-4">
        <button
          onClick={() => setActiveTab('pesanan')}
          className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
            activeTab === 'pesanan'
              ? 'border-[#FF527B] text-[#FF527B]'
              : 'border-transparent text-slate-400 hover:text-[#2A2A2A]'
          }`}
        >
          Pemasukan dari Pesanan
        </button>
        <button
          onClick={() => setActiveTab('penarikan')}
          className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
            activeTab === 'penarikan'
              ? 'border-[#FF527B] text-[#FF527B]'
              : 'border-transparent text-slate-400 hover:text-[#2A2A2A]'
          }`}
        >
          Riwayat Penarikan Dana
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'pesanan' && (
        <div className="bg-white rounded-xl border border-[#2A2A2A]/5 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="px-10 py-12 border-b border-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <h4 className="text-[13px] font-black text-[#2A2A2A] uppercase tracking-[0.3em]">
              Riwayat Pemasukan Pesanan
            </h4>
            <div className="flex bg-slate-50 p-1 rounded-2xl w-fit">
              {(['semua', 'ditahan', 'selesai'] as const).map((status) => (
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
                  {status === 'selesai' && 'Selesai'}
                </button>
              ))}
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white/70">
              <TrendingUp className="mb-4 h-12 w-12 text-[#FF9A9E]/40" />
              <h3 className="text-lg font-bold text-gray-600">Belum Ada Riwayat Pemasukan</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-md px-6">
                Pembayaran dari pelanggan akan otomatis tercatat di sini setelah pesanan masuk.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="text-[10px] font-black text-[#2A2A2A]/20 uppercase tracking-[0.2em] border-b-2 border-slate-50">
                    <th className="px-10 py-8">Detail Acara</th>
                    <th className="px-10 py-8">Harga Paket</th>
                    <th className="px-10 py-8">Komisi (5%)</th>
                    <th className="px-10 py-8">Masuk ke Saldo</th>
                    <th className="px-10 py-8">Status Pesanan</th>
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
                            Dana Ditahan
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-emerald-500 bg-emerald-50 border border-emerald-100 px-6 py-2.5 rounded-full inline-flex text-[10px] font-black uppercase tracking-widest">
                            <Check className="w-4 h-4" />
                            Masuk Dompet
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'penarikan' && (
        <div className="bg-white rounded-xl border border-[#2A2A2A]/5 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="px-10 py-12 border-b border-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <h4 className="text-[13px] font-black text-[#2A2A2A] uppercase tracking-[0.3em]">
              Riwayat Penarikan Dana
            </h4>
          </div>

          {withdrawals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white/70">
              <Wallet className="mb-4 h-12 w-12 text-[#FF9A9E]/40" />
              <h3 className="text-lg font-bold text-gray-600">Belum Ada Riwayat Penarikan</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-md px-6">
                Anda belum pernah melakukan penarikan saldo ke rekening Anda.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="text-[10px] font-black text-[#2A2A2A]/20 uppercase tracking-[0.2em] border-b-2 border-slate-50">
                    <th className="px-10 py-8">Tanggal</th>
                    <th className="px-10 py-8">Rekening Tujuan</th>
                    <th className="px-10 py-8">Nominal Penarikan</th>
                    <th className="px-10 py-8">Status Pencairan</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((w) => (
                    <tr key={w.id} className="group hover:bg-[#FDF1F0]/30 transition-all border-b border-slate-50">
                      <td className="px-10 py-10">
                        <h5 className="text-base font-black text-[#2A2A2A] mb-1">{formatDateForDisplay(w.createdAt)}</h5>
                        <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                          {new Date(w.createdAt).toLocaleTimeString('id-ID')} WIB
                        </p>
                      </td>
                      <td className="px-10 py-10">
                        <p className="text-[13px] font-black text-[#2A2A2A] uppercase">{w.bankName}</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {w.bankAccount} - {w.bankHolder}
                        </p>
                      </td>
                      <td className="px-10 py-10 text-xl font-black text-[#2A2A2A]">
                        {formatCurrency(w.amount)}
                      </td>
                      <td className="px-10 py-10">
                        {w.status === 'PENDING' || w.status === 'PROCESSING' ? (
                          <div className="flex items-center gap-3 text-orange-400 bg-orange-50 border border-orange-100 px-6 py-2.5 rounded-full inline-flex text-[10px] font-black uppercase tracking-widest">
                            <Hourglass className="w-4 h-4" />
                            Menunggu Diproses
                          </div>
                        ) : w.status === 'COMPLETED' ? (
                          <div className="flex items-center gap-3 text-emerald-500 bg-emerald-50 border border-emerald-100 px-6 py-2.5 rounded-full inline-flex text-[10px] font-black uppercase tracking-widest">
                            <Check className="w-4 h-4" />
                            Sukses Transfer
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-[#FF527B] bg-[#FCE6E3] border border-[#FF9A9E] px-6 py-2.5 rounded-full inline-flex text-[10px] font-black uppercase tracking-widest">
                            <X className="w-4 h-4" />
                            Ditolak
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Table Footer info */}
      <div className="px-10 py-12 bg-slate-50/50 flex flex-col md:flex-row md:items-center md:justify-between gap-6 rounded-xl border border-slate-100 mt-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed max-w-xl italic">
          *Pencairan dana akan diproses oleh Admin Planora maksimal 1x24 jam kerja ke rekening yang terdaftar.
        </p>
        <div className="flex items-center gap-3 text-emerald-500 whitespace-nowrap">
          <ShieldCheck className="w-6 h-6" />
          <span className="text-[11px] font-black uppercase tracking-widest">Transaksi Dilindungi</span>
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

      {/* MODAL TARIK DANA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-[#2A2A2A]">Tarik Dana</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-[#FF527B] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="bg-[#FCE6E3]/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center mb-8 border border-[#FF9A9E]/30">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF527B] mb-2">
                  Saldo Tersedia
                </span>
                <span className="text-3xl font-black text-[#2A2A2A]">
                  {formatCurrency(activeBalance)}
                </span>
              </div>

              <form onSubmit={handleWithdrawalSubmit} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">
                    Nominal Penarikan
                  </label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2A2A2A] font-black text-xl">
                      Rp
                    </span>
                    <input
                      type="number"
                      required
                      min="10000"
                      max={activeBalance}
                      placeholder="0"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pl-16 pr-6 text-xl font-black text-[#2A2A2A] focus:outline-none focus:border-[#FF527B] focus:ring-4 focus:ring-[#FF527B]/10 transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 ml-2">Minimal penarikan Rp 10.000</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Tujuan Transfer
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-emerald-500">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-[#2A2A2A] uppercase">{bankName}</p>
                      <p className="text-[10px] font-bold text-slate-500 tracking-widest mt-0.5">
                        {bankAccount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || Number(withdrawAmount) > activeBalance || Number(withdrawAmount) <= 0}
                    className="w-full bg-[#FF527B] hover:bg-[#ff3b68] disabled:bg-slate-300 text-white font-black text-sm uppercase tracking-widest py-5 rounded-2xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
                  >
                    {isSubmitting ? 'Memproses...' : 'Tarik Sekarang'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
