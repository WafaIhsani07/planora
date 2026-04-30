'use client';

import React, { useState } from 'react';
import DashboardLayout from '../DashboardLayout';
import { Plus, Edit3, Trash2, X, Check, Upload, ChevronDown, ArrowLeft } from 'lucide-react';

interface ServicePackage {
  id: number;
  name: string;
  category: string;
  price: string;
  status: 'Aktif' | 'Nonaktif';
  orders: number;
  img: string;
  features: string[];
}

const mockPackages: ServicePackage[] = [
  {
    id: 1,
    name: 'Paket Dekorasi Basic',
    category: 'Dekorasi Pernikahan',
    price: 'Rp 2.000.000',
    status: 'Aktif',
    orders: 12,
    img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=400',
    features: ['Dekorasi Meja Akad', 'Bunga Meja', 'Kursi 20 Set'],
  },
  {
    id: 2,
    name: 'Paket Dekorasi Standard',
    category: 'Dekorasi Lamaran',
    price: 'Rp 5.250.000',
    status: 'Aktif',
    orders: 34,
    img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400',
    features: ['Backdrop Kayu', 'Artificial Flower', 'Ring Box', 'Initial Name'],
  },
  {
    id: 3,
    name: 'Paket Dekorasi Premium',
    category: 'Dekorasi Pernikahan',
    price: 'Rp 12.000.000',
    status: 'Aktif',
    orders: 8,
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400',
    features: ['Pelaminan 8-10 Meter', 'Full Fresh Flower', 'Lighting Set', 'Gate Jalur'],
  },
];

