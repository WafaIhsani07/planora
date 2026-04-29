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
import VendorFeatured from "@/components/VendorFeatured";
import Footer from "@/components/Footer";

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

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    <circle cx="19" cy="19" r="2" />
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
    <>
      <header className={`fixed left-0 right-0 top-0 z-[200] border-b border-white/5 px-6 py-5 transition-all duration-300 md:px-12 ${isHeaderScrolled ? "bg-[#0A0A0A]/95 backdrop-blur-md" : "bg-[#0A0A0A]"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logogmbr.png"
              alt="Planora"
              width={160}
              height={42}
              priority
              className="h-9 w-auto md:h-10"
            />
            <span className="font-logo text-2xl italic leading-none tracking-tighter text-white md:text-[2.5rem]">Planora</span>
            <SparkleIcon className="mt-[-6px] h-4 w-4 text-[#FF9A9E]" />
          </div>

          <nav className="hidden items-center gap-10 text-sm font-semibold text-gray-300 lg:flex">
            <a href="#beranda" className="relative text-[#FF9A9E] after:absolute after:-bottom-1.5 after:left-1/2 after:h-0.5 after:w-7 after:-translate-x-1/2 after:bg-[#FF9A9E]">
              Beranda
            </a>
            <a href="#kategori" className="transition hover:text-white">Jelajahi Vendor</a>
            <a href="#cara-kerja" className="transition hover:text-white">Cara Kerja</a>
            <a href="#features" className="transition hover:text-white">Untuk Vendor</a>
            <a href="#footer" className="transition hover:text-white">Tentang Kami</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden rounded-xl border border-[#FF9A9E]/40 px-6 py-2.5 text-sm font-bold !text-white transition hover:border-[#FF9A9E]/60 hover:bg-[#FF9A9E]/5 md:block">
              Masuk
            </Link>
            <Link href="/register" className="rounded-xl bg-pink-gradient px-6 py-2.5 text-sm font-bold text-black shadow-[0_12px_28px_-14px_rgba(255,154,158,0.8)] transition hover:opacity-90">
              Daftar Gratis
            </Link>
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-controls="mobile-nav-menu"
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black lg:hidden"
            >
              {isMobileMenuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <div id="beranda" data-reveal className="relative overflow-hidden hero-bg font-sans text-white">
        <div className="pointer-events-none absolute right-[-8%] top-[-10%] z-0 h-155 w-155 rounded-full bg-[#fff0ed] opacity-70 blur-[100px]"></div>
        <div className="pointer-events-none absolute bottom-[-12%] left-[-12%] z-0 h-130 w-130 rounded-full bg-[#e8eaee] opacity-60 blur-[120px]"></div>

        <div className="relative mx-auto max-w-7xl px-6 pt-32 md:px-12 md:pt-36">

        {isMobileMenuOpen ? (
          <div id="mobile-nav-menu" className="mx-6 mt-4 rounded-3xl border border-white/10 bg-black/95 p-4 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.3)] md:mx-12 lg:hidden">
            <div className="flex flex-col gap-2 text-sm font-semibold text-white">
              <a href="#beranda" className="rounded-xl px-3 py-2 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20" onClick={() => setIsMobileMenuOpen(false)}>
                Beranda
              </a>
              <a href="#kategori" className="rounded-xl px-3 py-2 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20" onClick={() => setIsMobileMenuOpen(false)}>
                Jelajahi Vendor
              </a>
              <a href="#cara-kerja" className="rounded-xl px-3 py-2 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20" onClick={() => setIsMobileMenuOpen(false)}>
                Cara Kerja
              </a>
              <a href="#features" className="rounded-xl px-3 py-2 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20" onClick={() => setIsMobileMenuOpen(false)}>
                Untuk Vendor
              </a>
              <a href="#footer" className="rounded-xl px-3 py-2 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20" onClick={() => setIsMobileMenuOpen(false)}>
                Tentang Kami
              </a>
            </div>
          </div>
        ) : null}

        <main className="grid grid-cols-1 items-start gap-6 pb-8 pt-2 sm:pt-6 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col items-start pr-0 lg:pr-10">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 sm:mb-9">
              <span className="text-[10px] font-bold tracking-wider text-gray-300 sm:hidden">
                #1 MARKETPLACE JASA ACARA
              </span>
              <span className="hidden text-[10px] font-bold tracking-wider text-gray-300 sm:inline">
                #1 MARKETPLACE JASA ACARA
              </span>
            </div>

            <h1 className="mb-6 max-w-[12ch] text-[2.8rem] font-extrabold leading-[1.04] tracking-tight text-white sm:max-w-none sm:text-[3.8rem] md:text-[4.7rem] lg:text-[5.2rem]">
              Rencanakan Momen <br /> Spesialmu dengan <br /> <span className="text-pink-gradient italic">Sempurna</span>
            </h1>

            <p className="mb-8 max-w-md text-sm leading-relaxed text-gray-400">
              Temukan vendor terbaik untuk setiap kebutuhan acaramu. Aman, mudah, dan terpercaya bersama Planora.
            </p>

            <div className="mb-6 flex w-full max-w-xl flex-col gap-2 rounded-full bg-white p-1.5 shadow-2xl md:flex-row">
              <div className="flex flex-1 items-center px-6 py-2 gap-3">
                <SearchIcon className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari vendor, kategori, atau kota..."
                  aria-label="Cari vendor"
                  className="w-full bg-transparent text-sm text-black placeholder-gray-400 outline-none focus-visible:ring-0"
                />
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-8 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800 md:w-auto">
                <span>Cari Vendor</span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-8 flex flex-wrap gap-2">
              <div className="flex flex-wrap gap-2">
                {['Fotografi','Katering','Dekorasi','Wedding Organizer','Hiburan'].map((chip) => (
                  <button key={chip} type="button" className="rounded-full border border-white/20 px-5 py-2 text-[11px] font-bold uppercase tracking-tight text-white transition hover:bg-white/10">
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex -space-x-2.5">
                <img
                  className="h-9 w-9 rounded-full border-2 border-black object-cover"
                  src="https://i.pravatar.cc/100?u=a1"
                  alt="User 1"
                />
                <img
                  className="h-9 w-9 rounded-full border-2 border-black object-cover"
                  src="https://i.pravatar.cc/100?u=a2"
                  alt="User 2"
                />
                <img
                  className="h-9 w-9 rounded-full border-2 border-black object-cover"
                  src="https://i.pravatar.cc/100?u=a3"
                  alt="User 3"
                />
                <img
                  className="h-9 w-9 rounded-full border-2 border-black object-cover"
                  src="https://i.pravatar.cc/100?u=a4"
                  alt="User 4"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold uppercase tracking-wide text-gray-400">10.000+ pelanggan puas</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-brand-gray sm:text-[10px]">
                </span>
              </div>
            </div>
          </div>

          <div className="image-glow relative w-full max-w-[34rem] self-center lg:max-w-none lg:self-start">
            <SparkleIcon className="absolute left-10 top-28 h-4 w-4 text-[#FF9A9E]/70" />
            <SparkleIcon className="absolute right-16 top-16 h-5 w-5 text-[#FF9A9E]/80" />
            <div className="pointer-events-none absolute right-6 top-8 hidden h-44 w-44 rounded-full bg-[#FF9A9E]/20 blur-[70px] lg:block"></div>
            <div className="pointer-events-none absolute bottom-0 right-10 hidden h-52 w-52 rounded-full bg-[#FF9A9E]/25 blur-[90px] lg:block"></div>

            <div className="space-y-3 sm:space-y-4">
              {/* Katering - Large top left */}
              <div className="relative h-48 overflow-hidden rounded-[1.4rem] bg-white shadow-[0_28px_90px_-36px_rgba(255,154,158,0.85)] ring-1 ring-white/10 sm:h-56 lg:h-52">
                <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop" alt="katering" className="h-full w-full object-cover" />
                <span className="absolute left-2 sm:left-3 top-2 sm:top-3 rounded-full bg-accent px-2 sm:px-3 py-1 text-xs font-bold text-[#2C2D2A]">Katering</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Dekorasi - Top right smaller */}
                <div className="relative h-40 overflow-hidden rounded-[1.4rem] bg-white shadow-[0_28px_90px_-36px_rgba(255,154,158,0.85)] ring-1 ring-white/10 sm:h-44">
                  <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop" alt="dekorasi" className="h-full w-full object-cover" />
                  <span className="absolute left-2 sm:left-3 top-2 sm:top-3 rounded-full bg-accent px-2 sm:px-3 py-1 text-xs font-bold text-[#2C2D2A]">Dekorasi</span>
                </div>
                
                {/* Fotografi - Top right */}
                <div className="relative h-40 overflow-hidden rounded-[1.4rem] bg-white shadow-[0_28px_90px_-36px_rgba(255,154,158,0.85)] ring-1 ring-white/10 sm:h-44">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop" alt="fotografi" className="h-full w-full object-cover" />
                  <span className="absolute left-2 sm:left-3 top-2 sm:top-3 rounded-full bg-accent px-2 sm:px-3 py-1 text-xs font-bold text-[#2C2D2A]">Fotografi</span>
                </div>
              </div>
            </div>
          </div>
        </main>
        </div>
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandTrust />
      <CategorySection />
      <VendorFeatured />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialSection />
      <CtaSection />
      <Footer />
    </>
  );
}