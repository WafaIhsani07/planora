'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MessageCircle,
  ShieldCheck,
  FileText,
  AlertTriangle,
  UploadCloud,
  RefreshCw,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';
import {
  getBookingById,
  getPaymentByBookingId,
  updateBookingStatus,
  submitPaymentProof,
} from '@/services/bookings.service';
import toast from 'react-hot-toast';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;
  const decodedBookingId = typeof bookingId === 'string' ? decodeURIComponent(bookingId) : bookingId;

  const [booking, setBooking] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [completing, setCompleting] = useState(false);

  // Form states
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank');
  const [proofUrl, setProofUrl] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isExpired: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const bookingData = await getBookingById(decodedBookingId);
      setBooking(bookingData);

      const paymentData = await getPaymentByBookingId(decodedBookingId);
      setPayment(paymentData);
    } catch (error: any) {
      console.error('Gagal memuat detail booking:', error);
      toast.error('Gagal mengambil data pesanan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (decodedBookingId) {
      loadData();
    }
  }, [decodedBookingId]);

  // Countdown Timer effect
  useEffect(() => {
    if (!booking || booking.status !== 'PENDING' || (payment && payment.status !== 'PENDING')) return;

    const calculateTimeLeft = () => {
      const createdAtTime = new Date(booking.createdAt).getTime();
      const expirationTime = createdAtTime + 24 * 60 * 60 * 1000; // 24 jam
      const difference = expirationTime - Date.now();

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return true; // is expired
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds, isExpired: false });
      return false;
    };

    calculateTimeLeft();
    const interval = setInterval(() => {
      const expired = calculateTimeLeft();
      if (expired) {
        clearInterval(interval);
        // Refresh data to show expired status
        loadData();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking, payment]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofUrl) {
      toast.error('Harap masukkan URL bukti transfer.');
      return;
    }

    try {
      setSubmittingPayment(true);
      await submitPaymentProof(booking.id, paymentMethod, proofUrl);
      toast.success('Bukti pembayaran berhasil diunggah! Menunggu verifikasi Admin.');
      setProofUrl('');
      // Reload data
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengirim pembayaran.');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      setCancelling(true);
      await updateBookingStatus(booking.id, 'CANCELLED', cancelReason || 'Dibatalkan oleh pelanggan');
      toast.success('Pesanan berhasil dibatalkan.');
      setShowCancelModal(false);
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal membatalkan pesanan.');
    } finally {
      setCancelling(false);
    }
  };

  const handleCompleteBooking = async () => {
    if (!confirm('Apakah Anda yakin ingin mengonfirmasi bahwa acara/pesanan ini telah selesai? Tindakan ini akan melepaskan dana pembayaran ke saldo vendor dan tidak dapat dibatalkan.')) {
      return;
    }

    try {
      setCompleting(true);
      await updateBookingStatus(booking.id, 'COMPLETED');
      toast.success('Pemesanan berhasil diselesaikan. Dana telah diteruskan ke vendor.');
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyelesaikan pemesanan.');
    } finally {
      setCompleting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40" data-testid="loading-spinner">
        <RefreshCw className="w-12 h-12 text-[#FF9A9E] animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-[#2A2A2A]/40">Memuat Detail Booking...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-black text-[#2A2A2A] mb-4">Pesanan Tidak Ditemukan</h1>
        <p className="text-[#2A2A2A]/40 mb-8">Pesanan dengan ID {decodedBookingId} tidak terdaftar di sistem kami.</p>
        <Link
          href="/bookings"
          className="px-8 py-4 bg-[#FF9A9E] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#FF527B] transition-all"
        >
          Kembali ke Daftar Pesanan
        </Link>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Menunggu Pembayaran';
      case 'CONFIRMED': return 'Dikonfirmasi (Hari-H)';
      case 'IN_PROGRESS': return 'Sedang Berlangsung';
      case 'COMPLETED': return 'Selesai';
      case 'CANCELLED': return 'Dibatalkan';
      default: return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-[#FCE6E3] text-[#FF527B]';
      case 'CONFIRMED': return 'bg-[#FFF9E5] text-[#F59E0B]';
      case 'IN_PROGRESS': return 'bg-blue-50 text-blue-600';
      case 'COMPLETED': return 'bg-[#E6F9F0] text-[#10B981]';
      case 'CANCELLED': return 'bg-slate-100 text-slate-500';
      default: return 'bg-slate-50 text-slate-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Top Bar Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link
            href="/bookings"
            className="w-12 h-12 bg-white border border-[#2A2A2A]/5 rounded-2xl flex items-center justify-center text-[#2A2A2A]/30 hover:bg-[#FF9A9E] hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#2A2A2A]">
              Booking #{booking.id.substring(Math.max(0, booking.id.length - 8)).toUpperCase()}
            </h1>
            <p className="text-[#2A2A2A]/40 text-xs font-bold uppercase tracking-[0.2em] mt-1">
              Dipesan pada {formatDate(booking.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusStyle(booking.status)}`}>
            {getStatusLabel(booking.status)}
          </span>
          <div className="bg-white border border-[#2A2A2A]/5 text-[#2A2A2A]/40 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            Escrow Planora Aman
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column (Main Info, Tracker, Invoice) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Booking Details */}
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-[#2A2A2A]/5 shadow-sm space-y-8">
            <div className="flex items-start gap-5 pb-6 border-b border-slate-50">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-slate-100">
                <img
                  src={booking.layanan?.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=150'}
                  className="w-full h-full object-cover"
                  alt={booking.layanan?.name}
                />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#FF9A9E] uppercase tracking-wider mb-1">
                  Layanan Vendor
                </p>
                <h2 className="text-xl font-extrabold text-[#2A2A2A] leading-tight mb-1">
                  {booking.layanan?.name || 'Paket Layanan'}
                </h2>
                <p className="text-xs text-slate-500 font-semibold">
                  Oleh: {booking.vendor?.businessName || 'Nama Vendor'}
                </p>
              </div>
            </div>

            {/* Grid Detail Info */}
            <div className="grid md:grid-cols-2 gap-8 pt-2">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FDF1F0] rounded-xl flex items-center justify-center text-[#FF9A9E] flex-shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#2A2A2A]/20 uppercase tracking-widest mb-1">Tanggal Acara</p>
                    <p className="text-sm font-bold text-[#2A2A2A]">{formatDate(booking.eventDate)}</p>
                    <p className="text-xs text-slate-400 mt-1">Acara berlangsung seharian</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FDF1F0] rounded-xl flex items-center justify-center text-[#FF9A9E] flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#2A2A2A]/20 uppercase tracking-widest mb-1">Lokasi Acara</p>
                    <p className="text-sm font-bold text-[#2A2A2A] leading-relaxed">
                      {booking.eventAddress || 'Lokasi belum dispesifikasikan'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FDF1F0] rounded-xl flex items-center justify-center text-[#FF9A9E] flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#2A2A2A]/20 uppercase tracking-widest mb-1">Catatan Klien</p>
                    <p className="text-sm font-medium text-slate-500 italic">
                      {booking.notes || 'Tidak ada catatan tambahan untuk vendor.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Status Tracker */}
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-[#2A2A2A]/5 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-[#2A2A2A]/30 uppercase tracking-[0.25em]">Alur Proses Booking</h3>
            
            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              
              {/* Step 1: Dibuat */}
              <div className="relative flex gap-4">
                <div className="absolute -left-[27px] w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white border-4 border-white shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2A2A2A]">Pesanan Dibuat</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Permintaan pesanan berhasil dikirim ke sistem.</p>
                </div>
              </div>

              {/* Step 2: Pembayaran */}
              <div className="relative flex gap-4">
                <div className={`absolute -left-[27px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
                  payment?.status === 'PAID' || payment?.status === 'REFUNDED'
                    ? 'bg-emerald-500 text-white'
                    : payment?.status === 'FAILED'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  {payment?.status === 'PAID' || payment?.status === 'REFUNDED' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : payment?.status === 'FAILED' ? (
                    <XCircle className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2A2A2A]">Pembayaran Lunas</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {payment?.status === 'PAID'
                      ? 'Pembayaran lunas terverifikasi oleh Admin.'
                      : payment?.status === 'FAILED'
                      ? 'Verifikasi pembayaran ditolak oleh Admin.'
                      : payment?.status === 'REFUNDED'
                      ? 'Pesanan dibatalkan & dana berhasil direfund.'
                      : 'Menunggu transfer bukti bayar dari pelanggan.'}
                  </p>
                </div>
              </div>

              {/* Step 3: Acara */}
              <div className="relative flex gap-4">
                <div className={`absolute -left-[27px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
                  booking.status === 'CONFIRMED' || booking.status === 'IN_PROGRESS' || booking.status === 'COMPLETED'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  <Calendar className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2A2A2A]">Acara Dikonfirmasi</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {booking.status === 'CONFIRMED' || booking.status === 'IN_PROGRESS'
                      ? 'Pesanan dikonfirmasi, menunggu hari pelaksanaan acara.'
                      : booking.status === 'COMPLETED'
                      ? 'Acara selesai dilaksanakan.'
                      : 'Menunggu pelunasan pembayaran.'}
                  </p>
                </div>
              </div>

              {/* Step 4: Selesai */}
              <div className="relative flex gap-4">
                <div className={`absolute -left-[27px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
                  booking.status === 'COMPLETED'
                    ? 'bg-emerald-500 text-white'
                    : booking.status === 'CANCELLED'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  {booking.status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : booking.status === 'CANCELLED' ? (
                    <XCircle className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 opacity-40" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2A2A2A]">
                    {booking.status === 'CANCELLED' ? 'Pesanan Dibatalkan' : 'Pesanan Selesai'}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {booking.status === 'COMPLETED'
                      ? 'Layanan selesai dikerjakan, dana dilepaskan ke vendor.'
                      : booking.status === 'CANCELLED'
                      ? `Transaksi dibatalkan. Alasan: ${booking.cancelReason || '-'}`
                      : 'Proses akhir pesanan.'}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Pricing Invoice Summary */}
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-[#2A2A2A]/5 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-[#2A2A2A]/30 uppercase tracking-[0.25em]">Detail Pembayaran</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-400">
                <span>Harga Paket Layanan</span>
                <span className="text-[#2A2A2A]">{formatCurrency(booking.totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold text-slate-400">
                <span>Biaya Platform (Escrow)</span>
                <span className="text-emerald-500">Gratis (Escrow Aman)</span>
              </div>
              <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                <div>
                  <span className="text-base font-black text-[#2A2A2A]">Total Pembayaran</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">
                    Nominal pas yang harus ditransfer
                  </p>
                </div>
                <span className="text-2xl font-black text-[#FF527B]">{formatCurrency(booking.totalPrice)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Widget Timer, Bukti Transfer, Vendor Info, Cancel Button) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Countdown Timer Widget (If Unpaid) */}
          {booking.status === 'PENDING' && (!payment || payment.status === 'PENDING' || payment.status === 'FAILED') && (
            <div className="bg-gradient-to-tr from-[#FF527B] to-[#FF9A9E] text-white p-6 rounded-[32px] shadow-lg relative overflow-hidden space-y-5">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-90 relative z-10">
                <Clock className="w-4.5 h-4.5 animate-pulse" />
                Batas Waktu Pembayaran
              </div>

              {!timeLeft.isExpired ? (
                <div className="space-y-3 relative z-10">
                  <div className="flex gap-2 items-center">
                    <div className="bg-white/20 px-3.5 py-2.5 rounded-2xl text-xl font-black text-center min-w-[50px]">
                      {timeLeft.hours.toString().padStart(2, '0')}
                      <span className="block text-[8px] font-bold uppercase opacity-80 mt-0.5">Jam</span>
                    </div>
                    <span className="text-xl font-black">:</span>
                    <div className="bg-white/20 px-3.5 py-2.5 rounded-2xl text-xl font-black text-center min-w-[50px]">
                      {timeLeft.minutes.toString().padStart(2, '0')}
                      <span className="block text-[8px] font-bold uppercase opacity-80 mt-0.5">Menit</span>
                    </div>
                    <span className="text-xl font-black">:</span>
                    <div className="bg-white/20 px-3.5 py-2.5 rounded-2xl text-xl font-black text-center min-w-[50px]">
                      {timeLeft.seconds.toString().padStart(2, '0')}
                      <span className="block text-[8px] font-bold uppercase opacity-80 mt-0.5">Detik</span>
                    </div>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-95">
                    Harap segera selesaikan pembayaran dan unggah bukti transfer sebelum batas waktu habis untuk menghindari pembatalan otomatis oleh sistem.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 rounded-full text-[9px] font-black uppercase">
                    <XCircle className="w-3.5 h-3.5" /> Batas Waktu Habis
                  </div>
                  <h4 className="text-lg font-black leading-tight">Pesanan Telah Kedaluwarsa</h4>
                  <p className="text-[11px] opacity-90">
                    Sistem otomatis membatalkan pesanan ini karena melewati batas waktu pembayaran 24 jam.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Refund Details Widget */}
          {payment?.status === 'REFUNDED' && (
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-[#2A2A2A]/5 shadow-sm space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-[#E6F9F0] rounded-2xl flex items-center justify-center text-[#10B981] flex-shrink-0">
                  <CheckCircle2 className="w-6.5 h-6.5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#2A2A2A] uppercase tracking-tight">Dana Berhasil Direfund</h4>
                  <p className="text-[11px] font-semibold text-[#2A2A2A]/40 mt-1">
                    Refund diproses oleh Admin pada {formatDate(payment.refundedAt || payment.updatedAt)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed bg-[#F7F9FC] p-4 rounded-2xl border border-slate-100 italic">
                &ldquo;{payment.note || 'Pengembalian dana berhasil ditransfer balik ke rekening Anda.'}&rdquo;
              </p>
              {payment.refundProofUrl && (
                <a
                  href={payment.refundProofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#2A2A2A] hover:bg-black text-white py-4 rounded-[20px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-[#FF9A9E]" />
                  Lihat Bukti Transfer Refund
                </a>
              )}
            </div>
          )}

          {/* Payment Upload Form (If Unpaid) */}
          {booking.status === 'PENDING' && (!payment || payment.status === 'PENDING' || payment.status === 'FAILED') && !timeLeft.isExpired && (
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-[#2A2A2A]/5 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FDF1F0] rounded-xl flex items-center justify-center text-[#FF527B] flex-shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#2A2A2A] uppercase tracking-tight">Kirim Bukti Pembayaran</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Unggah rincian transfer Anda</p>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[#2A2A2A]/40 uppercase tracking-widest">Metode Pembayaran</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-slate-50 text-sm font-semibold p-4 rounded-2xl border border-slate-100 focus:outline-none focus:border-[#FF9A9E] focus:bg-white"
                  >
                    <option value="Transfer Bank BCA">Transfer Bank BCA</option>
                    <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                    <option value="Transfer Bank BNI">Transfer Bank BNI</option>
                    <option value="E-Wallet (Gopay/OVO)">E-Wallet (Gopay/OVO/Dana)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[#2A2A2A]/40 uppercase tracking-widest">URL Bukti Pembayaran (URL Gambar)</label>
                  <input
                    type="text"
                    placeholder="https://example.com/receipt.jpg"
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    className="w-full bg-slate-50 text-sm font-semibold p-4 rounded-2xl border border-slate-100 focus:outline-none focus:border-[#FF9A9E] focus:bg-white"
                    required
                  />
                  <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
                    Tempelkan tautan gambar screenshot struk pembayaran Anda.
                  </p>
                </div>

                {payment?.status === 'FAILED' && (
                  <div className="bg-[#FCE6E3] p-4 rounded-2xl border border-[#FF527B]/10 text-[#FF527B] text-[11px] font-semibold flex gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Pembayaran Sebelumnya Ditolak:</p>
                      <p className="mt-0.5 opacity-90">{payment.note || 'Bukti transfer tidak valid.'}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="w-full bg-[#FF527B] hover:bg-[#FF3E6C] text-white py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-[#FF527B]/10 flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
                >
                  <UploadCloud className="w-5 h-5 text-white" />
                  {submittingPayment ? 'Mengirim...' : 'Kirim Bukti Bayar'}
                </button>
              </form>
            </div>
          )}

          {/* Payment Submitted Wait State */}
          {booking.status === 'PENDING' && payment && payment.status === 'PENDING' && (
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-[#2A2A2A]/5 shadow-sm text-center space-y-6">
              <div className="w-16 h-16 bg-[#FFF9E5] text-[#F59E0B] rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-black text-[#2A2A2A] uppercase tracking-tight">Verifikasi Pembayaran</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[240px] mx-auto">
                  Bukti pembayaran sudah terkirim. Admin kami sedang memverifikasi transaksi Anda. Mohon ditunggu.
                </p>
              </div>
              <div className="text-[10px] font-bold text-slate-400 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-1">
                <p>Metode: <span className="text-[#2A2A2A]">{payment.method}</span></p>
                <p className="truncate">Bukti: <a href={payment.proofUrl} target="_blank" rel="noreferrer" className="text-[#FF9A9E] hover:underline">Lihat Bukti Struk</a></p>
              </div>
            </div>
          )}

          {/* Confirm Completion Widget (Escrow Release) */}
          {(booking.status === 'CONFIRMED' || booking.status === 'IN_PROGRESS') && (
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-[#2A2A2A]/5 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#2A2A2A] uppercase tracking-tight">Konfirmasi Selesai</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Pelepasan Dana Escrow</p>
                </div>
              </div>
              
              <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                &ldquo;Klik tombol di bawah jika vendor telah menyelesaikan seluruh pekerjaan di lokasi acara untuk meneruskan dana pembayaran ke saldo vendor secara aman.&rdquo;
              </p>

              <button
                type="button"
                onClick={handleCompleteBooking}
                disabled={completing}
                className="w-full bg-[#10B981] hover:bg-emerald-600 text-white py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:shadow-none"
              >
                <CheckCircle2 className="w-5 h-5 text-white" />
                {completing ? 'Memproses...' : 'Konfirmasi Acara Selesai'}
              </button>
            </div>
          )}

          {/* Vendor Contact Card */}
          <div className="bg-[#2A2A2A] p-8 md:p-10 rounded-[32px] text-white shadow-sm border border-white/5 relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 opacity-50" />
            <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.3em] mb-4 relative z-10">Kontak Vendor</p>

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-16 h-16 rounded-[22px] overflow-hidden border-2 border-white/5 shadow-xl flex-shrink-0 bg-white">
                <img
                  src={booking.vendor?.user?.avatar || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=150'}
                  className="w-full h-full object-cover"
                  alt={booking.vendor?.businessName}
                />
              </div>
              <div>
                <h5 className="text-lg font-black tracking-tight">{booking.vendor?.businessName || 'Nama Vendor'}</h5>
                <p className="text-[9px] font-black text-[#FF9A9E] uppercase tracking-wider mt-0.5">
                  Rating: ★ {booking.vendor?.rating || '0.0'}
                </p>
              </div>
            </div>

            <div className="space-y-4 relative z-10 text-xs font-semibold opacity-70 pt-2 border-t border-white/5">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#FF9A9E]" />
                <span>+62 {booking.vendor?.user?.phone || '812-3456-789'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#FF9A9E]" />
                <span className="truncate">{booking.vendor?.user?.email || 'vendor@planora.com'}</span>
              </div>

              {booking.vendor?.user?.phone && (
                <a
                  href={`https://wa.me/62${booking.vendor?.user?.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full mt-4 bg-white/10 border border-white/5 hover:bg-white/15 text-white py-4 rounded-[20px] font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4.5 h-4.5" />
                  Hubungi Via WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Cancel Booking Trigger (Only if Pending Payment) */}
          {booking.status === 'PENDING' && (
            <div className="pt-2 text-center">
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest hover:underline cursor-pointer"
              >
                Batalkan Pesanan Ini
              </button>
            </div>
          )}

          {/* Cancellation Info (If Cancelled) */}
          {booking.status === 'CANCELLED' && (
            <div className="bg-[#FCE6E3] p-6 rounded-[32px] border border-[#FF527B]/10 space-y-4 text-center">
              <div className="w-12 h-12 bg-[#FF527B]/10 text-[#FF527B] rounded-full flex items-center justify-center mx-auto shadow-sm">
                <XCircle className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#FF527B] uppercase tracking-tight">Pesanan Dibatalkan</h4>
                <p className="text-[11px] font-semibold text-red-400 mt-1">
                  Alasan pembatalan:
                </p>
                <p className="text-xs text-red-700 mt-2 font-medium italic">
                  &ldquo;{booking.cancelReason || 'Dibatalkan oleh sistem.'}&rdquo;
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Cancellation Modal Dialog */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-8 rounded-[32px] border border-[#2A2A2A]/5 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-[#FCE6E3] text-[#FF527B] rounded-full flex items-center justify-center mx-auto shadow-sm">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-black text-[#2A2A2A] uppercase tracking-tight">Batalkan Booking</h4>
              <p className="text-xs text-slate-500">
                Apakah Anda yakin ingin membatalkan pesanan ini? Aksi ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-[#2A2A2A]/40 uppercase tracking-widest">Alasan Pembatalan</label>
                <textarea
                  placeholder="Contoh: Berubah rencana, salah pilih tanggal, dll."
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-slate-50 text-sm font-semibold p-4 rounded-2xl border border-slate-100 focus:outline-none focus:border-[#FF9A9E] focus:bg-white resize-none"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 py-4.5 rounded-[20px] font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer border border-slate-100"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4.5 rounded-[20px] font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-red-500/10 cursor-pointer disabled:bg-slate-300"
                >
                  {cancelling ? 'Proses...' : 'Ya, Batalkan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}