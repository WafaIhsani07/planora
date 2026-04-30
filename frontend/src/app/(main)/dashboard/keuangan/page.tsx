'use client';

import React, { useMemo, useState } from 'react';
import {
  Wallet,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Banknote,
  Search,
  Filter,
  X,
} from 'lucide-react';

import DashboardLayout from '../DashboardLayout';

type TxStatus = 'Selesai' | 'Diproses' | 'Tertunda';
type TxType = 'Income' | 'Withdrawal';

type Transaction = {
    id: string;
    type: TxType;
    source: string;
    date: string;
    amount: string;
    status: TxStatus;
};

const transactions: Transaction[] = [
    { id: 'TRX-98210', type: 'Income', source: 'Pembayaran DP #PLR-240512-001', date: '12 Mei 2026', amount: '+ Rp 4.250.000', status: 'Selesai' },
    { id: 'TRX-98209', type: 'Withdrawal', source: 'Pencairan Dana ke Bank BCA', date: '10 Mei 2026', amount: '- Rp 5.000.000', status: 'Diproses' },
    { id: 'TRX-98208', type: 'Income', source: 'Pelunasan #PLR-240509-003', date: '09 Mei 2026', amount: '+ Rp 12.000.000', status: 'Selesai' },
    { id: 'TRX-98207', type: 'Income', source: 'Pembayaran DP #PLR-240505-005', date: '05 Mei 2026', amount: '+ Rp 4.500.000', status: 'Selesai' },
    { id: 'TRX-98206', type: 'Withdrawal', source: 'Pencairan Dana ke Bank Mandiri', date: '03 Mei 2026', amount: '- Rp 8.750.000', status: 'Selesai' },
    { id: 'TRX-98205', type: 'Income', source: 'Pembayaran DP #PLR-240520-006', date: '02 Mei 2026', amount: '+ Rp 2.375.000', status: 'Tertunda' },
];

const getStatusStyle = (status: TxStatus) => {
    if (status === 'Selesai') return 'bg-[#E6F9F0] text-[#10B981]';
    if (status === 'Diproses') return 'bg-[#FFF9E5] text-[#F59E0B]';
    return 'bg-[#FCE6E3] text-[#FF527B]';
};

