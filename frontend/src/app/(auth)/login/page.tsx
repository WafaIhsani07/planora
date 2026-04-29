'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  EyeOff,
  Eye,
  ArrowRight,
  User,
  UserCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { login } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';

type UserRole = 'customer' | 'vendor';

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  
  const [role, setRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login({
        email,
        password,
        role: role === 'customer' ? 'CUSTOMER' : 'VENDOR'
      });

      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        
        // Update auth store
        setSession(user, token);
        
        // Redirect based on role
        if (user.role === 'VENDOR') {
          router.push('/vendor/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal. Cek email dan password Anda.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans text-slate-900 overflow-hidden bg-white text-base">
      {/* SISI KIRI: HERO, INFO & TESTIMONIAL */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col p-16 xl:p-24 justify-between overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80')",
          }}
        />
        {/* Overlay Pink #FFDED7 solid */}
        <div className="absolute inset-0 z-10 bg-[#FFDED7]/90 backdrop-blur-[1px]" />

        {/* Logo Section - Hitam Pekat */}
        <div className="relative z-20 flex items-center gap-3">
          <Image
            src="/images/logogmbr.png"
            alt="Planora Logo"
            width={160}
            height={42}
            className="h-9 w-auto md:h-10"
          />
          <span className="font-logo text-[1.85rem] italic leading-none tracking-tighter text-black md:text-[2.15rem]">
            Planora
          </span>
          <Sparkles className="mt-[-6px] h-5 w-5 text-[#E94E77]" />
        </div>

        {/* Headline Sisi Kiri - Teks Akcent tidak pucat */}
        <div className="relative z-20 mt-10">
          <h1 className="text-5xl xl:text-6xl font-black leading-[1.05] mb-8 text-black tracking-tight">
            Rencanakan <br />
            Momen Spesialmu <br />
            <span className="text-[#FF527B] italic drop-shadow-md">Bersama Planora</span>
          </h1>
          <p className="text-slate-700 font-bold text-lg max-w-md leading-relaxed opacity-85">
            Masuk untuk mengelola pesanan acara Anda atau temukan vendor impian
            untuk momen spesial berikutnya.
          </p>
        </div>

        {/* Testimonial & Social Proof Sisi Kiri */}
        <div className="relative z-20 mt-auto space-y-8">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <img
                src="https://i.pravatar.cc/100?u=v1"
                className="w-11 h-11 rounded-full border-2 border-white/50 object-cover shadow-sm"
                alt="User"
              />
              <img
                src="https://i.pravatar.cc/100?u=v2"
                className="w-11 h-11 rounded-full border-2 border-white/50 object-cover shadow-sm"
                alt="User"
              />
              <img
                src="https://i.pravatar.cc/100?u=v3"
                className="w-11 h-11 rounded-full border-2 border-white/50 object-cover shadow-sm"
                alt="User"
              />
            </div>
            <p className="text-sm font-bold text-slate-700">
              Bergabung dengan <span className="text-black font-black">10.000+</span> pengguna
            </p>
          </div>
          <div className="max-w-md border-l-4 border-[#FF527B] pl-6">
            <p className="text-lg xl:text-xl font-black text-black leading-snug italic opacity-90">
              "Semenjak pakai Planora, ngurus vendor acara jadi jauh lebih
              tenang dan teratur. Bener-bener ngebantu banget!"
            </p>
          </div>
        </div>
      </div>

      {/* SISI KANAN: LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 md:p-20 overflow-y-auto">
        <div className="w-full max-w-[500px] py-10">
          {/* Header Section */}
          <div className="mb-10">
            <p className="text-slate-400 text-[11px] mb-2 font-bold uppercase tracking-[0.15em]">
              Selamat Datang ✨
            </p>
            <h2 className="text-3xl md:text-[2rem] font-extrabold text-[#0D121F] mb-3 tracking-tight leading-tight">
              Masuk ke <span className="text-[#FF9A9E]">Planora</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Belum punya akun?{' '}
              <Link
                href="/register"
                className="text-[#FF9A9E] font-bold hover:underline inline-flex items-center gap-1 transition-all"
              >
                Daftar Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>

          {/* Role Switcher */}
          <div className="flex bg-[#F7F9FC] p-1.5 rounded-2xl mb-10 border border-slate-100">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                role === 'customer'
                  ? 'bg-[#FFDED7] text-black shadow-sm'
                  : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              <User
                className={`w-5 h-5 ${
                  role === 'customer' ? 'text-black' : 'text-slate-400'
                }`}
              />
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole('vendor')}
              className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                role === 'vendor'
                  ? 'bg-[#FFDED7] text-black shadow-sm'
                  : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              <UserCircle
                className={`w-5 h-5 ${
                  role === 'vendor' ? 'text-black' : 'text-slate-400'
                }`}
              />
              Vendor
            </button>
          </div>

          {/* Form Inputs */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium">
                {error}
              </div>
            )}
            
            {/* Email Input */}
            <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">
                Email atau Nomor HP
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Masukkan email atau nomor HP"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 pl-12 pr-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 pl-12 pr-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <div className="w-5 h-5 bg-slate-100 border border-slate-300 rounded-md peer-checked:bg-[#FF9A9E] peer-checked:border-[#FF9A9E] transition-all" />
                  <svg
                    className="absolute w-3 h-3 text-white left-1 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-slate-500 group-hover:text-slate-800 transition-colors">
                  Ingat saya
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-bold text-[#FF9A9E] hover:underline"
              >
                Lupa kata sandi?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0D121F] text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-slate-800 disabled:opacity-75 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-95 transition-all text-lg mt-4"
            >
              {isLoading ? 'Sedang Memproses...' : 'Masuk'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EDF2F7]"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.25em] font-black text-slate-300">
              <span className="bg-white px-4">atau masuk dengan</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
              className="w-full bg-white border border-[#E2E8F0] text-slate-700 font-bold py-4.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#F7F9FC] transition-all shadow-sm mb-12 text-sm md:text-base"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>

          {/* Bottom Info Box */}
          <div className="flex items-center gap-4 bg-[#FF9A9E]/5 p-5 rounded-[24px] border border-[#FF9A9E]/10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#FF9A9E]" />
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-bold">
              Dengan masuk, Anda menyetujui <br />
              <button className="text-[#FF9A9E] font-bold hover:underline">
                Syarat & Ketentuan
              </button>{' '}
              dan{' '}
              <button className="text-[#FF9A9E] font-bold hover:underline">
                Kebijakan Privasi
              </button>{' '}
              Planora.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        button { font-family: inherit; }
      `}</style>
    </div>
  );
}
