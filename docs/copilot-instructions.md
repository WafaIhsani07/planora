# Copilot Instructions — Planora

Dokumen ini berisi pedoman untuk GitHub Copilot ketika membantu mengerjakan repo **Planora**.

## Konteks Proyek

- Repo berisi beberapa folder, namun yang aktif saat ini adalah **backend** di `backend/`.
- Backend: Node.js + TypeScript + Express + Prisma.
- Backend berjalan default di port **5000** (lihat `PORT` di `backend/.env`).

## Aturan Umum

- Fokus pada perubahan yang diminta saja (hindari "nice-to-have" tanpa diminta).
- Pertahankan gaya/struktur folder yang sudah ada.
- Jangan menambahkan dependensi baru tanpa alasan yang jelas.
- Jangan menulis atau membocorkan kredensial.
  - Jangan pernah memasukkan nilai real untuk `DATABASE_URL`/`DIRECT_URL` ke dalam commit.
  - Gunakan placeholder di file contoh (`.env.example`).

## TypeScript / ESM (Penting)

Backend menggunakan ESM:

- `backend/package.json` memiliki `"type": "module"`.
- `backend/tsconfig.json` memakai `module`/`moduleResolution` = `NodeNext`.

Konsekuensinya:

- Import file lokal **wajib** memakai ekstensi `.js` di source TS (NodeNext ESM), misalnya:
  - ✅ `import app from "./app.js"` (file fisik: `app.ts`)
  - ❌ `import app from "./app"`
- Untuk import tipe dari dependency, gunakan `type` import bila hanya tipe:
  - ✅ `import { type Request, type Response } from "express"`

## Prisma (v7)

- Prisma CLI dikonfigurasi melalui `backend/prisma.config.ts`.
- Di Prisma v7, `datasource.url` **tidak** boleh ada di `backend/prisma/schema.prisma`.
  - URL database dibaca dari environment (`backend/.env`) melalui `prisma.config.ts`.

Perintah umum:

```bash
cd backend
npx prisma validate
npx prisma generate
npx prisma migrate dev
```

Catatan koneksi:

- Gunakan `DATABASE_URL` untuk koneksi normal.
- Gunakan `DIRECT_URL` untuk koneksi direct/non-pooled (sering lebih stabil untuk migrate).

## Environment Variables

- File env yang dipakai backend: `backend/.env`.
- Contoh aman: `backend/.env.example` (tanpa credential nyata).

Minimal env yang diharapkan:

- `PORT=5000`
- `DATABASE_URL=...`
- `DIRECT_URL=...` (opsional tapi disarankan)

## Struktur Backend yang Direkomendasikan

- Entrypoint server: `backend/src/server.ts`
- Express app: `backend/src/app.ts`
- Prisma client singleton: `backend/src/config/prisma.ts`
- Controller: `backend/src/controllers/*`
- Routes: `backend/src/routes/*`

## Cara Menjalankan

Dari root repo:

```bash
npm run dev
```

Atau langsung dari backend:

```bash
cd backend
npm run dev
```

## Konvensi Kode

- Gunakan TypeScript strict (hindari `any`).
- Tangani error dengan response JSON yang konsisten.
- Jangan hardcode port/URL; gunakan env.
- Jangan mengubah format besar-besaran (prettier/lint) jika tidak diperlukan.

## Checklist Saat Membuat PR

- Pastikan `npm run dev` berjalan.
- Jika mengubah schema Prisma:
  - Jalankan `npx prisma validate`.
  - Jalankan `npx prisma migrate dev` bila diperlukan.
- Pastikan tidak ada file `.env` atau secret yang ter-commit.
