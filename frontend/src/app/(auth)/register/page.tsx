"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, Building, ChevronDown, Eye, EyeOff, Lock, Mail, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";

const serviceCategories = [
  "Wedding Organizer",
  "Venue",
  "Katering",
  "Fotografi",
  "Videografi",
  "Dekorasi & Florist",
  "Make Up Artist (MUA)",
  "Busana Pengantin",
  "MC (Master of Ceremony)",
  "Hiburan Musik (Band/DJ)",
  "Undangan Digital",
  "Souvenir",
];

export default function RegisterPage() {
  const role = "vendor";
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans text-slate-900 overflow-hidden bg-white text-base">
      <div className="relative hidden lg:flex lg:w-1/2 flex-col p-16 xl:p-24 justify-between overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80')",
          }}
        />
        <div className="absolute inset-0 z-10 bg-[#FFDED7]/90 backdrop-blur-[1px]" />

        <div className="relative z-20 flex items-center gap-3">
          <Image src="/images/logogmbr.png" alt="Planora" width={160} height={42} className="h-9 w-auto md:h-10" priority />
          <span className="font-logo text-[1.85rem] italic leading-none tracking-tighter text-black md:text-[2.15rem]">Planora</span>
          <Sparkles className="mt-[-6px] h-5 w-5 text-[#E94E77]" />
        </div>

        <div className="relative z-20 mt-10">
          <h1 className="text-5xl xl:text-6xl font-black leading-[1.05] mb-8 text-black tracking-tight">
            Mulai <br />
            Langkahmu <br />
            <span className="text-[#FF527B] italic drop-shadow-md">Bersama Planora</span>
          </h1>
          <p className="text-slate-700 font-bold text-lg max-w-md leading-relaxed opacity-85">
            Daftar sebagai vendor untuk menjangkau ribuan klien dan kembangkan bisnis Anda lebih profesional.
          </p>
        </div>

        <div className="relative z-20 mt-auto space-y-8">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/100?u=v10" className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" alt="User" />
              <img src="https://i.pravatar.cc/100?u=v11" className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" alt="User" />
              <img src="https://i.pravatar.cc/100?u=v12" className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" alt="User" />
            </div>
            <p className="text-sm font-bold text-slate-700">Bergabung dengan <span className="text-black font-black">10.000+</span> vendor</p>
          </div>
          <div className="max-w-md border-l-4 border-[#FF527B] pl-6">
            <p className="text-lg xl:text-xl font-black text-black leading-snug italic opacity-90">
              "Bergabung dengan Planora membantu saya menjangkau lebih banyak klien dan mengatur pesanan dengan rapi."
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 md:p-20 overflow-y-auto">
        <div className="w-full max-w-[500px] py-8 md:py-10">
          <div className="mb-10">
            <p className="text-slate-400 text-[11px] mb-2 font-bold uppercase tracking-[0.15em]">Selamat Datang ✨</p>
            <h2 className="text-3xl md:text-[2rem] font-extrabold text-[#0D121F] mb-3 tracking-tight leading-tight">Daftar Vendor <span className="text-[#FF9A9E]">Planora</span></h2>
            <p className="text-slate-400 text-sm font-medium">Sudah punya akun? <Link href="/login" className="text-[#FF9A9E] font-bold hover:underline">Masuk Sekarang</Link></p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Nama Pemilik (Owner)</label>
                  <input type="text" placeholder="Nama lengkap" className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 px-6 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400" />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Email / Nomor HP</label>
                  <input type="text" placeholder="Email atau No. HP" className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 px-6 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400" />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Nama Bisnis</label>
                <div className="relative group">
                  <Building className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#FF9A9E] transition-colors" />
                  <input type="text" placeholder="Contoh: Arkana Photography" className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 pl-12 pr-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400" />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Kategori Jasa</label>
                <div className="relative">
                  <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 pl-12 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white transition-all text-slate-600 font-medium text-sm md:text-base">
                    <option value="">Pilih kategori utama</option>
                    {serviceCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Email Bisnis</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#FF9A9E] transition-colors" />
                  <input type="email" placeholder="email@bisnisanda.id" className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 pl-12 pr-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Kota Domisili</label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#FF9A9E] transition-colors" />
                    <input type="text" placeholder="Nama Kota" className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 pl-12 pr-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Alamat Lengkap</label>
                  <input type="text" placeholder="Detail Alamat" className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 px-6 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Kata Sandi</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#FF9A9E] transition-colors" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Min. 8 Karakter" className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 pl-12 pr-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-300 hover:text-slate-500 transition-colors">{showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}</button>
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Konfirmasi Sandi</label>
                <input type="password" placeholder="Ulangi sandi" className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 px-6 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400" />
              </div>
            </div>

            <div className="flex items-start gap-3 px-1 py-2">
              <div className="relative flex items-center mt-1">
                <input type="checkbox" id="agree" className="peer sr-only" checked={agreed} onChange={() => setAgreed(!agreed)} />
                <div className="w-5 h-5 bg-slate-100 border border-slate-300 rounded-md peer-checked:bg-[#FF9A9E] peer-checked:border-[#FF9A9E] transition-all cursor-pointer" onClick={() => setAgreed(!agreed)} />
                <svg className="absolute w-3 h-3 text-white left-1 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>
              </div>
              <label htmlFor="agree" className="text-sm font-bold text-slate-500 cursor-pointer select-none leading-tight">Saya menyetujui <button className="text-[#FF9A9E] hover:underline transition-all">Syarat & Ketentuan</button> serta <button className="text-[#FF9A9E] hover:underline transition-all">Kebijakan Planora</button>.</label>
            </div>

            <button className="w-full bg-[#0D121F] text-white font-bold py-4.5 rounded-2xl shadow-xl transition-all text-base md:text-lg mt-4 hover:bg-slate-800 active:scale-95">Daftar Sekarang</button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#EDF2F7]"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.25em] font-black text-slate-300"><span className="bg-white px-4">atau daftar dengan</span></div>
          </div>

          <button className="w-full bg-white border border-[#E2E8F0] text-slate-700 font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#F7F9FC] transition-all shadow-sm mb-12">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" /> Google
          </button>

          <div className="flex items-center gap-4 bg-[#FF9A9E]/5 p-5 rounded-[24px] border border-[#FF9A9E]/10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"><ShieldCheck className="w-5 h-5 text-[#FF9A9E]" /></div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-bold">Data pendaftaran Anda aman. Kami menjamin kerahasiaan informasi sesuai standar keamanan global Planora.</p>
          </div>
        </div>
      </div>

      <style>{`\n        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');\n        button, input, select, textarea { font-family: inherit; }\n      `}</style>
    </div>
  );
}