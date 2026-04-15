'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// --- Komponen Ikon (SVG Inline) ---
const MailIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
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


export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
            callbackUrl: '/dashboard',
        });

        setIsSubmitting(false);

        if (result?.error) {
            setErrorMessage('Email atau kata sandi tidak valid.');
            return;
        }

        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen min-h-dvh w-full flex flex-col md:flex-row bg-[#FAFAFC]">

            {/* Kolom Kiri: Branding & Testimoni (Dengan Background Image) */}
            <div
                className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-between relative overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2048&auto=format&fit=crop")' }}
            >

                {/* Overlay Pink Transparan */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FCE6E3]/75 to-[#F9D2CF]/75 z-0 backdrop-blur-[2px]"></div>

                {/* Logo & Headline */}
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-12 md:mb-16">
                        <Image
                            src="/images/logogmbr.png"
                            alt="Planora"
                            width={40}
                            height={40}
                            className="h-10 w-10 object-contain"
                            priority
                        />
                        <span className="font-extrabold text-2xl text-[#2A2A2A] tracking-tight">PLANORA</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] font-extrabold text-[#2A2A2A] mb-4">
                        Selamat Datang <br /> Kembali.
                    </h1>
                    <p className="text-[#6B7280] text-sm md:text-base max-w-md leading-relaxed">
                        Masuk untuk mengelola pesanan acara Anda atau temukan vendor impian untuk momen spesial berikutnya.
                    </p>
                </div>

                {/* Kartu Testimoni */}
                <div className="relative z-10 mt-16 md:mt-auto max-w-md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex -space-x-3">
                            <img className="w-10 h-10 rounded-full border-2 border-[#FCE6E3] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User 1" />
                            <img className="w-10 h-10 rounded-full border-2 border-[#FCE6E3] object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="User 2" />
                            <img className="w-10 h-10 rounded-full border-2 border-[#FCE6E3] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User 3" />
                        </div>
                        <span className="text-xs text-[#6B7280] font-medium leading-tight">Bergabung dengan 2,500+ <br className="hidden md:block" /> pengguna</span>
                    </div>
                    <p className="text-[#2A2A2A] text-sm md:text-base italic font-medium leading-relaxed pr-4">
                        "Semenjak pakai Planora, ngurus vendor acara jadi jauh lebih tenang dan teratur. Bener-bener ngebantu banget!"
                    </p>
                </div>

                {/* Background Ornament */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-white/20 rounded-full blur-3xl pointer-events-none z-0"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-[#2A2A2A]/25 rounded-full blur-[100px] pointer-events-none z-0"></div>

            </div>


            {/* Kolom Kanan: Formulir Login */}
            <div className="w-full md:w-1/2 bg-white p-8 md:p-16 lg:p-24 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">

                    {/* Header Formulir */}
                    <div className="mb-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#2A2A2A] mb-3">
                            Masuk
                        </h2>
                        <p className="text-[#A8A8A8] text-sm md:text-base">
                            Belum punya akun? <a href="/register" className="text-[#6B7280] font-bold hover:underline">Daftar sekarang</a>
                        </p>
                    </div>

                    {/* Formulir */}
                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>

                        {/* Input Email */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider">
                                ALAMAT EMAIL
                            </label>
                            <div className="relative">
                                <MailIcon className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-[#A8A8A8]" />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="nama@email.com"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="w-full bg-[#FAFAFC] border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-sm text-[#2A2A2A] placeholder-[#A8A8A8] outline-none focus:border-[#6B7280] transition-colors"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Input Password */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider">
                                    KATA SANDI
                                </label>
                                <a href="/forgot-password" className="text-[11px] font-bold text-[#A8A8A8] hover:text-[#6B7280] transition-colors">
                                    Lupa Kata Sandi?
                                </a>
                            </div>
                            <div className="relative">
                                <LockIcon className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-[#A8A8A8]" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    className="w-full bg-[#FAFAFC] border border-gray-200 rounded-xl py-3.5 pl-12 pr-12 text-sm text-[#2A2A2A] placeholder-[#A8A8A8] outline-none focus:border-[#6B7280] transition-colors"
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                                    title={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 -translate-y-1/2 right-4 text-[#A8A8A8] hover:text-[#6B7280] transition-colors focus:outline-none"
                                >
                                    <EyeIcon isVisible={showPassword} className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Checkbox Ingat Saya */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={remember}
                                onChange={(event) => setRemember(event.target.checked)}
                                className="w-5 h-5 border-2 border-gray-300 rounded accent-[#6B7280] focus:ring-[#6B7280] transition-colors cursor-pointer"
                            />
                            <label htmlFor="remember" className="text-sm text-[#6B7280] font-medium cursor-pointer select-none">
                                Ingat saya di perangkat ini
                            </label>
                        </div>

                        {/* Tombol Masuk */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#6B7280] hover:bg-[#5a606b] disabled:cursor-not-allowed disabled:opacity-70 text-white text-sm font-bold py-4 rounded-xl transition-all hover:shadow-lg active:scale-[0.98]"
                        >
                            {isSubmitting ? 'Memproses...' : 'Masuk Sekarang'}
                        </button>

                        {errorMessage ? (
                            <p className="text-sm font-medium text-[#b45309]">{errorMessage}</p>
                        ) : null}

                    </form>

                    {/* Pemisah */}
                    <div className="relative flex items-center py-8">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-[#A8A8A8] uppercase tracking-wider">ATAU MASUK DENGAN</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Tombol Sosial Media */}
                    <div className="flex flex-col sm:flex-row gap-4">
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
