# Laporan Progress 04 - Implementasi Website Planora

## 1. Informasi Laporan

- Proyek: Planora (Platform marketplace layanan event)
- Tahap: Progress ke-4 (Implementasi Website)
- Tanggal pembaruan: 22 April 2026
- Ruang lingkup laporan: Kondisi implementasi aktual sampai saat ini (belum final release)

## 2. Tujuan Tahap Implementasi

Tahap ini berfokus pada:

1. Membangun fondasi arsitektur frontend dan backend.
2. Menyiapkan skema database dan migration awal.
3. Mengimplementasikan halaman utama aplikasi dan dashboard.
4. Menyiapkan autentikasi berbasis NextAuth (credential).
5. Menyiapkan service layer API dan state management.
6. Menyiapkan struktur untuk pengembangan fitur lanjutan.

## 3. Ringkasan Capaian Saat Ini

Secara umum, progres implementasi saat ini berada di fase **fondasi + UI inti + integrasi awal**.

- Frontend Next.js: Struktur halaman dan komponen inti sudah luas dan berjalan.
- Backend Express + Prisma: Fondasi server dan koneksi DB sudah siap, API bisnis masih minim.
- Database: Schema dan migration awal sudah dibuat dengan relasi utama.
- Auth: NextAuth credentials sudah terpasang, namun masih mode demo (belum validasi ke database).
- Data flow: Sebagian halaman masih memakai mock/static data.

## 4. Arsitektur Implementasi

### 4.1 Frontend

- Framework: Next.js 16 + React 19 + TypeScript.
- Styling: Tailwind CSS 4.
- State management: Zustand.
- Networking: Axios + service layer.
- Auth: NextAuth.

Bukti konfigurasi dependency:
- `frontend/package.json`

### 4.2 Backend

- Runtime: Node.js + Express 5.
- ORM: Prisma.
- Database: PostgreSQL.

Bukti dependency backend:
- `backend/package.json`

### 4.3 Database

Model utama yang sudah tersedia:
- User
- VendorProfile
- Service
- Booking
- Payment
- Review

Enum utama:
- Role
- BookingStatus
- PaymentStatus

## 5. Kronologi Implementasi (Dari Awal Sampai Kondisi Sekarang)

### Fase 1 - Inisialisasi Proyek dan Tooling

Yang sudah dilakukan:

1. Setup struktur project multi-folder (`frontend`, `backend`, `docs`).
2. Setup script development root untuk menjalankan backend (`npm run dev`).
3. Setup TypeScript pada backend dan frontend.
4. Penyusunan dokumentasi awal di README dan setup guide.

Indikator:
- Root script dev tersedia di `package.json`.
- Dokumentasi setup sudah ada di `README.md` dan `docs/SETUP.md`.

### Fase 2 - Implementasi Fondasi Backend

Yang sudah dilakukan:

1. Membuat Express app dengan middleware dasar (`cors`, `json`, `urlencoded`).
2. Menambahkan endpoint health-check (`GET /`).
3. Menambahkan 404 handler dan global error handler.
4. Menyediakan entry point server pada `server.ts`.
5. Menyiapkan PrismaClient singleton.

Status saat ini:
- Backend foundation siap dijalankan.
- Routing bisnis masih belum luas (baru controller user sederhana).

### Fase 3 - Implementasi Database (Prisma)

Yang sudah dilakukan:

1. Menyusun schema Prisma dengan relasi inti marketplace event.
2. Membuat migration awal SQL.
3. Menetapkan enum role, booking status, dan payment status.

Status saat ini:
- Struktur data inti sudah siap dipakai.
- Endpoint CRUD untuk seluruh model belum selesai.

### Fase 4 - Implementasi Fondasi Frontend

Yang sudah dilakukan:

1. Menyiapkan App Router Next.js.
2. Menyiapkan root layout + metadata + footer global.
3. Menyusun landing page modular (Hero, BrandTrust, Category, HowItWorks, Features, Testimonial, CTA).
4. Menambahkan elemen responsive header dan mobile menu.

Status saat ini:
- Tampilan landing dan struktur halaman utama sudah kuat.
- Integrasi interaksi bisnis (search vendor real API, dll) belum final.

### Fase 5 - Implementasi Auth dan Session

Yang sudah dilakukan:

1. Integrasi NextAuth route (`GET/POST`) pada App Router.
2. Konfigurasi credentials provider.
3. Menyiapkan login flow di halaman login dengan `signIn`.
4. Menyediakan quick login mode development (vendor/admin).
5. Menyiapkan Zustand auth store (`setSession`, `clearSession`) dan hook `useAuth`.

