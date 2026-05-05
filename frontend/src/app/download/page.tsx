import Link from 'next/link';
import Image from 'next/image';
import { Download, QrCode, Smartphone, Store, ArrowRight, CheckCircle2 } from 'lucide-react';

const stores = [
  {
    name: 'Google Play',
    href: '#',
    note: 'Untuk Android',
  },
  {
    name: 'App Store',
    href: '#',
    note: 'Untuk iPhone',
  },
];

const features = [
  'Cari vendor dari mobile dengan cepat',
  'Lihat katalog, testimoni, dan rekomendasi terbaik',
  'Chat, booking, dan notifikasi pesanan',
  'Status pesanan real-time di aplikasi',
];

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-[#FFF7F6] text-[#1f1f1f]">
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-16">
        <div className="space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#FF527B]">
            <ArrowRight className="h-4 w-4 rotate-180" /> Kembali ke Landing
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF9A9E]/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#FF527B] shadow-sm">
            <Smartphone className="h-4 w-4" /> Planora Mobile App
          </div>

          <div className="max-w-2xl space-y-5">
            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              Download App Planora untuk
              <span className="text-[#FF527B]"> Customer</span>
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              Customer tetap bisa melihat katalog, rekomendasi vendor terbaik, dan testimoni melalui website. Untuk pengalaman penuh seperti booking, chat, dan notifikasi, gunakan aplikasi mobile Planora.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {stores.map((store) => (
              <a
                key={store.name}
                href={store.href}
                className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0F2] text-[#FF527B]">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black">{store.name}</p>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{store.note}</p>
                  </div>
                </div>
                <Download className="h-5 w-5 text-slate-300" />
              </a>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3 rounded-[20px] bg-white p-4 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#FF527B]" />
                <p className="text-sm leading-6 text-slate-600">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-[520px] rounded-[36px] bg-white p-6 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.18)]">
            <div className="grid gap-4 lg:grid-cols-[1fr_140px]">
              <div className="rounded-[28px] bg-[#FFF5F5] p-6">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 shadow-sm">
                  <QrCode className="h-4 w-4 text-[#FF527B]" /> Scan QR
                </div>
                <h2 className="text-2xl font-black leading-tight">Buka Planora di HP dalam sekali scan</h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                  Cocok untuk calon customer yang ingin langsung install aplikasi dan mulai mencari vendor acara.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
                    <div className="mx-auto mb-2 flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-[#FF9A9E]/40 bg-[#FFF7F6] text-center text-[10px] font-black uppercase tracking-widest text-[#FF527B]">
                      QR Code
                    </div>
                    <p className="text-xs font-bold text-slate-500">Scan untuk install</p>
                  </div>
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <Image
                      src="/images/logogmbr.png"
                      alt="Planora"
                      width={220}
                      height={220}
                      className="h-24 w-full object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-[28px] bg-[#1b1b1b] p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Preview App</p>
                <div className="overflow-hidden rounded-[22px] bg-[#2a2a2a] p-4">
                  <div className="space-y-3">
                    <div className="rounded-2xl bg-white/8 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">Browse</p>
                      <p className="mt-1 text-sm font-bold">Jelajahi vendor & kategori</p>
                    </div>
                    <div className="rounded-2xl bg-white/8 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">Booking</p>
                      <p className="mt-1 text-sm font-bold">Atur pesanan di aplikasi</p>
                    </div>
                    <div className="rounded-2xl bg-white/8 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">Chat</p>
                      <p className="mt-1 text-sm font-bold">Hubungi vendor langsung</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[22px] bg-white p-4 text-[#1b1b1b]">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Link alternatif</p>
                  <div className="mt-3 space-y-2">
                    {stores.map((store) => (
                      <a key={store.name} href={store.href} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold hover:border-[#FF9A9E]">
                        <span>{store.name}</span>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
