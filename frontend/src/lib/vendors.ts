import { CATEGORIES } from './categories';

export type Vendor = {
  id: string;
  name: string;
  category: string; // category id from CATEGORIES
  location: string;
  rating: number;
  reviews: number;
  price: string;
  description: string;
  cover: string;
  gallery: string[];
  services: string[];
  reviewsList: { name: string; text: string; rating: number }[];
};

export const VENDORS: Vendor[] = [
  {
    id: 'lumiere',
    name: 'Lumiere Decoration',
    category: 'dekorasi',
    location: 'Jakarta Selatan',
    rating: 4.9,
    reviews: 120,
    price: 'Rp 8.500.000',
    description: 'Lumiere Decoration menyediakan dekorasi wedding elegan, romantis, dan rapi untuk venue indoor maupun outdoor.',
    cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1400',
    gallery: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=900',
    ],
    services: ['Dekorasi pelaminan', 'Backwall & bunga segar', 'Venue styling full set', 'Free konsultasi konsep'],
    reviewsList: [
      { name: 'Nadia', text: 'Hasilnya mewah dan sesuai brief, tim juga responsif.', rating: 5 },
      { name: 'Rizky', text: 'Dekorasi datang tepat waktu dan setup sangat detail.', rating: 5 },
    ],
  },
  {
    id: 'eterna',
    name: 'Eterna Photography',
    category: 'fotografi',
    location: 'Jakarta Timur',
    rating: 4.8,
    reviews: 98,
    price: 'Rp 3.500.000',
    description: 'Eterna Photography menangkap momen acara dengan gaya natural, hangat, dan cinematic.',
    cover: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1400',
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
  {
    id: 'delish',
    name: 'Delish Catering',
    category: 'katering',
    location: 'Tangerang',
    rating: 4.7,
    reviews: 76,
    price: 'Rp 25.000/porsi',
    description: 'Delish Catering menghadirkan menu yang lezat, higienis, dan pilihan paket yang fleksibel.',
    cover: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1400',
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
  {
    id: 'glow',
    name: 'Glow Makeup',
    category: 'mua',
    location: 'Bekasi',
    rating: 4.9,
    reviews: 64,
    price: 'Rp 2.500.000',
    description: 'Glow Makeup fokus pada riasan yang tahan lama, natural glowing, dan cocok untuk acara spesial.',
    cover: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1400',
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
];

export function getVendorById(id: string) {
  return VENDORS.find((v) => v.id === id) ?? null;
}

export function listVendors() {
  return VENDORS;
}
