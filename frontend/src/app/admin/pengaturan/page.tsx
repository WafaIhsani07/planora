'use client';

import React, { useState, useRef } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';

const UserIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
);
const LockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const BellIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);
const BankIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 10.5h18"/><path d="M12 3v7.5"/><path d="M21 10.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18v-7.5"/><path d="M7 14h3"/><path d="M14 14h3"/></svg>
);
const CogIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 0 1 2.27 17.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82L4.4 4.68A2 2 0 0 1 7.23 1.85l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09c.12.7.6 1.3 1.3 1.51.7.21 1.4-.05 1.82-.33l.06-.06A2 2 0 0 1 21.73 6.1l-.06.06a1.65 1.65 0 0 0-.33 1.82c.2.7.7 1.25 1.51 1.51H21a2 2 0 0 1 0 4h-.09c-.81.26-1.31.81-1.51 1.51z"/></svg>
);
const InfoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

type Tab = 'profil' | 'keamanan' | 'notifikasi';

export default function AdminPengaturanPage() {
    const [activeTab, setActiveTab] = useState<Tab>('profil');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showEscrowModal, setShowEscrowModal] = useState(false);
    const [showNotifModal, setShowNotifModal] = useState(false);
    const [showPrefModal, setShowPrefModal] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

    const initialEscrow = () => {
        try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem('adminEscrowAccount') : null;
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return { bankName: 'BCA', accountNumber: '1234567890', accountHolder: 'Planora Escrow', verified: true };
    };

    const [escrowBank, setEscrowBank] = useState(() => initialEscrow());
    const [escrowDraft, setEscrowDraft] = useState(() => initialEscrow());
    const [escrowEditMode, setEscrowEditMode] = useState(false);
    const [escrowDirty, setEscrowDirty] = useState(false);

    // Password modal draft
    const [passwordDraft, setPasswordDraft] = useState({ current: '', next: '', confirm: '' });
    const [passwordDirty, setPasswordDirty] = useState(false);

    // Notification settings
    const initialNotif = () => {
        try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem('adminNotifSettings') : null;
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return {
            vendorNew: true,
            paymentReceived: true,
            bookingCreated: false,
            weeklyReport: true,
            dispute: true,
        };
    };
    const [notifSettings, setNotifSettings] = useState(() => initialNotif());
    const [notifDraft, setNotifDraft] = useState(() => initialNotif());
    const [notifEditMode, setNotifEditMode] = useState(false);
    const [notifDirty, setNotifDirty] = useState(false);

    // Preferences
    const initialPref = () => {
        try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem('adminPrefSettings') : null;
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return { timezone: '(UTC+07:00) Jakarta', language: 'Indonesia', theme: 'light', dateFormat: 'DD/MM/YYYY' };
    };
    const [prefSettings, setPrefSettings] = useState(() => initialPref());
    const [prefDraft, setPrefDraft] = useState(() => initialPref());
    const [prefEditMode, setPrefEditMode] = useState(false);
    const [prefDirty, setPrefDirty] = useState(false);

    // About
    const initialAbout = () => {
        try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem('adminAboutInfo') : null;
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return { version: '1.0.0', description: 'Aplikasi manajemen layanan acara.', supportEmail: 'support@planora.com' };
    };
    const [aboutInfo, setAboutInfo] = useState(() => initialAbout());
    const [aboutDraft, setAboutDraft] = useState(() => initialAbout());
    const [aboutEditMode, setAboutEditMode] = useState(false);
    const [aboutDirty, setAboutDirty] = useState(false);

    const pushToast = (type: 'success' | 'info' | 'error', message: string) => {
        setToast({ type, message });
        window.setTimeout(() => setToast(null), 3000);
    };

    // close modal with ESC (confirm if editing)
    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showEscrowModal) {
                    if (escrowDirty) {
                        if (!confirm('Perubahan belum disimpan. Yakin keluar?')) return;
                    }
                    setShowEscrowModal(false);
                    setEscrowEditMode(false);
                    setEscrowDirty(false);
                }
                if (showNotifModal) {
                    if (notifDirty) {
                        if (!confirm('Perubahan belum disimpan. Yakin keluar?')) return;
                    }
                    setShowNotifModal(false);
                    setNotifEditMode(false);
                    setNotifDirty(false);
                }
                if (showPrefModal) {
                    if (prefDirty) {
                        if (!confirm('Perubahan belum disimpan. Yakin keluar?')) return;
                    }
                    setShowPrefModal(false);
                    setPrefEditMode(false);
                    setPrefDirty(false);
                }
                if (showAboutModal) {
                    if (aboutDirty) {
                        if (!confirm('Perubahan belum disimpan. Yakin keluar?')) return;
                    }
                    setShowAboutModal(false);
                    setAboutEditMode(false);
                    setAboutDirty(false);
                }
                if (showPasswordModal) {
                    if (passwordDirty && !confirm('Perubahan belum disimpan. Yakin keluar?')) return;
                    setShowPasswordModal(false);
                    setPasswordDraft({ current: '', next: '', confirm: '' });
                    setPasswordDirty(false);
                }
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [showEscrowModal, escrowDirty, showNotifModal, notifDirty, showPrefModal, prefDirty, showAboutModal, aboutDirty, showPasswordModal, passwordDirty]);

    // Apply theme from preferences (persisted) and preview when editing
    React.useEffect(() => {
        const apply = (theme: string) => {
            if (typeof document === 'undefined') return;
            if (theme === 'dark') document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
        };
        apply(prefSettings.theme);
    }, [prefSettings.theme]);

    // Preview theme when editing preferences (revert on close)
    React.useEffect(() => {
        if (!prefEditMode) return;
        const apply = (theme: string) => {
            if (typeof document === 'undefined') return;
            if (theme === 'dark') document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
        };
        apply(prefDraft.theme);
        return () => {
            apply(prefSettings.theme);
        };
    }, [prefDraft.theme, prefEditMode, prefSettings.theme]);

    // Save functionality removed per request

    const handlePhotoClick = () => fileInputRef.current?.click();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        setPhotoPreview(url);
    };

    const tabs: { value: Tab; label: string; icon: React.ReactNode }[] = [
        { value: 'profil', label: 'Profil Admin', icon: <UserIcon className="w-4 h-4" /> },
        { value: 'keamanan', label: 'Keamanan', icon: <LockIcon className="w-4 h-4" /> },
        { value: 'notifikasi', label: 'Notifikasi', icon: <BellIcon className="w-4 h-4" /> },
    ];

    return (
        <>
            <AdminHeader hideSearch />

            <div className="p-8 pb-16">
                <div className="mx-auto w-full max-w-[1200px] flex flex-col gap-8">

                    {/* Page Header */}
                    <div>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-[#2A2A2A]/40 uppercase mb-2 block">
                            KONFIGURASI AKUN
                        </span>
                        <h1 className="text-3xl md:text-4xl leading-tight font-black tracking-tight text-[#2A2A2A]">
                            Profil & Pengaturan
                        </h1>
                    </div>

                    {/* Profile Banner */}
                    <div className="bg-[#2A2A2A] rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-48 h-48 bg-[#FF9A9E]/5 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
                        <div className="w-16 h-16 rounded-2xl bg-[#FF9A9E] flex items-center justify-center font-black text-white text-2xl flex-shrink-0 shadow-lg shadow-[#FF9A9E]/30">
                            A
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-extrabold text-lg tracking-tight">Admin Planora</span>
                            <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase">Root Access • admin@planora.com</span>
                        </div>
                        <div className="ml-auto">
                            <span className="px-4 py-2 bg-[#FF9A9E]/20 border border-[#FF9A9E]/20 text-[#FF9A9E] text-[9px] font-black tracking-widest uppercase rounded-full">
                                ADMIN
                            </span>
                        </div>
                    </div>

                    {/* Tabs removed as requested */}

                    {/* Tab Content (no outer white card) */}
                    <div className="flex flex-col gap-8">

                        {/* PROFIL TAB */}
                        {activeTab === 'profil' && (
                            <>
                                <div>
                                    <h2 className="text-base font-black tracking-tighter text-[#2A2A2A] mb-1">
                                        Profil Admin
                                    </h2>
                                    <p className="text-[12px] font-medium text-[#A8A8A8]">
                                        Informasi dasar akun administrator.
                                    </p>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-black text-[#A8A8A8]">Nama Lengkap</label>
                                                <input defaultValue="Admin Planora" className="w-full bg-[#FAFAFC] border border-gray-100 rounded-lg px-4 py-3 text-sm font-semibold text-[#2A2A2A] outline-none focus:ring-2 focus:ring-[#FF9A9E]/20" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-black text-[#A8A8A8]">Email</label>
                                                <input defaultValue="admin@planora.com" className="w-full bg-[#FAFAFC] border border-gray-100 rounded-lg px-4 py-3 text-sm font-semibold text-[#2A2A2A] outline-none focus:ring-2 focus:ring-[#FF9A9E]/20" />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-black text-[#A8A8A8]">No. Telepon</label>
                                                <input defaultValue="0812-3456-7890" className="w-full bg-[#FAFAFC] border border-gray-100 rounded-lg px-4 py-3 text-sm font-semibold text-[#2A2A2A] outline-none focus:ring-2 focus:ring-[#FF9A9E]/20" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-black text-[#A8A8A8]">Jabatan</label>
                                                <input defaultValue="Super Admin" className="w-full bg-[#FAFAFC] border border-gray-100 rounded-lg px-4 py-3 text-sm font-semibold text-[#2A2A2A] outline-none focus:ring-2 focus:ring-[#FF9A9E]/20" />
                                            </div>
                                        </div>

                                        <div className="w-full md:w-44 flex-shrink-0 flex flex-col items-center justify-center gap-4">
                                                <div className="w-20 h-20 rounded-full overflow-hidden bg-[#FF9A9E] flex items-center justify-center text-white text-2xl font-black">
                                                    {photoPreview ? <img src={photoPreview} alt="avatar" className="w-full h-full object-cover"/> : 'A'}
                                                </div>
                                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                                <button onClick={handlePhotoClick} className="px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm font-bold">Ubah Foto</button>
                                            <p className="text-xs text-[#A8A8A8]">JPG, PNG maks. 2MB</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <button className="px-6 py-3 bg-[#FF6B82] text-white rounded-lg font-black">Simpan Perubahan</button>
                                        <span className="text-sm text-[#A8A8A8]">Terakhir diperbarui: 20 Mei 2026</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mt-6">
                                    <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-50 shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#E9FFF6] flex items-center justify-center text-[#0F766E]"><LockIcon className="w-5 h-5"/></div>
                                            <div>
                                                <div className="font-black text-sm">Keamanan Akun</div>
                                                <div className="text-xs text-[#A8A8A8]">Ubah password dan atur keamanan akun Anda.</div>
                                            </div>
                                        </div>
                                        <button onClick={() => { setShowPasswordModal(true); setPasswordDirty(false); setPasswordDraft({ current: '', next: '', confirm: '' }); }} className="px-4 py-2 border rounded-lg">Ubah Password</button>
                                    </div>

                                    <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-50 shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#F0FFF9] flex items-center justify-center text-[#065F46]"><BankIcon className="w-5 h-5"/></div>
                                            <div>
                                                <div className="font-black text-sm">Rekening Escrow</div>
                                                <div className="text-xs text-[#A8A8A8]">Kelola rekening escrow yang digunakan untuk menampung dana sementara.</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-xs text-green-600 font-bold">Aktif</span>
                                            <button onClick={() => { setShowEscrowModal(true); setEscrowEditMode(true); setEscrowDraft(escrowBank); }} className="px-4 py-2 border rounded-lg">Kelola Rekening</button>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-50 shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#FDF7FF] flex items-center justify-center text-[#6B21A8]"><BellIcon className="w-5 h-5"/></div>
                                            <div>
                                                <div className="font-black text-sm">Notifikasi</div>
                                                <div className="text-xs text-[#A8A8A8]">Atur preferensi notifikasi yang ingin Anda terima.</div>
                                            </div>
                                        </div>
                                        <button onClick={() => { setShowNotifModal(true); setNotifEditMode(true); setNotifDraft(notifSettings); }} className="px-4 py-2 border rounded-lg">Atur Notifikasi</button>
                                    </div>

                                    <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-50 shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] flex items-center justify-center text-[#92400E]"><CogIcon className="w-5 h-5"/></div>
                                            <div>
                                                <div className="font-black text-sm">Preferensi Sistem</div>
                                                <div className="text-xs text-[#A8A8A8]">Sesuaikan tampilan, zona waktu, dan pengaturan sistem lainnya.</div>
                                            </div>
                                        </div>
                                        <button onClick={() => { setShowPrefModal(true); setPrefEditMode(true); setPrefDraft(prefSettings); }} className="px-4 py-2 border rounded-lg">Atur Preferensi</button>
                                    </div>

                                    <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-50 shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center text-[#374151]"><InfoIcon className="w-5 h-5"/></div>
                                            <div>
                                                <div className="font-black text-sm">Tentang Planora</div>
                                                <div className="text-xs text-[#A8A8A8]">Informasi versi aplikasi dan kebijakan penggunaan.</div>
                                            </div>
                                        </div>
                                        <button onClick={() => { setShowAboutModal(true); setAboutEditMode(true); setAboutDraft(aboutInfo); }} className="px-4 py-2 border rounded-lg">Lihat Detail</button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* KEAMANAN TAB */}
                        {activeTab === 'keamanan' && (
                            <>
                                <div>
                                    <h2 className="text-base font-black italic tracking-tighter text-[#2A2A2A] uppercase mb-1">
                                        Keamanan Akun
                                    </h2>
                                    <p className="text-[10px] font-bold text-[#2A2A2A]/30 uppercase tracking-wider">
                                        Perbarui password akun admin
                                    </p>
                                </div>

                                <div className="flex flex-col gap-6 max-w-md">
                                    {[
                                        { label: 'Password Saat Ini', placeholder: '••••••••' },
                                        { label: 'Password Baru', placeholder: '••••••••' },
                                        { label: 'Konfirmasi Password Baru', placeholder: '••••••••' },
                                    ].map((field) => (
                                        <div key={field.label} className="flex flex-col gap-2">
                                            <label className="text-[9px] font-black tracking-[0.2em] text-[#2A2A2A]/50 uppercase">
                                                {field.label}
                                            </label>
                                            <input
                                                type="password"
                                                placeholder={field.placeholder}
                                                className="w-full bg-[#FAFAFC] border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-semibold text-[#2A2A2A] placeholder-[#2A2A2A]/20 outline-none focus:ring-2 focus:ring-[#FF9A9E]/30 focus:border-[#FF9A9E]/30 transition-all"
                                            />
                                        </div>
                                    ))}

                                    <div className="p-4 bg-[#FDF1F0] rounded-xl border border-[#FF9A9E]/10">
                                        <p className="text-[9px] font-bold text-[#2A2A2A]/50 uppercase tracking-wider leading-relaxed">
                                            Password minimal 8 karakter, kombinasi huruf besar, huruf kecil, dan angka.
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* NOTIFIKASI TAB */}
                        {activeTab === 'notifikasi' && (
                            <>
                                <div>
                                    <h2 className="text-base font-black italic tracking-tighter text-[#2A2A2A] uppercase mb-1">
                                        Preferensi Notifikasi
                                    </h2>
                                    <p className="text-[10px] font-bold text-[#2A2A2A]/30 uppercase tracking-wider">
                                        Atur notifikasi yang ingin diterima
                                    </p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {[
                                        { label: 'Vendor Baru Mendaftar', desc: 'Notifikasi saat ada vendor baru yang mendaftar', defaultOn: true },
                                        { label: 'Pembayaran Masuk', desc: 'Notifikasi saat ada transaksi pembayaran baru', defaultOn: true },
                                        { label: 'Booking Dibuat', desc: 'Notifikasi saat ada booking baru dari pelanggan', defaultOn: false },
                                        { label: 'Laporan Mingguan', desc: 'Ringkasan aktivitas platform setiap minggu', defaultOn: true },
                                        { label: 'Sengketa & Keluhan', desc: 'Notifikasi prioritas untuk kasus sengketa', defaultOn: true },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center justify-between p-4 bg-[#FAFAFC] rounded-xl border border-gray-50 hover:bg-[#FDF1F0]/50 transition-colors"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-extrabold text-[#2A2A2A] mb-0.5">{item.label}</span>
                                                <span className="text-[9px] font-medium text-[#2A2A2A]/40">{item.desc}</span>
                                            </div>
                                            <div className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${item.defaultOn ? 'bg-[#FF9A9E]' : 'bg-gray-200'}`}>
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${item.defaultOn ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Global save removed */}

                        {/* Modals */}
                        {showPasswordModal && (
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                                onClick={() => {
                                    if (passwordDirty) {
                                        if (!confirm('Perubahan belum disimpan. Yakin keluar?')) return;
                                    }
                                    setShowPasswordModal(false);
                                    setPasswordDraft({ current: '', next: '', confirm: '' });
                                    setPasswordDirty(false);
                                }}
                            >
                                <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-sm border border-gray-50 relative" onClick={(e) => e.stopPropagation()}>
                                    <button aria-label="Tutup" onClick={() => { if (passwordDirty && !confirm('Perubahan belum disimpan. Yakin keluar?')) return; setShowPasswordModal(false); setPasswordDraft({ current: '', next: '', confirm: '' }); setPasswordDirty(false); }} className="absolute right-4 top-4 h-9 w-9 rounded-lg bg-slate-50 text-[#2A2A2A]/60 hover:bg-[#F3F4F6]">×</button>
                                    <h3 className="font-black text-lg mb-4">Ubah Password</h3>
                                    <div className="space-y-3">
                                        <input value={passwordDraft.current} onChange={(e) => { setPasswordDraft(prev => ({ ...prev, current: e.target.value })); setPasswordDirty(true); }} type="password" placeholder="Password Saat Ini" className="w-full border rounded-lg px-3 py-2" />
                                        <input value={passwordDraft.next} onChange={(e) => { setPasswordDraft(prev => ({ ...prev, next: e.target.value })); setPasswordDirty(true); }} type="password" placeholder="Password Baru" className="w-full border rounded-lg px-3 py-2" />
                                        <input value={passwordDraft.confirm} onChange={(e) => { setPasswordDraft(prev => ({ ...prev, confirm: e.target.value })); setPasswordDirty(true); }} type="password" placeholder="Konfirmasi Password Baru" className="w-full border rounded-lg px-3 py-2" />
                                    </div>
                                    <div className="mt-4 flex justify-end gap-2">
                                        <button onClick={() => { if (passwordDirty && !confirm('Perubahan belum disimpan. Yakin batal?')) return; setShowPasswordModal(false); setPasswordDraft({ current: '', next: '', confirm: '' }); setPasswordDirty(false); }} className="px-4 py-2">Batal</button>
                                        <button onClick={() => {
                                            if (!passwordDraft.next || passwordDraft.next.length < 8) { pushToast('error', 'Password baru minimal 8 karakter.'); return; }
                                            if (passwordDraft.next !== passwordDraft.confirm) { pushToast('error', 'Konfirmasi password tidak cocok.'); return; }
                                            // TODO: Hook to backend password change
                                            setShowPasswordModal(false);
                                            setPasswordDraft({ current: '', next: '', confirm: '' });
                                            setPasswordDirty(false);
                                            pushToast('success', 'Password berhasil diperbarui.');
                                        }} className="px-4 py-2 bg-[#FF6B82] text-white rounded-lg">Simpan</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showEscrowModal && (
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                                onClick={() => {
                                    if (escrowDirty) {
                                        if (!confirm('Perubahan belum disimpan. Yakin keluar?')) return;
                                    }
                                    setShowEscrowModal(false);
                                    setEscrowEditMode(false);
                                    setEscrowDirty(false);
                                }}
                            >
                                <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-sm border border-gray-50 relative" onClick={(e) => e.stopPropagation()}>
                                    <button aria-label="Tutup" onClick={() => { if (escrowDirty && !confirm('Perubahan belum disimpan. Yakin keluar?')) return; setShowEscrowModal(false); setEscrowEditMode(false); setEscrowDirty(false); }} className="absolute right-4 top-4 h-9 w-9 rounded-lg bg-slate-50 text-[#2A2A2A]/60 hover:bg-[#F3F4F6]">×</button>
                                    <h3 className="font-black text-lg mb-4">Kelola Rekening Escrow</h3>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-[#6B6B6B]">Nama Bank</label>
                                        <select value={escrowEditMode ? escrowDraft.bankName : escrowBank.bankName} disabled={!escrowEditMode} onChange={(e) => { setEscrowDraft(prev => ({ ...prev, bankName: e.target.value })); setEscrowDirty(true); }} className="w-full border rounded-lg px-4 py-3 pr-10">
                                            <option>BCA</option>
                                            <option>Mandiri</option>
                                            <option>BNI</option>
                                            <option>CIMB Niaga</option>
                                        </select>

                                        <label className="text-[10px] font-black text-[#6B6B6B]">Nomor Rekening</label>
                                        <input value={escrowEditMode ? escrowDraft.accountNumber : escrowBank.accountNumber} onChange={(e) => { setEscrowDraft(prev => ({ ...prev, accountNumber: e.target.value })); setEscrowDirty(true); }} readOnly={!escrowEditMode} className="w-full border rounded-lg px-4 py-3" />

                                        <label className="text-[10px] font-black text-[#6B6B6B]">Nama Pemilik Rekening</label>
                                        <input value={escrowEditMode ? escrowDraft.accountHolder : escrowBank.accountHolder} onChange={(e) => { setEscrowDraft(prev => ({ ...prev, accountHolder: e.target.value })); setEscrowDirty(true); }} readOnly={!escrowEditMode} className="w-full border rounded-lg px-4 py-3" />
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="text-sm text-[#0F766E] font-bold">{escrowBank.verified ? 'Aktif' : 'Belum Diverifikasi'}</div>
                                        <div className="flex gap-2">
                                            {escrowEditMode ? (
                                                <>
                                                    <button onClick={() => { setShowEscrowModal(false); setEscrowEditMode(false); setEscrowDraft(escrowBank); setEscrowDirty(false); }} className="px-4 py-2 border rounded-lg">Batal</button>
                                                    <button onClick={() => {
                                                        if (!escrowDraft.accountNumber || !escrowDraft.accountHolder) {
                                                            pushToast('error', 'Isi semua field rekening terlebih dahulu.');
                                                            return;
                                                        }
                                                        setEscrowBank({ ...escrowDraft, verified: true });
                                                        try { localStorage.setItem('adminEscrowAccount', JSON.stringify({ ...escrowDraft, verified: true })); } catch(e) {}
                                                        setEscrowEditMode(false);
                                                        setEscrowDirty(false);
                                                        setShowEscrowModal(false);
                                                        pushToast('success', 'Perubahan rekening escrow disimpan.');
                                                    }} className="px-4 py-2 bg-[#FF6B82] text-white rounded-lg">Simpan</button>
                                                </>
                                            ) : (
                                                <button onClick={() => setShowEscrowModal(false)} className="px-4 py-2 border rounded-lg">Tutup</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {showNotifModal && (
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                                onClick={() => {
                                    if (notifDirty) {
                                        if (!confirm('Perubahan belum disimpan. Yakin keluar?')) return;
                                    }
                                    setShowNotifModal(false);
                                    setNotifEditMode(false);
                                    setNotifDraft(notifSettings);
                                    setNotifDirty(false);
                                }}
                            >
                                <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-sm border border-gray-50 relative" onClick={(e) => e.stopPropagation()}>
                                    <button aria-label="Tutup" onClick={() => { if (notifDirty && !confirm('Perubahan belum disimpan. Yakin keluar?')) return; setShowNotifModal(false); setNotifEditMode(false); setNotifDraft(notifSettings); setNotifDirty(false); }} className="absolute right-4 top-4 h-9 w-9 rounded-lg bg-slate-50 text-[#2A2A2A]/60 hover:bg-[#F3F4F6]">×</button>
                                    <h3 className="font-black text-lg mb-4">Atur Notifikasi</h3>
                                    <div className="space-y-3">
                                        {Object.entries(notifDraft).map(([key, val]) => (
                                            <label key={key} className="flex items-center justify-between p-2 bg-[#FAFAFC] rounded-lg">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm">{key === 'vendorNew' ? 'Vendor Baru Mendaftar' : key === 'paymentReceived' ? 'Pembayaran Masuk' : key === 'bookingCreated' ? 'Booking Dibuat' : key === 'weeklyReport' ? 'Laporan Mingguan' : 'Sengketa & Keluhan'}</span>
                                                    <span className="text-xs text-[#6B7280]">{key === 'vendorNew' ? 'Notifikasi saat ada vendor baru yang mendaftar' : key === 'paymentReceived' ? 'Notifikasi saat ada transaksi pembayaran baru' : key === 'bookingCreated' ? 'Notifikasi saat ada booking baru dari pelanggan' : key === 'weeklyReport' ? 'Ringkasan aktivitas platform setiap minggu' : 'Notifikasi prioritas untuk kasus sengketa'}</span>
                                                </div>
                                                <input type="checkbox" disabled={!notifEditMode} checked={!!val} onChange={(e) => { setNotifDraft(prev => ({ ...prev, [key]: e.target.checked })); setNotifDirty(true); }} />
                                            </label>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div />
                                        <div className="flex gap-2">
                                            {notifEditMode ? (
                                                <>
                                                    <button onClick={() => { setShowNotifModal(false); setNotifEditMode(false); setNotifDraft(notifSettings); setNotifDirty(false); }} className="px-4 py-2 border rounded-lg">Batal</button>
                                                    <button onClick={() => {
                                                        setNotifSettings(notifDraft);
                                                        try { localStorage.setItem('adminNotifSettings', JSON.stringify(notifDraft)); } catch (e) {}
                                                        setNotifEditMode(false);
                                                        setNotifDirty(false);
                                                        setShowNotifModal(false);
                                                        pushToast('success', 'Preferensi notifikasi disimpan.');
                                                    }} className="px-4 py-2 bg-[#FF6B82] text-white rounded-lg">Simpan</button>
                                                </>
                                            ) : (
                                                <button onClick={() => setShowNotifModal(false)} className="px-4 py-2 border rounded-lg">Tutup</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Toast */}
                        {toast && (
                            <div className={`fixed right-6 bottom-6 z-50 rounded-lg px-4 py-3 font-bold ${toast.type === 'success' ? 'bg-emerald-500 text-white' : toast.type === 'error' ? 'bg-rose-500 text-white' : 'bg-sky-500 text-white'}`}>
                                {toast.message}
                            </div>
                        )}

                        {showPrefModal && (
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                                onClick={() => {
                                    if (prefDirty) {
                                        if (!confirm('Perubahan belum disimpan. Yakin keluar?')) return;
                                    }
                                    setShowPrefModal(false);
                                    setPrefEditMode(false);
                                    setPrefDraft(prefSettings);
                                    setPrefDirty(false);
                                }}
                            >
                                <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-sm border border-gray-50 relative" onClick={(e) => e.stopPropagation()}>
                                    <button aria-label="Tutup" onClick={() => { if (prefDirty && !confirm('Perubahan belum disimpan. Yakin keluar?')) return; setShowPrefModal(false); setPrefEditMode(false); setPrefDraft(prefSettings); setPrefDirty(false); }} className="absolute right-4 top-4 h-9 w-9 rounded-lg bg-slate-50 text-[#2A2A2A]/60 hover:bg-[#F3F4F6]">×</button>
                                    <h3 className="font-black text-lg mb-4">Preferensi Sistem</h3>
                                    <div className="space-y-3">
                                        <label className="text-sm">Zona Waktu</label>
                                        <select disabled={!prefEditMode} value={prefDraft.timezone} onChange={(e) => { setPrefDraft(prev => ({ ...prev, timezone: e.target.value })); setPrefDirty(true); }} className="w-full border rounded-lg px-4 py-3 pr-10">
                                            <option>(UTC+07:00) Jakarta</option>
                                            <option>(UTC+08:00) Kuala Lumpur</option>
                                            <option>(UTC+09:00) Tokyo</option>
                                        </select>

                                        <label className="text-sm">Bahasa</label>
                                        <select disabled={!prefEditMode} value={prefDraft.language} onChange={(e) => { setPrefDraft(prev => ({ ...prev, language: e.target.value })); setPrefDirty(true); }} className="w-full border rounded-lg px-4 py-3 pr-10">
                                            <option>Indonesia</option>
                                            <option>English</option>
                                        </select>

                                        <label className="text-sm">Tema</label>
                                        <select disabled={!prefEditMode} value={prefDraft.theme} onChange={(e) => { setPrefDraft(prev => ({ ...prev, theme: e.target.value })); setPrefDirty(true); }} className="w-full border rounded-lg px-4 py-3 pr-10">
                                            <option value="light">Terang</option>
                                            <option value="dark">Gelap</option>
                                        </select>

                                        <label className="text-sm">Format Tanggal</label>
                                        <select disabled={!prefEditMode} value={prefDraft.dateFormat} onChange={(e) => { setPrefDraft(prev => ({ ...prev, dateFormat: e.target.value })); setPrefDirty(true); }} className="w-full border rounded-lg px-4 py-3 pr-10">
                                            <option>DD/MM/YYYY</option>
                                            <option>MM/DD/YYYY</option>
                                            <option>YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div />
                                        <div className="flex gap-2">
                                            {prefEditMode ? (
                                                <>
                                                    <button onClick={() => { setShowPrefModal(false); setPrefEditMode(false); setPrefDraft(prefSettings); setPrefDirty(false); }} className="px-4 py-2 border rounded-lg">Batal</button>
                                                    <button onClick={() => {
                                                        setPrefSettings(prefDraft);
                                                        try { localStorage.setItem('adminPrefSettings', JSON.stringify(prefDraft)); } catch (e) {}
                                                        setPrefEditMode(false);
                                                        setPrefDirty(false);
                                                        setShowPrefModal(false);
                                                        pushToast('success', 'Preferensi sistem disimpan.');
                                                    }} className="px-4 py-2 bg-[#FF6B82] text-white rounded-lg">Simpan</button>
                                                </>
                                            ) : (
                                                <button onClick={() => setShowPrefModal(false)} className="px-4 py-2 border rounded-lg">Tutup</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showAboutModal && (
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                                onClick={() => {
                                    if (aboutDirty) {
                                        if (!confirm('Perubahan belum disimpan. Yakin keluar?')) return;
                                    }
                                    setShowAboutModal(false);
                                    setAboutEditMode(false);
                                    setAboutDraft(aboutInfo);
                                    setAboutDirty(false);
                                }}
                            >
                                <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-sm border border-gray-50 relative" onClick={(e) => e.stopPropagation()}>
                                    <button aria-label="Tutup" onClick={() => { if (aboutDirty && !confirm('Perubahan belum disimpan. Yakin keluar?')) return; setShowAboutModal(false); setAboutEditMode(false); setAboutDraft(aboutInfo); setAboutDirty(false); }} className="absolute right-4 top-4 h-9 w-9 rounded-lg bg-slate-50 text-[#2A2A2A]/60 hover:bg-[#F3F4F6]">×</button>
                                    <h3 className="font-black text-lg mb-4">Tentang Planora</h3>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold">Versi</label>
                                        <input value={aboutEditMode ? aboutDraft.version : aboutInfo.version} onChange={(e) => { setAboutDraft(prev => ({ ...prev, version: e.target.value })); setAboutDirty(true); }} readOnly={!aboutEditMode} className="w-full border rounded-lg px-3 py-2" />

                                        <label className="text-xs font-bold">Deskripsi</label>

                                        <label className="text-xs font-bold">Email Dukungan</label>
                                        <textarea value={aboutEditMode ? aboutDraft.description : aboutInfo.description} onChange={(e) => { setAboutDraft(prev => ({ ...prev, description: e.target.value })); setAboutDirty(true); }} readOnly={!aboutEditMode} className="w-full border rounded-lg px-3 py-2" />

                                        <input value={aboutEditMode ? aboutDraft.supportEmail : aboutInfo.supportEmail} onChange={(e) => { setAboutDraft(prev => ({ ...prev, supportEmail: e.target.value })); setAboutDirty(true); }} readOnly={!aboutEditMode} className="w-full border rounded-lg px-3 py-2" />
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div />
                                        <div className="flex gap-2">
                                            {aboutEditMode ? (
                                                <>
                                                    <button onClick={() => { setShowAboutModal(false); setAboutEditMode(false); setAboutDraft(aboutInfo); setAboutDirty(false); }} className="px-4 py-2 border rounded-lg">Batal</button>
                                                    <button onClick={() => {
                                                        setAboutInfo(aboutDraft);
                                                        try { localStorage.setItem('adminAboutInfo', JSON.stringify(aboutDraft)); } catch (e) {}
                                                        setAboutEditMode(false);
                                                        setAboutDirty(false);
                                                        setShowAboutModal(false);
                                                        pushToast('success', 'Informasi tentang aplikasi disimpan.');
                                                    }} className="px-4 py-2 bg-[#FF6B82] text-white rounded-lg">Simpan</button>
                                                </>
                                            ) : (
                                                <button onClick={() => setShowAboutModal(false)} className="px-4 py-2 border rounded-lg">Tutup</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer removed per request */}

                </div>
            </div>
        </>
    );
}