import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail, ShieldCheck, Sparkles } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-16 xl:p-24">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-[#FFDED7]/90 backdrop-blur-[1px]" />

          <div className="relative z-10 flex items-center gap-3">
            <Image
              src="/images/logogmbr.png"
              alt="Planora"
              width={160}
              height={42}
              className="h-9 w-auto md:h-10"
              priority
            />
            <span className="font-logo text-[1.85rem] italic leading-none tracking-tighter text-black md:text-[2.15rem]">
              Planora
            </span>
            <Sparkles className="mt-[-6px] h-5 w-5 text-[#E94E77]" />
          </div>

          <div className="relative z-10 max-w-xl">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.35em] text-slate-500">
              Pemulihan Akun
            </p>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-black xl:text-6xl">
              Lupa password?
              <br />
              <span className="text-[#FF527B] italic drop-shadow-md">Kembali masuk dengan aman</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg font-bold leading-relaxed text-slate-700 opacity-90">
              Kirim link reset ke email terdaftar Anda. Kami akan bantu Anda masuk kembali ke dashboard vendor dengan cepat.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="max-w-md border-l-4 border-[#FF527B] pl-6">
              <p className="text-xl font-black leading-snug italic text-black opacity-90">
                "Akses akun tetap aman, alur reset dibuat sederhana agar tim vendor bisa segera kembali bekerja."
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm font-bold text-slate-700">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/75 shadow-sm backdrop-blur-md">
                <ShieldCheck className="h-5 w-5 text-[#FF527B]" />
              </div>
              Proteksi akun dan pemulihan terpusat untuk akses vendor.
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center bg-[#FFF9F8] px-5 py-10 sm:px-8 lg:bg-white lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,154,158,0.10),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,82,123,0.08),transparent_30%)]" />

          <div className="relative z-10 w-full max-w-[520px] rounded-[32px] border border-[#F1D8D4] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center justify-between gap-4">
              <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-[#FF527B]">
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Link>
              <span className="rounded-full bg-[#FFF0F1] px-3 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-[#FF527B]">
                Reset Aman
              </span>
            </div>

            <div className="mb-8 space-y-3">
              <p className="text-xs font-black uppercase tracking-[0.35em] text-slate-400">
                Lupa Password
              </p>
              <h2 className="text-3xl font-black tracking-tight text-[#0D121F] sm:text-[2.35rem]">
                Masukkan email Anda
              </h2>
              <p className="max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
                Kami akan mengirimkan tautan reset password ke email yang terdaftar untuk akun vendor Anda.
              </p>
            </div>

            <form className="space-y-6">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F7F9FC] py-4 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#FF9A9E] focus:bg-white focus:ring-2 focus:ring-[#FF9A9E]/20"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#0D121F] px-4 py-4.5 text-base font-bold text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800 active:scale-[0.99]"
              >
                Kirim Link Reset
              </button>
            </form>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#F2E4E2] bg-[#FFF9F8] p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF527B]">Langkah 1</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Masukkan email vendor yang aktif untuk akun Planora.</p>
              </div>
              <div className="rounded-2xl border border-[#F2E4E2] bg-[#FFF9F8] p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF527B]">Langkah 2</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Buka email, klik link reset, lalu buat password baru.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}