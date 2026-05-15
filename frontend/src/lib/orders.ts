export type OrderStatus = 'Menunggu' | 'Dikonfirmasi' | 'Selesai';

export type PaymentStatus = 'menunggu' | 'dikonfirmasi' | 'selesai';

export interface Order {
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
  location: string;
  img: string;
}

export const vendorOrders: Order[] = [
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
    location: 'Gedung Graha Saba',
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
    location: 'Hotel Santika Premiere',
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
    location: 'Gedung Serbaguna',
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
    location: 'Rumah Pribadi',
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
    location: 'Gedung Pancasila',
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
    location: 'Aula Masjid Al-Ikhlas',
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
    location: 'Ballroom Grand Palace',
    img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=100',
  },
];

export const getPendingOrderCount = () =>
  vendorOrders.filter((order) => order.status === 'Menunggu').length;