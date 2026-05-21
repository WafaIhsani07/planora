import { db as prisma } from '../src/config/database.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🧹 Membersihkan sisa data lama untuk menghindari bentrokan...');
  
  // Hapus data secara bertahap untuk mencegah masalah foreign key constraint
  await prisma.notification.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.jadwal.deleteMany({});
  await prisma.layanan.deleteMany({});
  await prisma.portfolio.deleteMany({});
  await prisma.kategori.deleteMany({});
  await prisma.vendor.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.passwordResetToken.deleteMany({});
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          'customer@planora.com',
          'admin@planora.dev',
          'vendor@planora.com',
          'calonvendor@gmail.com',
          'ritzwo@planora.com',
          'royalcatering@planora.com',
          'roselladekora@planora.com'
        ]
      }
    }
  });

  console.log('🚀 Mulai melakukan seeding data baru yang super komplit...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. BUAT AKUN CUSTOMER (RUDI)
  const customer = await prisma.user.create({
    data: {
      email: 'customer@planora.com',
      password: passwordHash,
      name: 'Rudi Hermawan',
      phone: '081234567890',
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
    },
  });
  console.log('✅ Customer Rudi Hermawan berhasil dibuat.');

  // 2. BUAT AKUN ADMIN
  await prisma.user.create({
    data: {
      email: 'admin@planora.dev',
      password: await bcrypt.hash('devadmin123', 10),
      name: 'Super Admin Planora',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin Super Admin Planora berhasil dibuat.');

  // 3. BUAT AKUN-AKUN VENDOR
  const vendorWOUser = await prisma.user.create({
    data: {
      email: 'ritzwo@planora.com',
      password: passwordHash,
      name: 'Sarah Ritz',
      role: 'VENDOR',
      phone: '089876543210',
    }
  });

  const vendorCateringUser = await prisma.user.create({
    data: {
      email: 'royalcatering@planora.com',
      password: passwordHash,
      name: 'Chef Gunawan',
      role: 'VENDOR',
      phone: '082233445566',
    }
  });

  const vendorPhotoUser = await prisma.user.create({
    data: {
      email: 'vendor@planora.com',
      password: passwordHash,
      name: 'Feri Wafa',
      role: 'VENDOR',
      phone: '081122334455',
    }
  });

  const vendorDecoUser = await prisma.user.create({
    data: {
      email: 'roselladekora@planora.com',
      password: passwordHash,
      name: 'Amelia Rosella',
      role: 'VENDOR',
      phone: '085566778899',
    }
  });

  const calonVendorUser = await prisma.user.create({
    data: {
      email: 'calonvendor@gmail.com',
      password: passwordHash,
      name: 'Budi Calon Vendor',
      role: 'VENDOR',
    }
  });
  console.log('✅ Akun-akun user Vendor berhasil dibuat.');

  // 4. BUAT PROFIL VENDOR (VERIFIED & PENDING)
  const vendorPhoto = await prisma.vendor.create({
    data: {
      userId: vendorPhotoUser.id,
      businessName: 'Wafa Media Studio',
      description: 'Layanan dokumentasi foto & video premium untuk pernikahan, pertunangan, dan wisuda dengan tim profesional berpengalaman.',
      address: 'Jl. Khatib Sulaiman No. 42',
      city: 'Padang',
      province: 'Sumatera Barat',
      status: 'VERIFIED',
      rating: 4.8,
      totalBookings: 124,
      totalReviews: 89,
      bankName: 'BANK BCA',
      bankAccount: '8123456789',
      bankHolder: 'Feri Wafa',
      balance: 15500000.00
    }
  });

  const vendorWO = await prisma.vendor.create({
    data: {
      userId: vendorWOUser.id,
      businessName: 'Ritz Wedding Organizer',
      description: 'Mewujudkan pernikahan impian Anda tanpa stres. Kami mengurus seluruh kebutuhan mulai dari perencanaan hingga hari H secara detail.',
      address: 'Sudirman Central Business District (SCBD) Kav. 52-53',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      status: 'VERIFIED',
      rating: 4.9,
      totalBookings: 215,
      totalReviews: 180,
      bankName: 'BANK Mandiri',
      bankAccount: '1230099887766',
      bankHolder: 'Sarah Ritz',
      balance: 22000000.00
    }
  });

  const vendorCatering = await prisma.vendor.create({
    data: {
      userId: vendorCateringUser.id,
      businessName: 'Royal Catering & Pastry',
      description: 'Sajian hidangan nusantara dan internasional bercitarasa tinggi dengan bahan-bahan premium yang higienis serta bersertifikat Halal.',
      address: 'Jl. Raya Darmo No. 88',
      city: 'Surabaya',
      province: 'Jawa Timur',
      status: 'VERIFIED',
      rating: 4.7,
      totalBookings: 310,
      totalReviews: 240,
      bankName: 'BANK BCA',
      bankAccount: '0112233445',
      bankHolder: 'CV Royal Sejahtera',
    }
  });

  const vendorDeco = await prisma.vendor.create({
    data: {
      userId: vendorDecoUser.id,
      businessName: 'Rosella Decoration',
      description: 'Dekorasi pernikahan estetik bernuansa rustik, modern, floral klasik, maupun adat tradisi daerah dengan sentuhan bunga-bunga segar terbaik.',
      address: 'Jl. Setiabudi No. 120',
      city: 'Bandung',
      province: 'Jawa Barat',
      status: 'VERIFIED',
      rating: 4.6,
      totalBookings: 98,
      totalReviews: 70,
      bankName: 'BANK BNI',
      bankAccount: '0987654321',
      bankHolder: 'Amelia Rosella',
      balance: 8500000.00
    }
  });

  // Calon Vendor PENDING untuk pengujian admin
  await prisma.vendor.create({
    data: {
      userId: calonVendorUser.id,
      businessName: 'Catering Berkah Jaya',
      description: 'Layanan katering sehat, lezat, dan murah meriah untuk wilayah Jakarta Timur.',
      address: 'Jl. Raya Pulo Gadung No. 10',
      city: 'Jakarta Timur',
      province: 'DKI Jakarta',
      status: 'PENDING',
    }
  });
  console.log('✅ Profil Vendor VERIFIED & PENDING berhasil dibuat.');

  // 5. BUAT KATEGORI
  const catWO = await prisma.kategori.create({
    data: { name: 'Wedding Organizer', slug: 'wedding-organizer', description: 'Perencanaan dan koordinasi pesta pernikahan' }
  });
  const catCatering = await prisma.kategori.create({
    data: { name: 'Catering & Sajian', slug: 'catering', description: 'Hidangan prasmanan, gubukan, nasi box, dan pastry' }
  });
  const catPhoto = await prisma.kategori.create({
    data: { name: 'Fotografi & Video', slug: 'fotografi', description: 'Dokumentasi momen berharga berstandar sinematik' }
  });
  const catDeco = await prisma.kategori.create({
    data: { name: 'Dekorasi Pernikahan', slug: 'dekorasi', description: 'Dekorasi panggung, lorong, pencahayaan, dan photobooth' }
  });
  console.log('✅ Kategori-kategori berhasil dibuat.');

  // 6. BUAT LAYANAN (SERVICES) UNTUK MASING-MASING VENDOR
  // Fotografi Layanan
  const layPhotoPremium = await prisma.layanan.create({
    data: {
      vendorId: vendorPhoto.id,
      kategoriId: catPhoto.id,
      name: 'Paket Foto Pernikahan Premium',
      description: 'Layanan full-day dokumentasi pernikahan. Termasuk 2 fotografer, 1 videografer, album kolase cetak eksklusif ukuran 30x40 cm, 150+ foto diedit warna dan retouch wajah, video sinematik 3 menit, serta flashdisk berisi seluruh softcopy.',
      price: 5500000.00,
      duration: 12,
      images: ['https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=300&auto=format&fit=crop']
    }
  });

  const layPhotoEngagement = await prisma.layanan.create({
    data: {
      vendorId: vendorPhoto.id,
      kategoriId: catPhoto.id,
      name: 'Paket Dokumentasi Lamaran / Tunangan',
      description: 'Layanan setengah hari (maksimal 5 jam). Termasuk 1 fotografer profesional, 50 foto pilihan diedit, dan seluruh softcopy via Google Drive.',
      price: 2000000.00,
      duration: 5,
      images: ['https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=300&auto=format&fit=crop']
    }
  });

  // WO Layanan
  const layWOFull = await prisma.layanan.create({
    data: {
      vendorId: vendorWO.id,
      kategoriId: catWO.id,
      name: 'Full Wedding Organizer & Planner (Max 800 Tamu)',
      description: 'Pendampingan penuh sejak 6 bulan sebelum hari pernikahan. Mencakup pemilihan vendor, pengelolaan anggaran, rapat keluarga, pembuatan rundown acara detail, gladi bersih, hingga koordinasi tim lapangan isi 10 kru pada hari H.',
      price: 15000000.00,
      duration: 24,
      images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=300&auto=format&fit=crop']
    }
  });

  // Catering Layanan
  const layCateringGold = await prisma.layanan.create({
    data: {
      vendorId: vendorCatering.id,
      kategoriId: catCatering.id,
      name: 'Buffet Menu Gold (Minimal 500 Porsi)',
      description: 'Sajian prasmanan premium lengkap. Termasuk 2 menu nasi, 3 hidangan daging/ayam pilihan, 1 hidangan sayuran, sup kehangatan, aneka buah potong, 2 jenis puding manis, softdrink, dan es krim segar sebagai penutup.',
      price: 45000000.00,
      duration: 8,
      images: ['https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=300&auto=format&fit=crop']
    }
  });

  // Dekorasi Layanan
  const layDecoRustik = await prisma.layanan.create({
    data: {
      vendorId: vendorDeco.id,
      kategoriId: catDeco.id,
      name: 'Dekorasi Florist Rustik Modern 12 Meter',
      description: 'Dekorasi panggung megah minimalis rustik sepanjang 12 meter dengan perpaduan apik kayu jati belanda asli, dedaunan kering eksotis, dan aneka bunga mawar segar wangi berlimpah. Sudah termasuk karpet jalan, kotak amplop, dan pergola pintu masuk.',
      price: 18500000.00,
      duration: 24,
      images: ['https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop']
    }
  });
  console.log('✅ Layanan (Services) berhasil dibuat.');

  // 7. BUAT KETERSEDIAAN JADWAL (JADWAL ACARA VENDOR)
  // Buat tanggal penting di minggu depan
  const today = new Date();
  
  // Tanggal penting untuk event Confirmed (Jadwal 1)
  const targetEventDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 8, 0, 0); 
  const targetDateOnly = new Date(targetEventDate.getFullYear(), targetEventDate.getMonth(), targetEventDate.getDate());

  // Tanggal penting untuk event Pending (Jadwal 2)
  const pendingEventDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 9, 0, 0);
  const pendingDateOnly = new Date(pendingEventDate.getFullYear(), pendingEventDate.getMonth(), pendingEventDate.getDate());

  // Tanggal penting untuk event Completed (Jadwal 3 - kemarin)
  const completedEventDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3, 10, 0, 0);
  const completedDateOnly = new Date(completedEventDate.getFullYear(), completedEventDate.getMonth(), completedEventDate.getDate());

  const jadwalConfirmed = await prisma.jadwal.create({
    data: {
      vendorId: vendorPhoto.id,
      date: targetDateOnly,
      isAvailable: false,
      note: 'Terbooking oleh Rudi Hermawan (Paket Foto Pernikahan Premium)'
    }
  });

  const jadwalPending = await prisma.jadwal.create({
    data: {
      vendorId: vendorDeco.id,
      date: pendingDateOnly,
      isAvailable: false,
      note: 'Dipesan oleh Rudi Hermawan (Dekorasi Florist Rustik)'
    }
  });

  const jadwalCompleted = await prisma.jadwal.create({
    data: {
      vendorId: vendorWO.id,
      date: completedDateOnly,
      isAvailable: false,
      note: 'Selesai diselenggarakan (Sarah Ritz Full WO)'
    }
  });
  console.log('✅ Ketersediaan Jadwal berhasil di-set.');

  // 8. BUAT DATA BOOKING (PESANAN ACARA) UNTUK RUDI
  
  // A. BOOKING 1: PENDING (Menunggu Pembayaran)
  const bookingPending = await prisma.booking.create({
    data: {
      customerId: customer.id,
      vendorId: vendorDeco.id,
      layananId: layDecoRustik.id,
      jadwalId: jadwalPending.id,
      eventDate: pendingEventDate,
      eventAddress: 'Restoran Bunga Rampai, Jakarta Pusat',
      notes: 'Tolong siapkan bunga berwarna dominan peach lembut dan putih agar cocok dengan gaun pengantin.',
      totalPrice: 18500000.00,
      status: 'PENDING',
    }
  });

  // B. BOOKING 2: CONFIRMED (Sudah dibayar & dijadwalkan berjalan)
  const bookingConfirmed = await prisma.booking.create({
    data: {
      customerId: customer.id,
      vendorId: vendorPhoto.id,
      layananId: layPhotoPremium.id,
      jadwalId: jadwalConfirmed.id,
      eventDate: targetEventDate,
      eventAddress: 'Gedung Graha Saba, Kota Padang',
      notes: 'Acara dimulai pagi pukul 08:00 WIB. Tim dokumentasi diharapkan sudah standby di lokasi sejak pukul 07:00 WIB.',
      totalPrice: 5500000.00,
      status: 'CONFIRMED',
    }
  });

  // C. BOOKING 3: COMPLETED (Selesai, Lunas & Diberi Review)
  const bookingCompleted = await prisma.booking.create({
    data: {
      customerId: customer.id,
      vendorId: vendorWO.id,
      layananId: layWOFull.id,
      jadwalId: jadwalCompleted.id,
      eventDate: completedEventDate,
      eventAddress: 'Ballroom Hotel Shangri-La, Jakarta Pusat',
      notes: 'Pernikahan adat minang modern.',
      totalPrice: 15000000.00,
      status: 'COMPLETED',
    }
  });

  // D. BOOKING 4: CANCELLED (Dibatalkan)
  const bookingCancelled = await prisma.booking.create({
    data: {
      customerId: customer.id,
      vendorId: vendorCatering.id,
      layananId: layCateringGold.id,
      eventDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 20),
      eventAddress: 'Gedung Kartika, Surabaya',
      notes: 'Dibatalkan karena perubahan rencana keluarga besar.',
      totalPrice: 45000000.00,
      status: 'CANCELLED',
      cancelReason: 'Permintaan customer: Pemindahan tempat pelaksanaan resepsi ke kota lain.'
    }
  });
  console.log('✅ Booking multi-status berhasil dibuat.');

  // 9. BUAT TRANSAKSI PEMBAYARAN (PAYMENT)
  // Pembayaran untuk Booking 2: CONFIRMED (LUNAS)
  await prisma.payment.create({
    data: {
      bookingId: bookingConfirmed.id,
      amount: 5500000.00,
      status: 'PAID',
      method: 'BANK_TRANSFER',
      proofUrl: 'https://placehold.co/600x400/png?text=Bukti+Transfer+Rudi',
      paidAt: new Date(),
      verifiedAt: new Date(),
      verifiedBy: 'Super Admin Planora'
    }
  });

  // Pembayaran untuk Booking 3: COMPLETED (LUNAS)
  await prisma.payment.create({
    data: {
      bookingId: bookingCompleted.id,
      amount: 15000000.00,
      status: 'PAID',
      method: 'BANK_TRANSFER',
      proofUrl: 'https://placehold.co/600x400/png?text=Bukti+Transfer+Sarah+WO',
      paidAt: new Date(completedEventDate.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 hari sebelum acara
      verifiedAt: new Date(completedEventDate.getTime() - 2 * 24 * 60 * 60 * 1000),
      verifiedBy: 'Super Admin Planora'
    }
  });

  // Pembayaran untuk Booking 1: PENDING (Menunggu Verifikasi Admin)
  await prisma.payment.create({
    data: {
      bookingId: bookingPending.id,
      amount: 18500000.00,
      status: 'PENDING',
      method: 'BANK_TRANSFER',
      proofUrl: 'https://placehold.co/600x400/png?text=Bukti+Transfer+Pending'
    }
  });

  // Pembayaran untuk Booking 4: CANCELLED (Ditolak / FAILED)
  await prisma.payment.create({
    data: {
      bookingId: bookingCancelled.id,
      amount: 45000000.00,
      status: 'FAILED',
      method: 'BANK_TRANSFER',
      proofUrl: 'https://placehold.co/600x400/png?text=Bukti+Transfer+Palsu',
      note: 'Bukti transfer buram dan tidak valid.',
      verifiedAt: new Date(),
      verifiedBy: 'Super Admin Planora'
    }
  });
  console.log('✅ Data transaksi Pembayaran (Payment) berhasil dibuat.');

  // 10. BUAT DATA ULASAN (REVIEW)
  // Ulasan bintang 5 dari Rudi untuk Ritz WO (Booking 3)
  await prisma.review.create({
    data: {
      bookingId: bookingCompleted.id,
      customerId: customer.id,
      vendorId: vendorWO.id,
      rating: 5,
      comment: 'Sangat puas dengan layanan Ritz WO! Seluruh tim sangat cekatan, ramah, dan profesional menjaga rundown acara tetap lancar dari awal akad nikah hingga resepsi malam hari selesai tanpa hambatan.',
      reply: 'Terima kasih banyak kak Rudi atas kepercayaannya mempercayakan hari bahagia bersama Ritz Wedding Organizer. Kami doakan semoga bahagia senantiasa! ❤️'
    }
  });
  console.log('✅ Data ulasan Ulasan (Review) berhasil dibuat.');

  // 11. BUAT NOTIFIKASI SIMULASI UNTUK RUDI
  await prisma.notification.create({
    data: {
      userId: customer.id,
      title: 'Pesanan Dikonfirmasi 🎉',
      message: 'Pesanan Anda untuk Paket Foto Pernikahan Premium di Wafa Media Studio pada tanggal ' + targetEventDate.toString().substring(0, 10) + ' telah dikonfirmasi dan lunas.',
      type: 'BOOKING',
      isRead: false,
    }
  });

  await prisma.notification.create({
    data: {
      userId: customer.id,
      title: 'Menunggu Pembayaran 💳',
      message: 'Segera lakukan pembayaran untuk pesanan Dekorasi Florist Rustik Modern Anda di Rosella Decoration sebesar Rp 18.500.000 sebelum batas waktu berakhir.',
      type: 'PAYMENT',
      isRead: false,
    }
  });

  await prisma.notification.create({
    data: {
      userId: customer.id,
      title: 'Selamat Datang di Planora! ✨',
      message: 'Mulai petualangan Anda merencanakan momen terindah bersama vendor-vendor terbaik se-Indonesia pilihan Planora.',
      type: 'SYSTEM',
      isRead: true,
    }
  });
  console.log('✅ Data Notifikasi simulasi berhasil dibuat.');

  // 12. BUAT DATA PENCAIRAN DANA (WITHDRAWALS)
  await prisma.withdrawal.create({
    data: {
      vendorId: vendorPhoto.id,
      amount: 4250000.00,
      status: 'PENDING',
      bankName: 'BANK BCA',
      bankAccount: '8123456789',
      bankHolder: 'Feri Wafa',
    }
  });

  await prisma.withdrawal.create({
    data: {
      vendorId: vendorWO.id,
      amount: 8500000.00,
      status: 'PROCESSING',
      bankName: 'BANK Mandiri',
      bankAccount: '1230099887766',
      bankHolder: 'Sarah Ritz',
    }
  });

  await prisma.withdrawal.create({
    data: {
      vendorId: vendorDeco.id,
      amount: 3200000.00,
      status: 'COMPLETED',
      bankName: 'BANK BNI',
      bankAccount: '0987654321',
      bankHolder: 'Amelia Rosella',
      proofUrl: 'https://placehold.co/600x400/png?text=Bukti+Transfer+Pencairan',
    }
  });

  console.log('✅ Data Pencairan Dana berhasil dibuat.');

  console.log('🚀🌟 SEED SINKRONISASI DATABASE BERHASIL PENUH & SIAP DIGUNAKAN! 🌟🚀');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
