'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import FilterTabs from '@/components/admin/FilterTabs';
import AdminPagination from '@/components/admin/AdminPagination';
import StatusBadge from '@/components/admin/StatusBadge';
import { getAllUsers } from '@/services/admin.service';

const EyeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);
const PencilIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
);

export default function AdminManajemenUserPage() {
    const [activeTab, setActiveTab] = useState<'semua' | 'pelanggan' | 'vendor'>('semua');
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalCustomer: 0, totalVendor: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const roleMap: Record<string, string> = {
                    pelanggan: 'CUSTOMER',
                    vendor: 'VENDOR'
                };
                
                const params = activeTab !== 'semua' ? { role: roleMap[activeTab] } : {};
                const data = await getAllUsers(params);
                
                console.log("Data User dari Backend:", data); // Debugging
                
                const userList = data.users || [];
                setUsers(userList);
                
                if (activeTab === 'semua') {
                    const customers = userList.filter((u: any) => u.role === 'CUSTOMER').length;
                    const vendors = userList.filter((u: any) => u.role === 'VENDOR').length;
                    setStats({ totalCustomer: customers, totalVendor: vendors });
                }
            } catch (error) {
                console.error("Gagal mengambil data user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [activeTab]);

    return (
        <>
            <AdminHeader searchPlaceholder="Cari nama atau email user..." />

            <div className="flex-1 overflow-y-auto p-10 pb-16">
                <div className="max-w-[1300px] mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-2 block">
                                AUDIT & PENGAWASAN PENGGUNA
                            </span>
                            <h1 className="text-4xl md:text-[2.75rem] leading-[1.05] font-black italic tracking-tighter text-[#2A2A2A]">
                                MANAJEMEN <br /> PENGGUNA SISTEM.
                            </h1>
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

                    <div className="bg-white rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 flex flex-col">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                            <FilterTabs
                                active={activeTab}
                                onChange={setActiveTab}
                                tabs={[
                                    { label: 'SEMUA', value: 'semua' },
                                    { label: 'PELANGGAN', value: 'pelanggan' },
                                    { label: 'VENDOR', value: 'vendor' },
                                ]}
                            />

                            <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">
                                MONITORING {users.length} PENGGUNA AKTIF
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="py-20 flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9A9E]"></div>
                            </div>
                        ) : (
                            <div className="flex flex-col w-full mb-10">
                                <div className="flex items-center pb-5 border-b border-gray-100">
                                    <div className="w-[40%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">DETAIL IDENTITAS</div>
                                    <div className="w-[20%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase text-center">TIPE PERAN</div>
                                    <div className="w-[25%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase text-center">TANGGAL JOIN</div>
                                    <div className="w-[15%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase text-right pr-2">MODERASI</div>
                                </div>

                                {users.length === 0 ? (
                                    <div className="py-10 text-center text-xs text-gray-400">Tidak ada data user.</div>
                                ) : (
                                    users.map((user) => (
                                        <div key={user.id} className="flex items-center py-6 border-b border-gray-50 transition-colors hover:bg-gray-50/50">
                                            <div className="w-[40%] flex items-center gap-4">
                                                <div className="w-12 h-12 bg-[#F4F4F5] rounded-full flex items-center justify-center shrink-0 uppercase">
                                                    <span className="text-[11px] font-black text-[#A8A8A8] tracking-widest">
                                                        {user.name?.substring(0, 2) || '??'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-extrabold text-[#2A2A2A] mb-1 tracking-tight uppercase">{user.name}</span>
                                                    <span className="text-[8px] font-bold text-[#A8A8A8] uppercase tracking-wider">{user.email}</span>
                                                </div>
                                            </div>

                                            <div className="w-[20%] flex justify-center">
                                                <StatusBadge 
                                                    text={user.role} 
                                                    variant={user.role === 'VENDOR' ? 'emerald' : user.role === 'ADMIN' ? 'red' : 'blue'} 
                                                    rounded="md" 
                                                />
                                            </div>

                                            <div className="w-[25%] flex justify-center">
                                                <span className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-wider">
                                                    {new Date(user.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>

                                            <div className="w-[15%] flex justify-end gap-2">
                                                <button type="button" aria-label="Lihat" className="w-9 h-9 bg-[#FAFAFC] hover:bg-gray-100 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#2A2A2A] transition-colors">
                                                    <EyeIcon className="w-4 h-4" />
                                                </button>
                                                <button type="button" aria-label="Edit" className="w-9 h-9 bg-[#FDF1F0] hover:bg-red-50 border border-red-50 rounded-lg flex items-center justify-center text-red-400 hover:text-red-500 transition-colors">
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        <AdminPagination pages={[1]} currentPage={1} />
                    </div>

                    <div className="mt-16 pb-4 text-center">
                        <p className="text-[8px] font-bold tracking-[0.3em] text-[#A8A8A8] uppercase">
                            PLANORA ECOSYSTEM • MODUL AUDIT PENGGUNA • 2026
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
