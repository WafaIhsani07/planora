'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Star, ChevronRight, HelpCircle, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { listVendors } from '@/lib/vendors';
import { getCategoryById } from '@/lib/categories';
import Footer from '@/components/Footer';
import ScrollObserver from '@/components/ScrollObserver';

const vendors = listVendors();

export default function VendorsPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredVendors = vendors.filter((vendor) => {
    const matchCategory = !selectedCategory || vendor.category === selectedCategory;
    const matchSearch = !searchTerm || vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <>
      {/* NAVIGATION */}
      <header className={`fixed left-0 right-0 top-0 z-[200] border-b border-white/5 px-6 py-5 transition-all duration-300 md:px-12 ${isHeaderScrolled ? "bg-[#0A0A0A]/95 backdrop-blur-md" : "bg-[#0A0A0A]"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logogmbr.png" alt="Planora" width={160} height={42} priority className="h-9 w-auto md:h-10" />
            <span className="font-logo text-2xl italic leading-none tracking-tighter text-white md:text-[2.5rem]">Planora</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mt-[-6px] h-4 w-4 text-[#FF9A9E]">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              <circle cx="19" cy="19" r="2" />
            </svg>
          </Link>

          <div className="flex items-center gap-8">
            <nav className="hidden items-center gap-8 text-sm font-semibold text-gray-300 lg:flex">
              <Link href="/#beranda" className="relative transition hover:text-white after:absolute after:-bottom-1.5 after:left-1/2 after:h-0.5 after:w-7 after:-translate-x-1/2 after:bg-[#FF9A9E] after:opacity-0 hover:after:opacity-100 after:transition-opacity">Beranda</Link>
              <a href="#" className="relative text-[#FF9A9E] after:absolute after:-bottom-1.5 after:left-1/2 after:h-0.5 after:w-7 after:-translate-x-1/2 after:bg-[#FF9A9E]">Jelajahi Vendor</a>
              <Link href="/#footer" className="relative transition hover:text-white after:absolute after:-bottom-1.5 after:left-1/2 after:h-0.5 after:w-7 after:-translate-x-1/2 after:bg-[#FF9A9E] after:opacity-0 hover:after:opacity-100 after:transition-opacity">Tentang</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden rounded-xl bg-[#FF9A9E] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#FF527B] md:block">Masuk</Link>
              <Link href="/download" className="rounded-xl bg-pink-gradient px-6 py-2.5 text-sm font-bold text-black shadow-[0_12px_28px_-14px_rgba(255,154,158,0.8)] transition hover:opacity-90">Download App</Link>
              <button
                type="button"
                aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
                aria-controls="mobile-nav-menu"
                onClick={() => setIsMobileMenuOpen((value) => !value)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black lg:hidden"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div id="mobile-nav-menu" className="mx-6 mt-4 rounded-3xl border border-white/10 bg-black/95 p-4 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.3)] md:mx-12 lg:hidden">
            <div className="flex flex-col gap-2 text-sm font-semibold text-white">
              <Link href="/#beranda" className="rounded-xl px-3 py-2 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20" onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link>
              <a href="#" className="rounded-xl px-3 py-2 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20" onClick={() => setIsMobileMenuOpen(false)}>Jelajahi Vendor</a>
              <Link href="/#footer" className="rounded-xl px-3 py-2 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20" onClick={() => setIsMobileMenuOpen(false)}>Tentang</Link>
              <Link href="/download" className="rounded-xl bg-pink-gradient px-3 py-2 text-center font-bold text-black transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20" onClick={() => setIsMobileMenuOpen(false)}>Download App</Link>
            </div>
          </div>
        )}
      </header>

      {/* EXPLORE HEADER */}
      <header className="relative overflow-hidden bg-[#FDF1F0]/50 px-6 py-20 md:px-12 pt-40 pb-20 text-[#2A2A2A]" data-reveal>
        <div className="absolute -mr-64 -mt-64 right-0 top-0 h-[500px] w-[500px] rounded-full bg-white blur-[120px] opacity-60"></div>

        <div className="relative z-10 mx-auto max-w-7xl space-y-10 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-[900] uppercase leading-[1.1] tracking-tighter md:text-6xl">
              TEMUKAN PARTNER <br /> <span className="text-[#FF527B]">ACARA TERBAIKMU</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#2A2A2A]/30 md:text-xs">Mulai dari Dekorasi hingga Katering dalam satu tempat.</p>
          </div>

          {/* Search Bar */}
          <div className="mx-auto flex max-w-4xl flex-col gap-2 rounded-[32px] border border-white bg-white p-2 shadow-[0_20px_40px_-15px_rgba(255,82,123,0.2),_0_10px_20px_-10px_rgba(0,0,0,0.05)] md:flex-row" data-reveal>
            <div className="flex flex-[1.5] items-center gap-4 border-b border-slate-50 px-8 py-5 md:border-b-0 md:border-r">
              <Search className="h-5 w-5 text-slate-300" />
              <input
                type="text"
                placeholder="Cari nama vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-[#2A2A2A] outline-none placeholder:text-slate-200"
              />
            </div>
            <div className="flex flex-1 items-center gap-4 px-8 py-5">
              <MapPin className="h-5 w-5 text-[#FF9A9E]" />
              <select className="w-full appearance-none bg-transparent text-sm font-bold text-[#2A2A2A] outline-none cursor-pointer">
                <option>Seluruh Indonesia</option>
                <option>Jakarta</option>
                <option>Padang</option>
                <option>Bandung</option>
              </select>
            </div>
            <button className="rounded-[24px] bg-[#2A2A2A] px-12 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-black/10 hover:bg-black transition active:scale-95">
              Cari Sekarang
            </button>
          </div>
        </div>
      </header>

      {/* LIST SECTION */}
      <main className="mx-auto max-w-7xl space-y-12 py-16 px-6 md:px-12">
        <div className="flex items-center justify-start" data-reveal>
          <div className="relative w-full max-w-[280px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-[#2A2A2A]/5 bg-white py-4 px-6 text-sm font-bold text-[#2A2A2A] shadow-sm outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 transition-all cursor-pointer bg-no-repeat bg-right bg-[length:1.2rem]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%232A2A2A' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                paddingRight: '2.5rem'
              }}
            >
              <option value="">Semua Kategori</option>
              {['fotografi', 'dekorasi', 'katering', 'wedding-organizer', 'venue', 'undangan'].map((cat) => (
                <option key={cat} value={cat}>
                  {getCategoryById(cat)?.name ?? cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-reveal>
          {filteredVendors.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/vendor/${vendor.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-[40px] border border-[#2A2A2A]/5 bg-white hover:shadow-2xl transition-all"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={vendor.cover}
                  alt={vendor.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-6 left-6 rounded-full bg-white/90 backdrop-blur-md px-4 py-1.5 text-[9px] font-black uppercase text-[#FF527B] shadow-sm">
                  {getCategoryById(vendor.category)?.name ?? vendor.category}
                </div>
              </div>
              <div className="flex flex-1 flex-col space-y-6 p-8">
                <div className="space-y-1">
                  <div className="mb-2 flex items-center gap-1.5 text-yellow-400">
                    <Star className="h-4 w-4 fill-yellow-400" />
                    <span className="text-xs font-black text-[#2A2A2A]">{vendor.rating}</span>
                  </div>
                  <h4 className="text-xl font-black text-[#2A2A2A] leading-tight transition-colors group-hover:text-[#FF527B]">
                    {vendor.name}
                  </h4>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{vendor.location}</span>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-tighter text-slate-300">Mulai dari</p>
                    <p className="text-lg font-black text-[#2A2A2A]">{vendor.price}</p>
                  </div>
                  <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FCE6E3] text-[#FF527B] shadow-sm transition-all hover:bg-[#FF527B] hover:text-white">
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </Link>
          ))}

          {/* Help Card */}
          <div className="flex flex-col items-center justify-center space-y-6 rounded-[40px] bg-[#2A2A2A] p-8 text-center text-white shadow-xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-white/5 text-[#FF9A9E]">
              <HelpCircle className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h5 className="text-lg font-[900]">Belum Menemukan?</h5>
              <p className="text-[10px] font-medium leading-relaxed text-white/40">Beri tahu kriteria yang Anda cari, kami akan membantu.</p>
            </div>
            <button className="rounded-xl bg-[#FF9A9E] px-6 py-2.5 text-[9px] font-black uppercase tracking-widest text-[#2A2A2A] shadow-lg">
              Chat Admin
            </button>
          </div>
        </div>

        {/* Pagination */}
        {filteredVendors.length > 0 && (
          <div className="flex items-center justify-center gap-2 pt-10">
            <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2A2A2A]/5 bg-white text-slate-300 shadow-sm hover:text-[#2A2A2A] transition-all">
              ‹
            </button>
            <button className="h-12 w-12 rounded-2xl bg-[#FF9A9E] text-xs font-black text-white shadow-lg shadow-pink-400/20">
              1
            </button>
            <button className="h-12 w-12 rounded-2xl border border-[#2A2A2A]/5 bg-white text-xs font-black text-slate-400 hover:bg-[#FCE6E3] hover:text-[#FF527B] transition-all">
              2
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2A2A2A]/5 bg-white text-slate-300 shadow-sm hover:text-[#2A2A2A] transition-all">
              ›
            </button>
          </div>
        )}
      </main>

      <ScrollObserver />
      <Footer />
    </>
  );
}