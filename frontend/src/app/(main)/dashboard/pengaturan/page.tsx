'use client';

import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import DashboardLayout from '../DashboardLayout';
import {
  AtSign,
  Camera,
  ExternalLink,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Star,
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

export default function PengaturanVendorPage() {
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [saved, setSaved] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChange = (key: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordUpdate = () => {
    if (!currentPassword) {
      alert('Isi kata sandi saat ini terlebih dahulu.');
      return;
    }

    if (newPassword.length < 8) {
      alert('Kata sandi baru minimal 8 karakter.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setShowPasswordModal(false);
    alert('Kata sandi berhasil diperbarui.');
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-[34px] font-black tracking-tight text-[#2A2A2A]">Pengaturan Akun</h1>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#2A2A2A]/40">
              KELOLA PROFIL TOKO DAN KEAMANAN AKUN ANDA.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open('/', '_blank')}
              className="rounded-[18px] border border-[#2A2A2A]/10 bg-white px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A] transition-all hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Lihat Publik
              </span>
            </button>

            <button
              onClick={handleSave}
              className="rounded-[18px] bg-[#2A2A2A] px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-[#2A2A2A]/10 transition-all hover:bg-black"
            >
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Simpan Perubahan
              </span>
            </button>
          </div>
        </div>

        {saved && (
          <div className="rounded-2xl border border-[#E6F9F0] bg-[#E6F9F0] px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[#10B981]">
            Perubahan berhasil disimpan.
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-4">
            <div className="rounded-[40px] border border-[#2A2A2A]/5 bg-white p-8 text-center shadow-sm">
              <div className="relative mx-auto mb-6 w-fit">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400"
                  className="h-32 w-32 rounded-[40px] border-4 border-[#FDF1F0] object-cover"
                  alt="Profil Vendor"
                />
                <button
                  onClick={() => alert('Fitur unggah foto akan segera tersedia.')}
                  className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-white bg-[#FF9A9E] text-white transition-colors hover:bg-[#FF527B]"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <h4 className="mb-1 text-xl font-black text-[#2A2A2A]">{form.businessName}</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF9A9E]">Vendor Dekorasi Pro</p>

              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-50 pt-8">
                <div className="text-left">
                  <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-[#2A2A2A]/20">Total Ulasan</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-black text-[#2A2A2A]">
                      4.9 <span className="text-[10px] font-bold opacity-30">(120)</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-[#2A2A2A]/20">Status Toko</p>
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-tighter text-emerald-600">Buka</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[40px] border border-[#FF9A9E]/10 bg-[#FDF1F0] p-8">
              <h4 className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#FF527B]">
                <Lock className="h-4 w-4" /> Keamanan Akun
              </h4>
              <p className="mb-6 text-xs font-medium leading-relaxed text-[#2A2A2A]/60">
                Pastikan Anda rutin mengganti kata sandi untuk menjaga keamanan dana dan data pesanan.
              </p>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full rounded-[18px] border border-[#FF9A9E]/20 bg-white py-4 text-[10px] font-bold uppercase tracking-widest text-[#FF527B] transition-all hover:bg-[#FF9A9E] hover:text-white"
              >
                Ganti Kata Sandi
              </button>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-red-50 py-4 text-[10px] font-bold uppercase tracking-widest text-red-500 transition-all hover:bg-red-500 hover:text-white"
            >
              <LogOut className="h-4 w-4" /> Keluar dari Akun
            </button>

            <div className="rounded-[40px] border border-[#2A2A2A]/5 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-[#FAFAFC] text-[#A8A8A8]">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-black tracking-tight text-[#2A2A2A]">Butuh Bantuan?</h3>
              <p className="mx-auto mb-5 max-w-[200px] text-[10px] font-bold uppercase tracking-wider text-[#A8A8A8]">
                Hubungi tim support Planora untuk kendala teknis
              </p>
              <button
                onClick={() => alert('Menghubungkan ke customer service...')}
                className="w-full rounded-xl border-2 border-[#2A2A2A] bg-white py-3 text-[10px] font-bold uppercase tracking-widest text-[#2A2A2A] transition-colors hover:bg-gray-50"
              >
                Chat Customer Service
              </button>
            </div>
          </div>

          <div className="space-y-8 lg:col-span-8">
            <div className="space-y-10 rounded-[40px] border border-[#2A2A2A]/5 bg-white p-10 shadow-sm">
              <section className="space-y-6">
                <h5 className="border-b border-slate-50 pb-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#2A2A2A]/20">
                  INFORMASI PROFIL
                </h5>

                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">Nama Toko / Bisnis</label>
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={(e) => handleChange('businessName', e.target.value)}
                      className="w-full rounded-2xl border border-transparent bg-[#FDF1F0]/50 px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">Tahun Berdiri</label>
                    <input
                      type="number"
                      value={form.yearFounded}
                      onChange={(e) => handleChange('yearFounded', e.target.value)}
                      className="w-full rounded-2xl border border-transparent bg-[#FDF1F0]/50 px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">Deskripsi Singkat Toko</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full resize-none rounded-[24px] border border-transparent bg-[#FDF1F0]/50 px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30"
                  />
                </div>
              </section>

              <section className="space-y-6">
                <h5 className="border-b border-slate-50 pb-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#2A2A2A]/20">
                  KONTAK DAN MEDIA SOSIAL
                </h5>

                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">
                      <Mail className="h-3 w-3" /> Alamat Email Bisnis
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full rounded-2xl border border-transparent bg-[#FDF1F0]/50 px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">
                      <Phone className="h-3 w-3" /> Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={form.whatsapp}
                      onChange={(e) => handleChange('whatsapp', e.target.value)}
                      className="w-full rounded-2xl border border-transparent bg-[#FDF1F0]/50 px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30"
                    />
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">
                      <AtSign className="h-3 w-3" /> Username Instagram
                    </label>
                    <input
                      type="text"
                      value={form.instagram}
                      onChange={(e) => handleChange('instagram', e.target.value)}
                      className="w-full rounded-2xl border border-transparent bg-[#FDF1F0]/50 px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">
                      <Globe className="h-3 w-3" /> Website (Opsional)
                    </label>
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      placeholder="www.websiteanda.com"
                      className="w-full rounded-2xl border border-transparent bg-[#FDF1F0]/50 px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h5 className="border-b border-slate-50 pb-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#2A2A2A]/20">
                  LOKASI DOMISILI
                </h5>

                <div className="space-y-3">
                  <label className="ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A]/40">
                    <MapPin className="h-3 w-3" /> Alamat Lengkap Studio
                  </label>
                  <textarea
                    rows={2}
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full resize-none rounded-[24px] border border-transparent bg-[#FDF1F0]/50 px-6 py-4 text-sm font-bold transition-all focus:border-[#FF9A9E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30"
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-black text-[#2A2A2A]">Ganti Kata Sandi</h4>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-[#2A2A2A]/40 transition-all hover:bg-[#FCE6E3] hover:text-[#FF527B]"
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

              <button
                onClick={handlePasswordUpdate}
                className="mt-2 w-full rounded-xl bg-[#2A2A2A] py-3 text-[11px] font-black uppercase tracking-widest text-white transition-colors hover:bg-black"
              >
                Perbarui Password
              </button>
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
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-[#2A2A2A]/40 transition-all hover:bg-[#FCE6E3] hover:text-[#FF527B]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-6 text-sm font-semibold text-[#2A2A2A]/70">
              Kamu yakin ingin keluar dari akun vendor sekarang?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[#2A2A2A]/50 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white hover:bg-red-600"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
