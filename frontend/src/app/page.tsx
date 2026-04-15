"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BrandTrust from "@/components/BrandTrust";
import CategorySection from "@/components/CategorySection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialSection from "@/components/TestimonialSection";
import CtaSection from "@/components/CtaSection";

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

const StarSolidIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);

const MenuIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 6h16"></path>
    <path d="M4 12h16"></path>
    <path d="M4 18h16"></path>
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);

function HeroSection() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div id="beranda" className="relative min-h-screen overflow-hidden bg-brand-bg font-sans text-gray-900">
      <div className="pointer-events-none absolute right-[-8%] top-[-10%] z-0 h-155 w-155 rounded-full bg-[#fff0ed] opacity-70 blur-[100px]"></div>
      <div className="pointer-events-none absolute bottom-[-12%] left-[-12%] z-0 h-130 w-130 rounded-full bg-[#e8eaee] opacity-60 blur-[120px]"></div>

      <div className="relative mx-auto max-w-330 px-4 pt-24 sm:px-10 sm:pt-28 lg:px-12">
        <header
          className={`fixed left-0 right-0 top-0 z-[120] flex flex-wrap items-center justify-between gap-4 border-b px-4 py-4 backdrop-blur transition-all duration-300 sm:px-10 sm:py-5 lg:px-12 ${isHeaderScrolled
            ? "border-[#e3e5ea] bg-white/95 shadow-[0_14px_30px_-20px_rgba(32,39,55,0.45)]"
            : "border-[#ececef] bg-brand-bg/90"
            }`}
        >
          <div className="flex cursor-pointer items-center gap-2 sm:gap-3">
            <Image
              src="/images/logogmbr.png"
              alt="Planora"
              width={160}
              height={42}
              priority
              className="h-9 w-auto sm:h-10"
            />
            <span className="text-base font-extrabold tracking-tight text-brand-dark sm:text-lg">Planora</span>
          </div>

          <nav className="hidden items-center gap-10 md:flex">
            <div className="relative cursor-pointer">
              <span className="text-[11px] font-bold tracking-widest text-gray-900">BERANDA</span>
              <div className="absolute -bottom-2 left-1/2 h-0.5 w-4 -translate-x-1/2 transform bg-gray-900"></div>
            </div>
            <a href="#kategori" className="cursor-pointer text-[11px] font-bold tracking-widest text-brand-gray transition-colors hover:text-gray-900">
              LAYANAN
            </a>
            <a href="#cara-kerja" className="cursor-pointer text-[11px] font-bold tracking-widest text-brand-gray transition-colors hover:text-gray-900">
              CARA KERJA
            </a>
            <a href="#features" className="cursor-pointer text-[11px] font-bold tracking-widest text-brand-gray transition-colors hover:text-gray-900">
              BANTUAN
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-6">
            <Link
              href="/login"
              className="hidden cursor-pointer text-[11px] font-bold tracking-widest text-brand-gray transition-colors hover:text-gray-900 sm:block"
            >
              MASUK
            </Link>
            <button className="rounded-full bg-brand-peach px-4 py-2.5 text-[10px] font-bold tracking-widest text-brand-dark transition-colors hover:bg-brand-peachHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:px-6 sm:py-3 sm:text-[11px]">
              DOWNLOAD PLANORA
            </button>
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-controls="mobile-nav-menu"
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#ececef] bg-white text-brand-dark transition-colors hover:bg-[#f7f4f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:hidden"
            >
              {isMobileMenuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {isMobileMenuOpen ? (
          <div id="mobile-nav-menu" className="mt-4 rounded-3xl border border-[#ececef] bg-white p-4 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.08)] md:hidden">
            <div className="flex flex-col gap-2 text-sm font-semibold text-brand-dark">
              <a href="#beranda" className="rounded-xl px-3 py-2 transition-colors hover:bg-[#faf6f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/20" onClick={() => setIsMobileMenuOpen(false)}>
                Beranda
              </a>
              <a href="#kategori" className="rounded-xl px-3 py-2 transition-colors hover:bg-[#faf6f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/20" onClick={() => setIsMobileMenuOpen(false)}>
                Layanan
              </a>
              <a href="#cara-kerja" className="rounded-xl px-3 py-2 transition-colors hover:bg-[#faf6f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/20" onClick={() => setIsMobileMenuOpen(false)}>
                Cara Kerja
              </a>
              <a href="#features" className="rounded-xl px-3 py-2 transition-colors hover:bg-[#faf6f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/20" onClick={() => setIsMobileMenuOpen(false)}>
                Bantuan
              </a>
            </div>
          </div>
        ) : null}

        <main className="grid grid-cols-1 items-center gap-10 pb-10 pt-12 sm:pt-16 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col items-start pr-0 lg:pr-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-md bg-brand-peach px-3 py-1.5 sm:mb-8">
              <StarSolidIcon className="h-3 w-3 text-brand-dark" />
              <span className="text-[9px] font-bold tracking-[0.18em] text-brand-dark sm:hidden">
                PLATFORM EVENT TERINTEGRASI
              </span>
              <span className="hidden text-[10px] font-bold tracking-[0.2em] text-brand-dark sm:inline">
                PLATFORM MANAJEMEN EVENT TERINTEGRASI
              </span>
            </div>

            <h1 className="mb-5 max-w-[12ch] text-[2.8rem] font-black leading-[0.95] tracking-[-0.05em] text-brand-dark sm:text-[3.5rem] sm:leading-none md:mb-6 md:max-w-none md:text-[5.2rem] md:leading-[0.93]">
              RENCANAKAN <br />
              <span className="font-bold italic text-[#a4a4a4]">MOMEN</span> <br />
              TERBAIK <br />
              ANDA.
            </h1>

            <p className="mb-8 max-w-135 text-sm leading-relaxed text-gray-500 sm:hidden">
              Temukan vendor terbaik dan kelola acara lebih cepat dalam satu tempat.
            </p>
            <p className="mb-8 hidden max-w-135 text-sm leading-relaxed text-gray-500 sm:block sm:text-base md:mb-10 md:text-lg md:leading-[1.45]">
              Temukan vendor terbaik, kelola jadwal otomatis, dan pantau progres acara Anda dalam satu
              sistem yang elegan dan transparan.
            </p>

            <div className="mb-10 flex w-full max-w-140 flex-col gap-2 rounded-3xl border border-gray-100 bg-white p-2.5 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] sm:mb-12 sm:flex-row sm:items-center sm:rounded-full sm:gap-0">
              <div className="flex flex-1 items-center pl-3 sm:pl-4">
                <SearchIcon className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari vendor..."
                  aria-label="Cari vendor"
                  className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none focus-visible:ring-0"
                />
              </div>
              <button className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-[1.1rem] bg-brand-dark px-5 py-3 text-[10px] font-bold tracking-widest text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto sm:rounded-full sm:px-7 sm:py-3.5 sm:text-[11px]">
                <span className="sm:hidden">CARI</span>
                <span className="hidden sm:inline">TEMUKAN JASA</span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex -space-x-2 sm:-space-x-3">
                <img
                  className="h-8 w-8 rounded-full border-2 border-brand-bg object-cover sm:h-9 sm:w-9"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="User 1"
                />
                <img
                  className="h-8 w-8 rounded-full border-2 border-brand-bg object-cover sm:h-9 sm:w-9"
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80"
                  alt="User 2"
                />
                <img
                  className="h-8 w-8 rounded-full border-2 border-brand-bg object-cover sm:h-9 sm:w-9"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="User 3"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-brand-dark sm:text-sm">10,000+</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-brand-gray sm:text-[10px]">
                  Pengguna Terverifikasi
                </span>
              </div>
            </div>
          </div>

          <div className="relative mt-6 flex h-90 w-full justify-center sm:mt-10 sm:h-105 md:h-155 lg:mt-0 lg:justify-end">
            <div className="relative z-10 h-full w-full max-w-125 rounded-4xl bg-white p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] sm:rounded-[2.5rem]">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
                alt="Event Decoration"
                className="h-full w-full rounded-[1.6rem] object-cover sm:rounded-4xl"
              />

              <div className="pointer-events-none absolute inset-3 rounded-[1.6rem] bg-linear-to-t from-black/10 to-transparent sm:rounded-4xl"></div>
            </div>

            <div className="absolute -right-1 top-10 z-20 flex max-w-55 items-start gap-3 rounded-[1.1rem] bg-white p-4 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] sm:-right-2 sm:top-14 md:-right-4 lg:-right-4.5 lg:top-14.5 lg:max-w-none lg:gap-4 lg:p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-peach sm:h-10 sm:w-10">
                <ShieldCheckIcon className="h-5 w-5 text-brand-dark" />
              </div>
              <div className="flex flex-col">
                <span className="mb-0.5 text-[7px] font-bold uppercase tracking-widest text-brand-gray sm:text-[8px]">Status</span>
                <span className="mb-2 text-[11px] font-bold text-brand-dark sm:text-xs">VENDOR TERKURASI</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarSolidIcon key={star} className="h-3 w-3 text-brand-dark" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <div className="pb-28 md:pb-0">
        <HeroSection />
        <BrandTrust />
        <CategorySection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialSection />
        <CtaSection />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#ececef] bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <a
            href="#features"
            className="flex-1 rounded-full bg-brand-peach px-4 py-3 text-center text-[11px] font-bold tracking-widest text-brand-dark shadow-[0_10px_24px_-18px_rgba(0,0,0,0.35)] transition-colors hover:bg-brand-peachHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            MULAI
          </a>
          <a
            href="#kategori"
            className="flex-1 rounded-full border border-[#ececef] bg-white px-4 py-3 text-center text-[11px] font-bold tracking-widest text-brand-dark shadow-[0_10px_24px_-18px_rgba(0,0,0,0.35)] transition-colors hover:bg-[#faf6f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            LIHAT JASA
          </a>
        </div>
      </div>
    </>
  );
}