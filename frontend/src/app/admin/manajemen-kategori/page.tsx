'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import { getAllKategori } from '@/services/admin.service';

const GridIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
);
const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
);
const PlusIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
);
const MedalIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
);
const CameraIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
);

function CategoryCard({ title, isActive = true }: { title: string; isActive?: boolean }) {
  return (
    <div className={`rounded-[2rem] border p-8 flex flex-col transition-transform hover:-translate-y-1 ${isActive ? 'bg-white shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border-gray-100' : 'bg-[#FAFAFC] border-2 border-dashed border-gray-200'}`}>
      <div className="flex justify-between items-start mb-10">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-[#FCE6E3]/60 text-[#2A2A2A]' : 'bg-white border border-gray-100 text-gray-300 shadow-sm'}`}>
          {isActive ? <CameraIcon className="w-5 h-5" /> : <ShieldCheckIcon className="w-5 h-5" />}
        </div>
        <StatusBadge text={isActive ? "AKTIF" : "NONAKTIF"} variant={isActive ? "emerald" : "gray"} />
      </div>

      <div className="flex flex-col mb-8">
        <h3 className={`text-xl font-black italic tracking-tighter uppercase mb-2 ${isActive ? 'text-[#2A2A2A]' : 'text-gray-400'}`}>{title}</h3>
        <span className={`text-[9px] font-bold tracking-[0.1em] uppercase ${isActive ? 'text-[#A8A8A8]' : 'text-gray-300'}`}>STRUKTUR LAYANAN AKTIF</span>
      </div>

      <div className="flex items-center gap-3 mt-auto">
        <button type="button" className={`flex-1 py-3.5 rounded-xl text-[9px] font-bold tracking-widest uppercase transition-colors cursor-pointer ${isActive ? 'bg-[#2A2A2A] text-white hover:bg-[#1a1a1a]' : 'bg-[#6CE0A9] text-white hover:bg-[#5bc794] shadow-lg shadow-[#6CE0A9]/30'}`}>
          {isActive ? 'Edit' : 'Aktifkan'}
        </button>
        {isActive && (
          <button type="button" className="flex-1 py-3.5 bg-[#FAFAFC] border border-transparent text-[#A8A8A8] hover:text-[#2A2A2A] hover:bg-gray-100 rounded-xl text-[9px] font-bold tracking-widest uppercase transition-colors cursor-pointer">
            Nonaktif
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdminManajemenKategoriPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllKategori();
        setCategories(data);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <AdminHeader searchPlaceholder="CARI NAMA KATEGORI..." />

      <div className="p-8 pb-16">
        <div className="max-w-[1300px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-2 block">ARSITEKTUR LAYANAN PLATFORM</span>
              <h1 className="text-4xl md:text-[2.75rem] leading-[1.05] font-black italic tracking-tighter text-[#2A2A2A]">
                MANAJEMEN <br /> KATEGORI.
              </h1>
            </div>

            <button type="button" className="flex items-center gap-2 px-6 h-12 rounded-full bg-[#2A2A2A] text-white text-[10px] font-bold tracking-widest uppercase hover:bg-[#1a1a1a] transition-colors shadow-lg shadow-[#2A2A2A]/20 cursor-pointer">
              <PlusIcon className="w-4 h-4" />
              BUAT KATEGORI BARU
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-14">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-50 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-[#FCE6E3]/50 text-[#2A2A2A] flex items-center justify-center shrink-0">
                <GridIcon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-1">TOTAL KATEGORI</span>
                <span className="text-3xl font-black text-[#2A2A2A] tracking-tighter">{categories.length}</span>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-50 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-[#F4F4F5] text-gray-400 flex items-center justify-center shrink-0">
                <MedalIcon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-1">KATEGORI TERPOPULER</span>
                <span className="text-xl md:text-2xl font-black italic text-[#2A2A2A] tracking-tighter uppercase">
                    {categories[0]?.name || '-'}
                </span>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-50 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-1">KATEGORI AKTIF</span>
                <span className="text-3xl font-black text-emerald-500 tracking-tighter">
                    {categories.filter(c => c.isActive !== false).length}
                </span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF9A9E]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {categories.length === 0 ? (
                    <div className="col-span-full py-10 text-center text-gray-400">Belum ada kategori.</div>
                ) : (
                    categories.map((cat) => (
                        <CategoryCard key={cat.id} title={cat.name} isActive={cat.isActive !== false} />
                    ))
                )}
            </div>
          )}

          <div className="mt-16 pb-4 text-center">
            <p className="text-[8px] font-bold tracking-[0.3em] text-[#A8A8A8] uppercase">PLANORA ECOSYSTEM • MODUL STRUKTUR JASA • 2026</p>
          </div>
        </div>
      </div>
    </>
  );
}