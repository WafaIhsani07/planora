'use client';

import React, { useState } from 'react';

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
);
const HelpCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>
);
const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></svg>
);
const SaveIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
);
const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="19" x2="5" y1="12" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
);

function ToggleSwitch({
  enabled,
  onToggle,
  label,
  description,
}: {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-extrabold tracking-wider text-[#2A2A2A] uppercase">{label}</span>
        <span className="text-[10px] font-medium text-[#A8A8A8]">{description}</span>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-label={label}
        className={`flex h-6 w-12 shrink-0 items-center rounded-full border-2 px-1 transition-colors duration-300 ${enabled ? 'border-[#2A2A2A] bg-white' : 'border-gray-300 bg-gray-100'}`}
      >
        <span className={`h-4 w-4 rounded-full bg-[#2A2A2A] transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

export default function PengaturanVendorPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [waReminder, setWaReminder] = useState(true);

  return (
    <div className="mx-auto w-full max-w-[1300px] pb-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <span className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">
            KONFIGURASI AKUN & KEAMANAN
          </span>
          <h1 className="text-4xl font-black italic tracking-tighter text-[#2A2A2A] leading-[1.05] md:text-[2.75rem]">
            PENGATURAN <br /> SISTEM VENDOR.
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white px-5 text-[10px] font-bold tracking-widest text-[#2A2A2A] uppercase shadow-sm transition-colors hover:bg-gray-50">
            <ExternalLinkIcon className="h-4 w-4" />
            LIHAT PUBLIK
          </button>
          <button className="flex h-11 items-center gap-2 rounded-full bg-[#2A2A2A] px-5 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg shadow-[#2A2A2A]/20 transition-colors hover:bg-[#1a1a1a]">
            <SaveIcon className="h-4 w-4" />
            SIMPAN PENGATURAN
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] lg:p-8">
            <h3 className="mb-6 text-lg font-black italic tracking-tighter text-[#2A2A2A] uppercase">
              KEAMANAN AKUN
            </h3>

            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">PASSWORD SAAT INI</label>
                  <input
                    type="password"
                    defaultValue="••••••••"
                    title="Password saat ini"
                    placeholder="Password saat ini"
                    className="w-full rounded-xl border border-gray-100 bg-[#FAFAFC] px-4 py-3 text-[13px] font-medium text-[#2A2A2A] outline-none transition-colors focus:border-gray-300"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">PASSWORD BARU</label>
                  <input
                    type="password"
                    placeholder="Minimal 8 karakter"
                    title="Password baru"
                    className="w-full rounded-xl border border-gray-100 bg-[#FAFAFC] px-4 py-3 text-[13px] font-medium text-[#2A2A2A] outline-none transition-colors placeholder:text-gray-400 focus:border-gray-300"
                  />
                </div>
              </div>

              <div className="mt-1 flex justify-end">
                <button className="h-11 w-full rounded-xl bg-[#2A2A2A] px-7 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg shadow-[#2A2A2A]/20 transition-colors hover:bg-[#1a1a1a] md:w-auto">
                  PERBARUI PASSWORD
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] lg:p-8">
            <h3 className="mb-6 text-lg font-black italic tracking-tighter text-[#2A2A2A] uppercase">
              NOTIFIKASI
            </h3>

            <div className="flex flex-col gap-6">
              <ToggleSwitch
                enabled={emailNotif}
                onToggle={() => setEmailNotif((currentValue) => !currentValue)}
                label="EMAIL NOTIFIKASI PESANAN"
                description="Kirim rincian pesanan baru ke email bisnis"
              />

              <div className="h-px w-full bg-gray-100" />

              <ToggleSwitch
                enabled={waReminder}
                onToggle={() => setWaReminder((currentValue) => !currentValue)}
                label="WHATSAPP REMINDER"
                description="Pengingat jadwal H-1 melalui WhatsApp"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6 lg:gap-8">
          <div className="rounded-[2.5rem] bg-[#2A2A2A] p-6 text-white shadow-[0_20px_40px_-10px_rgba(42,42,42,0.4)] lg:p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FCE6E3] text-[#2A2A2A]">
                <ShieldCheckIcon className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="mb-0.5 text-[8px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">VERIFIKASI</span>
                <h3 className="text-base font-black italic tracking-tighter text-white uppercase">VENDOR TERVERIFIKASI</h3>
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-2 rounded-2xl border border-[#444] bg-[#3A3A3A] p-4">
              <span className="text-[8px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">MASA AKTIF PAKET</span>
              <span className="text-xs font-bold tracking-wider text-white uppercase">PRO PLAN • S/D MEI 2027</span>
            </div>

            <button className="h-11 w-full rounded-xl bg-[#FCE6E3] text-[10px] font-bold tracking-widest text-[#2A2A2A] uppercase transition-colors hover:bg-[#F8D8D3]">
              UPGRADE LAYANAN
            </button>
          </div>

          <div className="rounded-[2.5rem] border border-gray-100 bg-white p-6 text-center shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] lg:p-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-[#FAFAFC] text-[#A8A8A8]">
              <HelpCircleIcon className="h-5 w-5" />
            </div>

            <h3 className="mb-2 text-base font-black italic tracking-tighter text-[#2A2A2A] uppercase">
              BUTUH BANTUAN?
            </h3>

            <p className="mx-auto mb-6 max-w-[200px] text-[9px] font-bold leading-relaxed tracking-wider text-[#A8A8A8] uppercase">
              HUBUNGI TIM SUPPORT PLANORA UNTUK KENDALA TEKNIS
            </p>

            <button className="h-11 w-full rounded-xl border-2 border-[#2A2A2A] bg-white text-[10px] font-bold tracking-widest text-[#2A2A2A] uppercase transition-colors hover:bg-gray-50">
              CHAT CUSTOMER SERVICE
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 pb-2 text-center">
        <p className="text-[8px] font-bold tracking-[0.3em] text-[#A8A8A8] uppercase">
          PLANORA ECOSYSTEM • MODUL PENGATURAN V.1 • 2026
        </p>
      </div>
    </div>
  );
}
