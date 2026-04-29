"use client";

import React from "react";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="5"></rect>
    <circle cx="12" cy="12" r="4"></circle>
    <circle cx="17.5" cy="6.5" r="1"></circle>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M13.5 22v-7h2.4l.4-3h-2.8V9.1c0-.9.2-1.5 1.6-1.5H16V5a22 22 0 0 0-2.2-.1c-2.2 0-3.7 1.4-3.7 3.9V12H7.6v3h2.5v7h3.4Z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14 4v9.5a4.5 4.5 0 1 1-3-4.24"></path>
    <path d="M14 4c1 2.2 2.8 3.4 5 3.5"></path>
  </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="6" width="20" height="12" rx="4"></rect>
    <path d="m10 9 5 3-5 3z"></path>
  </svg>
);

const footerLinks = {
  platform: ["Jelajahi Vendor", "Cara Kerja", "Untuk Vendor", "Tentang Kami"],
  kategori: ["Fotografi", "Katering", "Dekorasi", "Hiburan"],
};

export default function Footer() {
  return (
    <footer id="footer" className="border-t border-white/5 bg-[#0A0A0A] px-6 pb-12 pt-24 text-white md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="mb-8 flex items-center gap-3">
              <Image src="/images/logogmbr.png" alt="Planora" width={160} height={42} className="h-9 w-auto" />
              <h2 className="font-logo text-4xl italic tracking-tighter">Planora</h2>
            </div>
            <p className="mb-10 max-w-xs text-sm leading-relaxed text-gray-400">
              Marketplace jasa acara premium yang menghubungkan kamu dengan vendor terpercaya.
            </p>
            <div className="flex gap-4">
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white hover:text-black">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white hover:text-black">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white hover:text-black">
                <TikTokIcon className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white hover:text-black">
                <YouTubeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h6 className="mb-8 text-sm font-bold uppercase tracking-widest text-gray-200">Platform</h6>
            <ul className="space-y-4 text-sm font-medium text-gray-400">
              {footerLinks.platform.map((item) => (
                <li key={item}>
                  <a href="#" className="transition hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="mb-8 text-sm font-bold uppercase tracking-widest text-gray-200">Kategori</h6>
            <ul className="space-y-4 text-sm font-medium text-gray-400">
              {footerLinks.kategori.map((item) => (
                <li key={item}>
                  <a href="#" className="transition hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="mb-8 text-sm font-bold uppercase tracking-widest text-gray-200">Kontak</h6>
            <ul className="space-y-5 text-sm font-medium text-gray-400">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#FF9A9E]" />
                <span>hello@planora.id</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#FF9A9E]" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[#FF9A9E]" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">© 2024 Planora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
