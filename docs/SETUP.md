# Panduan Setup (Planora)

Panduan ini untuk membantu teman/kontributor menjalankan project secara lokal (ramah Windows).

Catatan: saat ini yang sudah siap dijalankan adalah **backend** di folder `backend/`.

## Quick Start

### Persyaratan

- Node.js 18+ (disarankan: versi LTS terbaru)
- npm (atau yarn/pnpm)
- PostgreSQL (local atau hosted)

### Instalasi & Development (Backend)

```bash
# Clone repository
git clone <YOUR_GIT_URL>

# Masuk ke direktori project
cd planora

# Install dependencies
cd backend
npm install

# Environment variables
copy .env.example .env

# Prisma
npx prisma generate
npx prisma migrate dev --name init

# Jalankan development server
npm run dev
```

API berjalan di:

- http://localhost:5000/

## Build untuk Production (Backend)

```bash
cd backend

npm run build
npm run start
```

## Deploy (Backend)

Backend ini aplikasi Node.js (Express). Kamu bisa deploy ke platform Node seperti Render/Railway/Fly.io/VPS.

Checklist umum:

1. Set environment variables: `DATABASE_URL`, `DIRECT_URL` (opsional), `PORT`
2. Jalankan `npm install`
3. Jalankan `npm run build`
4. Jalankan `npm run start`

## Cara Fork Project (GitHub)

1. Buka repository di GitHub
2. Klik **Fork**
3. Clone repo hasil fork:

```bash
git clone https://github.com/<your-username>/planora.git
cd planora
```

Opsional (disarankan): tambahkan upstream agar mudah update dari repo utama:

```bash
git remote add upstream https://github.com/Nandapratama716/planora.git
git remote -v
```

## Environment Variables

File env backend ada di `backend/.env` (buat dari `backend/.env.example`).

- `PORT` (default `5000`)
- `DATABASE_URL` (wajib)
- `DIRECT_URL` (opsional, sering disarankan untuk migrate)

## Troubleshooting

### Error: `ERR_MODULE_NOT_FOUND` untuk import lokal

Karena backend memakai ESM (`type: module`) + TypeScript `NodeNext`, import file lokal biasanya wajib pakai ekstensi `.js`.

Contoh:

```ts
import app from "./app.js" // file aslinya app.ts
```

### Prisma migrate gagal

Paling sering ini karena connection string / credential.

- Cek `DATABASE_URL` / `DIRECT_URL` di `backend/.env`
- Coba: `npx prisma validate`

## Contributing

```bash
git checkout -b feat/<short-name>
# lakukan perubahan
git add .
git commit -m "feat: <message>"
git push -u origin feat/<short-name>
```

Buat Pull Request dari fork kamu ke branch `main`.