Status saat ini:
- Jalur autentikasi front-end sudah ada.
- Validasi kredensial masih demo pada `authorize` (belum query user DB nyata).

### Fase 6 - Implementasi Dashboard dan Halaman Operasional

Yang sudah dilakukan:

1. Dashboard vendor dengan tampilan KPI, daftar pesanan, dan modul verifikasi bayar.
2. Dashboard admin overview dengan komponen statistik.
3. Halaman events dan bookings sudah tersedia.

Status saat ini:
- UI operasional sudah tersedia dan bisa dipresentasikan.
- Sebagian data di dashboard/events/bookings masih static atau mock.

### Fase 7 - Service Layer API dan Data Fetching

Yang sudah dilakukan:

1. Menyediakan `lib/api.ts` untuk base URL backend configurable via env.
2. Menyiapkan service auth (`/auth/login`, `/auth/register`).
3. Menyiapkan service events dan bookings (`/events`, `/bookings`).
4. Menyiapkan hooks data (`useEvents`, `useBookings`) namun masih mengembalikan mock data.

Status saat ini:
- Fondasi konsumsi API sudah siap.
- Integrasi penuh endpoint backend <-> frontend masih tahap lanjutan.

## 6. Status Implementasi per Modul

| Modul | Status | Keterangan |
|---|---|---|
| Struktur project & tooling | Selesai | Monorepo-like structure siap pakai |
| Backend Express foundation | Selesai | Middleware, health check, error handling tersedia |
| Prisma schema & migration awal | Selesai | Model inti marketplace sudah terdefinisi |
| API bisnis lengkap | Berjalan | Baru sebagian kecil (contoh user controller sederhana) |
| Landing page | Selesai (UI) | Komponen section lengkap dan responsive |
| Halaman login | Selesai (UI + flow awal) | Sudah terhubung NextAuth signIn |
| Halaman register | Berjalan | UI lengkap, submit ke backend belum final |
| Dashboard vendor/admin | Selesai (UI) | Data mayoritas masih static |
| Events & bookings | Berjalan | Halaman ada, sebagian data masih mock |
| Integrasi data real end-to-end | Berjalan | Service layer siap, API backend belum lengkap |
| Pengamanan route end-to-end | Berjalan | AuthGuard ada, namun integrasi role/session masih terbatas |

## 7. Kode Penting (Dengan Referensi Baris)

Di bawah ini adalah bagian kode yang paling relevan untuk dilampirkan pada laporan atau screenshot.

### 7.1 Fondasi Express App

Lokasi:
- `backend/src/app.ts:5` (`dotenv.config()`)
- `backend/src/app.ts:15` (health endpoint)
- `backend/src/app.ts:21` (404 handler)
- `backend/src/app.ts:24` (global error handler)

Cuplikan:

```ts
dotenv.config()

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Planora API running", status: "ok" })
})

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Error] ${err.message}`)
    res.status(500).json({ message: "Internal Server Error" })
})
```

### 7.2 Entry Point Server

Lokasi:
- `backend/src/server.ts:3`
- `backend/src/server.ts:5`

Cuplikan:

```ts
const PORT = Number(process.env.PORT) || 5000

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})
```

### 7.3 Prisma Schema Inti

Lokasi:
- `backend/prisma/schema.prisma:14` (model User)
- `backend/prisma/schema.prisma:82` (enum Role)

Cuplikan:

```prisma
model User {
 id String @id @default(uuid())
 name String
 email String @unique
 password String
 role Role
 createdAt DateTime @default(now())

 vendorProfile VendorProfile?

 bookings Booking[]
}

enum Role {
 CUSTOMER
 VENDOR
 ADMIN
}
```

### 7.4 Migration SQL Awal

Lokasi:
- `backend/prisma/migrations/20260402142148_init/migration.sql:11`
- `backend/prisma/migrations/20260402142148_init/migration.sql:94`

Cuplikan:

```sql
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
```

### 7.5 Landing Page Modular

Lokasi:
- `frontend/src/app/page.tsx:118` (HeroSection)
- `frontend/src/app/page.tsx:319` (HomePage)
- `frontend/src/app/page.tsx:324` sampai `frontend/src/app/page.tsx:329` (section modular)

Cuplikan:

```tsx
function HeroSection() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandTrust />
      <CategorySection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialSection />
      <CtaSection />
    </>
  );
}
```

### 7.6 Konfigurasi API Client Frontend

Lokasi:
- `frontend/src/lib/api.ts:4`

Cuplikan:

```ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000",
  withCredentials: true,
});
```

### 7.7 NextAuth Credentials + Route Handler

Lokasi:
- `frontend/src/lib/auth.ts:6` (CredentialsProvider)
- `frontend/src/lib/auth.ts:12` (`authorize`)
- `frontend/src/app/api/auth/[...nextauth]/route.ts:1`
- `frontend/src/app/api/auth/[...nextauth]/route.ts:6`

Cuplikan:

```ts
CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials.password) {
      return null;
    }

    return {
      id: "demo-user",
      name: "Demo User",
      email: credentials.email,
    };
  },
})
```

```ts
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

