import { db as prisma } from '../src/config/database.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Menghapus data lama...');
  // Hapus semua data (agar bersih setiap kali di-seed)
  await prisma.booking.deleteMany();
  await prisma.layanan.deleteMany();
  await prisma.kategori.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  console.log('Membuat data user & password...');
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Buat User Customer (Bisa dipakai login di aplikasi Mobile)
  const customer = await prisma.user.create({
    data: {
      email: 'customer@planora.com',
      password: passwordHash,
      name: 'Rudi Customer',
      phone: '081234567890',
      role: 'CUSTOMER',
    },
  });

  // 1b. Buat User Admin
  await prisma.user.create({
    data: {
      email: 'admin@planora.dev',
      password: await bcrypt.hash('devadmin123', 10),
      name: 'Super Admin',
      role: 'ADMIN',
    },
  });

  // 2. Buat User Vendor
  const vendorUser = await prisma.user.create({
    data: {
      email: 'vendor@planora.com',
      password: passwordHash,
      name: 'Vendor WO',
      role: 'VENDOR',
    },
  });

  // 3. Buat Profil Vendor
  const vendor = await prisma.vendor.create({
    data: {
      userId: vendorUser.id,
      businessName: 'Wafa Media Studio',
      description: 'Vendor fotografi terbaik di Padang.',
      address: 'Jl. Khatib Sulaiman',
      city: 'Padang',
      status: 'VERIFIED',
      rating: 4.8,
    },
  });

  // 3b. Buat Vendor yang Menunggu Verifikasi (PENDING)
  const pendingVendorUser = await prisma.user.create({
    data: {
      email: 'calonvendor@gmail.com',
      password: passwordHash,
      name: 'Budi Calon Vendor',
      role: 'VENDOR',
    },
  });

  await prisma.vendor.create({
    data: {
      userId: pendingVendorUser.id,
      businessName: 'Catering Berkah Jaya',
      description: 'Layanan katering sehat dan murah.',
      address: 'Jl. Sudirman No. 10',
      city: 'Jakarta',
      status: 'PENDING',
    },
  });

  console.log('Membuat kategori & layanan...');
  // 4. Buat Kategori
  const kategori = await prisma.kategori.create({
    data: {
      name: 'Fotografi',
      slug: 'fotografi',
      description: 'Layanan fotografi pernikahan dan acara',
    },
  });

  // 5. Buat Layanan untuk Vendor
  const layanan = await prisma.layanan.create({
    data: {
      vendorId: vendor.id,
      kategoriId: kategori.id,
      name: 'Paket Foto Pernikahan Premium',
      description: 'Sudah termasuk album cetak dan softcopy 100+ foto diedit.',
      price: 5500000,
    },
  });

  console.log('Membuat data booking/pesanan simulasi...');
  // 6. Buat Data Booking/Pesanan
  const booking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      vendorId: vendor.id,
      layananId: layanan.id,
      eventDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 Hari dari sekarang
      eventAddress: 'Gedung Graha Saba, Padang',
      notes: 'Tolong disiapkan tim yang ramah',
      totalPrice: 5500000,
      status: 'PENDING',
    },
  });

  console.log('✅ Seeding berhasil!');
  console.log('==============================================');
  console.log('🔑 Gunakan akun ini untuk login di aplikasi Mobile:');
  console.log('Email: customer@planora.com');
  console.log('Pass:  password123');
  console.log('==============================================');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
