"use client";

import React from "react";
import { Heart, Star } from "lucide-react";

const vendors = [
  {
    name: "Arkana Photography",
    category: "Fotografi",
    price: "Rp 7.500.000",
    rating: "4.9",
    reviews: "(320)",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80",
    avatar: "AP",
    avatarClass: "text-xs",
  },
  {
    name: "RasaKita Catering",
    category: "Katering",
    price: "Rp 15.000.000",
    rating: "4.8",
    reviews: "(245)",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80",
    avatar: "RK",
    avatarClass: "text-xs text-green-700",
  },
  {
    name: "Lumière Decoration",
    category: "Dekorasi",
    price: "Rp 12.000.000",
    rating: "4.9",
    reviews: "(109)",
    image: "https://images.unsplash.com/photo-1519222970733-f546218fa6d7?auto=format&fit=crop&q=80",
    avatar: "LD",
    avatarClass: "text-xs text-orange-700",
  },
];

export default function VendorFeatured() {
  return (
    <section data-reveal className="bg-white px-6 py-20 md:px-12">
        <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className="text-3xl font-bold text-[#2A2A2A] md:text-4xl">Vendor Unggulan</h2>
          <a href="#" className="hidden items-center gap-1 text-sm font-bold uppercase tracking-tight text-[#FF9A9E] transition-all hover:gap-2 md:flex">
            Lihat Semua Vendor
            <span aria-hidden="true">›</span>
          </a>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {vendors.map((vendor) => (
            <article key={vendor.name} className="group overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-[0_10px_30px_-20px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-64 overflow-hidden">
                <img src={vendor.image} alt={vendor.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <button type="button" aria-label="Simpan vendor" className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-400 shadow-sm backdrop-blur-md transition hover:text-red-500">
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              <div className="p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 font-bold ${vendor.avatarClass}`}>{vendor.avatar}</div>
                  <div>
                    <h4 className="text-lg font-bold text-[#2A2A2A]">{vendor.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{vendor.category}</p>
                  </div>
                </div>

                <div className="mb-6 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Star key={item} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-1 text-xs font-bold text-gray-700">{vendor.rating}</span>
                  <span className="text-xs text-gray-400">{vendor.reviews}</span>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400">Mulai dari</p>
                  <p className="text-xl font-extrabold text-[#FF9A9E]">{vendor.price}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
