# Presentasi Frontend Planora

## Slide 1 - Judul
**Planora Frontend**  
Platform marketplace layanan event berbasis web

- Nama Project: Planora
- Fokus: pengalaman pengguna dari landing page sampai dashboard
- Dibangun untuk: pengguna umum, vendor, dan admin

---

## Slide 2 - Latar Belakang
**Masalah yang ingin diselesaikan**

- Proses mencari vendor event sering tersebar di banyak platform
- Komunikasi, booking, dan pemantauan acara belum terintegrasi
- Vendor butuh kanal digital untuk menampilkan layanan secara profesional

**Solusi Planora**

- Satu platform untuk eksplorasi layanan event, booking, dan manajemen aktivitas
- UI modern, mobile-friendly, dan alur yang mudah dipahami

---

## Slide 3 - Tujuan Frontend

- Menyajikan landing page yang menarik dan jelas untuk onboarding user baru
- Memberikan alur autentikasi yang cepat (login, register, lupa password)
- Menyediakan area pengguna untuk dashboard, events, bookings, profile, settings
- Menyediakan area admin untuk monitoring dan manajemen data

---

## Slide 4 - Tech Stack Frontend

- Framework: **Next.js 16**
- UI Library: **React 19 + TypeScript**
- Styling: **Tailwind CSS 4**
- Data Fetching: **Axios + TanStack React Query**
- State Management: **Zustand**
- Auth: **NextAuth**
- Form & Validation: **React Hook Form + Zod**

**Alasan pemilihan stack**

- Produktif untuk development cepat
- Maintainable dengan type safety
- Mudah diskalakan untuk fitur baru

---

## Slide 5 - Arsitektur Frontend (Ringkas)

- App Router Next.js dengan segment halaman:
  - `(main)` untuk user area
  - `(auth)` untuk autentikasi
  - `(admin)` untuk admin area
- Komponen reusable di `src/components`
- Service layer API di `src/services` dan `src/lib/api.ts`
- State global terpusat di `src/store`

**Poin penting**

- Pemisahan concern antara UI, logic, dan komunikasi API
- Struktur folder memudahkan onboarding developer baru

---

## Slide 6 - Highlight UI/UX Landing Page

- Hero section dengan visual branding kuat
- Section edukatif: category, cara kerja, fitur, testimonial, CTA
- Navigasi jelas untuk user baru
- Responsif di desktop dan mobile

**Impact**

- Meningkatkan first impression dan trust pengguna
- Mempercepat user memahami value produk

---

## Slide 7 - Fitur Autentikasi

- Login page
- Register page dengan form vendor/pelanggan
- Forgot password page
- Auth guard untuk proteksi route tertentu

**Nilai bisnis**

- Membuat onboarding lebih terarah
- Menjaga keamanan akses halaman internal

---

## Slide 8 - Fitur User Area

- Dashboard ringkasan aktivitas
- Event listing dan filter
- Booking management
- Profile dan settings

**Manfaat**

- User dapat memantau aktivitas event dari satu tempat
- Alur penggunaan konsisten antar halaman

---

## Slide 9 - Fitur Admin Area

- Dashboard admin
- Manajemen user
- Monitoring/verifikasi
- Pengaturan dan kategori jasa

**Manfaat operasional**

- Kontrol data lebih terpusat
- Mempermudah pengawasan kualitas layanan di platform

---

## Slide 10 - Integrasi API

- Frontend menggunakan Axios instance terpusat
- Base URL dapat dikonfigurasi via environment variable
- Default local API: `http://localhost:5000`

Contoh env frontend:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

**Keuntungan**

- Mudah berpindah antar environment (local/staging/production)
- Konfigurasi sederhana untuk tim development

---

## Slide 11 - Kualitas Kode & Maintainability

- TypeScript untuk mengurangi bug runtime
- Reusable UI component untuk konsistensi tampilan
- Pemisahan service, hooks, dan store untuk codebase yang rapi
- Struktur modular memudahkan scaling fitur

---

## Slide 12 - Demo Flow (Saat Presentasi)

1. Buka landing page dan jelaskan value proposition
2. Tunjukkan navigasi ke login/register
3. Simulasikan alur user ke dashboard/events/bookings
4. Tunjukkan area admin dan capability monitoring
5. Tutup dengan ringkasan manfaat bisnis

Tips demo:

- Fokus pada alur user end-to-end
- Hindari terlalu lama di detail teknis jika audiens non-teknis

---

## Slide 13 - Tantangan & Solusi

**Tantangan**

- Menjaga konsistensi UI di banyak halaman
- Menyelaraskan kebutuhan user dan admin dalam satu aplikasi
- Menyiapkan struktur yang siap pengembangan jangka panjang

**Solusi yang diterapkan**

- Komponen UI reusable
- Segmentasi layout per area (auth/main/admin)
- Service dan state layer yang terorganisir

---

## Slide 14 - Rencana Pengembangan

- Peningkatan validasi form dan handling error state
- Peningkatan aksesibilitas dan performa page
- Dashboard analytics yang lebih kaya
- Penyempurnaan notifikasi dan feedback real-time

---

## Slide 15 - Penutup

**Planora Frontend** sudah memiliki fondasi yang kuat:

- Arsitektur modern dan scalable
- Pengalaman pengguna yang terarah
- Siap dikembangkan untuk kebutuhan produksi

Terima kasih.

---

## Lampiran - Quick Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Akses di browser: `http://localhost:3000`