export default function KatalogPage() {
  const [packages, setPackages] = useState<ServicePackage[]>(mockPackages);
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dekorasi Pernikahan',
    price: '',
    features: ['', ''],
    description: '',
  });

  const handleAddPackage = () => {
    if (!formData.name || !formData.price) {
      alert('Nama paket dan harga tidak boleh kosong!');
      return;
    }

    const newPackage: ServicePackage = {
      id: Math.max(...packages.map(p => p.id)) + 1,
      name: formData.name,
      category: formData.category,
      price: `Rp ${parseInt(formData.price).toLocaleString('id-ID')}`,
      status: 'Aktif',
      orders: 0,
      img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400',
      features: formData.features.filter(f => f.trim()),
    };

    setPackages([...packages, newPackage]);
    resetForm();
    setIsAddingPackage(false);
  };

  const handleDeletePackage = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
      setPackages(packages.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setPackages(packages.map(p => 
      p.id === id ? { ...p, status: p.status === 'Aktif' ? 'Nonaktif' : 'Aktif' } : p
    ));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Dekorasi Pernikahan',
      price: '',
      features: ['', ''],
      description: '',
    });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ''],
    });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  if (isAddingPackage) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl space-y-8">
          {/* Header Form */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsAddingPackage(false)}
              className="w-12 h-12 bg-white border border-[#2A2A2A]/5 rounded-2xl flex items-center justify-center text-[#2A2A2A] hover:bg-[#FF9A9E] hover:text-white transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-[34px] font-black tracking-tight text-[#2A2A2A]">Buat Paket Baru</h1>
              <p className="text-[#2A2A2A]/40 text-xs font-bold uppercase tracking-[0.25em]">ISI DETAIL LAYANAN UNTUK KLIENMU.</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Image Upload */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-8 rounded-[40px] border border-[#2A2A2A]/5 shadow-sm">
                <h4 className="text-[10px] font-black text-[#2A2A2A]/30 uppercase tracking-widest mb-6">Foto Utama Paket</h4>
                <div className="aspect-square bg-[#FDF1F0] rounded-[32px] border-2 border-dashed border-[#FF9A9E]/30 flex flex-col items-center justify-center p-8 text-center group hover:bg-[#FDF1F0] transition-all cursor-pointer">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-[#FF9A9E]" />
                  </div>
                  <p className="text-xs font-bold text-[#2A2A2A]/60 leading-relaxed">
                    Klik atau tarik gambar <br /> ke sini untuk unggah
                  </p>
                  <p className="text-[9px] text-[#2A2A2A]/30 mt-2 uppercase tracking-tighter">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div className="bg-[#2A2A2A] p-8 rounded-[40px] text-white shadow-xl shadow-[#2A2A2A]/10">
                <h4 className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-4">Tips Planora</h4>
                <p className="text-xs font-medium leading-relaxed opacity-70">
                  Gunakan foto dengan pencahayaan yang baik untuk menarik minat klien hingga 3x lipat lebih tinggi.
                </p>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white p-10 rounded-[40px] border border-[#2A2A2A]/5 shadow-sm space-y-8">
                {/* Nama & Kategori */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#2A2A2A]/40 uppercase tracking-widest ml-1">
                      Nama Paket
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Paket Intimate Rose"
                      className="w-full bg-[#FDF1F0]/50 border border-transparent rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30 focus:bg-white focus:border-[#FF9A9E] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#2A2A2A]/40 uppercase tracking-widest ml-1">
                      Kategori Utama
                    </label>
                    <div className="relative">
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-[#FDF1F0]/50 border border-transparent rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30 focus:bg-white appearance-none cursor-pointer"
                      >
                        <option>Dekorasi Pernikahan</option>
                        <option>Dekorasi Lamaran</option>
                        <option>Dekorasi Ulang Tahun</option>
                        <option>Dekorasi Aqiqah</option>
                        <option>Dekorasi Wisuda</option>
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A2A2A]/30 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Harga */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#2A2A2A]/40 uppercase tracking-widest ml-1">
                    Harga Layanan
                  </label>
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-[#FF527B]">Rp</div>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0"
                      className="w-full bg-[#FDF1F0]/50 border border-transparent rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30 focus:bg-white focus:border-[#FF9A9E] transition-all"
                    />
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-[#2A2A2A]/40 uppercase tracking-widest ml-1">
                      Layanan yang Didapat
                    </label>
                    <button
                      onClick={addFeature}
                      className="text-[9px] font-black text-[#FF9A9E] uppercase tracking-widest hover:text-[#FF527B]"
                    >
                      + TAMBAH POIN
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...formData.features];
                            newFeatures[i] = e.target.value;
                            setFormData({ ...formData, features: newFeatures });
                          }}
                          placeholder="Contoh: Pelaminan Full Flower"
                          className="flex-1 bg-[#FDF1F0]/30 border border-[#2A2A2A]/5 rounded-xl py-3 px-5 text-xs font-bold text-[#2A2A2A]/70 focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30"
                        />
                        {formData.features.length > 1 && (
                          <button
                            onClick={() => removeFeature(i)}
                            className="p-2 rounded-lg hover:bg-red-50 text-[#2A2A2A]/20 hover:text-red-500 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#2A2A2A]/40 uppercase tracking-widest ml-1">
                    Deskripsi Paket
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ceritakan detail paketmu..."
                    rows={4}
                    className="w-full bg-[#FDF1F0]/50 border border-transparent rounded-[24px] py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30 focus:bg-white focus:border-[#FF9A9E] transition-all resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-slate-50 flex items-center justify-end gap-4">
                  <button
                    onClick={() => {
                      setIsAddingPackage(false);
                      resetForm();
                    }}
                    className="px-8 py-4 rounded-[18px] text-[11px] font-black uppercase tracking-widest text-[#2A2A2A]/40 hover:text-[#2A2A2A] transition-all"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddPackage}
                    className="bg-[#FF9A9E] text-white px-10 py-4 rounded-[18px] font-bold text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-[#FF9A9E]/20 hover:bg-[#FF527B] transition-all active:scale-95"
                  >
                    Simpan Paket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-[34px] font-black tracking-tight text-[#2A2A2A]">Kelola Paket Layanan</h1>
            <p className="text-[#2A2A2A]/40 text-xs font-bold uppercase tracking-[0.25em]">ATUR HARGA DAN DETAIL PAKET ACARAMU.</p>
          </div>
          <button
            onClick={() => setIsAddingPackage(true)}
            className="bg-[#2A2A2A] text-white px-8 py-4 rounded-[20px] font-bold flex items-center gap-3 hover:bg-[#FF527B] transition-all shadow-sm active:scale-95 w-fit"
          >
            <Plus className="w-5 h-5" /> TAMBAH PAKET BARU
          </button>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[40px] border border-[#2A2A2A]/5 overflow-hidden flex flex-col hover:shadow-[0_15px_45px_rgb(0,0,0,0.06)] transition-all group"
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.img}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={item.name}
                />
                <div
                  className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    item.status === 'Aktif'
                      ? 'bg-[#E6F9F0] text-[#10B981]'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {item.status}
                </div>
                <div className="absolute top-6 right-6 flex gap-2">
                  <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-[#2A2A2A]/40 hover:text-[#FF527B] transition-colors shadow-sm">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePackage(item.id)}
                    className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-[#2A2A2A]/40 hover:text-red-500 transition-colors shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-6">
                  <p className="text-[10px] font-black text-[#FF9A9E] uppercase tracking-[0.2em] mb-1">
                    {item.category}
                  </p>
                  <h4 className="text-xl font-black text-[#2A2A2A] leading-tight">{item.name}</h4>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8 flex-1">
                  <p className="text-[10px] font-black text-[#2A2A2A]/20 uppercase tracking-widest border-b border-[#2A2A2A]/5 pb-2">
                    Fitur Utama
                  </p>
                  <ul className="space-y-2">
                    {item.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-bold text-[#2A2A2A]/60">
                        <Check className="w-3.5 h-3.5 text-[#10B981]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer: Price & Orders */}
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] font-bold text-[#2A2A2A]/30 uppercase tracking-tighter">Harga Paket</p>
                    <p className="text-xl font-black text-[#FF527B]">{item.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[#2A2A2A]/30 uppercase tracking-tighter">Dipesan</p>
                    <p className="text-sm font-black text-[#2A2A2A]">{item.orders} Kali</p>
                  </div>
                </div>

                {/* Status Toggle */}
                <button
                  onClick={() => handleToggleStatus(item.id)}
                  className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    item.status === 'Aktif'
                      ? 'bg-[#E6F9F0] text-[#10B981] hover:bg-[#10B981] hover:text-white'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {item.status === 'Aktif' ? 'Aktif - Klik untuk Nonaktifkan' : 'Nonaktif - Klik untuk Aktifkan'}
                </button>
              </div>
            </div>
          ))}

          {/* Add New Package Card */}
          <div
            onClick={() => setIsAddingPackage(true)}
            className="bg-[#FDF1F0]/50 rounded-[40px] border-2 border-dashed border-[#FF9A9E]/20 flex flex-col items-center justify-center p-12 hover:bg-[#FDF1F0] transition-all cursor-pointer group"
          >
            <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-[#FF9A9E]" />
            </div>
            <p className="text-sm font-black text-[#FF9A9E] uppercase tracking-widest">Buat Paket Baru</p>
            <p className="text-[10px] font-bold text-[#2A2A2A]/30 uppercase tracking-tighter mt-2">
              Kembangkan variasi produkmu
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
