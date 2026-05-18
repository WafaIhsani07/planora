'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { signOut } from 'next-auth/react';
import {
  Camera,
  Check,
  Landmark,
  Lock,
  User,
  Bell,
  X,
} from 'lucide-react';

type ProfileForm = {
  businessName: string;
  yearFounded: string;
  description: string;
  email: string;
  whatsapp: string;
  instagram: string;
  website: string;
  address: string;
};

type BankForm = {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
};

const initialForm: ProfileForm = {
  businessName: 'Wafa Decoration',
  yearFounded: '2018',
  description:
    'Wafa Decoration melayani berbagai macam jasa dekorasi mulai dari lamaran, akad nikah, hingga resepsi besar dengan sentuhan modern dan elegan.',
  email: 'hello@wafadeco.com',
  whatsapp: '+62 812-3456-7890',
  instagram: '@wafadecoration',
  website: '',
  address: 'Jl. Melati No. 45, Kebayoran Baru, Jakarta Selatan, 12150',
};

const initialBankForm: BankForm = {
  bankName: 'Bank BCA',
  accountNumber: '1234 5678 9012',
  accountHolder: 'Wafa Decoration',
};

const navItems = [
  { id: 'profil', label: 'Profil Bisnis', icon: User },
  { id: 'keamanan', label: 'Keamanan', icon: Lock },
  { id: 'rekening', label: 'Rekening Bank', icon: Landmark },
  { id: 'notifikasi', label: 'Notifikasi', icon: Bell },
];

