'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { getPendingVendors, verifyVendor, rejectVendor } from '@/services/admin.service';

const MapPinIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
const CalendarOutlineIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
);
const TrashIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
);
const LinkIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
);

function VendorCard({
    id,
    name,
    category,
    location,
    date,
    initial,
    accent = false,
    websiteLabel,
    onVerify,
    onReject,
    isProcessing = false
}: {
    id: string;
    name: string;
    category: string;
    location: string;
    date: string;
    initial: string;
    accent?: boolean;
    websiteLabel?: string;
    onVerify: (id: string) => void;
    onReject: (id: string) => void;
    isProcessing?: boolean;
}) {
    return (
        <div className="bg-white rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-6">
                <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
                    <div className={`absolute inset-0 border-2 border-dashed rounded-full ${accent ? 'border-[#FCE6E3]' : 'border-gray-300'}`} />
                    <div className={`w-[3.25rem] h-[3.25rem] rounded-full flex items-center justify-center ${accent ? 'bg-[#FDF1F0]' : 'bg-[#FAFAFC]'}`}>
                        <span className="text-xl font-black text-[#2A2A2A]">{initial}</span>
                    </div>
                </div>

                <div className="flex flex-col">
                    <h3 className="text-[15px] font-extrabold text-[#2A2A2A] mb-2.5 tracking-tight uppercase">
                        {name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-[#FAFAFC] text-gray-500 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                            {category}
                        </span>
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <MapPinIcon className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">{location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 ml-1">
                            <CalendarOutlineIcon className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">DAFTAR: {date}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                {websiteLabel ? (
                    <button disabled={isProcessing} className="flex items-center justify-center gap-2 flex-1 md:flex-none px-6 py-3.5 bg-[#FAFAFC] hover:bg-gray-100 text-[#2A2A2A] text-[9px] font-bold tracking-widest uppercase rounded-xl transition-colors">
                        <LinkIcon className="w-3.5 h-3.5" />
                        {websiteLabel}
                    </button>
                ) : null}
                <button disabled={isProcessing} onClick={() => onVerify(id)} className="flex-1 md:flex-none px-6 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[9px] font-bold tracking-widest uppercase rounded-xl transition-colors">
                    {isProcessing ? 'MEMPROSES...' : 'SETUJUI'}
                </button>
                <button disabled={isProcessing} onClick={() => onReject(id)} type="button" aria-label="Tolak vendor" title="Tolak vendor" className="w-11 h-11 flex items-center justify-center rounded-xl border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0">
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default function AdminVerifikasiVendorPage() {
    const [vendors, setVendors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchVendors = async () => {
        try {
            const data = await getPendingVendors();
            setVendors(data);
        } catch (error) {
            console.error("Gagal mengambil data vendor:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleVerify = async (id: string) => {
        setProcessingId(id);
        try {
            await verifyVendor(id);
            await fetchVendors();
        } catch (error) {
            console.error("Gagal menyetujui vendor", error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        setProcessingId(id);
        try {
            await rejectVendor(id, 'Ditolak oleh admin');
            await fetchVendors();
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
            <AdminHeader searchPlaceholder="CARI VENDOR YANG MENDAFTAR..." />

            <div className="flex-1 overflow-y-auto p-10 pb-16">
                <div className="max-w-[1100px] mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-2 block">
                                PENYARINGAN KUALITAS MITRA
                            </span>
                            <h1 className="text-4xl md:text-[2.75rem] leading-[1.05] font-black italic tracking-tighter text-[#2A2A2A]">
                                VERIFIKASI <br /> VENDOR BARU.
                            </h1>
                        </div>

                        <div className="flex items-center bg-white rounded-full px-6 py-2 border border-gray-100 shadow-sm h-14">
                            <div className="flex flex-col items-center justify-center pr-6 border-r border-gray-100">
                                <span className="text-[8px] font-bold tracking-widest text-[#A8A8A8] uppercase">ANTREAN</span>
                                <span className="text-sm font-black text-[#2A2A2A] leading-none mt-1">
                                    {vendors.length.toString().padStart(2, '0')}
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-center pl-6">
                                <span className="text-[8px] font-bold tracking-widest text-[#A8A8A8] uppercase">TINJAU HARI INI</span>
                                <span className="text-sm font-black text-emerald-500 leading-none mt-1">
                                    {vendors.length.toString().padStart(2, '0')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {vendors.length === 0 ? (
                            <div className="py-12 text-center text-sm text-gray-400 font-medium bg-white rounded-3xl border border-gray-100 shadow-sm">
                                Tidak ada antrean vendor yang perlu diverifikasi.
                            </div>
                        ) : (
                            vendors.map((vendor, index) => {
                                const initial = vendor.businessName.charAt(0).toUpperCase();
                                const date = new Date(vendor.createdAt).toLocaleDateString('id-ID');
                                return (
                                    <VendorCard
                                        key={vendor.id}
                                        id={vendor.id}
                                        name={vendor.businessName}
                                        category={vendor.user?.name ?? 'VENDOR BARU'}
                                        location={vendor.city ?? 'LOKASI BELUM DIATUR'}
                                        date={date}
                                        initial={initial}
                                        accent={index % 2 === 0}
                                        onVerify={handleVerify}
                                        onReject={handleReject}
                                        isProcessing={processingId === vendor.id}
                                    />
                                );
                            })
                        )}
                    </div>

                    <div className="mt-16 pb-4 text-center">
                        <p className="text-[8px] font-bold tracking-[0.3em] text-[#A8A8A8] uppercase">
                            PLANORA ECOSYSTEM • MODUL VERIFIKASI V.1 • 2026
                        </p>
                    </div>
                </div>
            </div>
            </>
    );
}
