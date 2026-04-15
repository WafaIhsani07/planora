'use client';

import React, { useEffect, useRef, useState } from 'react';

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></svg>
);
const SaveIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
);
const ImageIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
);
const PlusIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
);

function revokePreviewUrl(previewUrl: string | null) {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }
}

export default function ProfilVendorPage() {
  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const portfolioInputRef = useRef<HTMLInputElement | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [portfolioPreviews, setPortfolioPreviews] = useState<Array<string | null>>([null, null, null]);

  useEffect(() => {
    return () => {
      revokePreviewUrl(bannerPreview);
      revokePreviewUrl(avatarPreview);
      portfolioPreviews.forEach((previewUrl) => revokePreviewUrl(previewUrl));
    };
  }, [bannerPreview, avatarPreview, portfolioPreviews]);

  const openFilePicker = (target: 'banner' | 'avatar' | 'portfolio') => {
    if (target === 'banner') {
      bannerInputRef.current?.click();
      return;
    }

    if (target === 'avatar') {
      avatarInputRef.current?.click();
      return;
    }

    portfolioInputRef.current?.click();
  };

  const handleSingleUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    target: 'banner' | 'avatar',
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (target === 'banner') {
      setBannerPreview((currentPreview) => {
        revokePreviewUrl(currentPreview);
        return previewUrl;
      });
    } else {
      setAvatarPreview((currentPreview) => {
        revokePreviewUrl(currentPreview);
        return previewUrl;
      });
    }

    event.target.value = '';
  };

  const handlePortfolioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 3);

    if (!files.length) {
      return;
    }

    const nextPreviews = [...portfolioPreviews];

    files.forEach((file) => {
      const nextSlot = nextPreviews.findIndex((preview) => !preview);
      const previewUrl = URL.createObjectURL(file);

      if (nextSlot >= 0) {
        revokePreviewUrl(nextPreviews[nextSlot]);
        nextPreviews[nextSlot] = previewUrl;
      } else {
        revokePreviewUrl(nextPreviews[0]);
        nextPreviews[0] = previewUrl;
      }
    });

    setPortfolioPreviews(nextPreviews);
    event.target.value = '';
  };

  return (
    <div className="mx-auto w-full max-w-[1300px] pb-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <span className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">
            IDENTITAS BISNIS & BRAND
          </span>
          <h1 className="text-4xl font-black italic tracking-tighter text-[#2A2A2A] leading-[1.05] md:text-[2.75rem]">
            PROFIL <br /> STUDIO VENDOR.
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white px-5 text-[10px] font-bold tracking-widest text-[#2A2A2A] uppercase shadow-sm transition-colors hover:bg-gray-50">
            <ExternalLinkIcon className="h-4 w-4" />
            LIHAT PUBLIK
          </button>
          <button className="flex h-11 items-center gap-2 rounded-full bg-[#2A2A2A] px-5 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg shadow-[#2A2A2A]/20 transition-colors hover:bg-[#1a1a1a]">
            <SaveIcon className="h-4 w-4" />
            SIMPAN PROFIL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] lg:p-8">
            <div className="relative mb-11">
              <button
                type="button"
                onClick={() => openFilePicker('banner')}
                className="flex h-[140px] w-full items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-dashed border-gray-300 bg-[#FAFAFC] transition-colors hover:bg-gray-50"
              >
                {bannerPreview ? (
                  <img src={bannerPreview} alt="Preview banner studio" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">
                    UPLOAD BANNER STUDIO (1200X400)
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => openFilePicker('avatar')}
                className="absolute -bottom-7 left-6 flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-[1.25rem] border-[6px] border-white bg-[#FCE6E3] shadow-sm transition-transform hover:scale-105"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview avatar studio" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-[#2A2A2A]">W</span>
                )}
              </button>

              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                title="Upload banner studio"
                aria-label="Upload banner studio"
                className="hidden"
                onChange={(event) => handleSingleUpload(event, 'banner')}
              />

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                title="Upload avatar studio"
                aria-label="Upload avatar studio"
                className="hidden"
                onChange={(event) => handleSingleUpload(event, 'avatar')}
              />
            </div>

            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">NAMA STUDIO / BRAND</label>
                  <input
                    type="text"
                    defaultValue="Wafa Studio Photography"
                    title="Nama studio atau brand"
                    placeholder="Nama studio atau brand"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] font-medium text-[#2A2A2A] outline-none transition-colors focus:border-[#2A2A2A]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">NAMA PEMILIK</label>
                  <input
                    type="text"
                    defaultValue="Wahidah Wafa Ihsani"
                    title="Nama pemilik studio"
                    placeholder="Nama pemilik studio"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] font-medium text-[#2A2A2A] outline-none transition-colors focus:border-[#2A2A2A]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">BIO / DESKRIPSI STUDIO</label>
                <textarea
                  rows={3}
                  defaultValue="Spesialisasi dalam dokumentasi pernikahan bergaya cinematic dan minimalis. Berbasis di Kota Padang dengan jangkauan layanan seluruh Sumatera Barat."
                  title="Bio atau deskripsi studio"
                  placeholder="Bio atau deskripsi studio"
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] font-medium text-[#2A2A2A] outline-none transition-colors focus:border-[#2A2A2A]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] lg:p-8">
            <h3 className="mb-6 text-lg font-black italic tracking-tighter text-[#2A2A2A] uppercase">
              MEDIA SOSIAL & LINK
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">INSTAGRAM</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-medium text-gray-400">@</span>
                  <input
                    type="text"
                    defaultValue="wafastudio_pdg"
                    title="Username Instagram"
                    placeholder="Username Instagram"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-9 pr-4 text-[13px] font-medium text-[#2A2A2A] outline-none transition-colors focus:border-[#2A2A2A]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">WHATSAPP BUSINESS</label>
                <input
                  type="text"
                  defaultValue="081234567890"
                  title="Nomor WhatsApp business"
                  placeholder="Nomor WhatsApp business"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] font-medium text-[#2A2A2A] outline-none transition-colors focus:border-[#2A2A2A]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">SITUS WEB / LINKTREE</label>
                <input
                  type="url"
                  placeholder="https://..."
                  title="Alamat situs web atau linktree"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] font-medium text-[#2A2A2A] outline-none transition-colors placeholder:text-gray-300 focus:border-[#2A2A2A]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">EMAIL BISNIS</label>
                <input
                  type="email"
                  defaultValue="hello@wafastudio.com"
                  title="Email bisnis studio"
                  placeholder="Email bisnis studio"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] font-medium text-[#2A2A2A] outline-none transition-colors focus:border-[#2A2A2A]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6 lg:gap-8">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] lg:p-8">
            <h3 className="mb-5 text-lg font-black italic tracking-tighter text-[#2A2A2A] uppercase">
              LOKASI BISNIS
            </h3>

            <div className="mb-3 rounded-2xl border border-gray-100 bg-[#FAFAFC] p-4">
              <span className="mb-1 block text-[8px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">
                KOTA/KABUPATEN UTAMA
              </span>
              <span className="text-[13px] font-extrabold text-[#2A2A2A] uppercase">
                KOTA PADANG
              </span>
            </div>

            <p className="text-[8px] font-bold leading-relaxed tracking-wider text-[#A8A8A8] uppercase">
              *LOKASI INI AKAN MEMBANTU SISTEM MEREKOMENDASIKAN JASA ANDA KE PELANGGAN TERDEKAT.
            </p>
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] lg:p-8">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-black italic tracking-tighter text-[#2A2A2A] uppercase">
                PORTOFOLIO
              </h3>
              <a href="#" className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] underline decoration-[#A8A8A8] underline-offset-4 transition-colors hover:text-[#2A2A2A] hover:decoration-[#2A2A2A] uppercase">
                KELOLA GALERI
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {portfolioPreviews.map((previewUrl, index) => (
                <button
                  key={`portfolio-${index}`}
                  type="button"
                  onClick={() => openFilePicker('portfolio')}
                  className="aspect-square overflow-hidden rounded-2xl bg-[#F4F4F5] flex items-center justify-center transition-colors hover:bg-gray-200 cursor-pointer"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt={`Preview portofolio ${index + 1}`} className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              ))}

              <button
                type="button"
                onClick={() => openFilePicker('portfolio')}
                className="aspect-square rounded-2xl border-2 border-dashed border-[#FCE6E3] bg-[#FDF1F0] flex flex-col items-center justify-center cursor-pointer text-[#EF4444] transition-colors hover:bg-[#FCE6E3]"
              >
                <PlusIcon className="mb-1 h-5 w-5" />
                <span className="text-[8px] font-bold tracking-widest uppercase">TAMBAH</span>
              </button>

              <input
                ref={portfolioInputRef}
                type="file"
                accept="image/*"
                multiple
                title="Upload portofolio"
                aria-label="Upload portofolio"
                className="hidden"
                onChange={handlePortfolioUpload}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