export default function PengaturanVendorPage() {
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [notice, setNotice] = useState<{ type: 'success' | 'info'; message: string } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showRemoveAvatarConfirm, setShowRemoveAvatarConfirm] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [activeSection, setActiveSection] = useState('profil');
  const [bankForm, setBankForm] = useState<BankForm>(initialBankForm);
  const [bankDraft, setBankDraft] = useState<BankForm>(initialBankForm);
  const [bankEditMode, setBankEditMode] = useState(false);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const noticeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const container = rightRef.current;
    if (!container) return;

    const sections = navItems
      .map((item) => container.querySelector(`#${item.id}`))
      .filter(Boolean) as HTMLElement[];

    const onScroll = () => {
      const scrollTop = container.scrollTop;
      let current = 'profil';
      for (const section of sections) {
        if (section.offsetTop <= scrollTop + 120) current = section.id;
      }
      setActiveSection(current);
    };

    onScroll();
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  const handleChange = (key: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    return () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    };
  }, [avatarUrl]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    setAvatarUrl(url);
    pushNotice('success', 'Foto profil berhasil dipilih (preview). Klik Simpan Perubahan untuk menyimpan');
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleRemoveAvatar = () => {
    setShowRemoveAvatarConfirm(false);
    if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    setAvatarUrl(null);
    pushNotice('info', 'Foto profil dihapus. Klik Simpan Perubahan untuk menyimpan perubahan.');
  };

  const pushNotice = (type: 'success' | 'info', message: string) => {
    if (noticeTimerRef.current) {
      window.clearTimeout(noticeTimerRef.current);
    }

    setNotice({ type, message });
    noticeTimerRef.current = window.setTimeout(() => {
      setNotice(null);
    }, 2500);
  };

  const handleSave = () => {
    if (isSavingProfile) return;

    setIsSavingProfile(true);
    window.setTimeout(() => {
      setIsSavingProfile(false);
      pushNotice('success', 'Profil bisnis berhasil disimpan.');
    }, 900);
  };

  const handlePasswordUpdate = () => {
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Isi kata sandi saat ini terlebih dahulu.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Kata sandi baru minimal 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordModal(false);
    pushNotice('success', 'Kata sandi berhasil diperbarui.');
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await signOut({ redirect: false, callbackUrl: '/login' });
    window.location.href = '/login';
  };

  const handleOpenDeleteModal = () => {
    setDeleteError('');
    setDeleteConfirmText('');
    setShowDeleteModal(true);
  };

  const handleRequestDelete = () => {
    if (deleteConfirmText !== 'HAPUS') {
      setDeleteError('Ketik HAPUS untuk melanjutkan.');
      return;
    }

    setShowDeleteModal(false);
    setDeleteConfirmText('');
    pushNotice('info', 'Permintaan penghapusan akun vendor telah dikirim.');
  };

  const handleEditBank = () => {
    if (bankEditMode) {
      setBankDraft(bankForm);
      setBankEditMode(false);
      return;
    }

    setBankDraft(bankForm);
    setBankEditMode(true);
    const container = rightRef.current;
    const section = container?.querySelector('#rekening') as HTMLElement | null;
    if (container && section) {
      container.scrollTo({ top: section.offsetTop - 16, behavior: 'smooth' });
    }
  };

  const handleSaveBank = () => {
    if (!bankEditMode) return;

    setBankForm(bankDraft);
    setBankEditMode(false);
    pushNotice('success', 'Perubahan rekening disimpan.');
  };

  const sidebarItems = useMemo(
    () =>
      navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        const handleClick = (e: React.MouseEvent) => {
          e.preventDefault();
          const container = rightRef.current;
          if (!container) return;
          const el = container.querySelector(`#${item.id}`) as HTMLElement | null;
          if (el) container.scrollTo({ top: el.offsetTop - 16, behavior: 'smooth' });
        };

        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={handleClick}
            className={`flex items-center gap-4 rounded-2xl p-4 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
              isActive ? 'bg-[#FCE6E3] text-[#FF527B]' : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-[#FF527B]' : 'text-slate-400'}`} />
            {item.label}
          </a>
        );
      }),
    [activeSection]
  );

  return (
    <div className="mx-auto max-w-7xl space-y-10 pb-20 p-8 py-6">
      <div className="space-y-1">
        <h1 className="text-4xl md:text-[2.75rem] leading-[1.05] font-black italic tracking-tighter text-[#2A2A2A]">PENGATURAN</h1>
        <p className="text-sm font-medium uppercase tracking-widest text-[#2A2A2A]/40">
          KELOLA INFORMASI AKUN DAN PREFERENSI TOKO ANDA
        </p>
      </div>

      {notice && (
        <div
          className={`rounded-2xl px-4 py-3 text-[11px] font-black uppercase tracking-widest ${
            notice.type === 'success'
              ? 'border border-[#E6F9F0] bg-[#E6F9F0] text-[#10B981]'
              : 'border border-[#E8EEFF] bg-[#E8EEFF] text-[#5B6AC5]'
          }`}
        >
          {notice.message}
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="self-start lg:col-span-3">
          <div className="sticky top-10 h-fit rounded-2xl border border-[#2A2A2A]/5 bg-white p-4 shadow-sm">
            <nav className="space-y-1">{sidebarItems}</nav>
          </div>
        </div>

        <div ref={rightRef} className="space-y-10 lg:col-span-9 max-h-[calc(100vh-6rem)] overflow-auto pr-4">
          <section id="profil" className="scroll-mt-10 rounded-3xl border border-[#2A2A2A]/5 bg-white p-8 shadow-sm md:p-10 space-y-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-[#2A2A2A]">Profil Bisnis</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Informasi penting yang ditampilkan pada profil bisnis Anda
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-emerald-600">
                <Check className="h-3 w-3" /> Terverifikasi
              </span>
            </div>

            <div className="flex flex-col items-center gap-8 py-6 md:flex-row md:items-center">
              <div className="relative">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#FCE6E3] text-3xl font-black text-[#FF527B] shadow-xl">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span>WD</span>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl border-4 border-white bg-[#2A2A2A] text-white">
                  <button onClick={triggerFileSelect} aria-label="Upload Foto" className="flex items-center justify-center w-full h-full">
                    <Camera className="h-4 w-4" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onSelectFile} />
                </div>
              </div>

              <div className="space-y-3 text-center md:text-left">
                <div>
                  <h4 className="text-xl font-black text-[#2A2A2A]">{form.businessName}</h4>
                  <p className="mt-0.5 text-xs font-bold uppercase tracking-widest text-slate-300">Dekorasi • Padang, Sumatera Barat</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={triggerFileSelect} className="rounded-xl bg-[#2A2A2A] px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-black cursor-pointer">
                    Upload Foto
                  </button>
                  <button onClick={() => setShowRemoveAvatarConfirm(true)} className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:bg-slate-50 cursor-pointer">
                    Hapus
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-8 border-t border-slate-50 pt-10 md:grid-cols-2">
              <div className="space-y-3">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">Nama Bisnis</label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF9A9E]/10"
                />
              </div>

              <div className="space-y-3">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">Nomor HP / WhatsApp</label>
                <input
                  type="text"
                  value={form.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF9A9E]/10"
                />
              </div>

              <div className="space-y-3">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">Kota / Kabupaten</label>
                <input type="text" value="Padang, Sumatera Barat" readOnly className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 text-sm font-bold text-slate-500" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">Deskripsi Bisnis</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full resize-none rounded-[24px] border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-5 text-sm font-bold leading-relaxed transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF9A9E]/10"
              />
            </div>

            <div className="flex justify-end border-t border-slate-50 pt-6">
              <button onClick={handleSave} disabled={isSavingProfile} className="rounded-2xl bg-[#2A2A2A] px-10 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-black/10 transition-all hover:bg-black active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
                {isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </section>

          <section id="keamanan" className="scroll-mt-10 rounded-3xl border border-[#2A2A2A]/5 bg-white p-8 shadow-sm md:p-10 space-y-10">
            <div>
              <h3 className="text-xl font-black text-[#2A2A2A]">Keamanan Akun</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">Ganti kata sandi dan kelola keamanan login</p>
            </div>

            <div className="border-t border-slate-50 pt-6">
              <div className="space-y-3 md:max-w-xl">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">Email Akun</label>
                <input type="email" value={form.email} readOnly className="w-full cursor-not-allowed rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 text-sm font-bold text-slate-400 opacity-70" />
                <p className="ml-1 mt-1 text-[9px] font-bold italic tracking-tighter text-slate-300">Email tidak dapat diubah. Hubungi admin jika perlu.</p>

                <p className="mt-4 text-sm text-slate-500">Untuk mengganti kata sandi, klik tombol di bawah. Perubahan kata sandi hanya tersedia melalui dialog aman.</p>

                <div className="mt-4 flex justify-end">
                  <button onClick={() => setShowPasswordModal(true)} className="rounded-2xl bg-[#2A2A2A] px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-black/10 transition-all hover:bg-black active:scale-95 cursor-pointer">
                    Ganti Kata Sandi
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section id="rekening" className="scroll-mt-10 rounded-3xl border border-[#2A2A2A]/5 bg-white p-8 shadow-sm md:p-10 space-y-10">
            <div>
              <h3 className="text-xl font-black text-[#2A2A2A]">Rekening Bank</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">Rekening tujuan pencairan dana dari Planora</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-8 rounded-[32px] border border-slate-100 bg-[#F7F9FC] p-8 md:flex-row">
              <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-100 bg-white text-[#2A2A2A]/10 shadow-sm">
                  <Landmark className="h-8 w-8" />
                </div>
                <div>
                  <h5 className="text-sm font-black uppercase tracking-tight leading-none text-[#2A2A2A]">{bankForm.bankName}</h5>
                  <p className="mt-2 text-base font-bold italic tracking-widest text-[#2A2A2A] opacity-60">{bankForm.accountNumber} — a.n. {bankForm.accountHolder}</p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-500">
                    <Check className="h-3.5 w-3.5" /> Sudah diverifikasi admin
                  </p>
                </div>
              </div>
              <button onClick={handleEditBank} className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-sm transition-all hover:bg-slate-50 cursor-pointer">
                {bankEditMode ? 'Batal Ubah' : 'Ubah Rekening'}
              </button>
            </div>

            <div className="grid gap-8 border-t border-slate-50 pt-10 md:grid-cols-2">
              <div className="space-y-3">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">Nama Bank</label>
                <select
                  value={bankEditMode ? bankDraft.bankName : bankForm.bankName}
                  disabled={!bankEditMode}
                  onChange={(e) => setBankDraft((prev) => ({ ...prev, bankName: e.target.value }))}
                  className="w-full cursor-pointer rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF9A9E]/10 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <option>Bank BCA</option>
                  <option>Bank Mandiri</option>
                  <option>Bank BNI</option>
                  <option>Bank CIMB Niaga</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">Nomor Rekening</label>
                <input
                  type="text"
                  value={bankEditMode ? bankDraft.accountNumber : bankForm.accountNumber}
                  readOnly={!bankEditMode}
                  onChange={(e) => setBankDraft((prev) => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder="Masukkan nomor rekening baru"
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF9A9E]/10 read-only:cursor-default read-only:bg-slate-50 read-only:text-slate-400"
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">Nama Pemilik Rekening</label>
                <input
                  type="text"
                  value={bankEditMode ? bankDraft.accountHolder : bankForm.accountHolder}
                  readOnly={!bankEditMode}
                  onChange={(e) => setBankDraft((prev) => ({ ...prev, accountHolder: e.target.value }))}
                  placeholder="Sesuai buku tabungan"
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF9A9E]/10 read-only:cursor-default read-only:bg-slate-50 read-only:text-slate-400"
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-50 pt-6">
              <button onClick={handleSaveBank} disabled={!bankEditMode} className="rounded-2xl bg-[#2A2A2A] px-10 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-black/10 transition-all hover:bg-black active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
                Simpan Perubahan Rekening
              </button>
            </div>
          </section>

          <section id="notifikasi" className="scroll-mt-10 rounded-3xl border border-[#2A2A2A]/5 bg-white p-8 shadow-sm md:p-10 space-y-8">
            <div className="pb-2">
              <h3 className="text-xl font-black text-[#2A2A2A]">Notifikasi</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">Atur kapan dan bagaimana Anda menerima notifikasi</p>
            </div>

            <div className="divide-y divide-slate-100 border-t border-slate-100">
              {[
                ['Pesanan masuk baru', 'Notifikasi saat ada customer melakukan booking', true],
                ['Pembayaran DP diterima', 'Notifikasi saat admin memverifikasi DP customer', true],
                ['Pengingat H-3 acara', 'Pengingat otomatis 3 hari sebelum acara berlangsung', true],
                ['Dana berhasil dicairkan', 'Notifikasi saat admin mencairkan dana ke rekening Anda', true],
                ['Ulasan baru dari customer', 'Notifikasi saat customer memberikan rating dan ulasan', false],
                ['Email newsletter Planora', 'Tips bisnis dan update fitur terbaru dari Planora', false],
              ].map(([title, desc, enabled]) => (
                <div key={title as string} className="flex items-center justify-between py-8">
                  <div className="space-y-1">
                    <h5 className="text-[15px] font-black leading-tight text-[#2A2A2A]">{title as string}</h5>
                    <p className="text-[11px] font-medium text-slate-400">{desc as string}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" defaultChecked={enabled as boolean} />
                    <div className="h-7 w-14 rounded-full bg-slate-200 transition-all duration-300 peer-checked:bg-[#2A2A2A]" />
                    <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 peer-checked:translate-x-7" />
                  </label>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-red-100 bg-red-50 p-8 shadow-sm md:flex-row md:p-10">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-lg font-black uppercase tracking-tight text-red-500">Hapus Akun Vendor</h3>
              <p className="text-xs font-medium text-red-400">Akun dan semua data toko akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.</p>
            </div>
            <button onClick={handleOpenDeleteModal} className="rounded-2xl bg-red-500 px-10 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-200 transition-all hover:bg-red-600 active:scale-95 cursor-pointer">
              Ajukan Penghapusan
            </button>
          </section>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-black text-[#2A2A2A]">Ganti Kata Sandi</h4>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-[#2A2A2A]/40 transition-all hover:bg-[#FCE6E3] hover:text-[#FF527B] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold focus:border-[#FF9A9E] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold focus:border-[#FF9A9E] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">Konfirmasi Kata Sandi Baru</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold focus:border-[#FF9A9E] focus:outline-none"
                />
              </div>

              <button
                onClick={handlePasswordUpdate}
                className="mt-2 w-full rounded-xl bg-[#2A2A2A] py-3 text-[11px] font-black uppercase tracking-widest text-white transition-colors hover:bg-black cursor-pointer"
              >
                Perbarui Password
              </button>

              {passwordError && (
                <p className="rounded-2xl border border-[#F9D4D4] bg-[#FFF2F2] px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500">
                  {passwordError}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {showRemoveAvatarConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-sm rounded-[20px] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-black text-[#2A2A2A]">Hapus Foto Profil</h4>
              <button onClick={() => setShowRemoveAvatarConfirm(false)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-[#2A2A2A]/40 transition-all hover:bg-[#FCE6E3] hover:text-[#FF527B] cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm text-[#2A2A2A]/70">Kamu yakin ingin menghapus foto profil? Tindakan ini dapat dibatalkan dengan mengunggah foto baru.</p>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowRemoveAvatarConfirm(false)} className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[#2A2A2A]/50 transition-all hover:bg-gray-50 cursor-pointer">Batal</button>
              <button onClick={handleRemoveAvatar} className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-red-600 cursor-pointer">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-black text-[#2A2A2A]">Konfirmasi Keluar</h4>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-[#2A2A2A]/40 transition-all hover:bg-[#FCE6E3] hover:text-[#FF527B] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-6 text-sm font-semibold text-[#2A2A2A]/70">Kamu yakin ingin keluar dari akun vendor sekarang?</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[#2A2A2A]/50 transition-all hover:bg-gray-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-red-600 cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-black text-[#2A2A2A]">Ajukan Penghapusan Akun</h4>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-[#2A2A2A]/40 transition-all hover:bg-[#FCE6E3] hover:text-[#FF527B] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-[#2A2A2A]/70">
                Tindakan ini tidak langsung menghapus akun. Kami akan menerima permintaan penghapusan vendor untuk diproses lebih lanjut.
              </p>

              <div className="rounded-2xl border border-[#F9D4D4] bg-[#FFF2F2] px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500">
                Ketik HAPUS untuk melanjutkan
              </div>

              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="HAPUS"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold focus:border-[#FF9A9E] focus:outline-none"
              />

              {deleteError && (
                <p className="rounded-2xl border border-[#F9D4D4] bg-[#FFF2F2] px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500">
                  {deleteError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[#2A2A2A]/50 transition-all hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleRequestDelete}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-red-600 cursor-pointer"
                >
                  Kirim Permintaan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
