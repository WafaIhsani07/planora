'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const UserIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const BagIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
    <path d="M3 6h18"></path>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M12 6h.01"></path>
    <path d="M12 10h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M8 14h.01"></path>
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const TagIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42l-8.704-8.704z"></path>
    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const AtSignIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4.5 8.4"></path>
  </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const EyeIcon = ({ className, isVisible }: { className?: string, isVisible: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {isVisible ? (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </>
    ) : (
      <>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
        <line x1="2" x2="22" y1="2" y2="22"></line>
      </>
    )}
  </svg>
);

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
    <g transform="matrix(1, 0, 0, 1, 0, 0)">
      <path fill="#4285F4" d="M23.745,12.27c0-0.74-0.065-1.45-0.195-2.13H12v4.04h6.605c-0.285,1.52-1.14,2.81-2.43,3.68v3.05h3.93 C22.395,18.73,23.745,15.76,23.745,12.27z"></path>
      <path fill="#34A853" d="M12,24c3.24,0,5.955-1.07,7.965-2.91l-3.93-3.05c-1.085,0.725-2.47,1.16-4.035,1.16c-3.115,0-5.755-2.1-6.7-4.92 H1.29v3.1C3.325,21.43,7.39,24,12,24z"></path>
      <path fill="#FBBC05" d="M5.3,14.28c-0.24-0.715-0.38-1.48-0.38-2.28s0.14-1.565,0.38-2.28V6.62H1.29C0.47,8.24,0,10.06,0,12 c0,1.94,0.47,3.76,1.29,5.38L5.3,14.28z"></path>
      <path fill="#EA4335" d="M12,4.76c1.76,0,3.345,0.605,4.59,1.79l3.435-3.42C17.955,1.2,15.24,0,12,0C7.39,0,3.325,2.57,1.29,6.62 l4.01,3.1C6.245,6.86,8.885,4.76,12,4.76z"></path>
    </g>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);


