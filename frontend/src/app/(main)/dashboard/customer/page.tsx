'use client';

import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import {
  ArrowRight,
  Bell,
  CalendarCheck,
  Camera,
  ChevronDown,
  Flower2,
  Heart,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Music,
  Search,
  Settings,
  Sparkles,
  Star,
  Store,
  Utensils,
} from 'lucide-react';

type TabName = 'Beranda' | 'Jelajahi Vendor' | 'Pesananku' | 'Ulasan Saya' | 'Pengaturan';

const categories = [
  { name: 'Dekorasi', count: '132 Vendor', icon: Flower2 },
  { name: 'Fotografi', count: '87 Vendor', icon: Camera },
  { name: 'Katering', count: '96 Vendor', icon: Utensils },
  { name: 'Make Up', count: '64 Vendor', icon: Sparkles },
  { name: 'Hiburan', count: '42 Vendor', icon: Music },
  { name: 'Lainnya', count: 'Lihat semua', icon: MoreHorizontal },
];

const vendors = [
  {
    name: 'Lumiere Decoration',
    category: 'Dekorasi',
    location: 'Jakarta Selatan',
    price: 'Rp 8.500.000',
    rating: 4.9,
    reviews: 120,
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=700',
  },
  {
    name: 'Eterna Photography',
    category: 'Fotografi',
    location: 'Jakarta Timur',
    price: 'Rp 3.500.000',
    rating: 4.8,
    reviews: 98,
    img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=700',
  },
  {
    name: 'Delish Catering',
    category: 'Katering',
    location: 'Tangerang',
    price: 'Rp 25.000/porsi',
    rating: 4.7,
    reviews: 76,
    img: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=700',
  },
  {
    name: 'Glow Makeup',
    category: 'Make Up',
    location: 'Bekasi',
    price: 'Rp 2.500.000',
    rating: 4.9,
    reviews: 64,
    img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=700',
  },
];

