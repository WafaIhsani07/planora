'use client';

import React from 'react';

const BuildingIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 22h16" /><path d="M12 2 4 7h16Z" /><path d="M18 22V11" /><path d="M14 22V11" /><path d="M10 22V11" /><path d="M6 22V11" /></svg>
);
const TrendingUpIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
);
const ClockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const PercentIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="19" x2="5" y1="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>
);
const DownloadIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
);
const WalletIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
);

export default function KeuanganVendorPage() {
    return (
        <div className="mx-auto w-full max-w-[1300px] pb-8">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
                <div>
                    <span className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">
                        MANAJEMEN SALDO & PENDAPATAN
                    </span>
                    <h1 className="text-4xl leading-[1.05] font-black italic tracking-tighter text-[#2A2A2A] md:text-[2.75rem]">
                        RINGKASAN <br /> KEUANGAN.
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white px-5 text-[10px] font-bold tracking-widest text-[#2A2A2A] uppercase shadow-sm transition-colors hover:bg-gray-50">
                        <DownloadIcon className="h-4 w-4" />
                        LAPORAN BULANAN
                    </button>
                    <button className="flex h-11 items-center gap-2 rounded-full bg-[#2A2A2A] px-5 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg shadow-[#2A2A2A]/20 transition-colors hover:bg-[#1a1a1a]">
                        <WalletIcon className="h-4 w-4" />
                        TARIK SALDO
                    </button>
                </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                <div className="flex flex-col items-center justify-center rounded-[2rem] border border-gray-100 bg-white px-5 py-7 text-center shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-1">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FCE6E3] text-[#2A2A2A]">
                        <BuildingIcon className="h-5 w-5" />
                    </div>
                    <span className="mb-1.5 block text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">SALDO TERSEDIA</span>
                    <span className="text-[1.75rem] leading-none font-black italic tracking-tighter text-[#2A2A2A]">Rp 12.8M</span>
                </div>

                <div className="flex flex-col items-center justify-center rounded-[2rem] border border-gray-100 bg-white px-5 py-7 text-center shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-1">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2A2A2A] text-white">
                        <TrendingUpIcon className="h-5 w-5" />
                    </div>
                    <span className="mb-1.5 block text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">TOTAL OMZET</span>
                    <span className="text-[1.75rem] leading-none font-black italic tracking-tighter text-[#2A2A2A]">Rp 42.8M</span>
                </div>

                <div className="flex flex-col items-center justify-center rounded-[2rem] border border-gray-100 bg-white px-5 py-7 text-center shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-1">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4F4F5] text-gray-400">
                        <ClockIcon className="h-5 w-5" />
                    </div>
                    <span className="mb-1.5 block text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">SALDO TERTAHAN</span>
                    <span className="text-[1.75rem] leading-none font-black italic tracking-tighter text-[#A8A8A8]">Rp 5.2M</span>
                </div>

                <div className="flex flex-col items-center justify-center rounded-[2rem] border border-gray-100 bg-white px-5 py-7 text-center shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-1">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4F4F5] text-gray-400">
                        <PercentIcon className="h-5 w-5" />
                    </div>
                    <span className="mb-1.5 block text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">POTONGAN SISTEM</span>
                    <span className="text-[1.75rem] leading-none font-black italic tracking-tighter text-[#A8A8A8]">2.5%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
                <div className="lg:col-span-2 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] lg:p-8">
                    <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                        <h3 className="text-lg font-black italic tracking-tighter text-[#2A2A2A] uppercase">RIWAYAT TRANSAKSI</h3>
                        <button className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase transition-colors hover:text-[#2A2A2A]">
                            EXPORT CSV
                        </button>
                    </div>

                    <div className="w-full">
                        <div className="flex border-b border-gray-50 pb-3">
                            <div className="w-[30%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">NO. INVOICE</div>
                            <div className="w-[25%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">TANGGAL</div>
                            <div className="w-[25%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">NOMINAL</div>
                            <div className="w-[20%] text-right text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">STATUS</div>
                        </div>

                        <div className="flex items-center border-b border-gray-50 py-4">
                            <div className="w-[30%] text-[11px] font-bold text-[#2A2A2A]">INV/2026/04/001</div>
                            <div className="w-[25%] text-[10px] font-bold text-[#A8A8A8]">12 APR 2026</div>
                            <div className="w-[25%] text-[11px] font-bold text-[#2A2A2A]">Rp 5.500.000</div>
                            <div className="flex w-[20%] justify-end">
                                <span className="rounded-full bg-[#EAF5EF] px-3 py-1 text-[8px] font-extrabold tracking-widest text-emerald-600 uppercase">
                                    SELESAI
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center border-b border-gray-50 py-4">
                            <div className="w-[30%] text-[11px] font-bold text-[#2A2A2A]">INV/2026/04/002</div>
                            <div className="w-[25%] text-[10px] font-bold text-[#A8A8A8]">14 APR 2026</div>
                            <div className="w-[25%] text-[11px] font-bold text-[#2A2A2A]">Rp 3.500.000</div>
                            <div className="flex w-[20%] justify-end">
                                <span className="rounded-full bg-[#FFF4E5] px-3 py-1 text-[8px] font-extrabold tracking-widest text-orange-500 uppercase">
                                    PENDING
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] lg:p-8">
                        <h3 className="mb-5 text-lg font-black italic tracking-tighter text-[#2A2A2A] uppercase">INFO PENCAIRAN</h3>

                        <div className="mb-6 flex flex-col">
                            <span className="mb-2 text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">REKENING TERDAFTAR</span>
                            <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-[#FAFAFC] p-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white">
                                    <span className="text-[10px] font-black text-[#2A2A2A]">BCA</span>
                                </div>
                                <div className="min-w-0">
                                    <span className="block truncate text-[11px] font-bold text-[#2A2A2A] uppercase">NURWAHIDAH WAFA IHSANI</span>
                                    <span className="mt-0.5 block text-[9px] text-[#A8A8A8]">8023 **** 1199</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <span className="mb-1 block text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">PENCAIRAN TERAKHIR</span>
                            <span className="text-[11px] font-extrabold text-[#2A2A2A] uppercase">12 MARET 2026</span>
                        </div>

                        <button className="w-full rounded-xl bg-[#2A2A2A] py-3.5 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg shadow-[#2A2A2A]/20 transition-colors hover:bg-[#1a1a1a]">
                            AJUKAN WITHDRAW
                        </button>
                    </div>

                    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] lg:p-8">
                        <h3 className="mb-5 text-lg font-black italic tracking-tighter text-[#2A2A2A] uppercase">ARUS KAS</h3>

                        <div className="my-3 flex h-[108px] items-end justify-center gap-2.5">
                            <div className="h-[40%] w-full rounded-t-md bg-[#F4F4F5]" />
                            <div className="h-[60%] w-full rounded-t-md bg-[#F4F4F5]" />
                            <div className="h-[100%] w-full rounded-t-md bg-[#FCE6E3] shadow-sm" />
                            <div className="h-[30%] w-full rounded-t-md bg-[#F4F4F5]" />
                        </div>

                        <p className="w-full text-center text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">
                            STATISTIK 4 BULAN TERAKHIR
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
