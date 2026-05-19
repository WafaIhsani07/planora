'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { getPendingVendors, verifyVendor, rejectVendor } from '@/services/admin.service';

const DUMMY_VENDORS = [
    {
        id: 'dv-001',
        businessName: 'Eterna Photography',
        user: { name: 'Andini Putri', email: 'andini.putri@example.com' },
        city: 'Padang',
        province: 'Sumatera Barat',
        category: 'Fotografi',
        phone: '0813-1112-2222',
        description: 'Studio fotografi profesional yang menyediakan layanan prewedding, wedding, dan dokumentasi event dengan hasil elegan dan natural.',
        createdAt: new Date().toISOString(),
        status: 'PENDING',
    },
    {
        id: 'dv-002',
        businessName: 'Wafa Decoration',
        user: { name: 'Wafa Nur', email: 'wafa.nur@example.com' },
        city: 'Jakarta',
        province: 'DKI Jakarta',
        category: 'Dekorasi',
        phone: '0812-3456-7890',
        description: 'Penyedia dekorasi acara pernikahan dan pesta dengan konsep custom, modern, dan ramah anggaran.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        status: 'PENDING',
    },
    {
        id: 'dv-003',
        businessName: 'Luna Catering',
        user: { name: 'Rizky Adi', email: 'rizky.adi@example.com' },
        city: 'Bandung',
        province: 'Jawa Barat',
        category: 'Katering',
        phone: '0858-2222-3333',
        description: 'Layanan katering full service untuk acara perusahaan dan pernikahan, menu lokal dan internasional.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        status: 'PENDING',
    },
    {
        id: 'dv-004',
        businessName: 'Kreasi Audio',
        user: { name: 'Dewi Santoso', email: 'dewi.santoso@example.com' },
        city: '',
        province: '',
        category: 'Audio',
        phone: '0815-3333-4444',
        description: 'Penyewaan sound system dan layanan audio engineering untuk event indoor dan outdoor.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
        status: 'PENDING',
    },
];

const MapPinIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
const CalendarOutlineIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
);
const TrashIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
);
 

