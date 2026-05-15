'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '../DashboardLayout';
import { Plus, Edit3, Trash2, X, Check, Upload, ChevronDown, ArrowLeft, Briefcase, Tag, ShoppingBag, Calculator, Eye } from 'lucide-react';

interface ServicePackage {
  id: number;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  discountPercent?: number;
  discountLabel?: string;
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
    orders: 12,
    img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=400',
    features: ['Dekorasi Meja Akad', 'Bunga Meja', 'Kursi 20 Set'],
  },
  {
    id: 2,
    name: 'Paket Dekorasi Standard',
    category: 'Dekorasi Lamaran',
    price: 'Rp 5.250.000',
    orders: 34,
    img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400',
    features: ['Backdrop Kayu', 'Artificial Flower', 'Ring Box', 'Initial Name'],
    originalPrice: 'Rp 6.000.000',
    discountPercent: 12,
    discountLabel: 'Promo Lamaran',
  },
  {
    id: 3,
    name: 'Paket Dekorasi Premium',
    category: 'Dekorasi Pernikahan',
    price: 'Rp 12.000.000',
    orders: 8,
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400',
    features: ['Pelaminan 8-10 Meter', 'Full Fresh Flower', 'Lighting Set', 'Gate Jalur'],
  },
];

export default function KatalogPage() {
  const [packages, setPackages] = useState<ServicePackage[]>(mockPackages);
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [hasDiscountEnabled, setHasDiscountEnabled] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<ServicePackage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dekorasi Pernikahan',
    price: '',
    discountPercent: '',
    discountLabel: '',
    features: ['', ''],
    description: '',
  });

  // Hitung stats
  const totalPackages = packages.length;
  const promoCount = packages.filter(p => p.discountPercent && p.discountPercent > 0).length;
  const bestSeller = packages.reduce((max, p) => (p.orders > max.orders ? p : max), packages[0]);

  // Live preview untuk harga
  const previewPrice = useMemo(() => {
    const base = parseInt(formData.price) || 0;
    if (hasDiscountEnabled && formData.discountPercent) {
      return Math.round(base * (1 - Number(formData.discountPercent) / 100));
    }
    return base;
  }, [formData.price, formData.discountPercent, hasDiscountEnabled]);

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
      orders: 0,
      img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400',
      features: formData.features.filter(f => f.trim()),
      ...(formData.discountPercent && Number(formData.discountPercent) > 0
        ? {
            originalPrice: `Rp ${parseInt(formData.price).toLocaleString('id-ID')}`,
            price: `Rp ${Math.round(parseInt(formData.price) * (1 - Number(formData.discountPercent) / 100)).toLocaleString('id-ID')}`,
            discountPercent: Number(formData.discountPercent),
            discountLabel: formData.discountLabel.trim() || 'Diskon Spesial',
          }
        : {}),
    };

    setPackages([...packages, newPackage]);
    resetForm();
    setIsAddingPackage(false);
  };

  const handleDeletePackage = (id: number) => {
    const targetPackage = packages.find((item) => item.id === id);
    if (targetPackage) {
      setPackageToDelete(targetPackage);
    }
  };

  const confirmDeletePackage = () => {
    if (!packageToDelete) return;
    setPackages(packages.filter((item) => item.id !== packageToDelete.id));
    setPackageToDelete(null);
  };

  const cancelDeletePackage = () => {
    setPackageToDelete(null);
  };


  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Dekorasi Pernikahan',
      price: '',
      discountPercent: '',
      discountLabel: '',
      features: ['', ''],
      description: '',
    });
    setHasDiscountEnabled(false);
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
              className="w-12 h-12 bg-white border border-[#2A2A2A]/5 rounded-2xl flex items-center justify-center text-[#2A2A2A] hover:bg-[#FF9A9E] hover:text-white transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl md:text-[2rem] font-extrabold tracking-tight leading-tight text-[#2A2A2A]">Buat Paket Baru</h1>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2A2A2A]/35">ISI DETAIL LAYANAN UNTUK KLIENMU.</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Image Upload */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-8 rounded-xl border border-[#2A2A2A]/5 shadow-sm">
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

              {/* Live Preview Mobile */}
              <div className="bg-[#2A2A2A] p-8 rounded-[32px] text-white shadow-2xl space-y-4">
                <div className="flex items-center gap-2 opacity-40">
                  <Eye className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Pratinjau Mobile</span>
                </div>
                <div>
                  <h5 className="text-xl font-black">{formData.name || 'Nama Paket Anda'}</h5>
                  <p className="text-2xl font-black text-[#FF9A9E] mt-2">
                    Rp {previewPrice.toLocaleString('id-ID')}
                  </p>
                  {hasDiscountEnabled && formData.discountPercent && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-white/30 line-through">
                        Rp {(parseInt(formData.price) || 0).toLocaleString('id-ID')}
                      </span>
                      <span className="bg-[#FF527B] text-white text-[8px] font-black px-2 py-0.5 rounded">PROMO</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white p-10 rounded-xl border border-[#2A2A2A]/5 shadow-sm space-y-8">
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
                      className="w-full bg-[#FDF1F0]/50 border border-transparent rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30 focus:bg-white focus:border-[#FF9A9E] transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                {/* Harga & Diskon Section */}
                <div className="space-y-6 border-b border-slate-50 pb-6">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[10px] font-black text-[#2A2A2A]/20 uppercase tracking-[0.3em]">Harga & Strategi Diskon</h5>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Aktifkan Diskon?</span>
                      <button
                        onClick={() => setHasDiscountEnabled(!hasDiscountEnabled)}
                        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
                          hasDiscountEnabled ? 'bg-[#FF9A9E]' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            hasDiscountEnabled ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#2A2A2A]/40 uppercase tracking-widest ml-1">
                        Harga Normal (IDR)
                      </label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="0"
                          className="w-full bg-[#FDF1F0]/50 border border-transparent rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30 focus:bg-white focus:border-[#FF9A9E] transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                      </div>
                    </div>
                    <div className={`space-y-3 transition-all duration-300 ${
                      hasDiscountEnabled ? 'opacity-100 pointer-events-auto' : 'opacity-30 pointer-events-none'
                    }`}>
                      <label className="text-[10px] font-black text-[#FF527B] uppercase tracking-widest ml-1 flex items-center gap-2">
                        Besar Diskon (%) <Tag className="w-3 h-3" />
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          disabled={!hasDiscountEnabled}
                          value={formData.discountPercent}
                          onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                          placeholder="0"
                          className="w-full bg-[#FDF1F0]/50 border border-transparent rounded-2xl py-4 px-6 pr-14 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF527B]/30 focus:bg-white focus:border-[#FF527B] transition-all disabled:opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#FF527B] uppercase tracking-widest">%</span>
                      </div>
                    </div>
                  </div>

                  {hasDiscountEnabled && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#2A2A2A]/40 uppercase tracking-widest ml-1">
                        Label Promo
                      </label>
                      <input
                        type="text"
                        value={formData.discountLabel}
                        onChange={(e) => setFormData({ ...formData, discountLabel: e.target.value })}
                        placeholder="Contoh: Promo Wedding Week"
                        className="w-full bg-[#FDF1F0]/50 border border-transparent rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30 focus:bg-white focus:border-[#FF9A9E] transition-all"
                      />
                    </div>
                  )}

                  {/* Harga Akhir */}
                  <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-300">
                        <Calculator className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Harga Akhir di Aplikasi</p>
                        <h4 className="text-lg font-black text-[#FF527B]">Rp {previewPrice.toLocaleString('id-ID')}</h4>
                      </div>
                    </div>
                    <p className="text-[8px] font-bold text-slate-300 max-w-[150px] uppercase text-right leading-relaxed">
                      Harga ini akan dilihat customer di aplikasi.
                    </p>
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
                    className="px-8 py-4 rounded-[18px] text-[11px] font-black uppercase tracking-widest text-[#2A2A2A]/40 hover:text-[#2A2A2A] transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddPackage}
                    className="bg-[#FF9A9E] text-white px-6 py-3 rounded-[16px] font-bold text-[10px] uppercase tracking-[0.18em] shadow-lg shadow-[#FF9A9E]/20 hover:bg-[#FF527B] transition-all active:scale-95 cursor-pointer"
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
            <h1 className="text-3xl md:text-[2rem] font-extrabold tracking-tight leading-tight text-[#2A2A2A]">Kelola Paket Layanan</h1>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2A2A2A]/35">ATUR HARGA DAN PROMO UNTUK MENARIK KLIEN.</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsAddingPackage(true);
            }}
            className="bg-[#2A2A2A] text-white px-5 py-3 rounded-[16px] font-bold flex items-center gap-2.5 hover:bg-[#FF527B] transition-all shadow-sm active:scale-95 w-fit text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> TAMBAH PAKET BARU
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-[#2A2A2A]/5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#FDF1F0] rounded-xl flex items-center justify-center text-[#FF9A9E]">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] font-black text-[#2A2A2A]/20 uppercase tracking-widest">Total Paket</p>
              <h4 className="text-base font-bold text-[#2A2A2A]">{totalPackages} Paket</h4>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#2A2A2A]/5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#E6F9F0] rounded-xl flex items-center justify-center text-[#10B981]">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] font-black text-[#2A2A2A]/20 uppercase tracking-widest">Paket Promo</p>
              <h4 className="text-base font-bold text-[#2A2A2A]">{promoCount} Aktif</h4>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#2A2A2A]/5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#FCE6E3] rounded-xl flex items-center justify-center text-[#FF527B]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] font-black text-[#2A2A2A]/20 uppercase tracking-widest">Terlaris</p>
              <h4 className="text-base font-bold text-[#2A2A2A]">{bestSeller?.name.split(' ').pop() || 'N/A'}</h4>
            </div>
          </div>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#2A2A2A]/5 flex flex-col hover:shadow-lg transition-all group overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.img}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={item.name}
                />
                {item.discountPercent && item.discountPercent > 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#FFF9E5] text-[#F59E0B] shadow-sm">
                    Diskon {item.discountPercent}%
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => {
                      setIsAddingPackage(true);
                      setFormData({
                        name: item.name,
                        category: item.category,
                        price: item.originalPrice ? item.originalPrice.replace('Rp ', '').replace(/\./g, '') : item.price.replace('Rp ', '').replace(/\./g, ''),
                        discountPercent: item.discountPercent?.toString() || '',
                        discountLabel: item.discountLabel || '',
                        features: item.features,
                        description: '',
                      });
                      setHasDiscountEnabled(!!(item.discountPercent && item.discountPercent > 0));
                    }}
                    className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-[#FF9A9E] hover:text-white hover:bg-[#FF9A9E] transition-all shadow-sm cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePackage(item.id)}
                    className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-[#2A2A2A]/40 hover:text-red-500 hover:bg-red-100 transition-all shadow-sm cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                {/* Header */}
                <div>
                  <p className="text-[9px] font-black text-[#FF9A9E] uppercase tracking-widest mb-2">
                    {item.category}
                  </p>
                  <h3 className="text-lg font-black text-[#2A2A2A] leading-tight">{item.name}</h3>
                  {item.discountLabel && (
                    <p className="mt-2 text-[8px] font-bold uppercase tracking-wider text-[#FF527B]">
                      {item.discountLabel}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-[#2A2A2A]/25 uppercase tracking-widest border-b border-[#2A2A2A]/5 pb-2">
                    Fitur Utama
                  </p>
                  <ul className="space-y-1.5">
                    {item.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] font-medium text-[#2A2A2A]/70">
                        <Check className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Section */}
                <div className="border-t border-[#2A2A2A]/5 pt-4 mt-auto">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[8px] font-bold text-[#2A2A2A]/30 uppercase tracking-tighter mb-1">Harga Paket</p>
                      {item.originalPrice ? (
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-medium text-[#2A2A2A]/40 line-through">{item.originalPrice}</p>
                          <p className="text-xl font-black text-[#FF527B]">{item.price}</p>
                        </div>
                      ) : (
                        <p className="text-xl font-black text-[#2A2A2A]">{item.price}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-bold text-[#2A2A2A]/30 uppercase tracking-tighter mb-1">Dipesan</p>
                      <p className="text-lg font-black text-[#2A2A2A]">{item.orders} <span className="text-sm font-medium text-[#2A2A2A]/50">Kali</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Package Card */}
          <div
            onClick={() => {
              resetForm();
              setIsAddingPackage(true);
            }}
            className="bg-[#FDF1F0]/50 rounded-2xl border-2 border-dashed border-[#FF9A9E]/20 flex flex-col items-center justify-center p-8 hover:bg-[#FDF1F0] transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 bg-white rounded-[20px] flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-[#FF9A9E]" />
            </div>
            <p className="text-[10px] font-bold text-[#FF9A9E] uppercase tracking-widest">Buat Paket Baru</p>
            <p className="text-[8px] font-bold text-[#2A2A2A]/25 uppercase tracking-tighter mt-1">
              Kembangkan variasi produk
            </p>
          </div>
        </div>

        {packageToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A2A2A]/60 backdrop-blur-[2px] px-4">
            <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-white shadow-2xl">
              <div className="p-8 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-[#FCE6E3] text-[#FF527B] flex items-center justify-center shadow-sm">
                  <Trash2 className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#2A2A2A]">Hapus paket layanan?</h3>
                  <p className="text-sm leading-relaxed text-[#2A2A2A]/45">
                    Paket <span className="font-bold text-[#2A2A2A]">{packageToDelete.name}</span> akan dihapus dari katalog. Tindakan ini tidak bisa dibatalkan.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#2A2A2A]/5 bg-[#FAFAFC] p-4 space-y-2">
                  <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest text-[#2A2A2A]/45">
                    <span>Kategori</span>
                    <span className="normal-case tracking-normal text-[#2A2A2A]">{packageToDelete.category}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest text-[#2A2A2A]/45">
                    <span>Harga</span>
                    <span className="normal-case tracking-normal text-[#FF527B]">{packageToDelete.price}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={cancelDeletePackage}
                    className="flex-1 rounded-2xl border border-[#2A2A2A]/10 bg-white px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#2A2A2A]/60 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeletePackage}
                    className="flex-1 rounded-2xl bg-[#2A2A2A] px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-[#2A2A2A]/10 transition-all hover:bg-[#FF527B] cursor-pointer"
                  >
                    Ya, Hapus
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
