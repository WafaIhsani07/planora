'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  ArrowLeft,
  Eye,
  Upload,
  CalendarDays,
} from 'lucide-react';
import DashboardLayout from '../DashboardLayout';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  date: string;
}

const mockPortfolio: PortfolioItem[] = [
  {
    id: '1',
    title: 'Pernikahan Sophia & Ahmad',
    category: 'Wedding',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80',
    description: 'Dokumentasi lengkap acara pernikahan dengan lighting dan dekorasi premium',
    date: 'Maret 2024',
  },
  {
    id: '2',
    title: 'Corporate Event PT. Teknologi',
    category: 'Corporate',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
    description: 'Acara gathering karyawan dengan hiburan dan dokumentasi profesional',
    date: 'Februari 2024',
  },
];

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(mockPortfolio);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    date: '',
    image: '',
  });

  const monthNameToIndex: Record<string, string> = {
    januari: '01',
    februari: '02',
    maret: '03',
    april: '04',
    mei: '05',
    juni: '06',
    juli: '07',
    agustus: '08',
    september: '09',
    oktober: '10',
    november: '11',
    desember: '12',
  };

  const formatDateForInput = (value: string) => {
    if (!value) return '';

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    const normalized = value.trim().toLowerCase();
    const monthYearMatch = normalized.match(/^([a-z]+)\s+(\d{4})$/);
    if (monthYearMatch) {
      const [, monthName, year] = monthYearMatch;
      const month = monthNameToIndex[monthName];
      if (month) {
        return `${year}-${month}-01`;
      }
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }

    return '';
  };

  const formatDateForDisplay = (value: string) => {
    if (!value) return '';

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(`${value}T00:00:00`));
    }

    return value;
  };

  const filteredPortfolio = portfolio.filter((item) => {
    if (filterCategory === 'Semua') return true;
    return item.category === filterCategory;
  });

  const filterTabs = [
    { name: 'Semua', count: portfolio.length },
    { name: 'Wedding', count: portfolio.filter((item) => item.category === 'Wedding').length },
    { name: 'Corporate', count: portfolio.filter((item) => item.category === 'Corporate').length },
    { name: 'Birthday', count: portfolio.filter((item) => item.category === 'Birthday').length },
    { name: 'Gathering', count: portfolio.filter((item) => item.category === 'Gathering').length },
    { name: 'Seminar', count: portfolio.filter((item) => item.category === 'Seminar').length },
  ];

  const handleAddNew = () => {
    setFormData({ title: '', category: 'Wedding', description: '', date: '', image: '' });
    setEditingId(null);
    setView('form');
  };

  const handleEdit = (item: PortfolioItem) => {
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description,
      date: formatDateForInput(item.date),
      image: item.image,
    });
    setEditingId(item.id);
    setView('form');
  };

  const handleSave = () => {
    if (!formData.title || !formData.category || !formData.description || !formData.date || !formData.image) {
      alert('Lengkapi semua data portofolio dulu.');
      return;
    }

    const savedDate = formatDateForDisplay(formData.date);

    if (editingId) {
      setPortfolio(
        portfolio.map((item) =>
          item.id === editingId
            ? { ...item, ...formData, date: savedDate }
            : item
        )
      );
    } else {
      setPortfolio([
        ...portfolio,
        {
          id: Date.now().toString(),
          ...formData,
          date: savedDate,
        },
      ]);
    }
    setView('list');
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus portofolio ini?')) {
      setPortfolio(portfolio.filter((item) => item.id !== id));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {view === 'list' ? (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-[2rem] font-extrabold tracking-tight leading-tight text-[#2A2A2A]">Portofolio Bisnis</h1>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2A2A2A]/35">PAMERKAN HASIL KARYA TERBAIK ANDA UNTUK CALON KLIEN.</p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-[#2A2A2A] text-white px-5 py-3 rounded-[16px] font-bold flex items-center gap-2.5 hover:bg-[#FF527B] transition-all shadow-sm active:scale-95 w-fit text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" /> TAMBAH PORTOFOLIO
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView('list')}
              className="w-12 h-12 bg-white border border-[#2A2A2A]/5 rounded-2xl flex items-center justify-center text-[#2A2A2A]/30 hover:bg-[#FF9A9E] hover:text-white transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl md:text-[2rem] font-extrabold tracking-tight leading-tight text-[#2A2A2A]">
                {editingId ? 'Edit Portofolio' : 'Tambah Karya'}
              </h1>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2A2A2A]/35">UNGGAH HASIL KERJA ANDA UNTUK DIPAMERKAN KE PELANGGAN.</p>
            </div>
          </div>
        )}

        {view === 'list' && (
          <>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setFilterCategory(tab.name)}
                  className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap rounded-full border-2 cursor-pointer ${filterCategory === tab.name
                      ? 'bg-[#FF9A9E] text-white border-[#FF9A9E]'
                      : 'bg-white text-[#2A2A2A]/60 border-[#2A2A2A]/10 hover:border-[#2A2A2A]/30'
                    }`}
                >
                  {tab.name}
                  <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-black ${filterCategory === tab.name
                      ? 'bg-white text-[#FF9A9E]'
                      : 'bg-[#2A2A2A]/10 text-[#2A2A2A]/60'
                    }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {filteredPortfolio.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-gray-200 py-16 text-center bg-white/70">
                <ImageIcon className="mb-4 h-12 w-12 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-600">Belum Ada Portofolio</h3>
                <p className="mt-1 text-sm text-gray-500">Mulai tambahkan proyek Anda ke galeri</p>
                <button
                  onClick={handleAddNew}
                  className="mt-4 rounded-xl bg-[#FF9A9E] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#FF7F97] cursor-pointer"
                >
                  Tambah Portofolio Pertama
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                {filteredPortfolio.map((item) => (
                  <article
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#2A2A2A]/5 overflow-hidden hover:shadow-lg transition-all group flex flex-col"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                      <div className="absolute inset-0 bg-black/0 opacity-0 group-hover:opacity-100 group-hover:bg-black/30 transition-all flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-[#2A2A2A] hover:bg-[#FF9A9E] hover:text-white transition-all shadow-lg cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-[#2A2A2A] hover:bg-red-500 hover:text-white transition-all shadow-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute top-5 left-5 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase text-[#FF527B] shadow-sm">
                        {item.category}
                      </div>
                    </div>
                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                      <h4 className="text-lg font-black text-[#2A2A2A] leading-tight group-hover:text-[#FF527B] transition-colors cursor-pointer">
                        {item.title}
                      </h4>
                      <p className="text-xs leading-relaxed text-slate-600 flex-1">{item.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Eye className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase">1.2k Dilihat</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 uppercase">{item.date}</span>
                      </div>
                    </div>
                  </article>
                ))}

                <div
                  onClick={handleAddNew}
                  className="bg-[#FDF1F0]/50 rounded-2xl border-2 border-dashed border-[#FF9A9E]/20 flex flex-col items-center justify-center p-10 hover:bg-[#FDF1F0] transition-all cursor-pointer group min-h-[392px]"
                >
                  <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8 text-[#FF9A9E]" />
                  </div>
                  <p className="text-[10px] font-black text-[#FF9A9E] uppercase tracking-[0.2em] text-center leading-relaxed">
                    UNGGAH DOKUMENTASI<br />KARYA TERBARU
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {view === 'form' && (
          <div className="grid lg:grid-cols-12 gap-8 pb-20 animate-in slide-in-from-right-6 duration-500">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-8 rounded-xl border border-[#2A2A2A]/5 shadow-sm space-y-8">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.22em] text-[#2A2A2A]/25">Upload Media</h4>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Maksimal 5 foto per portofolio</p>
                </div>

                <div className="aspect-square bg-[#FFF7F8] rounded-[32px] border-2 border-dashed border-[#FF9A9E]/25 flex flex-col items-center justify-center px-6 py-8 group hover:border-[#FF9A9E] transition-all cursor-pointer">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-[#FF9A9E] shadow-sm group-hover:scale-110 transition-all mb-6">
                    <Upload className="w-8 h-8" />
                  </div>
                  <p className="text-[11px] font-black text-[#2A2A2A]/60 text-center leading-relaxed">
                    Klik atau tarik gambar
                    <br />
                    ke sini untuk unggah
                  </p>
                  <p className="mt-4 text-[9px] font-bold text-[#FF9A9E]/45 uppercase tracking-[0.18em]">PNG, JPG up to 5MB</p>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="aspect-square bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-200">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div className="aspect-square bg-slate-50 rounded-xl border border-slate-100" />
                  <div className="aspect-square bg-slate-50 rounded-xl border border-slate-100" />
                  <div className="aspect-square bg-slate-50 rounded-xl border border-slate-100" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white p-6 md:p-8 rounded-xl border border-[#2A2A2A]/5 shadow-sm space-y-8">
                <section className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#2A2A2A]/40 uppercase tracking-widest ml-1">Judul Portofolio / Acara</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Contoh: Intimate Wedding at Glass House"
                      className="w-full bg-[#FDF1F0]/50 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-[#FF9A9E] transition-all"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#2A2A2A]/40 uppercase tracking-widest ml-1">Kategori Acara</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-[#FDF1F0]/50 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-[#FF9A9E] appearance-none cursor-pointer"
                      >
                        <option value="Wedding">Wedding</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Gathering">Gathering</option>
                        <option value="Seminar">Seminar</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#2A2A2A]/40 uppercase tracking-widest ml-1">Tanggal Dokumentasi</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full appearance-none bg-[#FDF1F0]/50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-[#2A2A2A] focus:ring-2 focus:ring-[#FF9A9E] transition-all [color-scheme:light]"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#2A2A2A]/40 uppercase tracking-widest ml-1">Deskripsi & Cerita di Balik Karya</label>
                    <textarea
                      rows={6}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Ceritakan konsep, tantangan, atau keunikan dari karya ini..."
                      className="w-full bg-[#FDF1F0]/50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-[#FF9A9E] resize-none transition-all"
                    />
                  </div>
                </section>

                <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-end gap-4">
                  <button
                    onClick={() => setView('list')}
                    className="px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-[#2A2A2A] transition-all cursor-pointer"
                  >
                    Batalkan
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-[#FF9A9E] text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#FF9A9E]/20 hover:bg-[#FF7F97] transition-all transform active:scale-95 cursor-pointer"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