### 7.8 Login Flow dengan signIn

Lokasi:
- `frontend/src/app/login/page.tsx:87` (signIn)
- `frontend/src/app/login/page.tsx:104` (quick login)
- `frontend/src/app/login/page.tsx:127` (redirect sesuai role)

Cuplikan:

```tsx
const result = await signIn('credentials', {
    redirect: false,
    email,
    password,
    callbackUrl: '/dashboard',
});

const handleQuickLogin = async (role: 'vendor' | 'admin') => {
    const selectedRole = quickLoginConfig[role];

    const result = await signIn('credentials', {
        redirect: false,
        email: selectedRole.email,
        password: selectedRole.password,
        callbackUrl: selectedRole.callbackUrl,
    });

    router.push(selectedRole.callbackUrl);
};
```

### 7.9 Zustand Auth Store + Hook

Lokasi:
- `frontend/src/store/authStore.ts:16` (`setSession`)
- `frontend/src/hooks/useAuth.ts:6`

Cuplikan:

```ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setSession: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),
  clearSession: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),
}));
```

```ts
export default function useAuth() {
  const { user, isAuthenticated } = useAuthStore();

  return {
    user,
    isAuthenticated,
  };
}
```

### 7.10 Dashboard Vendor/Admin

Lokasi:
- `frontend/src/app/(main)/dashboard/page.tsx:20` (entry dashboard vendor)
- `frontend/src/app/(admin)/admin/page.tsx:3` (entry admin page)
- `frontend/src/app/(admin)/admin/page.tsx:8` sampai `frontend/src/app/(admin)/admin/page.tsx:10` (stats cards)

Cuplikan:

```tsx
export default function AdminPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-900">Admin Overview</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Total User" value="1.284" />
        <StatsCard title="Total Event" value="325" />
        <StatsCard title="Total Booking" value="782" />
      </div>
    </section>
  );
}
```

### 7.11 Data Mock pada Events/Bookings (Progress yang Masih Berjalan)

Lokasi:
- `frontend/src/components/events/EventList.tsx:4` (const events)
- `frontend/src/app/(main)/bookings/page.tsx:3` (const bookings)
- `frontend/src/hooks/useEvents.ts:6` (mockEvents)
- `frontend/src/hooks/useBookings.ts:6` (mockBookings)

Cuplikan:

```ts
const mockEvents: Event[] = [
  {
    id: "EV-001",
    name: "Wedding Organizer Premium",
    category: "Pernikahan",
    description: "Paket event pernikahan all-in.",
    priceLabel: "Mulai Rp 15.000.000",
  },
];

const mockBookings: Booking[] = [
  {
    id: "BK-001",
    eventId: "EV-001",
    eventName: "Wedding Organizer Premium",
    status: "confirmed",
  },
];
```

## 8. Gap dan Pekerjaan Lanjutan

Berikut area yang masih perlu dilanjutkan agar implementasi masuk fase production-ready:

1. Menyusun route backend lengkap (`/auth`, `/events`, `/bookings`, `/users`) dengan validasi input.
2. Menghubungkan `authorize` NextAuth ke database (Prisma) dan hashing password.
3. Menyelaraskan halaman auth yang saat ini terduplikasi (komponen auth sederhana vs login/register page utama).
4. Mengganti mock data pada dashboard/events/bookings dengan data API real.
5. Menambahkan proteksi route berbasis role (customer/vendor/admin) secara konsisten.
6. Menambahkan error handling, loading state, empty state, dan notifikasi API pada seluruh flow.
7. Menambahkan testing minimal (unit/integration) untuk endpoint kritikal.

## 9. Kesimpulan Progress 04

Implementasi website Planora telah mencapai tahap yang solid pada sisi **struktur, desain antarmuka, dan fondasi teknis**. Aplikasi sudah layak untuk demo alur utama (landing, login, dashboard, halaman inti), namun masih memerlukan penyempurnaan integrasi backend penuh agar seluruh fitur berjalan end-to-end dengan data nyata.

Dengan kondisi saat ini, tahap berikut yang paling penting adalah **penyelesaian API bisnis** dan **integrasi autentikasi + data real** agar website siap masuk ke tahap uji sistem dan hardening.
