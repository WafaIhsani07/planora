"use client";

import React from "react";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { listVendors } from "../lib/vendors";
import { getCategoryById } from "../lib/categories";

const vendors = listVendors().slice(0, 3);

function initials(name: string) {
  return name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function VendorFeatured() {
  return (
    <section data-reveal className="bg-white px-6 py-20 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className="text-3xl font-bold text-[#2A2A2A] md:text-4xl">Vendor Unggulan</h2>
          <a href="/vendors" className="hidden items-center gap-1 text-sm font-bold uppercase tracking-tight text-[#FF9A9E] transition-all hover:gap-2 md:flex">
            Lihat Semua Vendor
            <span aria-hidden="true">›</span>
          </a>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {vendors.map((vendor) => (
            <article key={vendor.id} className="group overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-[0_10px_30px_-20px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0">
                  <Image src={vendor.cover} alt={vendor.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <button type="button" aria-label="Simpan vendor" className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-400 shadow-sm backdrop-blur-md transition hover:text-red-500">
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              <div className="p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 font-bold`}>{initials(vendor.name)}</div>
                  <div>
                    <h4 className="text-lg font-bold text-[#2A2A2A]">{vendor.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{getCategoryById(vendor.category)?.name ?? vendor.category}</p>
                  </div>
                </div>

                <div className="mb-6 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Star key={item} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-1 text-xs font-bold text-gray-700">{vendor.rating}</span>
                  <span className="text-xs text-gray-400">({vendor.reviews})</span>
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
