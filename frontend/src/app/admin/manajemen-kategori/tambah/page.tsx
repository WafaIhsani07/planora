'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createKategori } from '@/services/admin.service';

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function TambahKategoriPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Nama kategori tidak boleh kosong');
      return;
    }

    setLoading(true);
    try {
      await createKategori({ ...form, slug: slugify(form.name) });
      router.push('/admin/manajemen-kategori');
    } catch (error: any) {
      console.error('Error creating kategori:', error);
      alert(error.response?.data?.message || 'Gagal membuat kategori');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF1F0] p-6">
      <div className="max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#2A2A2A] font-bold mb-6 hover:opacity-70 transition"
        >
          ← Kembali
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#2A2A2A] mb-2">Tambah Kategori</h1>
          <p className="text-[#6B6B6B]">Buat kategori layanan baru untuk mengorganisir data dengan lebih baik.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit}>
            {/* Nama Kategori */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#2A2A2A] mb-2">
                Nama Kategori <span className="text-[#FF5E7E]">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Contoh: Fotografi & Videografi"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[#2A2A2A] placeholder-[#BDBDBD] focus:outline-none focus:ring-2 focus:ring-[#FF5E7E] focus:border-transparent transition"
              />
              <p className="text-xs text-[#8A8A8A] mt-2">Masukkan nama kategori layanan</p>
            </div>

            {/* Deskripsi */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-[#2A2A2A] mb-2">
                Deskripsi <span className="text-[#FF5E7E]">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Jelaskan tentang kategori layanan ini..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[#2A2A2A] placeholder-[#BDBDBD] focus:outline-none focus:ring-2 focus:ring-[#FF5E7E] focus:border-transparent transition resize-none"
              />
              <p className="text-xs text-[#8A8A8A] mt-2">Berikan deskripsi singkat mengenai layanan dalam kategori ini</p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-[#E6E6E6] rounded-lg text-[#2A2A2A] font-bold hover:bg-gray-50 transition"
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#FF5E7E] hover:bg-[#FF4565] text-white font-bold rounded-lg flex items-center gap-2 transition disabled:opacity-50"
                disabled={loading}
              >
                📝 {loading ? 'Menyimpan...' : 'Simpan Kategori'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