export default function KeuanganVendorPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'Semua' | TxType>('Semua');
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    const filteredTransactions = useMemo(() => {
        return transactions.filter((trx) => {
            const matchesType = filterType === 'Semua' || trx.type === filterType;
            const q = searchQuery.toLowerCase();
            const matchesQuery =
                trx.id.toLowerCase().includes(q) ||
                trx.source.toLowerCase().includes(q) ||
                trx.date.toLowerCase().includes(q);
            return matchesType && matchesQuery;
        });
    }, [filterType, searchQuery]);

    const onDownloadReport = () => {
        alert('Laporan bulanan sedang dipersiapkan untuk diunduh.');
    };

    const onDownloadInvoice = (id: string) => {
        alert(`Invoice ${id} sedang diproses untuk diunduh.`);
    };

    const onApplyFilter = () => {
        if (filterType === 'Semua') {
            setFilterType('Income');
            return;
        }
        if (filterType === 'Income') {
            setFilterType('Withdrawal');
            return;
        }
        setFilterType('Semua');
    };

    return (
        <DashboardLayout>
            <div className="flex h-full w-full flex-col gap-8 pb-2">
                <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
                    <div>
                        <span className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-[#FF7F97] uppercase">
                            MANAJEMEN SALDO DAN PENDAPATAN
                        </span>
                        <h1 className="text-4xl leading-[1.05] font-black tracking-tight text-[#2A2A2A] md:text-[2.75rem]">
                            MANAJEMEN KEUANGAN
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={onDownloadReport}
                            className="flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white px-5 text-[10px] font-bold tracking-widest text-[#2A2A2A] uppercase shadow-sm transition-colors hover:bg-gray-50"
                        >
                            <Download className="h-4 w-4 text-[#FF9A9E]" />
                            UNDUH LAPORAN
                        </button>
                        <button
                            onClick={() => setShowWithdrawModal(true)}
                            className="flex h-11 items-center gap-2 rounded-full bg-[#2A2A2A] px-5 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg shadow-[#2A2A2A]/20 transition-colors hover:bg-[#1a1a1a]"
                        >
                            <Banknote className="h-4 w-4" />
                            TARIK DANA
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <div className="relative h-full overflow-hidden rounded-[48px] bg-[#2A2A2A] p-10 text-white shadow-2xl">
                            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#FF9A9E]/10 blur-3xl" />
                            <div className="relative z-10 flex h-full flex-col justify-between">
                                <div>
                                    <div className="mb-8 flex items-center gap-3 opacity-40">
                                        <Wallet className="h-5 w-5" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">SALDO PLANORA PAY</span>
                                    </div>
                                    <h2 className="mb-4 text-[44px] font-black leading-none">Rp 12.450.000</h2>
                                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                                        <TrendingUp className="h-4 w-4" /> +12% dari minggu lalu
                                    </div>
                                </div>

                                <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                                    <div>
                                        <p className="mb-1 text-[9px] font-black uppercase tracking-widest opacity-40">STATUS AKUN</p>
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                            <span className="text-xs font-bold uppercase">TERVERIFIKASI</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => alert('Detail saldo akan segera tersedia.')}
                                        className="text-[10px] font-black uppercase tracking-widest text-[#FF9A9E] hover:underline"
                                    >
                                        DETAIL SALDO
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:col-span-7 md:grid-cols-2">
                        <div className="flex flex-col justify-between rounded-[40px] border border-[#2A2A2A]/5 bg-white p-8 transition-all hover:shadow-lg">
                            <div className="mb-6 flex items-start justify-between">
                                <div className="rounded-[24px] bg-[#E6F9F0] p-4 text-[#10B981]">
                                    <ArrowDownLeft className="h-6 w-6" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/20">TOTAL PEMASUKAN</p>
                            </div>
                            <div>
                                <h3 className="mb-1 text-2xl font-black text-[#2A2A2A]">Rp 48.200k</h3>
                                <p className="text-[10px] font-bold uppercase tracking-tighter text-[#2A2A2A]/40">BULAN INI</p>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between rounded-[40px] border border-[#2A2A2A]/5 bg-white p-8 transition-all hover:shadow-lg">
                            <div className="mb-6 flex items-start justify-between">
                                <div className="rounded-[24px] bg-[#FCE6E3] p-4 text-[#FF527B]">
                                    <ArrowUpRight className="h-6 w-6" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/20">DANA DICAIRKAN</p>
                            </div>
                            <div>
                                <h3 className="mb-1 text-2xl font-black text-[#2A2A2A]">Rp 35.750k</h3>
                                <p className="text-[10px] font-bold uppercase tracking-tighter text-[#2A2A2A]/40">TOTAL KUMULATIF</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[40px] border border-[#2A2A2A]/5 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-50 p-8 md:flex-row md:items-center md:justify-between">
                        <h3 className="text-xl font-black tracking-tight text-[#2A2A2A]">RIWAYAT TRANSAKSI</h3>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari ID transaksi..."
                                    className="w-64 rounded-xl bg-slate-50 py-3 pl-11 pr-4 text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30"
                                />
                            </div>
                            <button
                                onClick={onApplyFilter}
                                className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/50 transition-all hover:bg-[#2A2A2A] hover:text-white"
                            >
                                <Filter className="h-4 w-4" />
                                {filterType}
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-[900px] w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-50 bg-slate-50/40 text-[10px] font-black uppercase tracking-[0.2em] text-[#2A2A2A]/30">
                                    <th className="px-10 py-5">ID TRANSAKSI</th>
                                    <th className="px-10 py-5">DESKRIPSI</th>
                                    <th className="px-10 py-5">TANGGAL</th>
                                    <th className="px-10 py-5">NOMINAL</th>
                                    <th className="px-10 py-5">STATUS</th>
                                    <th className="px-10 py-5 text-right">INVOICE</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredTransactions.map((trx) => (
                                    <tr key={trx.id} className="group transition-all hover:bg-[#FDF1F0]/20">
                                        <td className="px-10 py-6">
                                            <p className="text-[11px] font-black tracking-widest text-[#2A2A2A]">{trx.id}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${trx.type === 'Income' ? 'bg-[#E6F9F0] text-[#10B981]' : 'bg-[#FCE6E3] text-[#FF527B]'}`}>
                                                    {trx.type === 'Income' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                                </div>
                                                <p className="text-[13px] font-bold text-[#2A2A2A]">{trx.source}</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-xs font-bold text-[#2A2A2A]/40">{trx.date}</td>
                                        <td className={`px-10 py-6 text-[15px] font-black ${trx.type === 'Income' ? 'text-emerald-500' : 'text-[#2A2A2A]'}`}>
                                            {trx.amount}
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`inline-block rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest ${getStatusStyle(trx.status)}`}>
                                                {trx.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <button
                                                onClick={() => onDownloadInvoice(trx.id)}
                                                className="rounded-lg p-2 text-[#FF9A9E] transition-colors hover:bg-[#FDF1F0] hover:text-[#FF527B]"
                                            >
                                                <Download className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-slate-50 p-8 text-center">
                        <button
                            onClick={() => alert('Membuka riwayat lengkap...')}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF9A9E] transition-colors hover:text-[#FF527B]"
                        >
                            LIHAT RIWAYAT LENGKAP
                        </button>
                    </div>
                </div>
            </div>

            {showWithdrawModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-black text-[#2A2A2A]">Tarik Dana</h2>
                            <button
                                onClick={() => setShowWithdrawModal(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-[#2A2A2A]/40 transition-all hover:bg-[#FCE6E3] hover:text-[#FF527B]"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div className="rounded-2xl bg-[#FDF1F0] p-5">
                                <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">Saldo Tersedia</p>
                                <p className="text-3xl font-black text-[#2A2A2A]">Rp 12.450.000</p>
                            </div>

                            <div>
                                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">Jumlah Penarikan</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-[#FF527B]">Rp</span>
                                    <input
                                        type="number"
                                        defaultValue="5000000"
                                        className="w-full rounded-2xl border border-transparent bg-[#FDF1F0]/50 py-4 pl-14 pr-5 text-sm font-bold focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30"
                                    />
                                </div>
                            </div>

                            <p className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-[11px] font-bold text-blue-600">
                                Dana akan ditransfer ke rekening terdaftar dalam 1-2 jam kerja. Biaya admin 1% dari nominal penarikan.
                            </p>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowWithdrawModal(false)}
                                    className="flex-1 rounded-2xl px-5 py-3 text-[11px] font-black uppercase tracking-widest text-[#2A2A2A]/40 transition-all hover:text-[#2A2A2A]"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => {
                                        alert('Permintaan penarikan dana berhasil dikirim.');
                                        setShowWithdrawModal(false);
                                    }}
                                    className="flex-1 rounded-2xl bg-[#FF9A9E] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#FF9A9E]/20 transition-all hover:bg-[#FF527B]"
                                >
                                    Konfirmasi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
