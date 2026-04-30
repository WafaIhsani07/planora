'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Image as ImageIcon } from 'lucide-react';
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
    image: 'https://images.unsplash.com/photo-1540575467063-178f50002cae?auto=format&fit=crop&q=80',
    description: 'Acara gathering karyawan dengan hiburan dan dokumentasi profesional',
    date: 'Februari 2024',
  },
];

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(mockPortfolio);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    date: '',
    image: '',
  });

  const handleAddNew = () => {
    setFormData({ title: '', category: '', description: '', date: '', image: '' });
    setEditingId(null);
    setShowAddModal(true);
  };

  const handleEdit = (item: PortfolioItem) => {
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description,
      date: item.date,
      image: item.image,
    });
    setEditingId(item.id);
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (editingId) {
      setPortfolio(
        portfolio.map((item) =>
          item.id === editingId
            ? { ...item, ...formData }
            : item
        )
      );
    } else {
      setPortfolio([
        ...portfolio,
        {
          id: Date.now().toString(),
          ...formData,
        },
      ]);
    }
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    setPortfolio(portfolio.filter((item) => item.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2A2A2A]">Portofolio</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola galeri dan showcase proyek Anda</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#FF9A9E] px-6 py-3 font-bold text-white transition-transform hover:scale-105 hover:bg-[#FF7F97]"
        >
          <Plus className="h-5 w-5" />
          Tambah Portofolio
        </button>
      </div>

      {/* Portfolio Grid */}
      {portfolio.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-gray-200 py-12 text-center">
          <ImageIcon className="mb-4 h-12 w-12 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-600">Belum Ada Portofolio</h3>
          <p className="mt-1 text-sm text-gray-500">Mulai tambahkan proyek Anda ke galeri</p>
          <button
            onClick={handleAddNew}
            className="mt-4 rounded-xl bg-[#FF9A9E] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#FF7F97]"
          >
            Tambah Portofolio Pertama
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/40" />
                <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-700 transition hover:bg-[#FF9A9E] hover:text-white"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-red-500 transition hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2 inline-block rounded-full bg-[#FCE6E3] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FF6E8F]">
                  {item.category}
                </div>
                <h4 className="mb-1 text-lg font-bold text-[#2A2A2A]">{item.title}</h4>
                <p className="mb-3 text-xs text-gray-500">{item.date}</p>
                <p className="text-xs leading-relaxed text-gray-600">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2A2A2A]/80 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-[600px] overflow-y-auto rounded-[2rem] bg-white p-8 shadow-2xl">
            <h2 className="mb-6 text-2xl font-extrabold text-[#2A2A2A]">
              {editingId ? 'Edit Portofolio' : 'Tambah Portofolio Baru'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Judul Proyek
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nama proyek atau acara"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition focus:border-[#FF9A9E] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition focus:border-[#FF9A9E] focus:bg-white focus:outline-none"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Gathering">Gathering</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Tanggal
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="Bulan Tahun"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition focus:border-[#FF9A9E] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                  URL Gambar
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition focus:border-[#FF9A9E] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan detail proyek ini..."
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition focus:border-[#FF9A9E] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="flex-1 rounded-xl bg-[#FF9A9E] px-4 py-3 font-bold text-white transition hover:bg-[#FF7F97]"
              >
                {editingId ? 'Simpan Perubahan' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}
