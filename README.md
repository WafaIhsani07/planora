# Planora

Platform marketplace layanan event.

Saat ini yang sudah siap dijalankan adalah **Backend API** di folder `backend/`. Folder `frontend/` dan `mobile/` masih kosong (TBD).

## Quick Start (Backend)

### Persyaratan

- Node.js 18+ (disarankan: versi LTS terbaru)
- npm (atau yarn/pnpm)
- PostgreSQL (local atau hosted)

### Instalasi & Development

```bash
# Clone repository
git clone <YOUR_GIT_URL>

# Masuk ke direktori project
cd planora

# Install dependencies backend
cd backend
npm install

# Buat env (isi sesuai database kamu)
copy .env.example .env

# Prisma
npx prisma generate
npx prisma migrate dev --name init

# Jalankan development server
npm run dev
```

API akan berjalan di:

- http://localhost:5000/

### Menjalankan dari Root Repo

```bash
cd ..
npm run dev
```

Perintah ini menjalankan backend melalui `npm --prefix backend run dev`.

## Build untuk Production (Backend)

```bash
cd backend

# build (output: backend/dist)
npm run build

# start server production
npm run start
```

## Environment Variables

File env ada di `backend/.env` (buat dari `backend/.env.example`).

Wajib:

- `PORT` (default `5000`)
- `DATABASE_URL`

Disarankan:

- `DIRECT_URL` (untuk koneksi direct/non-pooled, sering lebih aman untuk migration)

## Prisma (v7)

Repo ini menggunakan Prisma v7 dengan config file `backend/prisma.config.ts`.

- URL koneksi database diambil dari `.env` lewat `prisma.config.ts`
- `backend/prisma/schema.prisma` tidak menyimpan `datasource.url` (sesuai Prisma v7)

Perintah berguna:

```bash
cd backend
npx prisma validate
npx prisma generate
npx prisma migrate dev
```

## Deploy (Backend)

Backend ini aplikasi Node.js biasa (Express). Kamu bisa deploy ke platform seperti Render/Railway/Fly.io/VPS.

Checklist umum:

- Set environment variables: `DATABASE_URL`, `DIRECT_URL` (opsional), `PORT`
- Jalankan `npm install`
- Jalankan `npm run build`
- Jalankan `npm run start`

## Tech Stack

Backend:

- Runtime: Node.js
- Bahasa: TypeScript
- Framework: Express
- Database ORM: Prisma
- Dev runner: `tsx` (watch mode)

Frontend / Mobile: belum ada (TBD).

## Struktur Repo

- `backend/` — Node.js + TypeScript API (Express) + Prisma
- `frontend/` — Frontend (belum ada / TBD)
- `mobile/` — Mobile client (belum ada / TBD)
- `docs/` — Catatan setup / panduan

## Kontribusi / Panduan Fork

### 1) Fork di GitHub

1. Buka repository ini di GitHub
2. Klik **Fork** (pojok kanan atas)
3. Pilih akun / organisasi kamu

### 2) Clone hasil fork

```bash
git clone https://github.com/<your-username>/planora.git
cd planora
```

### 3) Tambahkan upstream (opsional tapi disarankan)

```bash
git remote add upstream https://github.com/Nandapratama716/planora.git
git remote -v
```

### 4) Buat feature branch

```bash
git checkout -b feat/<short-name>
```

### 5) Update fork kamu

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### 6) Buat Pull Request

1. Push branch kamu: `git push -u origin feat/<short-name>`
2. Buka GitHub lalu buat Pull Request ke `Nandapratama716/planora:main`

## Troubleshooting

### Prisma migrate gagal (credential)

- Cek lagi nilai `DATABASE_URL` / `DIRECT_URL` di `backend/.env`
- Jalankan ulang: `npx prisma generate`

### Error import ESM (NodeNext)

Backend ini menggunakan ESM (`backend/package.json` memiliki `"type": "module"`).
Saat mengimpor file lokal di TypeScript, gunakan ekstensi `.js` pada import path (contoh: `import x from "./x.js"`).
