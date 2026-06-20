'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { signOut } from 'next-auth/react';
import DashboardLayout from '../DashboardLayout';
import {
  AtSign,
  Camera,
  Check,
  ExternalLink,
  Globe,
  HelpCircle,
  Landmark,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Star,
  User,
  Bell,
  X,
} from 'lucide-react';
import { getUserProfile, updateUserProfile, changePassword } from '@/services/user.service';
import { getMyVendorProfile, updateVendorProfile, uploadImage } from '@/services/vendor.service';
import { useLanguage } from '@/context/LanguageContext';

type ProfileForm = {
  businessName: string;
  yearFounded: string;
  description: string;
  email: string;
  whatsapp: string;
  instagram: string;
  website: string;
  address: string;
  ktpUrl?: string;
  bankBookUrl?: string;
  businessLicenseUrl?: string;
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
  ktpUrl: '',
  bankBookUrl: '',
  businessLicenseUrl: '',
};

const initialBankForm: BankForm = {
  bankName: 'Bank BCA',
  accountNumber: '1234 5678 9012',
  accountHolder: 'Wafa Decoration',
};

export default function PengaturanVendorPage() {
  const { t } = useLanguage();
  const navItems = [
    { id: 'profil', label: t('dashboard.pengaturan.nav.profil'), icon: User },
    { id: 'keamanan', label: t('dashboard.pengaturan.nav.keamanan'), icon: Lock },
    { id: 'rekening', label: t('dashboard.pengaturan.nav.rekening'), icon: Landmark },
    { id: 'notifikasi', label: t('dashboard.pengaturan.nav.notifikasi'), icon: Bell },
  ];
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [notice, setNotice] = useState<{ type: 'success' | 'info'; message: string } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
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

  useEffect(() => {
    async function loadData() {
      try {
        const [vendorRes, userRes] = await Promise.all([
          getMyVendorProfile(),
          getUserProfile(),
        ]);
        
        if (vendorRes) {
          setForm(prev => ({
            ...prev,
            businessName: vendorRes.businessName || '',
            description: vendorRes.description || '',
            address: vendorRes.address || '',
            ktpUrl: vendorRes.ktpUrl || '',
            bankBookUrl: vendorRes.bankBookUrl || '',
            businessLicenseUrl: vendorRes.businessLicenseUrl || '',
          }));
          if (vendorRes.bankName || vendorRes.bankAccount) {
            const bForm = {
              bankName: vendorRes.bankName || 'Bank BCA',
              accountNumber: vendorRes.bankAccount || '',
              accountHolder: vendorRes.bankHolder || '',
            };
            setBankForm(bForm);
            setBankDraft(bForm);
          }
        }
        
        if (userRes) {
          setForm(prev => ({
            ...prev,
            email: userRes.email || prev.email,
            whatsapp: userRes.phone || prev.whatsapp,
          }));
        }
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      }
    }
    loadData();
  }, []);

  const handleChange = (key: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    return () => {
      if (avatarUrl && avatarUrl.startsWith('blob:')) URL.revokeObjectURL(avatarUrl);
    };
  }, [avatarUrl]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (avatarUrl && avatarUrl.startsWith('blob:')) URL.revokeObjectURL(avatarUrl);
    setAvatarUrl(url);
    setAvatarFile(file);
    pushNotice('success', t('dashboard.pengaturan.messages.avatarSelected'));
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleRemoveAvatar = () => {
    setShowRemoveAvatarConfirm(false);
    if (avatarUrl && avatarUrl.startsWith('blob:')) URL.revokeObjectURL(avatarUrl);
    setAvatarUrl(null);
    setAvatarFile(null);
    pushNotice('info', t('dashboard.pengaturan.messages.avatarRemoved'));
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

  const handleSave = async () => {
    if (isSavingProfile) return;

    setIsSavingProfile(true);
    try {
      let finalAvatarUrl = avatarUrl;
      if (avatarFile) {
        const uploadedUrl = await uploadImage(avatarFile);
        if (uploadedUrl) finalAvatarUrl = uploadedUrl;
      }

      await updateVendorProfile({
        businessName: form.businessName,
        description: form.description,
        address: form.address,
        ktpUrl: form.ktpUrl,
        bankBookUrl: form.bankBookUrl,
        businessLicenseUrl: form.businessLicenseUrl,
      });
      await updateUserProfile({ 
        phone: form.whatsapp,
        ...(avatarFile || finalAvatarUrl === null ? { avatar: finalAvatarUrl || '' } : {})
      });
      
      setAvatarFile(null);
      pushNotice('success', t('dashboard.pengaturan.messages.profileSaved'));
    } catch (error) {
      pushNotice('info', t('dashboard.pengaturan.messages.profileSaveFailed'));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async () => {
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError(t('dashboard.pengaturan.messages.pwdCurrentRequired'));
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(t('dashboard.pengaturan.messages.pwdMinLength'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('dashboard.pengaturan.messages.pwdMismatch'));
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);
      pushNotice('success', t('dashboard.pengaturan.messages.pwdSuccess'));
    } catch (error: any) {
      setPasswordError(error?.response?.data?.message || t('dashboard.pengaturan.messages.pwdFailed'));
    }
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
    if (deleteConfirmText !== 'DELETE' && deleteConfirmText !== 'HAPUS') {
      setDeleteError(t('dashboard.pengaturan.messages.deleteTypeConfirm'));
      return;
    }

    setShowDeleteModal(false);
    setDeleteConfirmText('');
    pushNotice('info', t('dashboard.pengaturan.messages.deleteRequested'));
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

  const handleSaveBank = async () => {
    if (!bankEditMode) return;

    try {
      await updateVendorProfile({
        bankName: bankDraft.bankName,
        bankAccount: bankDraft.accountNumber,
        bankHolder: bankDraft.accountHolder,
      });
      setBankForm(bankDraft);
      setBankEditMode(false);
      pushNotice('success', t('dashboard.pengaturan.messages.bankSaved'));
    } catch (error) {
      pushNotice('info', t('dashboard.pengaturan.messages.bankFailed'));
    }
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
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-10 pb-20">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-[#2A2A2A]">{t('dashboard.pengaturan.title')}</h1>
          <p className="text-sm font-medium uppercase tracking-widest text-slate-400">
            {t('dashboard.pengaturan.subtitle')}
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
                  <h3 className="text-xl font-black text-[#2A2A2A]">{t('dashboard.pengaturan.profil.title')}</h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                    {t('dashboard.pengaturan.profil.desc')}
                  </p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-emerald-600">
                  <Check className="h-3 w-3" /> {t('dashboard.pengaturan.profil.verified')}
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
                      {t('dashboard.pengaturan.profil.uploadBtn')}
                    </button>
                    <button onClick={() => setShowRemoveAvatarConfirm(true)} className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:bg-slate-50 cursor-pointer">
                      {t('dashboard.pengaturan.profil.removeBtn')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-8 border-t border-slate-50 pt-10 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">{t('dashboard.pengaturan.profil.businessName')}</label>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF9A9E]/10"
                  />
                </div>

                {/* Kategori Layanan dihapus — tampilkan hanya data penting */}

                <div className="space-y-3">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">{t('dashboard.pengaturan.profil.whatsapp')}</label>
                  <input
                    type="text"
                    value={form.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF9A9E]/10"
                  />
                </div>

                <div className="space-y-3">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">{t('dashboard.pengaturan.profil.city')}</label>
                  <input type="text" value="Padang, Sumatera Barat" readOnly className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 text-sm font-bold text-slate-500" />
                </div>
              </div>

                <div className="space-y-3">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">{t('dashboard.pengaturan.profil.description')}</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full resize-none rounded-[24px] border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-5 text-sm font-bold leading-relaxed transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF9A9E]/10"
                />
              </div>

              <div className="space-y-4 border-t border-slate-50 pt-10">
                <h4 className="text-sm font-black text-[#2A2A2A]">Dokumen Legalitas (Opsional)</h4>
                <div className="grid gap-8 md:grid-cols-3">
                  <div className="space-y-3">
                    <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">KTP URL</label>
                    <input type="text" value={form.ktpUrl || ''} onChange={(e) => handleChange('ktpUrl', e.target.value)} placeholder="https://..." className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF9A9E]/10" />
                  </div>
                  <div className="space-y-3">
                    <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">SIUP URL</label>
                    <input type="text" value={form.businessLicenseUrl || ''} onChange={(e) => handleChange('businessLicenseUrl', e.target.value)} placeholder="https://..." className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF9A9E]/10" />
                  </div>
                  <div className="space-y-3">
                    <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">Buku Tabungan URL</label>
                    <input type="text" value={form.bankBookUrl || ''} onChange={(e) => handleChange('bankBookUrl', e.target.value)} placeholder="https://..." className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF9A9E]/10" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-50 pt-6">
                <button onClick={handleSave} disabled={isSavingProfile} className="rounded-2xl bg-[#2A2A2A] px-10 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-black/10 transition-all hover:bg-black active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
                  {isSavingProfile ? t('dashboard.pengaturan.profil.btnSaving') : t('dashboard.pengaturan.profil.btnSave')}
                </button>
              </div>
            </section>

            <section id="keamanan" className="scroll-mt-10 rounded-3xl border border-[#2A2A2A]/5 bg-white p-8 shadow-sm md:p-10 space-y-10">
              <div>
                <h3 className="text-xl font-black text-[#2A2A2A]">{t('dashboard.pengaturan.keamanan.title')}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">{t('dashboard.pengaturan.keamanan.desc')}</p>
              </div>

              <div className="border-t border-slate-50 pt-6">
                <div className="space-y-3 md:max-w-xl">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">{t('dashboard.pengaturan.keamanan.emailLabel')}</label>
                  <input type="email" value={form.email} readOnly className="w-full cursor-not-allowed rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 text-sm font-bold text-slate-400 opacity-70" />
                  <p className="ml-1 mt-1 text-[9px] font-bold italic tracking-tighter text-slate-300">{t('dashboard.pengaturan.keamanan.emailNote')}</p>

                  <p className="mt-4 text-sm text-slate-500">{t('dashboard.pengaturan.keamanan.pwdNote')}</p>

                  <div className="mt-4 flex justify-end">
                    <button onClick={() => setShowPasswordModal(true)} className="rounded-2xl bg-[#2A2A2A] px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-black/10 transition-all hover:bg-black active:scale-95 cursor-pointer">
                      {t('dashboard.pengaturan.keamanan.btnChangePwd')}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section id="rekening" className="scroll-mt-10 rounded-3xl border border-[#2A2A2A]/5 bg-white p-8 shadow-sm md:p-10 space-y-10">
              <div>
                <h3 className="text-xl font-black text-[#2A2A2A]">{t('dashboard.pengaturan.rekening.title')}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">{t('dashboard.pengaturan.rekening.desc')}</p>
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
                      <Check className="h-3.5 w-3.5" /> {t('dashboard.pengaturan.rekening.verified')}
                    </p>
                  </div>
                </div>
                <button onClick={handleEditBank} className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-sm transition-all hover:bg-slate-50 cursor-pointer">
                  {bankEditMode ? t('dashboard.pengaturan.rekening.btnCancelEdit') : t('dashboard.pengaturan.rekening.btnEdit')}
                </button>
              </div>

              <div className="grid gap-8 border-t border-slate-50 pt-10 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">{t('dashboard.pengaturan.rekening.bankName')}</label>
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
                  <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">{t('dashboard.pengaturan.rekening.accountNumber')}</label>
                  <input
                    type="text"
                    value={bankEditMode ? bankDraft.accountNumber : bankForm.accountNumber}
                    readOnly={!bankEditMode}
                    onChange={(e) => setBankDraft((prev) => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder={t('dashboard.pengaturan.rekening.accountPlaceholder')}
                    className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF9A9E]/10 read-only:cursor-default read-only:bg-slate-50 read-only:text-slate-400"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">{t('dashboard.pengaturan.rekening.accountHolder')}</label>
                  <input
                    type="text"
                    value={bankEditMode ? bankDraft.accountHolder : bankForm.accountHolder}
                    readOnly={!bankEditMode}
                    onChange={(e) => setBankDraft((prev) => ({ ...prev, accountHolder: e.target.value }))}
                    placeholder={t('dashboard.pengaturan.rekening.holderPlaceholder')}
                    className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF9A9E]/10 read-only:cursor-default read-only:bg-slate-50 read-only:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-50 pt-6">
                <button onClick={handleSaveBank} disabled={!bankEditMode} className="rounded-2xl bg-[#2A2A2A] px-10 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-black/10 transition-all hover:bg-black active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
                  {t('dashboard.pengaturan.rekening.btnSave')}
                </button>
              </div>
            </section>

            <section id="notifikasi" className="scroll-mt-10 rounded-3xl border border-[#2A2A2A]/5 bg-white p-8 shadow-sm md:p-10 space-y-8">
              <div className="pb-2">
                <h3 className="text-xl font-black text-[#2A2A2A]">{t('dashboard.pengaturan.notifikasi.title')}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">{t('dashboard.pengaturan.notifikasi.desc')}</p>
              </div>

              <div className="divide-y divide-slate-100 border-t border-slate-100">
                {[
                  [t('dashboard.pengaturan.notifikasi.items.newOrder.title'), t('dashboard.pengaturan.notifikasi.items.newOrder.desc'), true],
                  [t('dashboard.pengaturan.notifikasi.items.dpReceived.title'), t('dashboard.pengaturan.notifikasi.items.dpReceived.desc'), true],
                  [t('dashboard.pengaturan.notifikasi.items.eventReminder.title'), t('dashboard.pengaturan.notifikasi.items.eventReminder.desc'), true],
                  [t('dashboard.pengaturan.notifikasi.items.fundWithdrawn.title'), t('dashboard.pengaturan.notifikasi.items.fundWithdrawn.desc'), true],
                  [t('dashboard.pengaturan.notifikasi.items.newReview.title'), t('dashboard.pengaturan.notifikasi.items.newReview.desc'), false],
                  [t('dashboard.pengaturan.notifikasi.items.newsletter.title'), t('dashboard.pengaturan.notifikasi.items.newsletter.desc'), false],
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
                <h3 className="text-lg font-black uppercase tracking-tight text-red-500">{t('dashboard.pengaturan.dangerZone.title')}</h3>
                <p className="text-xs font-medium text-red-400">{t('dashboard.pengaturan.dangerZone.desc')}</p>
              </div>
              <button onClick={handleOpenDeleteModal} className="rounded-2xl bg-red-500 px-10 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-200 transition-all hover:bg-red-600 active:scale-95 cursor-pointer">
                {t('dashboard.pengaturan.dangerZone.btnDelete')}
              </button>
            </section>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-black text-[#2A2A2A]">{t('dashboard.pengaturan.modals.password.title')}</h4>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-[#2A2A2A]/40 transition-all hover:bg-[#FCE6E3] hover:text-[#FF527B] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">{t('dashboard.pengaturan.modals.password.currentPwd')}</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold focus:border-[#FF9A9E] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">{t('dashboard.pengaturan.modals.password.newPwd')}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold focus:border-[#FF9A9E] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">{t('dashboard.pengaturan.modals.password.confirmPwd')}</label>
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
                {t('dashboard.pengaturan.modals.password.btnUpdate')}
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
              <h4 className="text-lg font-black text-[#2A2A2A]">{t('dashboard.pengaturan.modals.avatar.title')}</h4>
              <button onClick={() => setShowRemoveAvatarConfirm(false)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-[#2A2A2A]/40 transition-all hover:bg-[#FCE6E3] hover:text-[#FF527B] cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm text-[#2A2A2A]/70">{t('dashboard.pengaturan.modals.avatar.desc')}</p>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowRemoveAvatarConfirm(false)} className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[#2A2A2A]/50 transition-all hover:bg-gray-50 cursor-pointer">{t('dashboard.pengaturan.modals.avatar.btnCancel')}</button>
              <button onClick={handleRemoveAvatar} className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-red-600 cursor-pointer">{t('dashboard.pengaturan.modals.avatar.btnDelete')}</button>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-black text-[#2A2A2A]">{t('dashboard.pengaturan.modals.logout.title')}</h4>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-[#2A2A2A]/40 transition-all hover:bg-[#FCE6E3] hover:text-[#FF527B] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-6 text-sm font-semibold text-[#2A2A2A]/70">{t('dashboard.pengaturan.modals.logout.desc')}</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[#2A2A2A]/50 transition-all hover:bg-gray-50 cursor-pointer"
              >
                {t('dashboard.pengaturan.modals.logout.btnCancel')}
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-red-600 cursor-pointer"
              >
                {t('dashboard.pengaturan.modals.logout.btnLogout')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-black text-[#2A2A2A]">{t('dashboard.pengaturan.modals.delete.title')}</h4>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-[#2A2A2A]/40 transition-all hover:bg-[#FCE6E3] hover:text-[#FF527B] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-[#2A2A2A]/70">
                {t('dashboard.pengaturan.modals.delete.desc')}
              </p>

              <div className="rounded-2xl border border-[#F9D4D4] bg-[#FFF2F2] px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500">
                {t('dashboard.pengaturan.modals.delete.instruction')}
              </div>

              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={t('dashboard.pengaturan.modals.delete.placeholder')}
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
                  {t('dashboard.pengaturan.modals.delete.btnCancel')}
                </button>
                <button
                  onClick={handleRequestDelete}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-red-600 cursor-pointer"
                >
                  {t('dashboard.pengaturan.modals.delete.btnSubmit')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}