const menuItems: Array<{ name: TabName; icon: React.ComponentType<{ className?: string }> }> = [
  { name: 'Beranda', icon: Home },
  { name: 'Jelajahi Vendor', icon: Store },
  { name: 'Pesananku', icon: CalendarCheck },
  { name: 'Ulasan Saya', icon: MessageSquare },
  { name: 'Pengaturan', icon: Settings },
];

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabName>('Beranda');
  const customerName = 'Aisyah Putri';

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="min-h-screen bg-[#FDF1F0] font-sans text-[#2A2A2A]">
      <aside className="fixed z-40 flex h-full w-72 flex-col bg-[#2A2A2A]">
        <div className="flex items-center gap-4 border-b border-white/5 p-8 pb-10">
          <img src="/images/logogmbr.png" alt="Planora" className="h-10 w-auto" />
          <span className="font-logo text-3xl font-bold italic tracking-tighter text-white">Planora</span>
        </div>

        <nav className="mt-8 flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveTab(item.name)}
                  className={`flex w-full items-center gap-4 rounded-[20px] p-4 font-bold transition-all ${
                    activeTab === item.name
                      ? 'bg-[#FF9A9E] text-white shadow-lg shadow-[#FF9A9E]/20'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${activeTab === item.name ? 'text-white' : 'text-slate-400'}`} />
                  <span className="text-[15px] tracking-tight">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto p-4">
          <div className="space-y-4 rounded-[32px] border border-white/5 bg-white/5 p-6 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <HelpCircle className="h-5 w-5 text-[#FF9A9E]" />
            </div>
            <div>
              <p className="text-[13px] font-black text-white">Butuh bantuan?</p>
              <p className="mt-1 text-[10px] font-bold uppercase text-slate-500">Hubungi admin kami 24/7</p>
            </div>
            <button className="w-full rounded-xl bg-[#FF9A9E] py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-[#FF527B]">
              Hubungi Admin
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 transition-all hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </div>
      </aside>

      <main className="ml-72">
        <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-[#2A2A2A]/5 bg-white/80 px-12 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#2A2A2A]">Halo, Aisyah! 👋</h1>
            <p className="hidden text-xs font-bold uppercase tracking-widest text-[#2A2A2A]/30 md:block">
              Temukan vendor terbaik untuk momen spesialmu.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden w-80 items-center rounded-2xl border border-[#2A2A2A]/5 bg-[#FDF1F0] px-5 py-3 lg:flex">
              <Search className="mr-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari vendor atau kategori..."
                className="w-full bg-transparent text-sm font-bold placeholder:text-slate-300 focus:outline-none"
              />
            </div>

            <button className="relative p-2.5 text-[#2A2A2A]/40 transition-colors hover:text-[#FF9A9E]">
              <Bell className="h-6 w-6" />
              <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#FF527B] text-[9px] font-black text-white">
                2
              </span>
            </button>

            <div className="group flex cursor-pointer items-center gap-4 border-l border-slate-100 pl-6">
              <img src="https://i.pravatar.cc/100?u=aisyah" className="h-11 w-11 rounded-full object-cover" alt="Customer" />
              <div className="text-left">
                <p className="text-sm font-black text-[#2A2A2A] transition-colors group-hover:text-[#FF9A9E]">{customerName}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#2A2A2A]/30">Pelanggan</p>
              </div>
              <ChevronDown className="h-4 w-4 text-[#2A2A2A]/20 transition-colors group-hover:text-[#FF9A9E]" />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl p-12">
          {activeTab === 'Beranda' ? (
            <div className="space-y-10">
              <div className="relative flex min-h-[340px] items-center overflow-hidden rounded-[48px] bg-[#FCE6E3] p-12 shadow-sm">
                <div className="absolute right-0 top-0 hidden h-full w-1/2 md:block">
                  <img
                    src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200"
                    className="h-full w-full object-cover"
                    alt="Wedding Decoration"
                    style={{ maskImage: 'linear-gradient(to left, black 60%, transparent)' }}
                  />
                </div>

                <div className="relative z-10 max-w-lg space-y-6">
                  <h2 className="text-4xl font-black leading-tight text-[#2A2A2A] md:text-5xl">
                    Wujudkan <br /> Acara Impianmu
                  </h2>
                  <p className="font-medium leading-relaxed text-slate-600">
                    Bersama vendor profesional pilihan Planora, setiap detail momen bahagiamu akan terukir sempurna.
                  </p>
                  <button
                    onClick={() => setActiveTab('Jelajahi Vendor')}
                    className="rounded-2xl bg-[#FF527B] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-[#FF527B]/20 transition-all hover:bg-[#2A2A2A]"
                  >
                    Jelajahi Vendor
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-[#2A2A2A]">Kategori Populer</h3>
                  <button className="text-[11px] font-black uppercase tracking-widest text-[#FF9A9E] hover:text-[#FF527B]">
                    Lihat Semua
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      className="group rounded-[32px] border border-[#2A2A2A]/5 bg-white p-6 text-center transition-all hover:shadow-xl hover:shadow-[#FF9A9E]/10"
                    >
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDF1F0] transition-colors group-hover:bg-[#FF9A9E]">
                        <cat.icon className="h-6 w-6 text-[#FF527B] group-hover:text-white" />
                      </div>
                      <h4 className="mb-1 text-sm font-black text-[#2A2A2A]">{cat.name}</h4>
                      <p className="text-[10px] font-bold uppercase text-slate-300">{cat.count}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6 pb-12">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-[#2A2A2A]">Rekomendasi Untukmu</h3>
                  <button className="text-[11px] font-black uppercase tracking-widest text-[#FF9A9E] hover:text-[#FF527B]">
                    Lihat Semua
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {vendors.map((vendor) => (
                    <div key={vendor.name} className="group overflow-hidden rounded-[40px] border border-[#2A2A2A]/5 bg-white transition-all hover:shadow-xl">
                      <div className="relative h-52 overflow-hidden">
                        <img src={vendor.img} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt={vendor.name} />
                        <button className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#2A2A2A]/20 shadow-sm backdrop-blur-md transition-all hover:text-[#FF527B]">
                          <Heart className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="p-8">
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <h4 className="text-base font-black leading-tight text-[#2A2A2A] transition-colors group-hover:text-[#FF527B]">{vendor.name}</h4>
                            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-300">{vendor.category}</p>
                          </div>
                          <div className="flex items-center gap-1 rounded-lg bg-[#FDF1F0] px-2 py-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-[11px] font-black text-[#2A2A2A]">{vendor.rating}</span>
                          </div>
                        </div>

                        <div className="mb-6 flex items-center gap-1.5 text-[#2A2A2A]/40">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="text-[11px] font-bold">{vendor.location}</span>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-50 pt-5">
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-tighter text-slate-300">Mulai dari</p>
                            <p className="text-sm font-black text-[#FF527B]">{vendor.price}</p>
                          </div>
                          <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-[#2A2A2A]/30 transition-all hover:bg-[#2A2A2A] hover:text-white">
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[40px] border border-[#2A2A2A]/5 bg-white">
                <LayoutDashboard className="h-10 w-10 text-[#FF9A9E]/30" />
              </div>
              <h3 className="mb-3 text-2xl font-black uppercase tracking-tight text-[#2A2A2A]">Halaman {activeTab}</h3>
              <p className="mx-auto max-w-xs text-[10px] font-medium uppercase tracking-widest text-[#2A2A2A]/40">
                Fitur ini sedang dalam penyiapan untuk mempermudah perencanaan acaramu.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
