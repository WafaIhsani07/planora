'use client';

import { useEffect, useState } from 'react';
import { getMyLayanan, createLayanan, updateLayanan, deleteLayanan } from '@/services/vendor.service';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

type LayananForm = {
  name: string;
  description: string;
  price: string;
  kategoriId: string;
};

const EMPTY_FORM: LayananForm = { name: '', description: '', price: '', kategoriId: '' };

export default function VendorLayananPage() {
  const [layanan, setLayanan] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [form, setForm] = useState<LayananForm>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchLayanan = async () => {
    try {
      const data = await getMyLayanan();
      setLayanan(data ?? []);
    } catch (err) {
      console.error('Gagal memuat layanan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLayanan(); }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setEditTarget(item);
    setForm({
      name: item.name,
      description: item.description ?? '',
      price: String(item.price),
      kategoriId: item.kategoriId ?? '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        kategoriId: form.kategoriId,
      };
      if (editTarget) {
        await updateLayanan(editTarget.id, payload);
      } else {
        await createLayanan(payload);
      }
      setShowModal(false);
      await fetchLayanan();
    } catch (err) {
      console.error('Gagal menyimpan layanan:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus layanan ini?')) return;
    setDeletingId(id);
    try {
      await deleteLayanan(id);
      await fetchLayanan();
    } catch (err) {
      console.error('Gagal menghapus:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center" data-testid="loading-spinner">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9A9E]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 py-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#2A2A2A]/40 uppercase mb-2 block">
            PRODUK & JASA ANDA
          </span>
          <h1 className="text-4xl font-black italic tracking-tighter text-[#2A2A2A]">KELOLA<br />LAYANAN.</h1>
        </div>
        <button
          id="btn-tambah-layanan"
          onClick={openCreate}
          className="flex items-center gap-2 px-6 h-11 rounded-full bg-[#2A2A2A] text-white text-[10px] font-bold tracking-widest uppercase hover:bg-[#FF9A9E] transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" /> TAMBAH LAYANAN
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_-8px_rgba(255,154,158,0.15)] border border-white p-6">
        {layanan.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-4">
            <Package className="w-12 h-12 text-[#FF9A9E]/40" />
            <p className="text-sm text-gray-400 font-medium">Anda belum memiliki layanan. Tambah sekarang!</p>
            <button onClick={openCreate} className="px-6 py-2.5 bg-[#2A2A2A] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#FF9A9E] transition-colors">
              + TAMBAH LAYANAN
            </button>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-50">
            {layanan.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 gap-4">
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-extrabold text-[#2A2A2A] mb-0.5">{item.name}</span>
                  <span className="text-[9px] font-medium text-[#2A2A2A]/40">{item.description || 'Tidak ada deskripsi'}</span>
                  <span className="text-[9px] font-bold text-[#FF9A9E] mt-1">{item.kategori?.name ?? 'Kategori'}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[12px] font-black text-[#2A2A2A]">{formatCurrency(item.price)}</span>
                  <button
                    id={`btn-edit-${item.id}`}
                    onClick={() => openEdit(item)}
                    className="w-9 h-9 rounded-xl bg-[#FDF1F0] hover:bg-[#FCE6E3] flex items-center justify-center text-[#FF9A9E]"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    id={`btn-delete-${item.id}`}
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 z-40 bg-[#2A2A2A]/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-[480px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50">
                <h2 className="text-lg font-black italic tracking-tighter text-[#2A2A2A] uppercase">
                  {editTarget ? 'Edit Layanan' : 'Tambah Layanan Baru'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[#2A2A2A]/40">Nama Layanan</label>
                  <input
                    id="input-nama-layanan"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Paket Foto Pernikahan"
                    className="h-11 px-4 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#FF9A9E] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[#2A2A2A]/40">Harga (Rp)</label>
                  <input
                    id="input-harga-layanan"
                    required
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="5000000"
                    className="h-11 px-4 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#FF9A9E] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[#2A2A2A]/40">Deskripsi (Opsional)</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Jelaskan paket layanan Anda..."
                    rows={3}
                    className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#FF9A9E] transition-colors resize-none"
                  />
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl bg-gray-50 border border-gray-100 text-[#2A2A2A]/40 text-[9px] font-black uppercase tracking-widest hover:text-[#2A2A2A] transition-colors"
                  >
                    BATAL
                  </button>
                  <button
                    id="btn-simpan-layanan"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-[#2A2A2A] text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#FF9A9E] transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? 'MENYIMPAN...' : 'SIMPAN'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
