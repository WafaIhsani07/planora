'use client';

import { useMemo, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminPagination from '@/components/admin/AdminPagination';
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

const DUMMY_WITHDRAWALS: WithdrawalItem[] = [
  {
    id: 'WD/2026/05/018',
    vendor: 'Wafa Decoration',
    vendorCode: 'VDR-240518-001',
    category: 'Dekorasi',
    bank: 'BCA',
    accountNumber: '8832 **** 1290',
    accountName: 'Wafa Decoration',
    amount: 'Rp 4.250.000',
    balance: 'Rp 4.450.000',
    commission: '- Rp 200.000',
    requestDate: '18 Mei 2026',
    requestTime: '10:30 WIB',
    status: 'menunggu',
    note: 'Menunggu konfirmasi transfer dari admin.',
    timeline: [{ time: '18 Mei 2026, 10:30 WIB', title: 'Pengajuan masuk', description: 'Vendor mengajukan pencairan dana.' }],
  },
  {
    id: 'WD/2026/05/017',
    vendor: 'Lumière Decoration',
    vendorCode: 'VDR-240518-002',
    category: 'Dekorasi',
    bank: 'BNI',
    accountNumber: '4567 **** 7890',
    accountName: 'Lumière Decoration',
    amount: 'Rp 8.500.000',
    balance: 'Rp 9.000.000',
    commission: '- Rp 500.000',
    requestDate: '18 Mei 2026',
    requestTime: '09:15 WIB',
    status: 'diproses',
    note: 'Sedang dalam proses pengecekan rekening tujuan.',
    timeline: [
      { time: '18 Mei 2026, 09:15 WIB', title: 'Pengajuan masuk', description: 'Vendor mengajukan pencairan dana.' },
      { time: '18 Mei 2026, 11:00 WIB', title: 'Diverifikasi admin', description: 'Data rekening sedang diproses.' },
    ],
  },
  {
    id: 'WD/2026/05/016',
    vendor: 'Eterna Photography',
    vendorCode: 'VDR-240517-003',
    category: 'Fotografi',
    bank: 'MANDIRI',
    accountNumber: '7890 **** 1122',
    accountName: 'Eterna Photography',
    amount: 'Rp 3.200.000',
    balance: 'Rp 3.360.000',
    commission: '- Rp 160.000',
    requestDate: '17 Mei 2026',
    requestTime: '16:45 WIB',
    status: 'selesai',
    note: 'Dana sudah berhasil ditransfer ke vendor.',
    timeline: [
      { time: '17 Mei 2026, 16:45 WIB', title: 'Pengajuan masuk', description: 'Vendor mengajukan pencairan dana.' },
      { time: '18 Mei 2026, 09:00 WIB', title: 'Selesai diproses', description: 'Dana berhasil dikirim ke rekening tujuan.' },
    ],
  },
];

const statusMap: Record<WithdrawalStatus, 'blue' | 'emerald' | 'red'> = {
  menunggu: 'blue',
  diproses: 'blue',
  selesai: 'emerald',
  ditolak: 'red',
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

export default function AdminPencairanDanaPage() {
  const [items, setItems] = useState<WithdrawalItem[]>(DUMMY_WITHDRAWALS);
  const [activeFilter, setActiveFilter] = useState<'semua' | 'menunggu' | 'diproses' | 'selesai'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [perPage, setPerPage] = useState<number>(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      semua: items.length,
      menunggu: items.filter((i) => i.status === 'menunggu').length,
      diproses: items.filter((i) => i.status === 'diproses').length,
      selesai: items.filter((i) => i.status === 'selesai').length,
      ditolak: items.filter((i) => i.status === 'ditolak').length,
    }),
    [items]
  );

  const filteredItems = useMemo(() => {
    const base = activeFilter === 'semua' ? items : items.filter((i) => i.status === activeFilter);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (i) => i.vendor.toLowerCase().includes(q) || i.accountNumber.toLowerCase().includes(q) || i.amount.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)
    );
  }, [items, activeFilter, searchQuery]);

  const total = items.length;
  const shown = filteredItems.length;
  const start = shown > 0 ? 1 : 0;
  const end = shown;

  const updateStatus = (id: string, status: WithdrawalStatus) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const selected = selectedId ? items.find((i) => i.id === selectedId) ?? null : null;
  const selectedTotals = selected
    ? (() => {
        const parseNumber = (s: string) => Number(String(s).replace(/[^0-9]/g, '')) || 0;
        const totalNum = parseNumber(selected.amount);
        const commission = Math.round(totalNum * 0.05);
        const danaDicairkan = totalNum - commission;
        const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
        return { totalNum, commission, danaDicairkan, fmt };
      })()
    : null;

  return (
    <div>
      <AdminHeader hideSearch />

      <div className="min-h-screen bg-[#FDF1F0] px-8 py-5 text-[#2A2A2A]">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2A2A2A]/40">Pantau proses pencairan mitra</span>
              <h1 className="text-2xl xl:text-3xl font-black tracking-tight text-[#2A2A2A]">Pencairan Dana</h1>
            </div>

            <div />
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-4 lg:gap-5 rounded-[2rem] bg-[#FDF1F0] p-0">
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
                    onClick={() => {
                      setActiveFilter(tab.key as typeof activeFilter);
                    }}
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

            <div className="mt-2">
              <div className="flex h-12 items-center gap-3 rounded-xl border border-[#F4D7D4] bg-white px-4 shadow-sm">
                <SearchIcon className="h-4 w-4 shrink-0 text-[#A8A8A8]" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari vendor..." className="w-full bg-transparent text-sm font-semibold text-[#2A2A2A] placeholder:text-[#A8A8A8] focus:outline-none" />
              </div>
            </div>

            <div className="mt-2 grid gap-3 lg:grid-cols-12 items-start">
              <div id="table-panel" className={`self-start overflow-hidden rounded-2xl border border-[#F4D7D4] bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] ${selectedId ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
                <table className="w-full table-fixed border-collapse text-left" style={{ willChange: 'transform', borderSpacing: 0 }}>
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
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center text-xs font-bold uppercase tracking-widest text-slate-300">Tidak ada antrean pencairan dalam kategori ini</td>
                      </tr>
                    ) : (
                      filteredItems.map((item) => (
                        <tr key={item.id} onClick={() => setSelectedId(item.id)} className={`cursor-pointer bg-white hover:bg-[#FAFAFC] transition-none ${selectedId === item.id ? 'bg-[#FFF5F6]' : ''}`}>
                          <td className="px-6 py-3 align-middle">
                            <div className="break-words text-xs font-black leading-tight tracking-widest uppercase text-[#2A2A2A]" title={item.id}>
                              {formatWithdrawalNumber(item.id)}
                            </div>
                            <div className="mt-1 text-[8px] font-medium uppercase tracking-wider text-[#2A2A2A]/30">{item.vendorCode}</div>
                          </td>

                          <td className="px-6 py-3 align-middle">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0A0A0A] text-[10px] font-extrabold text-white">{item.vendor.split(' ').slice(0, 2).map((w) => w.charAt(0)).join('')}</div>
                              <div className="overflow-hidden">
                                <div className="break-words text-xs font-black leading-tight text-[#2A2A2A]">{item.vendor}</div>
                                <div className="mt-0.5 break-words text-[9px] font-bold leading-tight text-slate-400">{item.category}</div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-3 align-middle">
                            <div className="whitespace-nowrap text-sm font-black text-[#2A2A2A]">{item.amount}</div>
                            <div className="mt-0.5 text-[9px] font-bold text-[#A8A8A8]">Komisi {item.commission}</div>
                          </td>

                          <td className="px-6 py-3 align-middle">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#2A2A2A]/60">Transfer Bank</div>
                          </td>

                          <td className="px-6 py-3 align-middle">
                            <div className="text-xs font-black text-[#2A2A2A]">{item.accountNumber}</div>
                            <div className="mt-0.5 text-[9px] font-bold text-slate-400">a.n {item.accountName}</div>
                          </td>

                          <td className="w-[96px] px-2 py-3 align-middle">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${
                                statusMap[item.status] === 'blue'
                                  ? 'bg-orange-50 text-orange-600 border border-orange-100'
                                  : statusMap[item.status] === 'emerald'
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  : 'bg-rose-50 text-rose-600 border border-rose-100'
                              }`}
                            >
                              {item.status === 'menunggu' ? 'Menunggu' : item.status === 'diproses' ? 'Diproses' : 'Selesai'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                <div className="flex flex-col items-center justify-between gap-4 border-t border-[#F4D7D4] bg-white p-6 sm:flex-row">
                  <span className="text-xs font-bold text-slate-400">Menampilkan 1 - {filteredItems.length} dari {filteredItems.length} data</span>
                  <div className="flex items-center gap-1.5">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-all hover:bg-slate-50">‹</button>
                    <button className="h-8 w-8 rounded-lg bg-[#FF9A9E] text-xs font-black text-white">1</button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-black text-slate-400 transition-all hover:bg-slate-50">2</button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-black text-slate-400 transition-all hover:bg-slate-50">3</button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-all hover:bg-slate-50">›</button>
                  </div>
                  <div className="relative">
                    <select className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-4 pr-10 text-xs font-semibold text-slate-500 focus:outline-none">
                      <option>10 / halaman</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</div>
                  </div>
                </div>
              </div>

              <div id="detail-panel" className={`self-start overflow-hidden rounded-2xl border border-[#F4D7D4] bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] ${selectedId ? 'block lg:col-span-4' : 'hidden'}`}>
                {selectedId && (() => {
                  const sel = items.find((i) => i.id === selectedId)!;
                  const parseNumber = (s: string) => Number(String(s).replace(/[^0-9]/g, '')) || 0;
                  const totalNum = parseNumber(sel.amount);
                  const commission = Math.round(totalNum * 0.05);
                  const danaDicairkan = totalNum - commission;
                  const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

                  return (
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-black">Detail Pencairan</h4>
                        </div>
                        <button onClick={() => setSelectedId(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-50">✕</button>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-[#0A0A0A] flex items-center justify-center text-white font-black">{sel.vendor.split(' ').slice(0,2).map(w => w.charAt(0)).join('')}</div>
                        <div>
                          <div className="text-sm font-black">{sel.vendor}</div>
                          <div className="mt-1 text-[10px] text-slate-400">{sel.vendorCode}</div>
                        </div>
                        <div className="ml-auto">
                          <StatusBadge text={sel.status === 'menunggu' ? 'Siap Dicairkan' : sel.status === 'diproses' ? 'Diproses' : 'Selesai'} variant={sel.status === 'selesai' ? 'emerald' : 'blue'} rounded="md" />
                        </div>
                      </div>

                      <hr className="my-5 border-t border-[#F4F4F6]" />

                      <SectionTitle title="Informasi Pencairan" />
                      <div className="mt-3 space-y-3">
                        <DetailRow label="No. Pencairan" value={formatWithdrawalNumber(sel.id)} />
                        <DetailRow label="Vendor" value={sel.vendor} />
                        <DetailRow label="Total Pencairan" value={fmt(totalNum)} />
                        <DetailRow label="Saldo Vendor" value={sel.balance} />
                        <DetailRow label="Metode Pencairan" value={sel.bank} />
                      </div>

                      <div className="mt-5">
                        <h5 className="text-sm font-black">Rekening Tujuan</h5>
                        <div className="mt-2 rounded-lg border border-slate-200 bg-white p-3 text-sm">
                          <div className="font-bold">{sel.bank} - {sel.accountNumber.replace(/\s\*/g, '')}</div>
                          <div className="text-xs text-slate-500 mt-1">a.n {sel.accountName}</div>
                        </div>
                      </div>

                      <div className="mt-5">
                        <h5 className="text-sm font-black">Rincian Pesanan</h5>
                        <div className="mt-3 space-y-2 text-sm">
                          <DetailRow label="Total Pesanan" value={fmt(totalNum)} />
                          <DetailRow label="Komisi Platform (5%)" value={fmt(commission)} />
                          <DetailRow label="Dana Dicairkan" value={fmt(danaDicairkan)} highlight={true} />
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <button onClick={() => { updateStatus(sel.id, 'ditolak'); setSelectedId(null); }} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold">Batalkan</button>
                        <button onClick={() => { updateStatus(sel.id, 'selesai'); setSelectedId(null); }} className="ml-auto rounded-full bg-emerald-500 px-4 py-2 text-sm font-black text-white">Proses Pencairan</button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="pt-1">
      <h5 className="text-[10px] font-black uppercase tracking-[0.22em] text-[#A8A8A8]">{title}</h5>
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
