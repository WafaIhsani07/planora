"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import { getAllKategori, createKategori, updateKategori } from '@/services/admin.service';

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

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function CategoryCard({ cat, onEdit }: { cat: any; onEdit: (id: string) => void }) {
  const layananCount = cat?._count?.layanan ?? 0;
  return (
    <div className={`rounded-xl border p-4 flex flex-col transition-transform hover:-translate-y-1 bg-white shadow-[0_8px_20px_-12px_rgba(0,0,0,0.05)] border-gray-100`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#FFF1F3] text-[#FF5E7E] font-black">{(cat.icon && cat.icon.charAt(0)) || cat.name?.charAt(0)}</div>
          <div>
            <div className="text-sm font-bold">{cat.name}</div>
          </div>
        </div>
        <StatusBadge text={cat.isActive === false ? 'NONAKTIF' : 'AKTIF'} variant={cat.isActive === false ? 'gray' : 'emerald'} />
      </div>

      <div className="text-sm text-[#6B6B6B] mb-3 line-clamp-3">{cat.description || '-'}</div>

      <div className="mt-auto flex items-center gap-3">
        <div className="text-[10px] text-[#A8A8A8] font-bold">{layananCount} Layanan</div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => onEdit(cat.id)} className="px-2 py-1.5 bg-white border border-[#E6E6E6] rounded-lg text-xs font-bold">Edit</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminManajemenKategoriPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [q, setQ] = useState('');
  const [view, setView] = useState<'grid'|'list'>('grid');
  const [page, setPage] = useState(1);
  const perPage = 6;
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<{ id?: string; name?: string; description?: string; slug?: string }>({});

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

  function filteredAndPaged(all: any[], q: string, page: number, perPage: number) {
    const term = q.trim().toLowerCase();
    const filtered = !term ? all : all.filter(c => (c.name || '').toLowerCase().includes(term) || (c.description || '').toLowerCase().includes(term) || (c.slug || '').toLowerCase().includes(term));
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }

  function startIndex(page:number, perPage:number, total:number){
    if (total === 0) return 0;
    return Math.min((page-1)*perPage+1, total);
  }

  function endIndex(page:number, perPage:number, total:number){
    if (total === 0) return 0;
    return Math.min(page*perPage, total);
  }

  return (
    <>
      <AdminHeader hideSearch />

      <div className="p-8 pb-16">
        <div className="max-w-[1300px] mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
                <h2 className="text-2xl font-black text-[#2A2A2A]">Manajemen Kategori</h2>
                <p className="text-sm text-[#6B6B6B] mt-1">Kelola semua kategori layanan yang tersedia di Planora.</p>
              </div>

            <div className="ml-auto">
              <button onClick={() => { setForm({}); setShowModal(true); }} type="button" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF5E7E] hover:bg-[#ef5570] text-white text-sm font-bold shadow-md">
                <PlusIcon className="w-4 h-4" />
                Tambah Kategori
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-6">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-[0_8px_20px_-12px_rgba(0,0,0,0.05)] border border-gray-50 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FCE6E3]/50 text-[#2A2A2A] flex items-center justify-center shrink-0">
                  <GridIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-1">TOTAL KATEGORI</span>
                  <span className="text-2xl font-black text-[#2A2A2A] tracking-tighter">{categories.length}</span>
              </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-xl shadow-[0_8px_20px_-12px_rgba(0,0,0,0.05)] border border-gray-50 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F4F4F5] text-gray-400 flex items-center justify-center shrink-0">
                <MedalIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-1">KATEGORI TERPOPULER</span>
                <span className="text-lg md:text-xl font-black text-[#2A2A2A] tracking-tighter uppercase">
                    {categories[0]?.name || '-'}
                </span>
              </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-xl shadow-[0_8px_20px_-12px_rgba(0,0,0,0.05)] border border-gray-50 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-1">KATEGORI AKTIF</span>
                <span className="text-2xl font-black text-emerald-500 tracking-tighter">
                    {categories.filter(c => c.isActive !== false).length}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 rounded-xl border border-[#F4D7D4] bg-white px-4 py-2">
                <svg className="w-4 h-4 text-[#A8A8A8]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
                <input value={q} onChange={e => { setQ(e.target.value); setPage(1); }} placeholder="Cari kategori..." className="w-full bg-transparent outline-none text-sm font-semibold" />
                {q && <button onClick={() => setQ('')} className="text-sm text-[#A8A8A8]">✕</button>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('grid')}
                aria-pressed={view === 'grid'}
                title="Grid view"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition ${view === 'grid' ? 'bg-[#FF5E7E] text-white' : 'bg-white border border-[#E6E8EB] text-[#2A2A2A]'}`}
              >
                <span className="w-4 h-4">▦</span>
                <span className="hidden sm:inline">Grid</span>
              </button>

              <button
                onClick={() => setView('list')}
                aria-pressed={view === 'list'}
                title="List view"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition ${view === 'list' ? 'bg-[#FF5E7E] text-white' : 'bg-white border border-[#E6E8EB] text-[#2A2A2A]'}`}
              >
                <span className="w-4 h-4">≡</span>
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF9A9E]"></div>
            </div>
          ) : (
            <>
              <div className={view==='grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8' : 'flex flex-col gap-4'}>
                {filteredAndPaged(categories, q, page, perPage).length === 0 ? (
                    <div className="col-span-full py-10 text-center text-gray-400">Belum ada kategori.</div>
                ) : (
                    filteredAndPaged(categories, q, page, perPage).map((cat) => (
                        <CategoryCard key={cat.id} cat={cat} onEdit={(id) => {
                          const selected = categories.find(c => c.id === id);
                          if (selected) setForm({ id: selected.id, name: selected.name, description: selected.description, slug: selected.slug });
                          setShowModal(true);
                        }} />
                    ))
                )}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-[#A8A8A8]">Menampilkan {startIndex(page, perPage, categories.length)} - {endIndex(page, perPage, categories.length)} dari {categories.length} kategori</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="w-8 h-8 rounded-lg border border-[#E6E8EB]">‹</button>
                  <div className="w-8 h-8 rounded-lg bg-[#FF9A9E] text-white flex items-center justify-center">{page}</div>
                  <button onClick={() => setPage(p => (p*perPage < categories.length ? p+1 : p))} disabled={page*perPage >= categories.length} className="w-8 h-8 rounded-lg border border-[#E6E8EB]">›</button>
                </div>
              </div>
            </>
          )}



          {/* Modal for create/edit (popup) */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/40" onClick={() => { if (!saving) setShowModal(false); }} />
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!form.name || !form.name.trim()) {
                  alert('Nama kategori tidak boleh kosong');
                  return;
                }
                setSaving(true);
                try {
                  const payload = { name: form.name || '', description: form.description, slug: slugify(form.name || '') };
                  if (form.id) {
                    await updateKategori(form.id, payload);
                  } else {
                    await createKategori(payload);
                  }
                  const data = await getAllKategori();
                  setCategories(data);
                } catch (err) {
                  console.error(err);
                  alert('Gagal menyimpan kategori');
                } finally {
                  setSaving(false);
                  setShowModal(false);
                  setForm({});
                }
              }} className="relative bg-white rounded-2xl p-6 w-full max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black">{form.id ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
                  <button type="button" onClick={() => { if (!saving) { setShowModal(false); setForm({}); } }} className="text-slate-400">✕</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-black text-[#A8A8A8]">Nama Kategori</label>
                    <input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-[#E6E8EB] rounded-xl p-3 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-[#A8A8A8]">Deskripsi</label>
                    <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-[#E6E8EB] rounded-xl p-3 mt-1 h-24" />
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button type="button" onClick={() => { if (!saving) { setShowModal(false); setForm({}); } }} className="flex-1 border border-[#E6E8EB] rounded-xl py-2">Batal</button>
                  <button type="submit" disabled={saving} className="flex-1 bg-[#FF5E7E] text-white rounded-xl py-2 font-black">{saving ? 'Menyimpan...' : 'Simpan'}</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}