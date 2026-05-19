import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  Heart,
  MapPin,
  MessageCircle,
  Star,
} from 'lucide-react';
import { getVendorById } from '../../../lib/vendors';
import { getCategoryById } from '../../../lib/categories';

export default async function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = getVendorById(id as string);

  if (!vendor) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FFF9F8] text-[#231F20]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 lg:px-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#FF527B]">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>

        <div className="mt-4 grid gap-8 xl:grid-cols-[1.45fr_0.95fr]">
          <section>
            <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
              <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <img src={vendor.cover} alt={vendor.name} className="h-[340px] w-full object-cover" />
              </div>
              <div className="grid gap-4">
                {vendor.gallery.map((image, index) => (
                  <div key={image} className="overflow-hidden rounded-[22px] bg-white shadow-sm">
                    <img src={image} alt={`${vendor.name} ${index + 1}`} className="h-[104px] w-full object-cover" />
                  </div>
                ))}
                <button className="rounded-[20px] bg-[#171717] px-4 py-3 text-sm font-bold text-white">
                  Lihat Semua Foto
                </button>
              </div>
            </div>

            <div className="mt-10 rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black">Layanan</h2>
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF9A9E]">Lihat Semua</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {vendor.services.map((service) => (
                  <div key={service} className="rounded-2xl border border-slate-100 bg-[#FFF9F8] px-4 py-3 text-sm font-semibold text-slate-700">
                    {service}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6 xl:sticky xl:top-6 self-start">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black md:text-4xl">{vendor.name}</h1>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF4FF] px-3 py-1 text-xs font-bold text-sky-700">
                  <Check className="h-3.5 w-3.5" /> Terverifikasi
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-500">{getCategoryById(vendor.category)?.name ?? vendor.category}</p>

              <div className="mt-4 space-y-2 text-sm text-slate-500">
                <div className="inline-flex items-center gap-2"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> {vendor.rating} ({vendor.reviews} ulasan)</div>
                <div className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {vendor.location}</div>
                <div className="inline-flex items-center gap-2">Mulai dari <strong className="text-[#FF527B]">{vendor.price}</strong></div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">{vendor.description}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-xl border border-[#FF9A9E]/25 bg-white px-4 py-3 text-sm font-bold text-[#FF527B] shadow-sm">
                  <Heart className="h-4 w-4" /> Favorit
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl bg-[#FF527B] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#FF527B]/20">
                  Pesan Sekarang
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700">
                  <MessageCircle className="h-4 w-4" /> Chat Vendor
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black">Ulasan Customer</h2>
              <div className="mt-4 flex items-end gap-4">
                <div>
                  <div className="text-5xl font-black text-[#FF9A9E]">{vendor.rating}</div>
                  <div className="mt-1 text-sm font-bold text-slate-400">({vendor.reviews} ulasan)</div>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  {[5, 4, 3, 2, 1].map((score, index) => (
                    <div key={score} className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="w-3">{score}</span>
                      <div className="h-2 flex-1 rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-[#FF9A9E]" style={{ width: `${100 - index * 18}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black">Ulasan Terbaru</h2>
              <div className="mt-4 space-y-4">
                {vendor.reviewsList.map((review) => (
                  <div key={review.name} className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-800">{review.name}</p>
                      <span className="text-sm font-black text-[#FF527B]">{review.rating}/5</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}