export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<'pelanggan' | 'vendor'>('vendor');

  return (
    <div className="min-h-screen min-h-dvh w-full flex flex-col md:flex-row bg-[#FAFAFC] font-sans">
      <div
        className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2048&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#FCE6E3]/75 to-[#F9D2CF]/75 z-0 backdrop-blur-[2px]"></div>

        <div className="relative z-10 flex items-center gap-2 mb-12 md:mb-20">
          <Image
            src="/images/logogmbr.png"
            alt="Planora"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="font-extrabold text-xl text-[#2A2A2A] tracking-tight">PLANORA</span>
        </div>

        <div className="relative z-10 mb-12 md:mb-auto">
          <h1 className="text-[2rem] sm:text-[2.4rem] lg:text-5xl leading-[1.05] font-extrabold text-[#2A2A2A] mb-6 tracking-tight">
            Jadikan Jasa Anda <br />
            <span className="italic">Pilihan Utama Klien.</span>
          </h1>
          <p className="text-[#4B5563] text-sm lg:text-base leading-relaxed max-w-sm">
            Bangun profil vendor yang meyakinkan, tampilkan layanan terbaik, dan jangkau lebih banyak calon pelanggan lewat Planora.
          </p>
        </div>

        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-white/20 rounded-full blur-3xl pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-[#2A2A2A]/25 rounded-full blur-[100px] pointer-events-none z-0"></div>
      </div>

      <div className="w-full md:w-1/2 bg-white p-8 md:p-12 lg:p-16">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-3xl md:text-[2rem] font-extrabold text-[#2A2A2A] mb-2 tracking-tight">
              Buat Akun Baru
            </h2>
            <p className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider">
              SUDAH PUNYA AKUN? <a href="/login" className="text-[#2A2A2A] hover:underline">MASUK DI SINI</a>
            </p>
          </div>

          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-wider">
                PILIH TIPE AKUN
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setAccountType('pelanggan')}
                  className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all ${accountType === 'pelanggan'
                    ? 'border-[#2A2A2A] bg-[#EAF5EF]'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                >
                  <UserIcon className={`w-6 h-6 ${accountType === 'pelanggan' ? 'text-[#2A2A2A]' : 'text-gray-400'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${accountType === 'pelanggan' ? 'text-[#2A2A2A]' : 'text-gray-400'}`}>
                    PELANGGAN
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('vendor')}
                  className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all ${accountType === 'vendor'
                    ? 'border-[#2A2A2A] bg-[#EAF5EF]'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                >
                  <BagIcon className={`w-6 h-6 ${accountType === 'vendor' ? 'text-[#2A2A2A]' : 'text-gray-400'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${accountType === 'vendor' ? 'text-[#2A2A2A]' : 'text-gray-400'}`}>
                    VENDOR
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-wider">
                  NAMA LENGKAP OWNER
                </label>
                <div className="relative">
                  <UserIcon className="absolute top-1/2 -translate-y-1/2 left-4 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Contoh: Budi Santoso" className="w-full bg-[#FAFAFC] border border-transparent rounded-xl py-3 pl-11 pr-4 text-sm text-[#2A2A2A] placeholder-gray-400 outline-none focus:border-gray-300 transition-colors" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-wider">
                  NAMA BISNIS
                </label>
                <div className="relative">
                  <BuildingIcon className="absolute top-1/2 -translate-y-1/2 left-4 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Contoh: Wafa Media" className="w-full bg-[#FAFAFC] border border-transparent rounded-xl py-3 pl-11 pr-4 text-sm text-[#2A2A2A] placeholder-gray-400 outline-none focus:border-gray-300 transition-colors" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-wider">
                  NOMOR WHATSAPP
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute top-1/2 -translate-y-1/2 left-4 w-4 h-4 text-gray-400" />
                  <input type="tel" placeholder="0812xxxx" className="w-full bg-[#FAFAFC] border border-transparent rounded-xl py-3 pl-11 pr-4 text-sm text-[#2A2A2A] placeholder-gray-400 outline-none focus:border-gray-300 transition-colors" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="service-category" className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-wider">
                  KATEGORI JASA
                </label>
                <div className="relative">
                  <TagIcon className="absolute top-1/2 -translate-y-1/2 left-4 w-4 h-4 text-gray-400" />
                  <select id="service-category" title="Kategori jasa" defaultValue="" className="w-full bg-[#FAFAFC] border border-transparent rounded-xl py-3 pl-11 pr-4 text-sm text-[#2A2A2A] outline-none focus:border-gray-300 transition-colors appearance-none cursor-pointer">
                    <option value="" disabled className="text-gray-400">Pilih Kategori</option>
                    <option value="fotografi">Fotografi &amp; Video</option>
                    <option value="katering">Katering</option>
                    <option value="dekorasi">Dekorasi</option>
                    <option value="wo">Wedding Organizer</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-wider">
                ALAMAT EMAIL BISNIS
              </label>
              <div className="relative">
                <MailIcon className="absolute top-1/2 -translate-y-1/2 left-4 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="nama@email.com" className="w-full bg-[#FAFAFC] border border-transparent rounded-xl py-3 pl-11 pr-4 text-sm text-[#2A2A2A] placeholder-gray-400 outline-none focus:border-gray-300 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-wider">
                  LOKASI
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute top-1/2 -translate-y-1/2 left-4 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Padang, Bukittinggi..." className="w-full bg-[#FAFAFC] border border-transparent rounded-xl py-3 pl-11 pr-4 text-sm text-[#2A2A2A] placeholder-gray-400 outline-none focus:border-gray-300 transition-colors" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-wider">
                  USERNAME INSTAGRAM
                </label>
                <div className="relative">
                  <AtSignIcon className="absolute top-1/2 -translate-y-1/2 left-4 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="@brand_kamu" className="w-full bg-[#FAFAFC] border border-transparent rounded-xl py-3 pl-11 pr-4 text-sm text-[#2A2A2A] placeholder-gray-400 outline-none focus:border-gray-300 transition-colors" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-wider">
                KATA SANDI
              </label>
              <div className="relative">
                <LockIcon className="absolute top-1/2 -translate-y-1/2 left-4 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimal 8 karakter"
                  className="w-full bg-[#FAFAFC] border border-transparent rounded-xl py-3 pl-11 pr-12 text-sm text-[#2A2A2A] placeholder-gray-400 outline-none focus:border-gray-300 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  <EyeIcon isVisible={showPassword} className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 mt-2">
              <input type="checkbox" id="terms" className="w-4 h-4 mt-0.5 border-2 border-gray-300 rounded accent-[#6B7280] focus:ring-[#6B7280] transition-colors cursor-pointer" />
              <label htmlFor="terms" className="text-[11px] text-gray-500 leading-tight cursor-pointer select-none">
                Saya menyetujui <span className="font-bold text-[#2A2A2A] hover:underline">Syarat &amp; Ketentuan</span> serta Kebijakan Privasi Planora.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#757A79] hover:bg-[#606463] text-white text-[11px] uppercase tracking-widest font-bold py-4 rounded-xl transition-all hover:shadow-lg active:scale-[0.98] mt-2"
            >
              Daftar Sekarang
            </button>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button type="button" className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl py-3.5 transition-all">
              <GoogleIcon className="w-5 h-5" />
              <span className="text-sm font-bold text-[#2A2A2A]">Google</span>
            </button>
            <button type="button" className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl py-3.5 transition-all">
              <FacebookIcon className="w-5 h-5" />
              <span className="text-sm font-bold text-[#2A2A2A]">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}