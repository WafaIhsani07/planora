'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '../../DashboardLayout';
import { ChevronLeft, Clock, User, Package, FileText, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type OrderStatus = 'Menunggu' | 'Dikonfirmasi' | 'Selesai';
type PaymentStatus = 'menunggu' | 'dikonfirmasi' | 'selesai';

interface Order {
  id: string;
  name: string;
  client: string;
  date: string;
  time: string;
  package: string;
  type: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  amount: string;
  img: string;
}

const mockOrders: Order[] = [
  {
    id: '#PLR-240512-001',
    name: 'Pernikahan A & D',
    client: 'Andini Putri',
    date: '12 Mei 2026',
    time: '08.00 - 16.00',
    package: 'Paket Dekorasi',
    type: 'Premium',
    status: 'Menunggu',
    paymentStatus: 'menunggu',
    amount: 'Rp 8.500.000',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: '#PLR-240511-002',
    name: 'Lamaran R & S',
    client: 'Raka Pratama',
    date: '11 Mei 2026',
    time: '13.00 - 17.00',
    package: 'Paket Dekorasi',
    type: 'Standard',
    status: 'Dikonfirmasi',
    paymentStatus: 'dikonfirmasi',
    amount: 'Rp 5.250.000',
    img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: '#PLR-240509-003',
    name: 'Pernikahan M & F',
    client: 'Farah Quinn',
    date: '9 Mei 2026',
    time: '08.00 - 15.00',
    package: 'Paket Dekorasi',
    type: 'Premium',
    status: 'Selesai',
    paymentStatus: 'selesai',
    amount: 'Rp 12.000.000',
    img: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: '#PLR-240507-004',
    name: 'Ulang Tahun Aisyah',
    client: 'Budi Santoso',
    date: '7 Mei 2026',
    time: '16.00 - 20.00',
    package: 'Paket Dekorasi',
    type: 'Basic',
    status: 'Menunggu',
    paymentStatus: 'menunggu',
    amount: 'Rp 2.000.000',
    img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: '#PLR-240505-005',
    name: 'Pernikahan B & C',
    client: 'Cindy Kusuma',
    date: '5 Mei 2026',
    time: '10.00 - 18.00',
    package: 'Paket Dekorasi',
    type: 'Premium',
    status: 'Selesai',
    paymentStatus: 'selesai',
    amount: 'Rp 10.500.000',
    img: 'https://images.unsplash.com/photo-1478098711619-69891b0ec21a?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: '#PLR-240520-006',
    name: 'Aqiqah Rafasya',
    client: 'Agus Rahman',
    date: '20 Mei 2026',
    time: '09.00 - 13.00',
    package: 'Paket Dekorasi',
    type: 'Standard',
    status: 'Dikonfirmasi',
    paymentStatus: 'dikonfirmasi',
    amount: 'Rp 4.750.000',
    img: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: '#PLR-240525-007',
    name: 'Resepsi Nikah I & M',
    client: 'Irene Gunawan',
    date: '25 Mei 2026',
    time: '18.00 - 23.00',
    package: 'Paket Dekorasi',
    type: 'Premium',
    status: 'Selesai',
    paymentStatus: 'selesai',
    amount: 'Rp 15.000.000',
    img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=100',
  },
];

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
  const router = useRouter();
  const orderId = params.id as string;

  const order = mockOrders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <DashboardLayout>
        <div className="p-12 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-black text-[#2A2A2A] mb-4">Pesanan Tidak Ditemukan</h1>
            <p className="text-[#2A2A2A]/40 mb-8">Pesanan dengan ID {orderId} tidak ada.</p>
            <Link
              href="/dashboard/jadwal"
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Header dengan Back Button */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard/jadwal"
            className="flex items-center gap-3 text-[#2A2A2A]/60 hover:text-[#2A2A2A] transition-all group"
          >
            <div className="p-2.5 rounded-lg bg-[#FDF1F0] group-hover:bg-[#FCE6E3]">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <span className="font-black text-sm uppercase tracking-widest">Kembali</span>
          </Link>
          <h1 className="text-3xl font-black text-[#2A2A2A]">Detail Pesanan</h1>
          <div className="w-20" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image dan Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Section */}
            <div className="relative rounded-[40px] overflow-hidden shadow-lg h-96 bg-gradient-to-br from-[#FF9A9E] to-[#FF527B]">
              <img
                src={order.img}
                alt={order.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <div className={`flex items-center gap-2.5 px-5 py-3 rounded-full font-black text-sm uppercase tracking-wider ${statusInfo.bg} ${statusInfo.text}`}>
                  <StatusIcon className="w-4 h-4" />
                  {order.status}
                </div>
              </div>
            </div>

            {/* Order Title and ID */}
            <div>
              <h2 className="text-4xl font-black text-[#2A2A2A] mb-3">{order.name}</h2>
              <p className="text-sm font-bold text-[#2A2A2A]/30 uppercase tracking-[0.15em]">{order.id}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Detail Item: Date */}
              <div className="bg-[#FDF1F0] rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-white rounded-xl">
                    <FileText className="w-5 h-5 text-[#FF527B]" />
                  </div>
                  <span className="text-[10px] font-black text-[#2A2A2A]/30 uppercase tracking-widest">Tanggal Acara</span>
                </div>
                <p className="text-2xl font-black text-[#2A2A2A] mb-1">{order.date}</p>
                <p className="text-sm font-bold text-[#2A2A2A]/60 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {order.time}
                </p>
              </div>

              {/* Detail Item: Client */}
              <div className="bg-[#FFF9E5] rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-white rounded-xl">
                    <User className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                  <span className="text-[10px] font-black text-[#2A2A2A]/30 uppercase tracking-widest">Klien</span>
                </div>
                <p className="text-2xl font-black text-[#2A2A2A]">{order.client}</p>
              </div>

              {/* Detail Item: Package */}
              <div className="bg-[#E6F9F0] rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-white rounded-xl">
                    <Package className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <span className="text-[10px] font-black text-[#2A2A2A]/30 uppercase tracking-widest">Paket</span>
                </div>
                <p className="text-2xl font-black text-[#2A2A2A] mb-1">{order.package}</p>
                <p className="text-sm font-bold text-[#2A2A2A]/60">{order.type}</p>
              </div>

              {/* Detail Item: Amount */}
              <div className="bg-[#FCE6E3] rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-white rounded-xl">
                    <DollarSign className="w-5 h-5 text-[#FF527B]" />
                  </div>
                  <span className="text-[10px] font-black text-[#2A2A2A]/30 uppercase tracking-widest">Total Pembayaran</span>
                </div>
                <p className="text-2xl font-black text-[#2A2A2A]">{order.amount}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className={`rounded-[40px] p-8 text-center space-y-4 ${statusInfo.bg}`}>
              <StatusIcon className={`w-12 h-12 mx-auto ${statusInfo.text}`} />
              <div>
                <p className="text-[11px] font-black text-[#2A2A2A]/40 uppercase tracking-widest mb-2">Status Pesanan</p>
                <p className={`text-3xl font-black uppercase tracking-wider ${statusInfo.text}`}>{order.status}</p>
              </div>
            </div>

            {/* Payment Status Card */}
            <div className="bg-white border-2 border-[#2A2A2A]/5 rounded-[40px] p-8 space-y-4">
              <h3 className="text-[11px] font-black text-[#2A2A2A]/30 uppercase tracking-widest">Status Pembayaran</h3>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${
                order.paymentStatus === 'menunggu'
                  ? 'bg-[#FCE6E3] text-[#FF527B]'
                  : order.paymentStatus === 'dikonfirmasi'
                    ? 'bg-[#FFF9E5] text-[#F59E0B]'
                    : 'bg-[#E6F9F0] text-[#10B981]'
              } font-bold text-sm`}>
                <div className="w-2 h-2 rounded-full bg-current" />
                <span className="capitalize">{order.paymentStatus === 'menunggu' ? 'Menunggu Verifikasi' : order.paymentStatus === 'dikonfirmasi' ? 'Sudah Dikonfirmasi' : 'Pembayaran Selesai'}</span>
              </div>
              <p className="text-[11px] font-bold text-[#2A2A2A]/50 leading-relaxed">
                {order.paymentStatus === 'menunggu' && 'Pembayaran Anda sedang menunggu verifikasi dari admin.'}
                {order.paymentStatus === 'dikonfirmasi' && 'Pembayaran Anda telah dikonfirmasi. Event siap dilaksanakan.'}
                {order.paymentStatus === 'selesai' && 'Pembayaran telah selesai. Terima kasih atas kepercayaan Anda!'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button className="w-full px-6 py-4 bg-[#FF9A9E] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#FF527B] transition-all shadow-lg hover:shadow-xl">
                Hubungi Vendor
              </button>
              <button className="w-full px-6 py-4 bg-white border-2 border-[#2A2A2A]/5 text-[#2A2A2A] rounded-2xl font-black uppercase tracking-widest hover:bg-[#FDF1F0] transition-all">
                Lihat Portofolio
              </button>
              {order.status === 'Menunggu' && (
                <button className="w-full px-6 py-4 bg-white border-2 border-[#FF527B] text-[#FF527B] rounded-2xl font-black uppercase tracking-widest hover:bg-[#FCE6E3] transition-all">
                  Batalkan Pesanan
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Timeline / Description Section */}
        <div className="bg-white border-2 border-[#2A2A2A]/5 rounded-[40px] p-8">
          <h3 className="text-xl font-black text-[#2A2A2A] mb-6 uppercase tracking-widest">Detail Layanan</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-[#2A2A2A]/5 last:border-b-0">
              <div className="flex-shrink-0 w-4 h-4 mt-2 rounded-full bg-[#FF9A9E]" />
              <div>
                <p className="font-black text-[#2A2A2A] text-sm mb-1">Paket {order.type}</p>
                <p className="text-[12px] text-[#2A2A2A]/60">{order.package} - {order.type}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-[#2A2A2A]/5 last:border-b-0">
              <div className="flex-shrink-0 w-4 h-4 mt-2 rounded-full bg-[#FF9A9E]" />
              <div>
                <p className="font-black text-[#2A2A2A] text-sm mb-1">Lokasi Acara</p>
                <p className="text-[12px] text-[#2A2A2A]/60">Akan dikonfirmasi setelah pembayaran</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-4 h-4 mt-2 rounded-full bg-[#FF9A9E]" />
              <div>
                <p className="font-black text-[#2A2A2A] text-sm mb-1">Revisi & Konsultasi</p>
                <p className="text-[12px] text-[#2A2A2A]/60">Unlimited revisi sampai Anda puas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
