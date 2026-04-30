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

## Script Presentasi Cepat Frontend

### Bagian 1 - Pembukaan
"Pada presentasi ini, saya akan menjelaskan frontend Planora sebagai wajah utama platform marketplace jasa event. Fokus utama frontend kami adalah membuat pengalaman pengguna terasa cepat dipahami, menarik secara visual, dan mudah dipakai oleh tiga jenis pengguna, yaitu pengunjung umum, vendor, dan admin."

### Bagian 2 - Landing Page
"Kalau kita lihat halaman landing page, bagian ini menjadi pintu masuk utama pengguna. Di sini kami menampilkan hero section yang kuat, navigasi yang jelas, highlight kategori layanan, social proof, serta CTA agar pengunjung langsung memahami value Planora sejak awal membuka website."

### Bagian 3 - Alur Autentikasi
"Setelah pengguna tertarik, frontend mengarahkan mereka ke alur autentikasi. Kami menyediakan halaman login, register, dan forgot password dengan tampilan yang konsisten agar onboarding terasa sederhana dan aman, baik untuk pengguna biasa maupun vendor yang ingin bergabung."

### Bagian 4 - Area Pengguna
"Untuk pengguna yang sudah masuk, frontend menyediakan area dashboard yang berisi halaman event, booking, profile, pengaturan, katalog, jadwal, keuangan, portofolio, hingga ulasan. Tujuannya adalah agar semua aktivitas penting bisa dipantau dari satu tempat tanpa berpindah ke banyak sistem."

### Bagian 5 - Area Admin
"Untuk admin, kami juga menyiapkan area khusus yang memudahkan monitoring dan pengelolaan platform. Di dalamnya ada dashboard admin, verifikasi vendor, manajemen user, monitoring transaksi, kategori jasa, dan pengaturan sistem. Jadi sisi operasional platform tetap terpusat dan mudah diawasi."

### Bagian 6 - Desain dan Struktur Teknologi
"Dari sisi implementasi, frontend dibangun dengan Next.js, React, TypeScript, Tailwind CSS, Zustand, React Query, dan NextAuth. Struktur folder dipisahkan berdasarkan area agar kode lebih rapi, reusable, dan siap dikembangkan ke fitur yang lebih besar."

### Bagian 7 - Penutup
"Secara keseluruhan, frontend Planora sudah menjadi fondasi yang kuat untuk pengalaman pengguna dan operasional admin. Masih ada beberapa bagian yang bisa dilengkapi, tetapi struktur yang sudah ada saat ini sudah cukup siap untuk dikembangkan ke tahap integrasi penuh dan produksi."

---

## Bagian Yang Belum Diimplementasi Sepenuhnya

- CTA di landing page sudah ada, tetapi alur lanjutan seperti pencarian vendor, pemilihan layanan, dan booking otomatis belum sepenuhnya tersambung ke data real atau hasil filter dinamis.
- Tombol CTA di section promosi masih bersifat visual, jadi belum semuanya terhubung ke flow aksi spesifik seperti pembuatan pesanan atau kontak langsung.
- Beberapa halaman admin masih menampilkan data statis atau contoh data, sehingga belum sepenuhnya menarik data dari backend secara real-time.
- Integrasi API di seluruh halaman frontend masih perlu disempurnakan agar form, tabel, dan ringkasan dashboard benar-benar memakai data produksi.
- Validasi dan handling error di beberapa form masih bisa ditingkatkan supaya UX lebih lengkap saat input gagal atau data tidak tersedia.

---

## Pemetaan Bagian Script ke Slide

- Pembukaan: Bagian 1
- Landing Page: Bagian 2
- Autentikasi: Bagian 3
- Area Pengguna: Bagian 4
- Area Admin: Bagian 5
- Desain dan Struktur Teknologi: Bagian 6
- Penutup: Bagian 7
- Kekurangan / belum diimplementasi: bagian "Bagian Yang Belum Diimplementasi Sepenuhnya"

---

## Lampiran - Quick Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Akses di browser: `http://localhost:3000`
