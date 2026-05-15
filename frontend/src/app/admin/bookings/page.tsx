"use client";

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import FilterTabs from '@/components/admin/FilterTabs';
import AdminPagination from '@/components/admin/AdminPagination';
import StatusBadge from '@/components/admin/StatusBadge';
import { getAllBookings } from '@/services/admin.service';

const EyeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);
const CalendarIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
);
const ClipboardListIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="8" height="4" x="8" y="2" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></svg>
);
const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
);
const XCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
);
const XIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);
const UserIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
);
const BuildingIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 22h16"/><path d="M12 2 4 7h16Z"/><path d="M18 22V11"/><path d="M6 22V11"/></svg>
);
const CreditCardIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
);

type BookingStatus = 'MENUNGGU' | 'DIKONFIRMASI' | 'BERJALAN' | 'SELESAI' | 'DIBATALKAN';

const statusVariantMap: Record<string, 'blue' | 'emerald' | 'red'> = {
    PENDING: 'blue',
    CONFIRMED: 'emerald',
    IN_PROGRESS: 'blue',
    COMPLETED: 'emerald',
    CANCELLED: 'red',
};

const mapStatusToIndonesian = (status: string) => {
    switch (status) {
        case 'PENDING': return 'MENUNGGU';
        case 'CONFIRMED': return 'DIKONFIRMASI';
        case 'IN_PROGRESS': return 'BERJALAN';
        case 'COMPLETED': return 'SELESAI';
        case 'CANCELLED': return 'DIBATALKAN';
        default: return status;
    }
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

type TabValue = 'semua' | 'menunggu' | 'dikonfirmasi' | 'selesai' | 'dibatalkan';

export default function AdminManajemenBookingPage() {
    const [activeTab, setActiveTab] = useState<TabValue>('semua');
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
    const [data, setData] = useState<{ bookings: any[], stats: any, total: number }>({ bookings: [], stats: {}, total: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let statusFilter = undefined;
                if (activeTab === 'menunggu') statusFilter = 'PENDING';
                if (activeTab === 'dikonfirmasi') statusFilter = 'CONFIRMED';
                if (activeTab === 'selesai') statusFilter = 'COMPLETED';
                if (activeTab === 'dibatalkan') statusFilter = 'CANCELLED';

                const response = await getAllBookings({ status: statusFilter });
                setData(response);
            } catch (error) {
                console.error("Gagal mengambil data booking", error);
            } finally {
                setIsLoading(false);
            }
        };

        setIsLoading(true);
        fetchData();
    }, [activeTab]);

    if (isLoading && data.bookings.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center" data-testid="loading-spinner">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9A9E]"></div>
            </div>
        );
    }

    return (
        <>
            <AdminHeader searchPlaceholder="Cari ID booking, pelanggan, atau vendor..." />

            <div className="p-8 pb-16">
                <div className="max-w-[1300px] mx-auto flex flex-col gap-8">

                    {/* Page Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-[#2A2A2A]/40 uppercase mb-2 block">
                                PENGAWASAN TRANSAKSI LAYANAN
                            </span>
                            <h1 className="text-4xl md:text-[2.75rem] leading-[1.05] font-black italic tracking-tighter text-[#2A2A2A]">
                                MANAJEMEN <br /> BOOKING.
                            </h1>
                        </div>

                        <div className="flex items-center bg-white rounded-full px-8 py-2 border border-[#FF9A9E]/20 shadow-sm h-14 gap-0">
                            <div className="flex flex-col items-center justify-center pr-6 border-r border-gray-100">
                                <span className="text-[8px] font-bold tracking-widest text-[#2A2A2A]/40 uppercase">TOTAL BOOKING</span>
                                <span className="text-base font-black text-[#2A2A2A] leading-none mt-1">
                                    {data.stats?.total?.toString().padStart(2, '0') ?? '00'}
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-center px-6 border-r border-gray-100">
                                <span className="text-[8px] font-bold tracking-widest text-[#2A2A2A]/40 uppercase">MENUNGGU</span>
                                <span className="text-base font-black text-[#FF9A9E] leading-none mt-1">
                                    {data.stats?.pending?.toString().padStart(2, '0') ?? '00'}
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-center pl-6">
                                <span className="text-[8px] font-bold tracking-widest text-[#2A2A2A]/40 uppercase">SELESAI</span>
                                <span className="text-base font-black text-emerald-500 leading-none mt-1">
                                    {data.stats?.completed?.toString().padStart(2, '0') ?? '00'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { icon: <ClipboardListIcon className="w-4 h-4 text-[#FF9A9E]" />, label: 'Total Booking', value: data.stats?.total ?? 0, sub: 'Semua Status' },
                            { icon: <CalendarIcon className="w-4 h-4 text-[#FF9A9E]" />, label: 'Menunggu Konfirmasi', value: data.stats?.pending ?? 0, sub: 'Perlu tindakan' },
                            { icon: <CheckCircleIcon className="w-4 h-4 text-emerald-500" />, label: 'Selesai', value: data.stats?.completed ?? 0, sub: 'Sudah diselesaikan' },
                            { icon: <XCircleIcon className="w-4 h-4 text-red-400" />, label: 'Dibatalkan', value: (data.stats?.total ?? 0) - (data.stats?.pending ?? 0) - (data.stats?.completed ?? 0), sub: 'Status lainnya' },
                        ].map((card) => (
                            <div key={card.label} className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-8px_rgba(255,154,158,0.15)] border border-white flex flex-col gap-3">
                                <div className="w-8 h-8 rounded-xl bg-[#FDF1F0] flex items-center justify-center">
                                    {card.icon}
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold tracking-[0.15em] text-[#2A2A2A]/40 uppercase mb-1">{card.label}</p>
                                    <p className="text-2xl font-black italic tracking-tighter text-[#2A2A2A]">{card.value}</p>
                                    <p className="text-[9px] font-semibold text-[#2A2A2A]/30 mt-0.5">{card.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_-8px_rgba(255,154,158,0.15)] border border-white p-6 flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <FilterTabs
                                active={activeTab}
                                onChange={setActiveTab}
                                tabs={[
                                    { label: 'SEMUA', value: 'semua' },
                                    { label: 'MENUNGGU', value: 'menunggu' },
                                    { label: 'DIKONFIRMASI', value: 'dikonfirmasi' },
                                    { label: 'SELESAI', value: 'selesai' },
                                    { label: 'DIBATALKAN', value: 'dibatalkan' },
                                ]}
                            />
                            <span className="text-[9px] font-bold tracking-[0.2em] text-[#2A2A2A]/30 uppercase">
                                PERIODE: MEI 2026
                            </span>
                        </div>

                        {/* Table Header */}
                        <div className="flex items-center pb-4 border-b border-gray-50">
                            <div className="w-[5%] text-[9px] font-bold tracking-[0.15em] text-[#2A2A2A]/30 uppercase">#</div>
                            <div className="w-[20%] text-[9px] font-bold tracking-[0.15em] text-[#2A2A2A]/30 uppercase">ID & Pelanggan</div>
                            <div className="w-[20%] text-[9px] font-bold tracking-[0.15em] text-[#2A2A2A]/30 uppercase">Vendor & Layanan</div>
                            <div className="w-[15%] text-[9px] font-bold tracking-[0.15em] text-[#2A2A2A]/30 uppercase">Tanggal Acara</div>
                            <div className="w-[15%] text-[9px] font-bold tracking-[0.15em] text-[#2A2A2A]/30 uppercase">Nominal</div>
                            <div className="w-[15%] text-[9px] font-bold tracking-[0.15em] text-[#2A2A2A]/30 uppercase text-center">Status</div>
                            <div className="w-[10%] text-[9px] font-bold tracking-[0.15em] text-[#2A2A2A]/30 uppercase text-right">Aksi</div>
                        </div>

                        {/* Table Rows */}
                        {data.bookings.map((booking, i) => {
                            const date = new Date(booking.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                            return (
                                <div
                                    key={booking.id}
                                    className="flex items-center py-4 border-b border-gray-50 last:border-0 hover:bg-[#FDF1F0]/30 transition-colors rounded-xl px-2"
                                >
                                    <div className="w-[5%]">
                                        <span className="text-[10px] font-bold text-[#2A2A2A]/20">{i + 1}</span>
                                    </div>
                                    <div className="w-[20%] flex flex-col pr-2">
                                        <span className="text-[10px] font-extrabold text-[#2A2A2A] mb-0.5 tracking-wider uppercase truncate">{booking.id}</span>
                                        <span className="text-[9px] font-semibold text-[#2A2A2A]/50 truncate">{booking.customer?.name}</span>
                                        <span className="text-[8px] font-medium text-[#2A2A2A]/30 truncate">{booking.customer?.email}</span>
                                    </div>
                                    <div className="w-[20%] flex flex-col pr-2">
                                        <span className="text-[10px] font-bold text-[#2A2A2A] truncate">{booking.vendor?.businessName}</span>
                                        <span className="text-[9px] font-medium text-[#2A2A2A]/40 truncate">{booking.layanan?.name}</span>
                                    </div>
                                    <div className="w-[15%]">
                                        <span className="text-[10px] font-bold text-[#2A2A2A]/60">{date}</span>
                                    </div>
                                    <div className="w-[15%]">
                                        <span className="text-[11px] font-extrabold text-[#2A2A2A]">{formatCurrency(booking.totalPrice)}</span>
                                    </div>
                                    <div className="w-[15%] flex justify-center">
                                        <StatusBadge text={mapStatusToIndonesian(booking.status)} variant={statusVariantMap[booking.status] || 'blue'} />
                                    </div>
                                    <div className="w-[10%] flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedBooking(booking)}
                                            className="w-9 h-9 bg-[#FDF1F0] hover:bg-[#FCE6E3] border border-[#FF9A9E]/10 rounded-xl flex items-center justify-center text-[#FF9A9E] hover:text-[#FF527B] transition-colors"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {data.bookings.length === 0 && !isLoading && (
                            <div className="py-8 text-center text-xs text-gray-400 font-medium">
                                Tidak ada data pemesanan.
                            </div>
                        )}
                    </div>

                    <AdminPagination pages={[1, 2, 3]} currentPage={1} />

                    <div className="pb-2 text-center">
                        <p className="text-[8px] font-bold tracking-[0.3em] text-[#2A2A2A]/20 uppercase">
                            PLANORA ECOSYSTEM • MANAJEMEN BOOKING • 2026
                        </p>
                    </div>
                </div>
            </div>

{/* DETAIL MODAL */}
{selectedBooking && (
    <>
        {/* Backdrop */}
        <div
            className="fixed inset-0 z-40 bg-[#2A2A2A]/50 backdrop-blur-sm"
            onClick={() => setSelectedBooking(null)}
        />

        {/* Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-[600px] max-h-[90vh] flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 flex-shrink-0">
                    <div>
                        <p className="text-[9px] font-bold tracking-[0.2em] text-[#2A2A2A]/30 uppercase mb-1">
                            Detail Booking
                        </p>
                        <h2 className="text-lg font-black italic tracking-tighter text-[#2A2A2A] uppercase">
                            {selectedBooking.id}
                        </h2>
                    </div>
                    <button
                        onClick={() => setSelectedBooking(null)}
                        className="w-9 h-9 rounded-xl bg-[#FAFAFC] hover:bg-gray-100 flex items-center justify-center text-[#2A2A2A]/40 hover:text-[#2A2A2A] transition-colors"
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4">

                    {/* Status & Tanggal Buat */}
                    <div className="flex items-center justify-between">
                        <StatusBadge
                            text={mapStatusToIndonesian(selectedBooking.status)}
                            variant={statusVariantMap[selectedBooking.status] || 'blue'}
                        />
                        <span className="text-[9px] font-bold text-[#2A2A2A]/30 uppercase tracking-wider">
                            Dibuat: {new Date(selectedBooking.createdAt).toLocaleDateString('id-ID')}
                        </span>
                    </div>

                    {/* Grid 2 kolom */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Pelanggan */}
                        <div className="bg-[#FAFAFC] rounded-2xl p-5 flex flex-col gap-2">
                            <div className="flex items-center gap-2 mb-1">
                                <UserIcon className="w-4 h-4 text-[#FF9A9E]" />
                                <span className="text-[9px] font-black tracking-[0.2em] text-[#2A2A2A]/40 uppercase">
                                    Pelanggan
                                </span>
                            </div>
                            <span className="text-[13px] font-extrabold text-[#2A2A2A]">
                                {selectedBooking.customer?.name}
                            </span>
                            <span className="text-[10px] font-medium text-[#2A2A2A]/50">
                                {selectedBooking.customer?.email}
                            </span>
                            <span className="text-[10px] font-medium text-[#2A2A2A]/50">
                                {selectedBooking.customer?.phone || '-'}
                            </span>
                        </div>

                        {/* Vendor */}
                        <div className="bg-[#FAFAFC] rounded-2xl p-5 flex flex-col gap-2">
                            <div className="flex items-center gap-2 mb-1">
                                <BuildingIcon className="w-4 h-4 text-[#FF9A9E]" />
                                <span className="text-[9px] font-black tracking-[0.2em] text-[#2A2A2A]/40 uppercase">
                                    Vendor
                                </span>
                            </div>
                            <span className="text-[13px] font-extrabold text-[#2A2A2A]">
                                {selectedBooking.vendor?.businessName}
                            </span>
                            <span className="text-[10px] font-bold text-[#FF9A9E]">
                                {selectedBooking.layanan?.kategori?.name || 'Kategori Umum'}
                            </span>
                            <span className="text-[10px] font-medium text-[#2A2A2A]/50">
                                {selectedBooking.layanan?.name}
                            </span>
                        </div>

                        {/* Jadwal */}
                        <div className="bg-[#FAFAFC] rounded-2xl p-5 flex flex-col gap-2">
                            <div className="flex items-center gap-2 mb-1">
                                <CalendarIcon className="w-4 h-4 text-[#FF9A9E]" />
                                <span className="text-[9px] font-black tracking-[0.2em] text-[#2A2A2A]/40 uppercase">
                                    Jadwal & Lokasi
                                </span>
                            </div>
                            <div className="flex gap-4">
                                <div>
                                    <p className="text-[8px] font-bold text-[#2A2A2A]/30 uppercase tracking-wider mb-0.5">
                                        Tanggal
                                    </p>
                                    <p className="text-[11px] font-extrabold text-[#2A2A2A]">
                                        {new Date(selectedBooking.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-bold text-[#2A2A2A]/30 uppercase tracking-wider mb-0.5">
                                        Catatan
                                    </p>
                                    <p className="text-[11px] font-extrabold text-[#2A2A2A] max-w-[150px] truncate">
                                        {selectedBooking.notes || '-'}
                                    </p>
                                </div>
                            </div>
                            <p className="text-[10px] font-medium text-[#2A2A2A]/50 leading-relaxed">
                                {selectedBooking.eventAddress || 'Sesuai Layanan'}
                            </p>
                        </div>

                        {/* Pembayaran */}
                        <div className="bg-[#FAFAFC] rounded-2xl p-5 flex flex-col gap-2">
                            <div className="flex items-center gap-2 mb-1">
                                <CreditCardIcon className="w-4 h-4 text-[#FF9A9E]" />
                                <span className="text-[9px] font-black tracking-[0.2em] text-[#2A2A2A]/40 uppercase">
                                    Pembayaran
                                </span>
                            </div>
                            <div className="flex gap-4">
                                <div>
                                    <p className="text-[8px] font-bold text-[#2A2A2A]/30 uppercase tracking-wider mb-0.5">
                                        Total
                                    </p>
                                    <p className="text-[13px] font-black text-[#2A2A2A]">
                                        {formatCurrency(selectedBooking.totalPrice)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <span className="text-[9px] font-bold text-[#2A2A2A]/30 uppercase tracking-wider">
                                    Status
                                </span>
                                <span className={`text-[10px] font-black uppercase tracking-wider ${
                                    selectedBooking.payment?.status === 'PAID'
                                        ? 'text-emerald-500'
                                        : 'text-[#2A2A2A]/30'
                                }`}>
                                    {selectedBooking.payment?.status || 'BELUM BAYAR'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Catatan */}
                    {selectedBooking.catatan !== '-' && (
                        <div className="bg-[#FDF1F0] rounded-2xl p-5">
                            <p className="text-[9px] font-black tracking-[0.2em] text-[#2A2A2A]/40 uppercase mb-2">
                                Catatan Pelanggan
                            </p>
                            <p className="text-[11px] font-medium text-[#2A2A2A]/70 leading-relaxed">
                                {selectedBooking.catatan}
                            </p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-5 border-t border-gray-50 flex-shrink-0 flex gap-3">
                    <button
                        onClick={() => setSelectedBooking(null)}
                        className="w-full py-3.5 bg-[#FAFAFC] border border-gray-100 text-[#2A2A2A]/40 rounded-xl text-[9px] font-black tracking-widest uppercase hover:text-[#2A2A2A] transition-colors"
                    >
                        TUTUP
                    </button>
                </div>

            </div>
        </div>
    </>
)}
        </>
    );
}