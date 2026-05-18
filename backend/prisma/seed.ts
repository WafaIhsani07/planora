import { db as prisma } from '../src/config/database.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Memeriksa dan membuat data awal jika belum ada...');
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Buat User Customer jika belum ada
  const existingCustomer = await prisma.user.findUnique({
    where: { email: 'customer@planora.com' }
  });
  
  let customer = existingCustomer;
  if (!customer) {
    customer = await prisma.user.create({
      data: {
        email: 'customer@planora.com',
        password: passwordHash,
        name: 'Rudi Customer',
        phone: '081234567890',
        role: 'CUSTOMER',
      },
    });
    console.log('Customer Rudi dibuat.');
  }

  // 1b. Buat User Admin jika belum ada
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@planora.dev' }
  });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: 'admin@planora.dev',
        password: await bcrypt.hash('devadmin123', 10),
        name: 'Super Admin',
        role: 'ADMIN',
      },
    });
    console.log('Admin Super Admin dibuat.');
  }

  // 2. Buat User Vendor jika belum ada
  const existingVendorUser = await prisma.user.findUnique({
    where: { email: 'vendor@planora.com' }
  });
  
  let vendorUser = existingVendorUser;
  if (!vendorUser) {
    vendorUser = await prisma.user.create({
      data: {
        email: 'vendor@planora.com',
        password: passwordHash,
        name: 'Vendor WO',
        role: 'VENDOR',
      },
    });
    console.log('User Vendor WO dibuat.');
  }

  // 3. Buat Profil Vendor jika belum ada
  let vendor = await prisma.vendor.findFirst({
    where: { userId: vendorUser.id }
  });
  if (!vendor) {
    vendor = await prisma.vendor.create({
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
    console.log('Profil Vendor Wafa Media Studio dibuat.');
  }

  // 3b. Buat Vendor yang Menunggu Verifikasi jika belum ada
  const existingPendingUser = await prisma.user.findUnique({
    where: { email: 'calonvendor@gmail.com' }
  });
  
  let pendingVendorUser = existingPendingUser;
  if (!pendingVendorUser) {
    pendingVendorUser = await prisma.user.create({
      data: {
        email: 'calonvendor@gmail.com',
        password: passwordHash,
        name: 'Budi Calon Vendor',
        role: 'VENDOR',
      },
    });
    console.log('User Calon Vendor Budi dibuat.');
  }

  const existingPendingVendor = await prisma.vendor.findFirst({
    where: { userId: pendingVendorUser.id }
  });
  if (!existingPendingVendor) {
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
    console.log('Profil Vendor Catering Berkah Jaya dibuat.');
  }

  // 4. Buat Kategori jika belum ada
  let kategori = await prisma.kategori.findFirst({
    where: { slug: 'fotografi' }
  });
  if (!kategori) {
    kategori = await prisma.kategori.create({
      data: {
        name: 'Fotografi',
        slug: 'fotografi',
        description: 'Layanan fotografi pernikahan dan acara',
      },
    });
    console.log('Kategori Fotografi dibuat.');
  }

  // 5. Buat Layanan jika belum ada
  let layanan = await prisma.layanan.findFirst({
    where: { vendorId: vendor.id, kategoriId: kategori.id }
  });
  if (!layanan) {
    layanan = await prisma.layanan.create({
      data: {
        vendorId: vendor.id,
        kategoriId: kategori.id,
        name: 'Paket Foto Pernikahan Premium',
        description: 'Sudah termasuk album cetak dan softcopy 100+ foto diedit.',
        price: 5500000,
      },
    });
    console.log('Layanan Paket Foto Pernikahan Premium dibuat.');
  }

  // 6. Buat Data Booking/Pesanan jika belum ada
  const existingBooking = await prisma.booking.findFirst({
    where: { customerId: customer.id, vendorId: vendor.id }
  });
  if (!existingBooking) {
    await prisma.booking.create({
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
    console.log('Booking simulasi dibuat.');
  }

  console.log('✅ Sinkronisasi Seed berhasil tanpa menghapus data baru!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
