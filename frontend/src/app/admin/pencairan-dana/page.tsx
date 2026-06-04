'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { getAllWithdrawals, processWithdrawal } from '@/services/admin.service';
import AdminHeader from '@/components/admin/AdminHeader';
import StatusBadge from '@/components/admin/StatusBadge';

type WithdrawalStatus = 'menunggu' | 'diproses' | 'selesai' | 'ditolak';

type WithdrawalItem = {
  id: string;
  vendor: string;
  vendorCode: string;
  category: string;
  bank: string;
  accountNumber: string;
  accountName: string;
  amount: string;
  balance: string;
  commission: string;
  requestDate: string;
  requestTime: string;
  status: WithdrawalStatus;
  note: string;
  timeline: Array<{ time: string; title: string; description: string }>;
};

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function formatWithdrawalNumber(id: string) {
  const last = id.split('/').pop();
  return last ? `WD-${last}` : id;
}

// ─── Modal: Konfirmasi Aksi ────────────────────────────────────────────────────
function ConfirmModal({
  open, title, description, confirmLabel, confirmClass, onConfirm, onCancel,
}: {
  open: boolean; title: string; description: string; confirmLabel: string;
  confirmClass: string; onConfirm: () => void; onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <svg className="h-7 w-7 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-black text-[#2A2A2A]">{title}</h3>
        <p className="mb-8 text-sm font-semibold text-slate-500 leading-relaxed">{description}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50">
            Batal
          </button>
          <button onClick={onConfirm} className={`flex-1 rounded-2xl py-3 text-sm font-black text-white transition-all ${confirmClass}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal: Upload Bukti Transfer (file langsung) ─────────────────────────────
function ProofModal({
  open, onConfirm, onCancel,
}: {
  open: boolean; onConfirm: (url: string) => void; onCancel: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) { setFile(null); setPreview(null); setError(''); setIsUploading(false); setIsDragging(false); }
  }, [open]);

  const handleFile = (f: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(f.type)) { setError('Format tidak didukung. Gunakan JPG, PNG, WEBP, atau PDF.'); return; }
    if (f.size > 5 * 1024 * 1024) { setError('Ukuran file maksimal 5 MB.'); return; }
    setError('');
    setFile(f);
    if (f.type !== 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview('pdf');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) { setError('Pilih file bukti transfer terlebih dahulu.'); return; }
    setIsUploading(true);
    try {
      const { uploadImage } = await import('@/services/vendor.service');
      const url = await uploadImage(file);
      if (!url) { setError('Gagal mengunggah file. Coba lagi.'); setIsUploading(false); return; }
      onConfirm(url);
    } catch {
      setError('Terjadi kesalahan saat mengunggah. Coba lagi.');
      setIsUploading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
          <svg className="h-7 w-7 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <h3 className="mb-1 text-xl font-black text-[#2A2A2A]">Unggah Bukti Transfer</h3>
        <p className="mb-5 text-sm text-slate-500">Upload foto/screenshot struk transfer langsung dari perangkat Anda. Format: JPG, PNG, WEBP, atau PDF (maks. 5 MB).</p>

        {/* Drop Zone */}
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <div
          onClick={() => !isUploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative mb-4 flex h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
            isDragging ? 'border-emerald-400 bg-emerald-50' :
            file ? 'border-emerald-300 bg-emerald-50/50' :
            error ? 'border-red-300 bg-red-50' :
            'border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/30'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <svg className="h-8 w-8 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-xs font-semibold text-emerald-600">Mengunggah...</span>
            </div>
          ) : preview && preview !== 'pdf' ? (
            <div className="relative h-full w-full overflow-hidden rounded-xl p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" className="h-full w-full rounded-xl object-contain" />
              <div className="absolute inset-0 flex items-end justify-center pb-2">
                <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold text-white">Klik untuk ganti file</span>
              </div>
            </div>
          ) : preview === 'pdf' ? (
            <div className="flex flex-col items-center gap-2">
              <svg className="h-10 w-10 text-red-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <span className="max-w-[200px] truncate text-xs font-bold text-slate-600">{file?.name}</span>
              <span className="text-[10px] text-slate-400">Klik untuk ganti</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 text-center">
              <svg className={`h-8 w-8 transition-colors ${isDragging ? 'text-emerald-400' : 'text-slate-300'}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-xs font-bold text-slate-400">Seret &amp; lepas file ke sini, atau <span className="text-emerald-500">klik untuk memilih</span></span>
              <span className="text-[10px] text-slate-300">JPG, PNG, WEBP, PDF &bull; Maks. 5 MB</span>
            </div>
          )}
        </div>

        {error && <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onCancel} disabled={isUploading} className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={isUploading || !file} className="flex-1 rounded-2xl bg-emerald-500 py-3 text-sm font-black text-white transition-all hover:bg-emerald-600 shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed">
            {isUploading ? 'Mengunggah...' : 'Tandai Selesai ✓'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal: Alasan Penolakan ──────────────────────────────────────────────────
function RejectModal({
  open, onConfirm, onCancel,
}: {
  open: boolean; onConfirm: (note: string) => void; onCancel: () => void;
}) {
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { if (!open) { setNote(''); setError(''); } }, [open]);

  const handleSubmit = () => {
    if (!note.trim()) { setError('Alasan penolakan wajib diisi.'); return; }
    onConfirm(note.trim());
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
          <svg className="h-7 w-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="mb-1 text-xl font-black text-[#2A2A2A]">Tolak Pencairan Dana</h3>
        <p className="mb-6 text-sm text-slate-500">Berikan alasan yang jelas kepada vendor mengapa pencairan ini ditolak.</p>
        <div className="mb-7">
          <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">Alasan Penolakan</label>
          <textarea
            value={note}
            onChange={(e) => { setNote(e.target.value); setError(''); }}
            rows={3}
            placeholder="Contoh: Rekening tujuan tidak valid atau data tidak sesuai..."
            className={`w-full resize-none rounded-2xl border-2 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-[#2A2A2A] placeholder:text-slate-300 focus:outline-none transition-all ${
              error ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-slate-200 focus:border-red-400 focus:bg-white'
            }`}
          />
          {error && <p className="mt-2 text-xs font-semibold text-red-500">{error}</p>}
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50">
            Batal
          </button>
          <button onClick={handleSubmit} className="flex-1 rounded-2xl bg-red-500 py-3 text-sm font-black text-white transition-all hover:bg-red-600 shadow-lg shadow-red-100">
            Tolak Pencairan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function AdminPencairanDanaPage() {
  const [items, setItems] = useState<WithdrawalItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'semua' | 'menunggu' | 'diproses' | 'selesai'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successModal, setSuccessModal] = useState<{show: boolean, message: string}>({ show: false, message: '' });

  const [confirmProcessModal, setConfirmProcessModal] = useState(false);
  const [proofModal, setProofModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllWithdrawals();
      const mapped = data.map((d: any) => ({
        id: d.id,
        vendor: d.vendor.businessName,
        vendorCode: `VDR-${d.vendorId.substring(0, 6).toUpperCase()}`,
        category: 'Vendor Layanan',
        bank: d.bankName,
        accountNumber: d.bankAccount,
        accountName: d.bankHolder,
        amount: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(d.amount),
        balance: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(d.vendor.balance || 0),
        commission: '- Rp 0',
        requestDate: new Date(d.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        requestTime: new Date(d.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        status: (d.status === 'PENDING' ? 'menunggu' : d.status === 'PROCESSING' ? 'diproses' : d.status === 'COMPLETED' ? 'selesai' : 'ditolak') as WithdrawalStatus,
        note: d.note || '',
        timeline: [],
      }));
      setItems(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const counts = useMemo(() => ({
    semua: items.length,
    menunggu: items.filter((i) => i.status === 'menunggu').length,
    diproses: items.filter((i) => i.status === 'diproses').length,
    selesai: items.filter((i) => i.status === 'selesai').length,
  }), [items]);

  const filteredItems = useMemo(() => {
    const base = activeFilter === 'semua' ? items : items.filter((i) => i.status === activeFilter);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (i) => i.vendor.toLowerCase().includes(q) || i.accountNumber.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)
    );
  }, [items, activeFilter, searchQuery]);

  const handleProses = (id: string) => { setPendingActionId(id); setConfirmProcessModal(true); };
  const handleSelesai = (id: string) => { setPendingActionId(id); setProofModal(true); };
  const handleTolak = (id: string) => { setPendingActionId(id); setRejectModal(true); };

  const execUpdate = async (backendStatus: string, proofUrl?: string, note?: string) => {
    if (!pendingActionId) return;
    try {
      await processWithdrawal(pendingActionId, { status: backendStatus as any, proofUrl, note });
      await loadData();
      const label = backendStatus === 'PROCESSING' ? 'diproses' : backendStatus === 'COMPLETED' ? 'selesai' : 'ditolak';
      setSuccessModal({ show: true, message: `Pencairan dana berhasil diperbarui menjadi ${label}.` });
      setSelectedId(null);
    } catch (error) {
      console.error(error);
      alert('Gagal memproses pencairan dana');
    } finally {
      setPendingActionId(null);
    }
  };

  return (
    <div>
      <AdminHeader hideSearch />

      {/* ─── Modals ──────────────────────────────────────────────────────────── */}
      <ConfirmModal
        open={confirmProcessModal}
        title="Proses Pencairan Dana?"
        description="Anda akan mengubah status pencairan ini menjadi 'Diproses'. Pastikan Anda sudah mengecek data rekening tujuan vendor sebelum melanjutkan."
        confirmLabel="Ya, Proses Sekarang"
        confirmClass="bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-100"
        onConfirm={() => { setConfirmProcessModal(false); execUpdate('PROCESSING'); }}
        onCancel={() => { setConfirmProcessModal(false); setPendingActionId(null); }}
      />
      <ProofModal
        open={proofModal}
        onConfirm={(url) => { setProofModal(false); execUpdate('COMPLETED', url); }}
        onCancel={() => { setProofModal(false); setPendingActionId(null); }}
      />
      <RejectModal
        open={rejectModal}
        onConfirm={(note) => { setRejectModal(false); execUpdate('REJECTED', undefined, note); }}
        onCancel={() => { setRejectModal(false); setPendingActionId(null); }}
      />

      <div className="min-h-screen bg-[#FDF1F0] px-8 py-5 text-[#2A2A2A]">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2A2A2A]/40">Pantau proses pencairan mitra</span>
            <h1 className="text-2xl xl:text-3xl font-black tracking-tight text-[#2A2A2A]">Pencairan Dana</h1>
          </div>

          <div className="space-y-5">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-4">
              {[
                { key: 'semua', label: 'SEMUA', value: counts.semua },
                { key: 'menunggu', label: 'MENUNGGU', value: counts.menunggu },
                { key: 'diproses', label: 'DALAM PROSES', value: counts.diproses },
                { key: 'selesai', label: 'SELESAI', value: counts.selesai },
              ].map((tab) => {
                const active = activeFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key as typeof activeFilter)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                      active ? 'bg-[#FF9A9E] text-white shadow-[0_8px_24px_-6px_rgba(255,94,126,0.24)]' : 'bg-white text-[#A8A8A8] border border-[#F4D7D4]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`${active ? 'bg-white text-[#FF5E7E]' : 'bg-[#F4F4F6] text-[#A8A8A8]'} w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-bold`}>{tab.value}</span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="flex h-12 items-center gap-3 rounded-xl border border-[#F4D7D4] bg-white px-4 shadow-sm">
              <SearchIcon className="h-4 w-4 shrink-0 text-[#A8A8A8]" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari vendor..." className="w-full bg-transparent text-sm font-semibold text-[#2A2A2A] placeholder:text-[#A8A8A8] focus:outline-none" />
            </div>

            <div className="grid gap-3 lg:grid-cols-12 items-start">
              {/* Table */}
              <div className={`self-start overflow-hidden rounded-2xl border border-[#F4D7D4] bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] ${selectedId ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
                <table className="w-full table-fixed border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#F4D7D4]/60 bg-[#FAFAFC] text-[10px] font-black uppercase tracking-widest text-[#A8A8A8]">
                      <th className="px-6 py-5">No. Pencairan</th>
                      <th className="px-6 py-5">Vendor</th>
                      <th className="px-6 py-5">Total Pencairan</th>
                      <th className="px-6 py-5">Metode</th>
                      <th className="px-6 py-5">Rekening Tujuan</th>
                      <th className="px-6 py-5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4D7D4]/40">
                    {isLoading ? (
                      <tr><td colSpan={6} className="px-6 py-20 text-center text-xs font-bold uppercase tracking-widest text-slate-300">Memuat data...</td></tr>
                    ) : filteredItems.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-20 text-center text-xs font-bold uppercase tracking-widest text-slate-300">Tidak ada antrean pencairan</td></tr>
                    ) : filteredItems.map((item) => (
                      <tr key={item.id} onClick={() => setSelectedId(item.id)} className={`cursor-pointer bg-white hover:bg-[#FAFAFC] ${selectedId === item.id ? 'bg-[#FFF5F6]' : ''}`}>
                        <td className="px-6 py-3 align-middle">
                          <div className="break-words text-xs font-black leading-tight tracking-widest uppercase text-[#2A2A2A]">{formatWithdrawalNumber(item.id)}</div>
                          <div className="mt-1 text-[8px] font-medium uppercase tracking-wider text-[#2A2A2A]/30">{item.vendorCode}</div>
                        </td>
                        <td className="px-6 py-3 align-middle">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0A0A0A] text-[10px] font-extrabold text-white">{item.vendor.split(' ').slice(0, 2).map((w) => w.charAt(0)).join('')}</div>
                            <div>
                              <div className="text-xs font-black text-[#2A2A2A]">{item.vendor}</div>
                              <div className="text-[9px] font-bold text-slate-400">{item.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 align-middle">
                          <div className="whitespace-nowrap text-sm font-black text-[#2A2A2A]">{item.amount}</div>
                          <div className="text-[9px] font-bold text-[#A8A8A8]">Komisi {item.commission}</div>
                        </td>
                        <td className="px-6 py-3 align-middle">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#2A2A2A]/60">Transfer Bank</div>
                        </td>
                        <td className="px-6 py-3 align-middle">
                          <div className="text-xs font-black text-[#2A2A2A]">{item.accountNumber}</div>
                          <div className="text-[9px] font-bold text-slate-400">a.n {item.accountName}</div>
                        </td>
                        <td className="w-[96px] px-2 py-3 align-middle">
                          <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${
                            item.status === 'selesai' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : item.status === 'ditolak' ? 'bg-rose-50 text-rose-600 border border-rose-100'
                            : 'bg-orange-50 text-orange-600 border border-orange-100'
                          }`}>
                            {item.status === 'menunggu' ? 'Menunggu' : item.status === 'diproses' ? 'Diproses' : item.status === 'selesai' ? 'Selesai' : 'Ditolak'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-between gap-4 border-t border-[#F4D7D4] bg-white p-6">
                  <span className="text-xs font-bold text-slate-400">Menampilkan {filteredItems.length} dari {items.length} data</span>
                  <div className="flex items-center gap-1.5">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">‹</button>
                    <button className="h-8 w-8 rounded-lg bg-[#FF9A9E] text-xs font-black text-white">1</button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">›</button>
                  </div>
                  <select className="rounded-xl border border-slate-200 bg-white py-2 pl-4 pr-8 text-xs font-semibold text-slate-500 focus:outline-none">
                    <option>10 / halaman</option>
                  </select>
                </div>
              </div>

              {/* Detail Panel */}
              <div className={`self-start overflow-hidden rounded-2xl border border-[#F4D7D4] bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] ${selectedId ? 'block lg:col-span-4' : 'hidden'}`}>
                {selectedId && (() => {
                  const sel = items.find((i) => i.id === selectedId)!;
                  if (!sel) return null;
                  const parseNumber = (s: string) => Number(String(s).replace(/[^0-9]/g, '')) || 0;
                  const totalNum = parseNumber(sel.amount);
                  const commission = Math.round(totalNum * 0.05);
                  const danaDicairkan = totalNum - commission;
                  const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

                  return (
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <h4 className="text-lg font-black">Detail Pencairan</h4>
                        <button onClick={() => setSelectedId(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-50">✕</button>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-[#0A0A0A] flex items-center justify-center text-white font-black text-sm">{sel.vendor.split(' ').slice(0,2).map(w => w.charAt(0)).join('')}</div>
                        <div>
                          <div className="text-sm font-black">{sel.vendor}</div>
                          <div className="mt-1 text-[10px] text-slate-400">{sel.vendorCode}</div>
                        </div>
                        <div className="ml-auto">
                          <StatusBadge
                            text={sel.status === 'menunggu' ? 'Siap Dicairkan' : sel.status === 'diproses' ? 'Diproses' : 'Selesai'}
                            variant={sel.status === 'selesai' ? 'emerald' : 'blue'}
                            rounded="md"
                          />
                        </div>
                      </div>

                      <hr className="my-5 border-t border-[#F4F4F6]" />

                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#A8A8A8]">Informasi Pencairan</p>
                      <div className="mt-3 space-y-3">
                        <DetailRow label="No. Pencairan" value={formatWithdrawalNumber(sel.id)} />
                        <DetailRow label="Vendor" value={sel.vendor} />
                        <DetailRow label="Total Pencairan" value={fmt(totalNum)} />
                        <DetailRow label="Saldo Vendor" value={sel.balance} />
                        <DetailRow label="Metode Pencairan" value={`BANK ${sel.bank}`} />
                      </div>

                      <div className="mt-5">
                        <h5 className="text-sm font-black">Rekening Tujuan</h5>
                        <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                          <div className="font-bold">{sel.bank} - {sel.accountNumber}</div>
                          <div className="text-xs text-slate-500 mt-1">a.n {sel.accountName}</div>
                        </div>
                      </div>

                      <div className="mt-5">
                        <h5 className="text-sm font-black">Rincian Dana</h5>
                        <div className="mt-3 space-y-2">
                          <DetailRow label="Total Pesanan" value={fmt(totalNum)} />
                          <DetailRow label="Komisi Platform (5%)" value={fmt(commission)} />
                          <DetailRow label="Dana Dicairkan" value={fmt(danaDicairkan)} highlight />
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                        {sel.status === 'menunggu' && (
                          <button onClick={() => handleProses(sel.id)} className="w-full rounded-full bg-blue-500 px-4 py-2.5 text-sm font-black text-white hover:bg-blue-600 transition-all">
                            Proses Sekarang
                          </button>
                        )}
                        {sel.status === 'diproses' && (
                          <>
                            <button onClick={() => handleTolak(sel.id)} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold hover:bg-slate-50 transition-all">
                              Batalkan
                            </button>
                            <button onClick={() => handleSelesai(sel.id)} className="ml-auto rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-black text-white hover:bg-emerald-600 transition-all">
                              Tandai Selesai &amp; Unggah Bukti
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {successModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-8 w-8 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="mb-2 text-xl font-black text-[#2A2A2A]">Berhasil!</h3>
            <p className="mb-6 text-sm font-semibold text-slate-500">{successModal.message}</p>
            <button onClick={() => setSuccessModal({ show: false, message: '' })} className="w-full rounded-2xl bg-[#FF9A9E] py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-[#FF5E7E] transition-colors">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, highlight = false, danger = false }: { label: string; value: string; highlight?: boolean; danger?: boolean }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 text-xs">
      <span className="font-bold text-[#A8A8A8]">{label}</span>
      <span className={`text-right font-black ${highlight ? 'text-[#FF9A9E]' : danger ? 'text-red-500' : 'text-[#2A2A2A]'}`}>{value}</span>
    </div>
  );
}
