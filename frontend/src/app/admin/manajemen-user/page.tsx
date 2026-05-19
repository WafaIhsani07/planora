'use client';

import React, { useEffect, useMemo, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import { getAllUsers, getUserById, updateUserStatus } from '@/services/admin.service';

const EyeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);
const PencilIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
);
const BanIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="m4.93 4.93 14.14 14.14" /></svg>
);

export default function AdminManajemenUserPage() {
    const [activeTab, setActiveTab] = useState<'semua' | 'pelanggan' | 'vendor'>('semua');
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalCustomer: 0, totalVendor: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [detailLoadingId, setDetailLoadingId] = useState<string | null>(null);
    const [pendingDisableUser, setPendingDisableUser] = useState<any | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const data = await getAllUsers();

                console.log("Data User dari Backend:", data); // Debugging

                const userList = data.users || [];
                setAllUsers(userList);

                const customers = userList.filter((u: any) => u.role === 'CUSTOMER').length;
                const vendors = userList.filter((u: any) => u.role === 'VENDOR').length;
                setStats({ totalCustomer: customers, totalVendor: vendors });
            } catch (error) {
                console.error("Gagal mengambil data user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [activeTab, searchQuery, perPage]);

    const filteredUsers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return allUsers.filter((user: any) => {
            if (activeTab === 'pelanggan' && user.role !== 'CUSTOMER') return false;
            if (activeTab === 'vendor' && user.role !== 'VENDOR') return false;

            if (!query) return true;

            const name = (user.name ?? '').toLowerCase();
            const email = (user.email ?? '').toLowerCase();
            return name.includes(query) || email.includes(query);
        });
    }, [allUsers, activeTab, searchQuery]);
    const total = filteredUsers.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const startIndex = total === 0 ? 0 : (page - 1) * perPage + 1;
    const endIndex = total === 0 ? 0 : Math.min(page * perPage, total);
    const pagedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);
    const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

    const handleOpenDetail = async (user: any) => {
        setDetailLoadingId(user.id);
        try {
            const detail = await getUserById(user.id);
            setSelectedUser(detail ?? user);
        } catch (error) {
            console.error('Gagal mengambil detail user:', error);
            setSelectedUser(user);
        } finally {
            setDetailLoadingId(null);
        }
    };

    const handleDisableUser = async (user: any) => {
        setPendingDisableUser(user);
    };

    const confirmDisableUser = async () => {
        if (!pendingDisableUser) return;

        const user = pendingDisableUser;
        const nextIsActive = !user.isActive;
        setPendingDisableUser(null);
        setActionLoadingId(user.id);
        try {
            await updateUserStatus(user.id, nextIsActive);
            setAllUsers(prev => prev.map(item => item.id === user.id ? { ...item, isActive: nextIsActive } : item));
            if (selectedUser?.id === user.id) {
                setSelectedUser((current: any) => current ? { ...current, isActive: nextIsActive } : current);
            }
        } catch (error) {
            console.error(`${nextIsActive ? 'Gagal mengaktifkan' : 'Gagal menonaktifkan'} user:`, error);
            window.alert(`Gagal ${nextIsActive ? 'mengaktifkan' : 'menonaktifkan'} user`);
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <>
            <AdminHeader hideSearch />

            <div className="flex-1 overflow-y-auto p-10 pb-16">
                <div className="max-w-[1300px] mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-6">
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-2 block">AUDIT & PENGAWASAN PENGGUNA</span>
                            <h1 className="text-3xl md:text-4xl font-black text-[#2A2A2A]">Manajemen Pengguna Sistem</h1>
                        </div>

                        <div className="flex items-center bg-white rounded-full px-8 py-2 border border-gray-100 shadow-sm h-14">
                            <div className="flex flex-col items-center justify-center pr-8 border-r border-gray-100">
                                <span className="text-[8px] font-bold tracking-widest text-[#A8A8A8] uppercase">TOTAL PELANGGAN</span>
                                <span className="text-base font-black text-[#2A2A2A] leading-none mt-1">{stats.totalCustomer}</span>
                            </div>
                            <div className="flex flex-col items-center justify-center pl-8">
                                <span className="text-[8px] font-bold tracking-widest text-[#A8A8A8] uppercase">TOTAL VENDOR</span>
                                <span className="text-base font-black text-[#2A2A2A] leading-none mt-1">{stats.totalVendor}</span>
                            </div>
                        </div>
                    </div>

                    {/* Filter pills (outside card) */}
                    <div className="mb-4">
                        <div className="flex items-center gap-3">
                            {(() => {
                                const counts = {
                                    Semua: allUsers.length,
                                    Pelanggan: allUsers.filter(u => u.role === 'CUSTOMER').length,
                                    Vendor: allUsers.filter(u => u.role === 'VENDOR').length,
                                } as Record<string, number>;
                                const tabs = ['Semua','Pelanggan','Vendor'];
                                return tabs.map(tab => {
                                    const key = tab;
                                    const isActive = (activeTab === 'semua' && tab === 'Semua') || (activeTab === 'pelanggan' && tab === 'Pelanggan') || (activeTab === 'vendor' && tab === 'Vendor');
                                    const countKey = tab as keyof typeof counts;
                                    return (
                                        <button key={key} onClick={() => setActiveTab(tab.toLowerCase() as any)}
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

                    <div className="mb-4">
                        <div className="relative max-w-[380px]">
                            <svg className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D8A7A0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama atau email user..."
                                aria-label="Cari nama atau email user"
                                className="w-full rounded-xl border border-[#F4D7D4] bg-white/80 py-2 pl-10 pr-3 text-sm font-semibold text-[#2A2A2A] placeholder-[#D8A7A0] transition-all focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/15"
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-[#F4D7D4] bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] p-0 flex flex-col">

                        {isLoading ? (
                            <div className="py-20 flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9A9E]"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-[#F4D7D4]/60 bg-[#FAFAFC] text-[10px] font-black uppercase tracking-widest text-[#A8A8A8]">
                                            <th className="px-6 py-5">DETAIL IDENTITAS</th>
                                            <th className="px-6 py-5 text-center">TIPE PERAN</th>
                                            <th className="px-6 py-5 text-center">TANGGAL JOIN</th>
                                            <th className="px-6 py-5 text-center align-middle">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F4D7D4]/50">
                                        {pagedUsers.length === 0 ? (
                                            <tr><td colSpan={4} className="py-10 text-center text-xs text-gray-400">Tidak ada data user.</td></tr>
                                        ) : (
                                            pagedUsers.map((user) => (
                                                <tr key={user.id} className="transition-colors hover:bg-gray-50/50">
                                                    <td className="px-6 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-[#F4F4F5] rounded-full flex items-center justify-center shrink-0 uppercase">
                                                                <span className="text-[11px] font-black text-[#A8A8A8] tracking-widest">{user.name?.substring(0,2) || '??'}</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[13px] font-extrabold text-[#2A2A2A] mb-1 tracking-tight uppercase">{user.name}</span>
                                                                <span className="text-[8px] font-bold text-[#A8A8A8] uppercase tracking-wider">{user.email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 text-center">
                                                        <div className="flex justify-center">
                                                            <StatusBadge text={user.role} variant={user.role === 'VENDOR' ? 'emerald' : user.role === 'ADMIN' ? 'red' : 'blue'} rounded="md" />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 text-center">
                                                        <span className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-wider">{new Date(user.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                    </td>
                                                    <td className="px-6 py-6 text-center align-middle">
                                                        <div className="flex justify-center gap-2">
                                                            <button type="button" onClick={() => handleOpenDetail(user)} aria-label="Detail user" className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-100 bg-[#FAFAFC] px-3 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#2A2A2A] disabled:cursor-not-allowed disabled:opacity-50" disabled={detailLoadingId === user.id}>
                                                                <EyeIcon className="w-4 h-4" />
                                                                <span>{detailLoadingId === user.id ? 'Membuka...' : 'Detail'}</span>
                                                            </button>
                                                            <button type="button" onClick={() => handleDisableUser(user)} disabled={actionLoadingId === user.id} aria-label={user.isActive === false ? 'Aktifkan user' : 'Nonaktifkan user'} className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${user.isActive === false ? 'border border-emerald-50 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700' : 'border border-red-50 bg-[#FDF1F0] text-red-400 hover:bg-red-50 hover:text-red-500'}`}>
                                                                <BanIcon className="w-4 h-4" />
                                                                <span>{actionLoadingId === user.id ? 'Memproses...' : user.isActive === false ? 'Aktifkan' : 'Nonaktifkan'}</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="flex flex-col gap-4 border-t border-[#F4D7D4]/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div className="text-sm font-semibold text-[#A8A8A8]">
                                Menampilkan {startIndex} - {endIndex} dari {total} data
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
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
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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
                                    onChange={(e) => setPerPage(Number(e.target.value))}
                                    className="appearance-none rounded-xl border border-[#E6E8EB] bg-white px-4 py-2 pr-10 text-sm font-semibold text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/15"
                                >
                                    <option value={10}>10 / halaman</option>
                                    <option value={20}>20 / halaman</option>
                                    <option value={30}>30 / halaman</option>
                                </select>
                                <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8A8A8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>

                        {selectedUser ? (
                            <div className="fixed inset-y-0 right-0 z-40 flex w-full max-w-[420px] flex-col border-l border-[#F4D7D4] bg-white shadow-[-20px_0_50px_-20px_rgba(0,0,0,0.18)]">
                                <div className="flex items-center justify-between border-b border-[#F4D7D4]/60 px-6 py-5">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A8A8]">Detail User</p>
                                        <h3 className="mt-1 text-lg font-black text-[#2A2A2A]">{selectedUser.name || selectedUser.email}</h3>
                                    </div>
                                    <button type="button" onClick={() => setSelectedUser(null)} className="text-[#A8A8A8] transition-colors hover:text-[#2A2A2A]" aria-label="Tutup detail user">
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-5 overflow-y-auto px-6 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F4F4F5] text-lg font-black uppercase text-[#A8A8A8]">
                                            {selectedUser.name?.substring(0, 2) || '??'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-[#2A2A2A]">{selectedUser.name || '-'}</p>
                                            <p className="mt-1 text-xs font-bold text-[#A8A8A8]">{selectedUser.email}</p>
                                            <div className="mt-2">
                                                <StatusBadge text={selectedUser.role} variant={selectedUser.role === 'VENDOR' ? 'emerald' : selectedUser.role === 'ADMIN' ? 'red' : 'blue'} rounded="md" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 border-t border-[#F4D7D4]/60 pt-5">
                                        <div className="grid grid-cols-[110px_1fr] gap-4 text-xs">
                                            <span className="font-bold text-[#A8A8A8]">Email</span>
                                            <span className="break-words font-black text-[#2A2A2A]">{selectedUser.email}</span>
                                        </div>
                                        <div className="grid grid-cols-[110px_1fr] gap-4 text-xs">
                                            <span className="font-bold text-[#A8A8A8]">No. Telepon</span>
                                            <span className="font-black text-[#2A2A2A]">{selectedUser.phone || '-'}</span>
                                        </div>
                                        <div className="grid grid-cols-[110px_1fr] gap-4 text-xs">
                                            <span className="font-bold text-[#A8A8A8]">Status</span>
                                            <span className="font-black text-[#2A2A2A]">{selectedUser.isActive === false ? 'Nonaktif' : 'Aktif'}</span>
                                        </div>
                                        <div className="grid grid-cols-[110px_1fr] gap-4 text-xs">
                                            <span className="font-bold text-[#A8A8A8]">Bergabung</span>
                                            <span className="font-black text-[#2A2A2A]">{new Date(selectedUser.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </div>

                                    {selectedUser.vendor ? (
                                        <div className="space-y-3 border-t border-[#F4D7D4]/60 pt-5">
                                            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#A8A8A8]">Data Vendor</h4>
                                            <div className="grid grid-cols-[110px_1fr] gap-4 text-xs">
                                                <span className="font-bold text-[#A8A8A8]">Nama Usaha</span>
                                                <span className="font-black text-[#2A2A2A]">{selectedUser.vendor.businessName || '-'}</span>
                                            </div>
                                            <div className="grid grid-cols-[110px_1fr] gap-4 text-xs">
                                                <span className="font-bold text-[#A8A8A8]">Kota</span>
                                                <span className="font-black text-[#2A2A2A]">{selectedUser.vendor.city || '-'}</span>
                                            </div>
                                            <div className="grid grid-cols-[110px_1fr] gap-4 text-xs">
                                                <span className="font-bold text-[#A8A8A8]">Provinsi</span>
                                                <span className="font-black text-[#2A2A2A]">{selectedUser.vendor.province || '-'}</span>
                                            </div>
                                            <div className="grid grid-cols-[110px_1fr] gap-4 text-xs">
                                                <span className="font-bold text-[#A8A8A8]">Status Vendor</span>
                                                <span className="font-black text-[#2A2A2A]">{selectedUser.vendor.status || '-'}</span>
                                            </div>
                                            {'_count' in selectedUser ? (
                                                <>
                                                    <div className="grid grid-cols-[110px_1fr] gap-4 text-xs">
                                                        <span className="font-bold text-[#A8A8A8]">Booking</span>
                                                        <span className="font-black text-[#2A2A2A]">{selectedUser._count?.bookings ?? 0}</span>
                                                    </div>
                                                    <div className="grid grid-cols-[110px_1fr] gap-4 text-xs">
                                                        <span className="font-bold text-[#A8A8A8]">Review</span>
                                                        <span className="font-black text-[#2A2A2A]">{selectedUser._count?.reviews ?? 0}</span>
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}

                        {pendingDisableUser ? (
                            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                                <button
                                    type="button"
                                    className="absolute inset-0 bg-black/40"
                                    aria-label="Tutup konfirmasi nonaktifkan user"
                                    onClick={() => setPendingDisableUser(null)}
                                />
                                <div className="relative w-full max-w-md rounded-2xl border border-[#F4D7D4] bg-white p-6 shadow-2xl">
                                    <h3 className="text-lg font-black text-[#2A2A2A]">{pendingDisableUser.isActive === false ? 'Aktifkan user?' : 'Nonaktifkan user?'}</h3>
                                    <p className="mt-2 text-sm text-[#6B6B6B]">
                                        {pendingDisableUser.isActive === false ? 'Aktifkan' : 'Nonaktifkan'} user {pendingDisableUser.name ?? pendingDisableUser.email} sekarang?
                                    </p>
                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setPendingDisableUser(null)}
                                            className="rounded-xl border border-[#E6E8EB] bg-white px-4 py-2 text-sm font-bold text-[#2A2A2A] hover:bg-gray-50"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={confirmDisableUser}
                                            className="rounded-xl bg-[#FF9A9E] px-4 py-2 text-sm font-bold text-white hover:bg-[#ff8a8f]"
                                        >
                                            {pendingDisableUser.isActive === false ? 'Aktifkan' : 'Nonaktifkan'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}
