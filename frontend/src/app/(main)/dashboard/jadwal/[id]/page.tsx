'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../DashboardLayout';
import { vendorOrders, type OrderStatus } from '@/lib/orders';
import Link from 'next/link';
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  CheckCircle,
  Clock,
  Download,
  FileText,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case 'Menunggu':
      return { bg: 'bg-[#FCE6E3]', text: 'text-[#FF527B]', icon: AlertCircle };
    case 'Dikonfirmasi':
      return { bg: 'bg-[#FFF9E5]', text: 'text-[#F59E0B]', icon: Clock };
    case 'Selesai':
      return { bg: 'bg-[#E6F9F0]', text: 'text-[#10B981]', icon: CheckCircle };
  }
}

export default function PesananDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.id as string;
  const decodedOrderId = typeof orderId === 'string' ? decodeURIComponent(orderId) : orderId;
  const viewParam = searchParams.get('view');
  const backHref = viewParam === 'calendar' ? '/dashboard/jadwal?view=calendar' : '/dashboard/jadwal?view=list';

  const order = vendorOrders.find((o) => o.id === decodedOrderId);

  if (!order) {
    return (
      <DashboardLayout>
        <div className="p-12 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-black text-[#2A2A2A] mb-4">Pesanan Tidak Ditemukan</h1>
            <p className="text-[#2A2A2A]/40 mb-8">Pesanan dengan ID {decodedOrderId} tidak ada.</p>
            <Link
              href={backHref}
              className="px-8 py-3 bg-[#FF9A9E] text-white rounded-xl font-black uppercase tracking-widest hover:bg-[#FF527B] transition-all"
            >
              Kembali ke Pesanan
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statusInfo = getStatusColor(order.status);
  const StatusIcon = statusInfo.icon;

  const parseRupiah = (value: string) => Number(value.replace(/[^0-9]/g, '')) || 0;
  const totalHarga = parseRupiah(order.amount);
  const komisi = Math.round(totalHarga * 0.05);
  const pendapatanVendor = totalHarga - komisi;

  const handleDownload = () => {
    if (!order) return;
    const data = JSON.stringify(order, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.id.replace(/[^a-z0-9_-]/gi, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link
              href={backHref}
              className="w-12 h-12 bg-white border border-[#2A2A2A]/5 rounded-2xl flex items-center justify-center text-[#2A2A2A]/30 hover:bg-[#FF9A9E] hover:text-white transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl md:text-[34px] font-black tracking-tight text-[#2A2A2A]">{order.id}</h1>
              <p className="text-[#2A2A2A]/40 text-xs font-bold uppercase tracking-[0.25em] mt-1">Detail rincian operasional vendor</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownload}
              className="bg-white border border-[#2A2A2A]/5 text-[#2A2A2A] px-6 py-4 rounded-[20px] font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4 text-[#FF9A9E]" />
              Unduh Invoice
            </button>
            <div className="bg-[#2A2A2A] text-white px-6 py-4 rounded-[20px] font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg">
              <ShieldCheck className="w-4 h-4 text-[#FF9A9E]" />
              Dana aman di escrow admin
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-[32px] border border-[#2A2A2A]/5 shadow-sm space-y-10">
              <div className="flex items-center gap-6 pb-10 border-b border-slate-50">
                <div className="w-24 h-24 rounded-[32px] overflow-hidden shadow-sm flex-shrink-0">
                  <img src={order.img} className="w-full h-full object-cover" alt={order.name} />
                </div>
                <div>
                  <div className={`inline-block px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest mb-3 ${statusInfo.bg} ${statusInfo.text}`}>
                    {order.status === 'Menunggu' ? 'Menunggu Konfirmasi' : order.status === 'Dikonfirmasi' ? 'Berlangsung (Menunggu Hari H)' : 'Selesai'}
                  </div>
                  <h2 className="text-2xl font-black text-[#2A2A2A] leading-tight">{order.name}</h2>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#FDF1F0] rounded-xl flex items-center justify-center text-[#FF9A9E] flex-shrink-0">
                      <CalendarDays className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#2A2A2A]/20 uppercase tracking-widest mb-1">Tanggal Acara</p>
                      <p className="text-sm font-bold text-[#2A2A2A]">{order.date}</p>
                      <p className="text-xs text-slate-400 mt-1">{order.time} WIB</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#FDF1F0] rounded-xl flex items-center justify-center text-[#FF9A9E] flex-shrink-0">
                      <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#2A2A2A]/20 uppercase tracking-widest mb-1">Lokasi Acara</p>
                      <p className="text-sm font-bold text-[#2A2A2A] leading-relaxed">{order.location}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#FDF1F0] rounded-xl flex items-center justify-center text-[#FF9A9E] flex-shrink-0">
                      <Briefcase className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#2A2A2A]/20 uppercase tracking-widest mb-1">Paket Layanan</p>
                      <p className="text-sm font-bold text-[#2A2A2A]">{order.package}</p>
                      <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">{order.type}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#FDF1F0] rounded-xl flex items-center justify-center text-[#FF9A9E] flex-shrink-0">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#2A2A2A]/20 uppercase tracking-widest mb-1">Catatan Klien</p>
                      <p className="text-sm font-medium text-slate-500 italic">Tema Rose Gold & Putih. Mohon siapkan dekor yang lembut dan elegan.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[32px] border border-[#2A2A2A]/5 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-[10px] font-black text-[#2A2A2A]/20 uppercase tracking-[0.3em]">Ringkasan Pembagian Dana</h4>
                <span className="text-[9px] font-black text-[#FF9A9E] px-3 py-1 bg-[#FDF1F0] rounded-full uppercase">Skema Komisi 5%</span>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                  <span>Total Harga Paket (Dibayar Customer)</span>
                  <span className="text-[#2A2A2A]">{order.amount}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                  <span>Potongan Komisi Planora (5%)</span>
                  <span className="text-red-400">- Rp {komisi.toLocaleString('id-ID')}</span>
                </div>
                <div className="pt-6 border-t border-slate-50 flex justify-between items-center gap-4">
                  <div>
                    <span className="text-lg font-black text-[#2A2A2A]">Estimasi Pendapatan Vendor</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Akan dicairkan admin setelah acara selesai</p>
                  </div>
                  <span className="text-2xl md:text-3xl font-black text-[#FF527B]">Rp {pendapatanVendor.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="mt-12 p-8 bg-[#F7F9FC] rounded-[32px] border border-slate-100 flex items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm">
                    <Clock className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Pencairan Dana</p>
                    <h5 className="text-base font-black text-slate-600 uppercase">Ditahan oleh Admin (Escrow)</h5>
                  </div>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-[9px] font-bold text-slate-400 leading-relaxed max-w-[200px]">
                    Dana aman di sistem Planora dan akan dilepaskan ke saldo vendor setelah konfirmasi selesai oleh admin.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8 animate-in slide-in-from-bottom-6 duration-1000">
            <div className="bg-[#2A2A2A] p-10 rounded-[32px] text-white shadow-sm border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 opacity-50" />
              <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em] mb-10 relative z-10">Data Klien</p>

              <div className="flex flex-col items-center text-center space-y-6 relative z-10 mb-12">
                <div className="w-28 h-28 rounded-[36px] overflow-hidden border-4 border-white/5 shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt={order.client} />
                </div>
                <div>
                  <h5 className="text-2xl font-black tracking-tight mb-1">{order.client}</h5>
                  <p className="text-[10px] font-black text-[#FF9A9E] uppercase tracking-[0.15em]">Pelanggan Terverifikasi</p>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4 text-sm font-bold opacity-60">
                  <Phone className="w-4.5 h-4.5 text-[#FF9A9E]" />
                  <span>+62 812-3456-7890</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-bold opacity-60">
                  <Mail className="w-4.5 h-4.5 text-[#FF9A9E]" />
                  <span>andini.putri@email.com</span>
                </div>

                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full mt-6 bg-white/10 border border-white/10 hover:bg-white/20 text-white py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  Hubungi Klien
                </a>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[32px] border border-[#2A2A2A]/5 shadow-sm space-y-8">
              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 bg-[#FCE6E3] rounded-[24px] flex items-center justify-center text-[#FF527B] flex-shrink-0">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div>
                  <h5 className="text-base font-black text-[#2A2A2A] uppercase tracking-tight">Hanya Melihat</h5>
                  <p className="text-[11px] font-medium text-slate-500 leading-relaxed mt-2">
                    Status pembayaran dan verifikasi data transaksi dikelola sepenuhnya oleh Admin Planora. Hubungi admin jika ada ketidaksesuaian data.
                  </p>
                </div>
              </div>

              <button className="w-full bg-[#2A2A2A] text-white py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10 cursor-pointer">
                Hubungi Admin
              </button>
            </div>

            <div className="px-6 text-center opacity-30">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] leading-relaxed">
                TRANSAKSI ANDA DILINDUNGI OLEH <br /> SISTEM KEAMANAN PLANORA ESCROW.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