export default function AdminVerifikasiVendorPage() {
    const [vendors, setVendors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [useMock, setUseMock] = useState(true);
    const [activeTab, setActiveTab] = useState<string>('Semua');
    const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
    // pagination
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(8);
    const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
    const [docViewer, setDocViewer] = useState<{ open: boolean; title?: string; url?: string | null }>({ open: false });
    const [searchQuery, setSearchQuery] = useState<string>('');

    const fetchVendors = async () => {
        try {
            if (useMock) {
                setVendors(DUMMY_VENDORS);
                return;
            }

            const data = await getPendingVendors();
            // if backend returns empty, keep it empty
            setVendors(data);
        } catch (error) {
            console.error("Gagal mengambil data vendor:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Respect ?mock only if parameter is present; otherwise keep default (mock mode on)
        const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        if (params?.has('mock')) {
            const mockFlag = params.get('mock') === '1';
            setUseMock(Boolean(mockFlag));
        }
        fetchVendors();
    }, []);

    const handleVerify = async (id: string) => {
        setProcessingId(id);
        try {
            if (useMock) {
                setVendors(prev => prev.map(v => v.id === id ? { ...v, status: 'VERIFIED', verifiedAt: new Date().toISOString() } : v));
            } else {
                await verifyVendor(id);
                await fetchVendors();
            }
        } catch (error) {
            console.error("Gagal menyetujui vendor", error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        setProcessingId(id);
        try {
            if (useMock) {
                setVendors(prev => prev.map(v => v.id === id ? { ...v, status: 'REJECTED' } : v));
            } else {
                await rejectVendor(id, 'Ditolak oleh admin');
                await fetchVendors();
            }
        } catch (error) {
            console.error("Gagal menolak vendor", error);
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center" data-testid="loading-spinner">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9A9E]"></div>
            </div>
        );
    }

    return (
        <>

            <AdminHeader hideSearch />

            <div className="flex-1 overflow-y-auto bg-[#FDF1F0] px-8 py-8 lg:px-10 lg:py-10">
                    <div className="mx-auto w-full">
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A8A8]">
                                PENYARINGAN KUALITAS MITRA
                            </span>
                            <h1 className="text-3xl font-black leading-[1.05] tracking-[-0.04em] text-[#2A2A2A] md:text-[2rem] whitespace-nowrap">
                                Verifikasi Vendor Baru
                            </h1>
                        </div>

                    </div>

                    <div className="flex flex-col gap-4">

                        {/* Subtabs */}
                            <div className="mb-2">
                            <div className="flex items-center gap-2">
                                {(() => {
                                    const counts = {
                                        Semua: vendors.length,
                                        Menunggu: vendors.filter(v => v.status === 'PENDING').length,
                                        Dikonfirmasi: vendors.filter(v => v.status === 'VERIFIED').length,
                                        Ditolak: vendors.filter(v => v.status === 'REJECTED').length,
                                    } as Record<string, number>;

                                    const tabs = ['Semua','Menunggu','Dikonfirmasi','Ditolak'];
                                    return tabs.map(tab => {
                                        const key = tab;
                                        const isActive = activeTab === tab;
                                        const countKey = tab as keyof typeof counts;
                                        return (
                                            <button key={key} onClick={() => setActiveTab(tab)}
                                            className={`flex items-center gap-2 ${isActive ? 'bg-[#FF9A9E] text-white shadow-[0_8px_24px_-6px_rgba(255,94,126,0.24)]' : 'bg-white text-[#A8A8A8] border border-[#F4D7D4]'} rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all`}
                                            >
                                                <span>{tab}</span>
                                                <span className={`${isActive ? 'bg-white text-[#FF527B]' : 'bg-[#F4F4F6] text-[#A8A8A8]'} w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-bold`}>{counts[countKey] ?? 0}</span>
                                            </button>
                                        );
                                    });
                                })()}
                            </div>
                        </div>

                        {/* Filters Row: local search + category */}
                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-8">
                            <div className="lg:col-span-6 relative">
                                <svg className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C9B4AF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 21l-4.35-4.35" /><circle cx="11" cy="11" r="7" /></svg>
                                <input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1); }} placeholder="Cari vendor atau nama usaha..." className="w-full rounded-xl border border-[#F4D7D4] bg-white py-3 pl-11 pr-4 text-xs font-semibold text-[#2A2A2A] placeholder:text-[#C7B5B0] focus:border-[#FF9A9E] focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/10" />
                            </div>
                            <div className="lg:col-span-2 relative">
                                {(() => {
                                    const categories = Array.from(new Set(vendors.map(v => v.category).filter(Boolean)));
                                    return (
                                        <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }} className="w-full appearance-none rounded-xl border border-[#F4D7D4] bg-white py-3 px-4 pr-10 text-xs font-semibold focus:border-[#FF9A9E] focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/10">
                                            <option value="Semua">Semua Kategori</option>
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Table + Details */}
                        <div className="grid gap-6 lg:grid-cols-12 relative items-start">
                            <div id="vendor-table-panel" className={`overflow-hidden rounded-2xl border border-[#F4D7D4] bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] ${selectedVendorId ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-left">
                                        <thead>
                                            <tr className="border-b border-[#F4D7D4]/60 bg-[#FAFAFC] text-[10px] font-black uppercase tracking-widest text-[#A8A8A8]">
                                                <th className="px-6 py-5">Vendor</th>
                                                <th className="px-6 py-5">Nama Usaha</th>
                                                <th className="px-6 py-5">Kategori</th>
                                                <th className="px-6 py-5">Tanggal Daftar</th>
                                                {/* Kontak column removed per design */}
                                                <th className="px-6 py-5 text-center">Status</th>
                                                <th className="px-6 py-5 text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#F4D7D4]/50">
                                            {(() => {
                                                const filtered = vendors.filter(v => {
                                                    if (activeTab === 'Semua') {
                                                        // ok
                                                    } else if (activeTab === 'Menunggu' && v.status !== 'PENDING') return false;
                                                    else if (activeTab === 'Dikonfirmasi' && v.status !== 'VERIFIED') return false;
                                                    else if (activeTab === 'Ditolak' && v.status !== 'REJECTED') return false;

                                                    if (categoryFilter && categoryFilter !== 'Semua' && v.category !== categoryFilter) return false;

                                                    if (searchQuery && searchQuery.trim().length > 0) {
                                                        const q = searchQuery.trim().toLowerCase();
                                                        const name = (v.user?.name ?? '').toLowerCase();
                                                        const biz = (v.businessName ?? '').toLowerCase();
                                                        const id = (v.id ?? '').toLowerCase();
                                                        if (!name.includes(q) && !biz.includes(q) && !id.includes(q)) return false;
                                                    }

                                                    return true;
                                                });
                                                const total = filtered.length;
                                                const totalPages = Math.max(1, Math.ceil(total / perPage));
                                                const startIndex = total === 0 ? 0 : (page - 1) * perPage + 1;
                                                const endIndex = Math.min(page * perPage, total);
                                                const paged = filtered.slice((page - 1) * perPage, page * perPage);
                                                return paged.map(v => {
                                                const date = new Date(v.createdAt).toLocaleDateString('id-ID');
                                                const badgeClass = v.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border border-orange-100' : v.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100';
                                                const init = v.businessName ? v.businessName.charAt(0).toUpperCase() : 'V';
                                                return (
                                                    <tr key={v.id} id={`row-${v.id}`} className={`vendor-row hover:bg-[#FAFAFC] transition-all cursor-pointer ${selectedVendorId === v.id ? 'bg-[#FFF5F6] border-l-4 border-[#FF9A9E]' : ''}`} onClick={() => setSelectedVendorId(v.id)}>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] flex items-center justify-center text-white font-extrabold text-[11px] shrink-0">{init}</div>
                                                                <div className="overflow-hidden">
                                                                    <h5 className="text-xs font-black text-[#2A2A2A] truncate leading-none">{v.user?.name ?? 'Vendor Baru'}</h5>
                                                                    <p className="text-[10px] font-bold text-[#A8A8A8] truncate mt-1.5 leading-none">{v.user?.email ?? ''}</p>
                                                                    <p className="text-[9px] font-bold text-[#C7B5B0] uppercase tracking-wider mt-1.5 leading-none">{v.id}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-xs font-bold text-[#2A2A2A]">{v.businessName}</td>
                                                        <td className="px-6 py-5 text-xs font-bold text-[#A8A8A8]">{v.category ?? '-'}</td>
                                                        <td className="px-6 py-5"><p className="text-xs font-black text-[#2A2A2A]">{date}</p></td>
                                                        {/* contact column removed */}
                                                        <td className="px-6 py-5 text-center">
                                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${badgeClass}`}>{v.status === 'PENDING' ? 'Menunggu' : v.status === 'VERIFIED' ? 'Terverifikasi' : 'Ditolak'}</span>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                                                                <button onClick={() => setSelectedVendorId(v.id)} className="px-3 py-2 bg-white border border-[#F4D7D4] rounded-lg text-[11px] font-black tracking-widest shadow-sm normal-case">Lihat detail</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                                });
                                            })()}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex flex-col items-center justify-between gap-4 border-t border-[#F4D7D4]/50 p-6 sm:flex-row">
                                    {/* left: range text */}
                                    <span className="text-xs font-bold text-[#A8A8A8]">{(() => {
                                        const filtered = vendors.filter(v => {
                                            if (activeTab === 'Semua') return true;
                                            if (activeTab === 'Menunggu') return v.status === 'PENDING';
                                            if (activeTab === 'Dikonfirmasi') return v.status === 'VERIFIED';
                                            if (activeTab === 'Ditolak') return v.status === 'REJECTED';
                                            return true;
                                        });
                                        const total = filtered.length;
                                        const startIndex = total === 0 ? 0 : (page - 1) * perPage + 1;
                                        const endIndex = Math.min(page * perPage, total);
                                        return `Menampilkan ${startIndex} - ${endIndex} dari ${total} data`;
                                    })()}</span>

                                    {/* center: pagination controls */}
                                    <div className="flex items-center gap-2">
                                        {(() => {
                                            const filtered = vendors.filter(v => {
                                                if (activeTab === 'Semua') return true;
                                                if (activeTab === 'Menunggu') return v.status === 'PENDING';
                                                if (activeTab === 'Dikonfirmasi') return v.status === 'VERIFIED';
                                                if (activeTab === 'Ditolak') return v.status === 'REJECTED';
                                                return true;
                                            });
                                            const total = filtered.length;
                                            const totalPages = Math.max(1, Math.ceil(total / perPage));
                                            const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5);
                                                const canGoPrev = page > 1;
                                                const canGoNext = page < totalPages;
                                            return (
                                                <>
                                                        <button
                                                            onClick={() => canGoPrev && setPage(p => Math.max(1, p - 1))}
                                                            disabled={!canGoPrev}
                                                            aria-disabled={!canGoPrev}
                                                            className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4D7D4] text-[#A8A8A8] transition-all ${canGoPrev ? 'hover:bg-[#FDF1F0]' : 'cursor-not-allowed opacity-40'}`}
                                                        >
                                                            ‹
                                                        </button>
                                                    {pages.map(pn => (
                                                        <button key={pn} onClick={() => setPage(pn)} className={`${pn === page ? 'h-8 w-8 rounded-lg bg-[#FF9A9E] text-xs font-black text-white' : 'flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4D7D4] text-xs font-black text-[#A8A8A8] transition-all hover:bg-[#FDF1F0]'}`}>{pn}</button>
                                                    ))}
                                                        <button
                                                            onClick={() => canGoNext && setPage(p => Math.min(totalPages, p + 1))}
                                                            disabled={!canGoNext}
                                                            aria-disabled={!canGoNext}
                                                            className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4D7D4] text-[#A8A8A8] transition-all ${canGoNext ? 'hover:bg-[#FDF1F0]' : 'cursor-not-allowed opacity-40'}`}
                                                        >
                                                            ›
                                                        </button>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    {/* right: per-page select */}
                                    <div className="relative">
                                        <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} className="appearance-none rounded-xl border border-[#F4D7D4] bg-white py-2 px-4 pr-10 text-xs font-semibold text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/10">
                                            <option value={8}>8 / halaman</option>
                                            <option value={10}>10 / halaman</option>
                                            <option value={20}>20 / halaman</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div id="vendor-details-panel" className={`overflow-hidden rounded-2xl border border-[#F4D7D4] bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] ${selectedVendorId ? 'block lg:col-span-4' : 'hidden'}`}>
                                <div className="flex items-center justify-between border-b border-[#F4D7D4]/50 p-6">
                                    <h4 className="text-sm font-black uppercase tracking-wider text-[#2A2A2A]">Detail Vendor</h4>
                                    <button onClick={() => setSelectedVendorId(null)} className="text-[#D8C2BD] transition-colors hover:text-[#2A2A2A]">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                <div id="vendor-details-content" className="space-y-6 p-6">
                                    {selectedVendorId ? (() => {
                                        const v = vendors.find(x => x.id === selectedVendorId);
                                        if (!v) return <div>Data vendor tidak ditemukan.</div>;
                                        const statusBadge = v.status === 'PENDING' ? <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full border border-orange-100 uppercase">Menunggu Verifikasi</span> : v.status === 'VERIFIED' ? <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-100 uppercase">Terverifikasi</span> : <span className="bg-red-50 text-red-600 text-[10px] font-black px-3 py-1 rounded-full border border-red-100 uppercase">Ditolak</span>;
                                        return (
                                            <>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-[20px] bg-[#0A0A0A] flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">{v.businessName?.charAt(0)?.toUpperCase() ?? 'V'}</div>
                                                    <div>
                                                        <h4 className="text-base font-black text-[#2A2A2A] leading-tight">{v.businessName}</h4>
                                                        <p className="text-xs text-[#A8A8A8] mt-1 font-bold">{v.id}</p>
                                                        <div className="mt-2.5">{statusBadge}</div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 pt-6 border-t border-[#F4D7D4]/50">
                                                    <h5 className="text-[11px] font-black text-[#A8A8A8] uppercase tracking-widest">Informasi Usaha</h5>
                                                    <div className="space-y-3">
                                                        <div className="grid grid-cols-[110px_1fr] gap-4 text-xs">
                                                            <span className="font-bold text-[#A8A8A8]">Nama Usaha</span>
                                                            <span className="text-left font-black text-[#2A2A2A]">{v.businessName}</span>
                                                        </div>
                                                        <div className="grid grid-cols-[110px_1fr] gap-4 text-xs">
                                                            <span className="font-bold text-[#A8A8A8]">Kategori</span>
                                                            <span className="text-left font-black text-[#2A2A2A]">{v.category ?? '-'}</span>
                                                        </div>
                                                        <div className="grid grid-cols-[110px_1fr] gap-4 text-xs">
                                                            <span className="font-bold text-[#A8A8A8]">Alamat</span>
                                                            <span className="text-left font-bold leading-relaxed text-[#2A2A2A]">{[v.city, v.province].filter(Boolean).join(', ') || 'LOKASI BELUM DIATUR'}</span>
                                                        </div>
                                                        <div className="grid grid-cols-[110px_1fr] gap-4 text-xs">
                                                            <span className="font-bold text-[#A8A8A8]">No. Telepon</span>
                                                            <span className="text-left font-black text-[#2A2A2A]">{v.phone ?? '-'}</span>
                                                        </div>
                                                        <div className="grid grid-cols-[110px_1fr] gap-4 text-xs">
                                                            <span className="font-bold text-[#A8A8A8]">Email</span>
                                                            <span className="min-w-0 text-left font-black text-[#2A2A2A] break-words">{v.user?.email ?? '-'}</span>
                                                        </div>
                                                        <div className="space-y-1.5 pt-2">
                                                            <p className="font-bold text-[#A8A8A8] text-xs">Deskripsi</p>
                                                            <p className="text-xs font-medium text-[#6B6B6B] leading-relaxed">{v.description ?? '-'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-3 pt-6 border-t border-[#F4D7D4]/50">
                                                    <h5 className="text-[11px] font-black text-[#A8A8A8] uppercase tracking-widest">Dokumen Pendukung</h5>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between p-3 bg-[#FAFAFC] rounded-xl border border-[#F4F4F5]">
                                                            <div className="flex items-center gap-3">
                                                                <svg className="w-5 h-5 text-[#6B6B6B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2" /></svg>
                                                                <span className="text-xs font-bold text-[#6B6B6B]">KTP</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded uppercase border border-emerald-100">Terverifikasi</span>
                                                                <button aria-label="Preview KTP" onClick={() => setDocViewer({ open: true, title: 'KTP', url: 'https://via.placeholder.com/900x600?text=KTP' })} className="text-[#6B6B6B] hover:text-[#2A2A2A]">
                                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between p-3 bg-[#FAFAFC] rounded-xl border border-[#F4F4F5]">
                                                            <div className="flex items-center gap-3">
                                                                <svg className="w-5 h-5 text-[#6B6B6B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 10h18" /><path d="M7 6v12" /></svg>
                                                                <span className="text-xs font-bold text-[#6B6B6B]">Rekening Bank</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded uppercase border border-emerald-100">Terverifikasi</span>
                                                                <button aria-label="Preview Rekening Bank" onClick={() => setDocViewer({ open: true, title: 'Rekening Bank', url: 'https://via.placeholder.com/900x600?text=Rekening+Bank' })} className="text-[#6B6B6B] hover:text-[#2A2A2A]">
                                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between p-3 bg-[#FAFAFC] rounded-xl border border-[#F4F4F5]">
                                                            <div className="flex items-center gap-3">
                                                                <svg className="w-5 h-5 text-[#6B6B6B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4v16" /><path d="M6 8h12" /></svg>
                                                                <span className="text-xs font-bold text-[#6B6B6B]">Portofolio</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded uppercase border border-emerald-100 text-[10px]">Lihat</span>
                                                                <button aria-label="Preview Portofolio" onClick={() => setDocViewer({ open: true, title: 'Portofolio', url: 'https://via.placeholder.com/900x600?text=Portofolio' })} className="text-[#6B6B6B] hover:text-[#2A2A2A]">
                                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 pt-6 border-t border-[#F4D7D4]/50">
                                                    <button onClick={() => { if (selectedVendorId) handleReject(selectedVendorId); }} className="flex-1 border border-red-200 hover:bg-red-50 text-red-500 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest">Tolak</button>
                                                    <button onClick={() => { if (selectedVendorId) handleVerify(selectedVendorId); }} className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest">Verifikasi</button>
                                                </div>
                                            </>
                                        );
                                    })() : null}
                                </div>
                            </div>

                            {/* Document viewer modal (simple) */}
                            {docViewer.open ? (
                                <div className="fixed inset-0 z-50 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-black/40" onClick={() => setDocViewer({ open: false })}></div>
                                    <div className="relative max-w-[90%] max-h-[90%] w-[900px] bg-white rounded-2xl overflow-hidden shadow-xl">
                                        <div className="flex items-center justify-between p-4 border-b border-[#F4D7D4]/50">
                                            <h3 className="text-sm font-black">{docViewer.title}</h3>
                                            <button onClick={() => setDocViewer({ open: false })} className="text-[#A8A8A8] p-2">
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                        <div className="p-4 bg-[#FAFAFC] flex items-center justify-center" style={{ height: 540 }}>
                                            {docViewer.url ? (
                                                // image preview
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={docViewer.url} alt={docViewer.title} className="max-h-full max-w-full object-contain rounded-md" />
                                            ) : (
                                                <div className="text-sm text-[#6B6B6B]">Preview tidak tersedia.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* footer removed as requested */}
                </div>
            </div>
            </>
    );
}
