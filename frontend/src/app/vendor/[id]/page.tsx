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

const vendorData = {
  v1: {
    name: 'Lumiere Decoration',
    category: 'Dekorasi',
    location: 'Jakarta Selatan',
    rating: 4.9,
    reviews: 120,
    price: 'Rp 8.500.000',
    description:
      'Lumiere Decoration menyediakan dekorasi wedding elegan, romantis, dan rapi untuk venue indoor maupun outdoor.',
    cover:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1400',
    gallery: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=900',
    ],
    services: [
      'Dekorasi pelaminan',
      'Backwall & bunga segar',
      'Venue styling full set',
      'Free konsultasi konsep',
    ],
    reviewsList: [
      { name: 'Nadia', text: 'Hasilnya mewah dan sesuai brief, tim juga responsif.', rating: 5 },
      { name: 'Rizky', text: 'Dekorasi datang tepat waktu dan setup sangat detail.', rating: 5 },
    ],
  },
  v2: {
    name: 'Eterna Photography',
    category: 'Fotografi',
    location: 'Jakarta Timur',
    rating: 4.8,
    reviews: 98,
    price: 'Rp 3.500.000',
    description:
      'Eterna Photography menangkap momen acara dengan gaya natural, hangat, dan cinematic.',
    cover:
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1400',
    gallery: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=900',
    ],
    services: ['Pre-wedding shoot', 'Wedding coverage', 'Album premium', 'Drone shot'],
    reviewsList: [
      { name: 'Alya', text: 'Foto-fotonya sangat hidup dan hasil editnya clean.', rating: 5 },
      { name: 'Dimas', text: 'Komunikasi mudah dan file dikirim cepat.', rating: 4 },
    ],
  },
  v3: {
    name: 'Delish Catering',
    category: 'Katering',
    location: 'Tangerang',
    rating: 4.7,
    reviews: 76,
    price: 'Rp 25.000/porsi',
    description:
      'Delish Catering menghadirkan menu yang lezat, higienis, dan pilihan paket yang fleksibel.',
    cover:
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1400',
    gallery: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=900',
    ],
    services: ['Buffet wedding', 'Snack box', 'Coffee break', 'Menu custom'],
    reviewsList: [
      { name: 'Sinta', text: 'Semua makanan habis diserbu tamu, enak banget.', rating: 5 },
      { name: 'Farhan', text: 'Porsi pas dan variasi menunya banyak.', rating: 4 },
    ],
  },
  v4: {
    name: 'Glow Makeup',
    category: 'Make Up',
    location: 'Bekasi',
    rating: 4.9,
    reviews: 64,
    price: 'Rp 2.500.000',
    description:
      'Glow Makeup fokus pada riasan yang tahan lama, natural glowing, dan cocok untuk acara spesial.',
    cover:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1400',
    gallery: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=900',
    ],
    services: ['Bridal makeup', 'Hair styling', 'Touch up kit', 'Trial session'],
    reviewsList: [
      { name: 'Putri', text: 'Makeup-nya tahan seharian dan hasil foto sangat bagus.', rating: 5 },
      { name: 'Tania', text: 'Timnya ramah dan bisa menyesuaikan style.', rating: 5 },
    ],
  },
} as const;

export default async function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = vendorData[id as keyof typeof vendorData];

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
              <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
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

            <div className="mt-10 rounded-[28px] bg-white p-6 shadow-sm">
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
            <div className="rounded-[28px] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black md:text-4xl">{vendor.name}</h1>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF4FF] px-3 py-1 text-xs font-bold text-sky-700">
                  <Check className="h-3.5 w-3.5" /> Terverifikasi
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-500">{vendor.category}</p>

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

            <div className="rounded-[28px] bg-white p-6 shadow-sm">
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

            <div className="rounded-[28px] bg-white p-6 shadow-sm">
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