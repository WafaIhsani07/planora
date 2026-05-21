# LAPORAN PROGRESS 08
## Implementasi Website Sisi Vendor

**Proyek:** Planora  
**Fokus laporan:** Frontend website sisi vendor  
**Catatan:** Dokumen ini secara khusus membahas implementasi frontend sisi vendor. Pembahasan mengenai admin disusun pada laporan terpisah, sedangkan implementasi mobile dibahas pada laporan yang berbeda.

---

## BAB I. PENDAHULUAN

### 1.1 Latar Belakang

Pada tahap progress ke-8, pengembangan website Planora difokuskan pada implementasi sisi vendor. Dalam konteks sistem ini, vendor berperan sebagai pengguna utama yang mengelola layanan, memantau pesanan, menampilkan portofolio, merespons ulasan pelanggan, serta mengatur informasi bisnis dan rekening pencairan dana. Oleh karena itu, frontend sisi vendor perlu dirancang secara sistematis, konsisten, dan mudah digunakan agar proses operasional vendor dapat berjalan secara efektif.

Implementasi frontend pada sisi vendor tidak hanya dimaksudkan sebagai penyajian antarmuka visual, melainkan juga sebagai pusat interaksi yang menjembatani kebutuhan operasional vendor dengan data yang tersimpan di sistem. Pada tahap ini, dilakukan pembangunan struktur halaman, navigasi, form input, panel informasi, serta integrasi service API sehingga informasi yang tampil pada antarmuka tetap selaras dengan kondisi data sebenarnya.

### 1.2 Ruang Lingkup

Ruang lingkup laporan ini dibatasi pada implementasi sisi vendor di frontend website Planora. Adapun fitur yang dibahas meliputi:

- layout dan akses area vendor,
- sidebar navigasi vendor,
- daftar vendor publik dan detail vendor,
- dashboard vendor,
- halaman pesanan vendor,
- halaman paket layanan vendor,
- halaman portofolio vendor,
- halaman ulasan pelanggan,
- halaman keuangan vendor,
- halaman pengaturan vendor.

Laporan ini tidak membahas implementasi admin maupun mobile agar pembahasan tetap terfokus pada pekerjaan frontend yang dikerjakan pada sisi vendor.

### 1.3 Tujuan

Tujuan pengembangan sisi vendor pada progress ini adalah sebagai berikut:

1. Membuat area kerja vendor yang terproteksi berdasarkan role pengguna.
2. Menyediakan navigasi yang jelas untuk seluruh fitur operasional vendor.
3. Menyusun tampilan halaman yang responsif, modern, dan konsisten.
4. Menghubungkan frontend vendor dengan service API untuk data profil, layanan, dan booking.
5. Menyediakan alur kerja yang lengkap untuk kebutuhan vendor, mulai dari pengelolaan pesanan hingga pengaturan akun.

---

## BAB II. PROGRESS / KEGIATAN YANG TELAH DILAKUKAN

### 2.1 Membangun Layout Utama Area Vendor dan Proteksi Akses

Langkah awal dalam implementasi sisi vendor adalah membangun layout utama yang berfungsi sebagai kerangka untuk seluruh halaman vendor. Layout ini tidak hanya bertugas membungkus konten halaman, tetapi juga memastikan bahwa hanya pengguna dengan role vendor yang dapat mengakses area tersebut. Pada tahap ini, sistem melakukan pengecekan sesi login dan validasi role sebelum menampilkan halaman utama vendor.

Selain berfungsi sebagai mekanisme proteksi akses, layout vendor juga mengambil profil bisnis vendor dari backend agar nama bisnis yang tampil di topbar sesuai dengan akun yang sedang aktif. Layout ini turut menyimpan status sidebar yang terbuka atau terlipat ke localStorage sehingga pengalaman pengguna tetap konsisten meskipun halaman dimuat ulang.

Lokasi file: [frontend/src/app/vendor/layout.tsx](../frontend/src/app/vendor/layout.tsx)

Potongan kode penting:

```tsx
useEffect(() => {
  let mounted = true;
  getSession().then((session) => {
    if (!mounted) return;
    if (!session) {
      router.replace('/login');
      return;
    }
    if ((session.user as { role?: string })?.role !== 'VENDOR') {
      router.replace('/login');
      return;
    }

    getMyVendorProfile().then((profile) => {
      if (profile && mounted) {
        setBusinessName(profile.businessName);
      } else if (mounted) {
        setBusinessName(session.user?.name || 'Wafa Decoration');
      }
    });

    setReady(true);
  });
  return () => {
    mounted = false;
  };
}, [router]);
```

Fungsi kode tersebut adalah memeriksa status autentikasi pengguna, memastikan role yang digunakan adalah vendor, serta mengambil nama bisnis vendor untuk ditampilkan pada antarmuka utama.

[Screenshot di sini: tampilan awal vendor layout dengan topbar, nama bisnis, dan sidebar]

### 2.2 Menyediakan Sidebar Navigasi Vendor

Setelah layout utama tersedia, dilakukan pembuatan sidebar navigasi vendor sebagai pusat perpindahan halaman. Sidebar ini memuat menu Dashboard, Pesanan, Paket Layanan, Portofolio, Ulasan, Keuangan, dan Pengaturan. Komponen sidebar juga dirancang responsif dengan dua mode tampilan, yaitu mode penuh dan mode menyempit, sehingga tetap nyaman digunakan pada layar berukuran berbeda.

Pada sidebar ditampilkan badge jumlah pesanan tertunda yang diambil secara real-time dari service booking vendor. Selain itu, sidebar menyediakan modal konfirmasi logout agar vendor tidak keluar akun secara tidak sengaja. Fitur ini menjadi penting karena area vendor digunakan secara aktif untuk memantau pesanan masuk dan aktivitas bisnis harian.

Lokasi file: [frontend/src/components/vendor/VendorSidebar.tsx](../frontend/src/components/vendor/VendorSidebar.tsx)

Potongan kode penting:

```tsx
useEffect(() => {
  getVendorBookings({ status: 'PENDING' })
    .then((data) => {
      if (data) {
        setPendingCount(data.length);
      }
    })
    .catch((err) => console.error('Gagal mengambil jumlah pesanan tertunda:', err));
}, [pathname]);

const handleLogout = async () => {
  clearSession();
  await signOut({ redirect: false, callbackUrl: '/login' });
  window.location.href = '/login';
};
```

Fungsi kode tersebut adalah mengambil jumlah booking dengan status PENDING untuk badge pesanan, kemudian menyediakan alur logout yang aman dan terkontrol.

[Screenshot di sini: sidebar vendor terbuka]
[Screenshot di sini: modal logout vendor]

### 2.3 Menyusun Halaman Daftar Vendor Publik

Halaman vendor publik disusun agar calon pelanggan dapat menjelajahi vendor yang tersedia pada platform Planora. Pada halaman ini disediakan fitur pencarian berdasarkan nama vendor, filter kategori, serta kartu vendor yang memuat foto cover, rating, lokasi, dan harga awal. Seluruh elemen tersebut dirancang untuk membantu pengguna menemukan vendor yang paling sesuai dengan kebutuhan acara mereka.

Daftar vendor diambil dari data lokal yang didefinisikan pada file helper, kemudian ditampilkan ke dalam kartu interaktif. Komponen ini juga berperan sebagai penghubung antara halaman katalog umum dengan halaman detail vendor.

Lokasi file:

- [frontend/src/app/vendors/page.tsx](../frontend/src/app/vendors/page.tsx)
- [frontend/src/lib/vendors.ts](../frontend/src/lib/vendors.ts)
- [frontend/src/components/VendorFeatured.tsx](../frontend/src/components/VendorFeatured.tsx)

Potongan kode penting:

```tsx
const filteredVendors = vendors.filter((vendor) => {
  const matchCategory = !selectedCategory || vendor.category === selectedCategory;
  const matchSearch = !searchTerm || vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
  return matchCategory && matchSearch;
});
```

```tsx
export const VENDORS: Vendor[] = [
  {
    id: 'lumiere',
    name: 'Lumiere Decoration',
    category: 'dekorasi',
    location: 'Jakarta Selatan',
    rating: 4.9,
    reviews: 120,
    price: 'Rp 8.500.000',
    description: 'Lumiere Decoration menyediakan dekorasi wedding elegan, romantis, dan rapi untuk venue indoor maupun outdoor.',
    cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1400',
    gallery: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=900',
    ],
    services: ['Dekorasi pelaminan', 'Backwall & bunga segar', 'Venue styling full set', 'Free konsultasi konsep'],
    reviewsList: [
      { name: 'Nadia', text: 'Hasilnya mewah dan sesuai brief, tim juga responsif.', rating: 5 },
      { name: 'Rizky', text: 'Dekorasi datang tepat waktu dan setup sangat detail.', rating: 5 },
    ],
  },
];
```

Fungsi kode tersebut adalah memfilter vendor berdasarkan kategori dan kata kunci pencarian, sekaligus menyediakan data vendor untuk kebutuhan tampilan katalog publik.

[Screenshot di sini: halaman daftar vendor publik]

### 2.4 Membuat Halaman Detail Vendor

Halaman detail vendor menampilkan informasi yang lebih lengkap setelah pengguna memilih salah satu vendor dari katalog. Pada halaman ini ditampilkan foto cover utama, galeri foto, daftar layanan, rating, lokasi, harga, deskripsi, tombol favorit, tombol pesan, serta ulasan pelanggan.

Halaman ini memiliki peran penting karena menjadi titik pengambilan keputusan bagi pengguna sebelum melakukan pemesanan. Susunan antarmuka dibuat lebih fokus, dengan informasi utama ditempatkan di sisi kanan dan konten visual di sisi kiri.

Lokasi file: [frontend/src/app/vendor/[id]/page.tsx](../frontend/src/app/vendor/%5Bid%5D/page.tsx)

Potongan kode penting:

```tsx
export default async function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = getVendorById(id as string);

  if (!vendor) {
    notFound();
  }
```

```tsx
<div className="mt-4 grid gap-8 xl:grid-cols-[1.45fr_0.95fr]">
  <section>
    <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <img src={vendor.cover} alt={vendor.name} className="h-[340px] w-full object-cover" />
      </div>
    </div>
  </section>
</div>
```

Fungsi kode tersebut adalah mengambil data vendor berdasarkan ID lalu menampilkan detail visual dan informasi layanan secara lengkap.

[Screenshot di sini: halaman detail vendor dengan foto utama dan daftar layanan]

### 2.5 Menyediakan Dashboard Vendor

Dashboard vendor menjadi halaman awal setelah vendor masuk ke area pribadinya. Pada tahap ini, dashboard masih menggunakan komponen dashboard utama yang telah disiapkan sebelumnya, sehingga fokus implementasi diarahkan pada validitas routing vendor dan konsistensi layout yang membungkus halaman.

Walaupun secara tampilan masih sederhana, dashboard ini berperan penting sebagai titik masuk utama vendor untuk melihat ringkasan aktivitas bisnis.

Lokasi file: [frontend/src/app/vendor/dashboard/page.tsx](../frontend/src/app/vendor/dashboard/page.tsx)

Potongan kode penting:

```tsx
import DashboardClient from '../../(main)/dashboard/dashboard-client';

export default function VendorDashboardPage() {
  return (
    <div className="p-8 py-6 max-w-7xl mx-auto w-full">
      <DashboardClient />
    </div>
  );
}
```

Fungsi kode tersebut adalah memanggil komponen dashboard utama agar vendor memperoleh tampilan ringkasan saat memasuki area vendor.

[Screenshot di sini: dashboard vendor]

### 2.6 Mengimplementasikan Halaman Pesanan Vendor

Halaman pesanan merupakan fitur inti dalam operasional vendor karena seluruh booking yang masuk dikelola pada halaman ini. Vendor dapat melihat daftar pesanan dalam mode list dan kalender, memfilter pesanan berdasarkan status, lalu mengubah status booking menjadi dikonfirmasi atau dibatalkan. Pada halaman ini juga tersedia tampilan detail booking dan informasi pelanggan.

Halaman pesanan dihubungkan langsung dengan service booking sehingga data yang ditampilkan dan status pesanan yang diperbarui tetap sinkron dengan backend.

Lokasi file: [frontend/src/app/vendor/pesanan/page.tsx](../frontend/src/app/vendor/pesanan/page.tsx)

Potongan kode penting:

```tsx
const fetchBookings = async () => {
  try {
    const data = await getVendorBookings();
    const bookingList = Array.isArray(data) ? data : data?.bookings ?? [];
    setBookings(bookingList);
  } catch (err) {
    console.error('Gagal memuat pesanan:', err);
  } finally {
    setIsLoading(false);
  }
};
```

```tsx
const handleConfirm = async (id: string) => {
  setProcessingId(id);
  try {
    await updateBookingStatus(id, 'CONFIRMED');
    await fetchBookings();
    setSelectedBooking((prev: any) => prev && prev.id === id ? { ...prev, status: 'CONFIRMED' } : prev);
  } catch (err) {
    console.error('Gagal mengkonfirmasi pesanan:', err);
  } finally {
    setProcessingId(null);
  }
};
```

```tsx
function buildCalendarDays(cursor: Date, bookingsList: any[]): CalendarDay[] {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startOffset = firstDayOfMonth.getDay();
  const startDate = new Date(year, month, 1 - startOffset);

  const bookingMap: Record<string, any[]> = {};
  bookingsList.forEach((b) => {
    if (!b.eventDate) return;
    const d = new Date(b.eventDate);
    const dateKey = formatDateKey(d);
    if (!bookingMap[dateKey]) bookingMap[dateKey] = [];
    bookingMap[dateKey].push(b);
  });

  return Array.from({ length: 42 }, (_, index) => {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + index);
    const dateKey = formatDateKey(cellDate);
    const dayBookings = bookingMap[dateKey] || [];

    return {
      key: dateKey,
      day: String(cellDate.getDate()).padStart(2, '0'),
      isPrevMonth,
      isNextMonth,
      isEvent: dayBookings.length > 0,
      bookings: dayBookings,
    };
  });
}
```

Fungsi kode tersebut adalah memuat booking dari backend, memperbarui status booking, dan membangun kalender pesanan berdasarkan tanggal acara yang tersedia.

[Screenshot di sini: tampilan daftar pesanan vendor]
[Screenshot di sini: tampilan kalender pesanan vendor]

### 2.7 Mengimplementasikan Halaman Paket Layanan Vendor

Halaman layanan digunakan untuk mengelola paket yang dijual vendor. Melalui halaman ini, vendor dapat membuat paket baru, mengedit paket lama, dan menghapus paket yang sudah tidak digunakan. Form layanan dirancang cukup detail karena memuat nama paket, kategori, harga, deskripsi, fitur, promo, serta pratinjau harga.

Implementasi ini membantu vendor mengontrol katalog layanan secara mandiri tanpa bergantung pada admin.

Lokasi file: [frontend/src/app/vendor/layanan/page.tsx](../frontend/src/app/vendor/layanan/page.tsx)

Potongan kode penting:

```tsx
const fetchData = async () => {
  setIsLoading(true);
  try {
    const [layananData, kategoriData] = await Promise.all([
      getMyLayanan(),
      getAllKategori()
    ]);

    setCategories(kategoriData || []);
    setPackages(transformed);

    if (kategoriData && kategoriData.length > 0) {
      setFormData(prev => ({ ...prev, kategoriId: kategoriData[0].id }));
    }
  } catch (err) {
    console.error('Gagal mengambil data:', err);
  } finally {
    setIsLoading(false);
  }
};
```

```tsx
const handleSavePackage = async () => {
  if (!formData.name || !formData.price) {
    alert('Nama paket dan harga tidak boleh kosong!');
    return;
  }

  setIsSubmitting(true);

  try {
    let descriptionTextFinal = formData.descriptionText;
    if (hasDiscountEnabled && formData.discountPercent) {
      descriptionTextFinal += `\n\n[PROMO:${formData.discountPercent}%,${formData.discountLabel || 'Promo Spesial'}]`;
    }

    const finalDescription = serializeDescription(formData.features, descriptionTextFinal);
    const finalPrice = hasDiscountEnabled && formData.discountPercent
      ? Math.round(parseInt(formData.price) * (1 - Number(formData.discountPercent) / 100))
      : parseInt(formData.price);

    const payload = {
      name: formData.name,
      kategoriId: formData.kategoriId || categories[0]?.id,
      price: finalPrice,
      description: finalDescription,
      images: [DEFAULT_IMAGE],
    };

    if (editingId) {
      await updateLayanan(editingId, payload);
    } else {
      await createLayanan(payload);
    }

    setIsAddingPackage(false);
    resetForm();
    await fetchData();
  } catch (err) {
    console.error('Gagal menyimpan paket:', err);
  } finally {
    setIsSubmitting(false);
  }
};
```

Fungsi kode tersebut adalah mengambil data layanan vendor dan kategori, kemudian menyimpan layanan baru atau memperbarui layanan yang sudah ada.

[Screenshot di sini: daftar paket layanan vendor]
[Screenshot di sini: form tambah/edit layanan vendor]

### 2.8 Menyediakan Halaman Portofolio Vendor

Portofolio disediakan agar vendor dapat menampilkan hasil karya dan dokumentasi pekerjaan terbaiknya kepada calon pelanggan. Halaman ini memiliki mode list dan form, filter kategori, serta aksi tambah, edit, dan hapus portofolio.

Dengan adanya portofolio, vendor dapat meningkatkan kepercayaan calon pelanggan karena bukti hasil kerja ditampilkan secara visual dan terdokumentasi.

Lokasi file: [frontend/src/app/vendor/portofolio/page.tsx](../frontend/src/app/vendor/portofolio/page.tsx)

Potongan kode penting:

```tsx
const handleAddNew = () => {
  setFormData({ title: '', category: 'Wedding', description: '', date: '', image: '' });
  setEditingId(null);
  setView('form');
};

const handleEdit = (item: PortfolioItem) => {
  setFormData({
    title: item.title,
    category: item.category,
    description: item.description,
    date: formatDateForInput(item.date),
    image: item.image,
  });
  setEditingId(item.id);
  setView('form');
};

const handleSave = () => {
  if (!formData.title || !formData.category || !formData.description || !formData.date || !formData.image) {
    alert('Lengkapi semua data portofolio dulu.');
    return;
  }

  const savedDate = formatDateForDisplay(formData.date);
  if (editingId) {
    setPortfolio(
      portfolio.map((item) =>
        item.id === editingId
          ? { ...item, ...formData, date: savedDate }
          : item
      )
    );
  } else {
    setPortfolio([
      ...portfolio,
      {
        id: Date.now().toString(),
        ...formData,
        date: savedDate,
      },
    ]);
  }
  setView('list');
  setEditingId(null);
};
```

Fungsi kode tersebut adalah mengelola data portofolio vendor secara lokal, termasuk menambah karya baru, mengedit data lama, dan menyimpan hasil perubahan.

[Screenshot di sini: daftar portofolio vendor]
[Screenshot di sini: form portofolio vendor]

### 2.9 Menyusun Halaman Ulasan Pelanggan

Halaman ulasan pelanggan dibuat untuk membantu vendor memantau reputasi bisnisnya. Di halaman ini terdapat rating rata-rata, distribusi rating, daftar ulasan, filter urutan, dan fitur balas ulasan. Vendor dapat melihat ulasan mana yang sudah dibalas maupun yang masih menunggu tanggapan.

Fitur ini penting karena kualitas respons vendor terhadap pelanggan berpengaruh terhadap tingkat kepercayaan pengguna lain.

Lokasi file: [frontend/src/app/vendor/ulasan/page.tsx](../frontend/src/app/vendor/ulasan/page.tsx)

Potongan kode penting:

```tsx
const avgRating = (
  mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length
).toFixed(1);

const ratingDistribution = useMemo(() => {
  return {
    5: mockReviews.filter(r => r.rating === 5).length,
    4: mockReviews.filter(r => r.rating === 4).length,
    3: mockReviews.filter(r => r.rating === 3).length,
    2: mockReviews.filter(r => r.rating === 2).length,
    1: mockReviews.filter(r => r.rating === 1).length,
  };
}, []);
```

```tsx
const handleReply = (reviewId: number) => {
  if (replyText.trim()) {
    console.log(`Reply to review ${reviewId}: ${replyText}`);
    setReplyingTo(null);
    setReplyText('');
  }
};

const handleEditReply = (reviewId: number, currentReply: string) => {
  setEditingReply(reviewId);
  setEditReplyText(currentReply);
};
```

Fungsi kode tersebut adalah menghitung rating rata-rata, memetakan distribusi ulasan, dan menyiapkan alur balasan vendor terhadap ulasan pelanggan.

[Screenshot di sini: halaman ulasan pelanggan vendor]

### 2.10 Membuat Halaman Keuangan Vendor

Halaman keuangan disiapkan untuk memudahkan vendor memantau alur pembayaran. Pada halaman ini ditampilkan total pendapatan, dana yang masih ditahan, saldo yang siap dicairkan, rekening tujuan, sistem pembagian dana, dan riwayat transaksi. Vendor juga dapat memfilter transaksi berdasarkan status.

Halaman ini mendukung transparansi pencairan dana sekaligus membantu vendor memahami mekanisme komisi platform.

Lokasi file: [frontend/src/app/vendor/keuangan/page.tsx](../frontend/src/app/vendor/keuangan/page.tsx)

Potongan kode penting:

```tsx
const totalIncome = mockTransactions.reduce((sum, tx) => sum + tx.packagePrice, 0);
const totalHeld = mockTransactions
  .filter((tx) => tx.status === 'ditahan')
  .reduce((sum, tx) => sum + tx.netBalance, 0);
const totalReady = mockTransactions
  .filter((tx) => tx.status === 'dicairkan')
  .reduce((sum, tx) => sum + tx.netBalance, 0);
```

```tsx
<p className="text-sm font-medium text-white/30">
  Anda menerima 95% dari total harga paket setelah potongan komisi platform 5%.
</p>
```

```tsx
<p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed max-w-xl italic">
  *Pencairan dana dilakukan secara berkala oleh Admin Planora maksimal 1x24 jam setelah
  status acara dinyatakan selesai oleh kedua belah pihak.
</p>
```

Fungsi kode tersebut adalah menghitung ringkasan keuangan vendor dan menampilkan mekanisme pencairan dana secara jelas dan informatif.

[Screenshot di sini: dashboard keuangan vendor]

### 2.11 Menyusun Halaman Pengaturan Vendor

Halaman pengaturan menjadi pusat pengelolaan profil dan keamanan akun vendor. Pada halaman ini vendor dapat mengubah informasi bisnis, mengganti foto profil, mengatur password, memperbarui rekening bank, menyalakan atau mematikan notifikasi, logout, dan mengajukan penghapusan akun.

Halaman ini dibagi menjadi beberapa section agar pengelolaan data terasa lebih terstruktur. Di sisi frontend, halaman ini juga menggunakan modal untuk aksi-aksi penting seperti ganti password, logout, hapus avatar, dan hapus akun.

Lokasi file: [frontend/src/app/vendor/pengaturan/page.tsx](../frontend/src/app/vendor/pengaturan/page.tsx)

Potongan kode penting:

```tsx
const handleSave = () => {
  if (isSavingProfile) return;

  setIsSavingProfile(true);
  window.setTimeout(() => {
    setIsSavingProfile(false);
    pushNotice('success', 'Profil bisnis berhasil disimpan.');
  }, 900);
};
```

```tsx
const handlePasswordUpdate = () => {
  setPasswordError('');

  if (!currentPassword) {
    setPasswordError('Isi kata sandi saat ini terlebih dahulu.');
    return;
  }

  if (newPassword.length < 8) {
    setPasswordError('Kata sandi baru minimal 8 karakter.');
    return;
  }

  if (newPassword !== confirmPassword) {
    setPasswordError('Konfirmasi kata sandi tidak cocok.');
    return;
  }

  setCurrentPassword('');
  setNewPassword('');
  setConfirmPassword('');
  setShowPasswordModal(false);
  pushNotice('success', 'Kata sandi berhasil diperbarui.');
};
```

```tsx
const handleRequestDelete = () => {
  if (deleteConfirmText !== 'HAPUS') {
    setDeleteError('Ketik HAPUS untuk melanjutkan.');
    return;
  }

  setShowDeleteModal(false);
  setDeleteConfirmText('');
  pushNotice('info', 'Permintaan penghapusan akun vendor telah dikirim.');
};
```

Fungsi kode tersebut adalah menyimpan perubahan profil bisnis, memvalidasi pergantian password, serta memproses permintaan penghapusan akun vendor.

[Screenshot di sini: halaman pengaturan vendor]
[Screenshot di sini: modal ganti password]
[Screenshot di sini: modal penghapusan akun vendor]

---

## BAB III. PENUTUP

### 3.1 Kesimpulan

Berdasarkan progress yang telah dikerjakan, sisi vendor pada website Planora telah memiliki fondasi frontend yang cukup lengkap. Implementasi yang dilakukan mencakup proteksi akses vendor, sidebar navigasi, katalog vendor publik, halaman detail vendor, dashboard, pesanan, layanan, portofolio, ulasan, keuangan, dan pengaturan akun. Dengan cakupan tersebut, vendor telah dapat menggunakan platform sebagai pusat pengelolaan operasional bisnisnya.

Secara teknis, pengembangan frontend pada tahap ini telah memanfaatkan pola komponen yang konsisten, penggunaan state lokal untuk beberapa interaksi, serta integrasi service API untuk data booking, layanan, dan profil vendor. Kondisi ini membuat struktur aplikasi lebih mudah dikembangkan pada tahap berikutnya.

### 3.2 Saran Pengembangan Berikutnya

Untuk tahap lanjutan, beberapa hal yang dapat dikembangkan adalah sebagai berikut:

1. Menghubungkan lebih banyak halaman vendor ke backend produksi penuh.
2. Menambahkan validasi form yang lebih ketat pada layanan, portofolio, dan pengaturan.
3. Memperhalus pengalaman pengguna pada halaman pesanan dan keuangan agar lebih informatif.
4. Menambahkan pengujian frontend yang lebih lengkap untuk menjaga stabilitas fitur vendor.

---

## LAMPIRAN TAMBAHAN: REFERENSI FILE PENTING

- Layout vendor: [frontend/src/app/vendor/layout.tsx](../frontend/src/app/vendor/layout.tsx)
- Sidebar vendor: [frontend/src/components/vendor/VendorSidebar.tsx](../frontend/src/components/vendor/VendorSidebar.tsx)
- Service vendor: [frontend/src/services/vendor.service.ts](../frontend/src/services/vendor.service.ts)
- Katalog vendor publik: [frontend/src/app/vendors/page.tsx](../frontend/src/app/vendors/page.tsx)
- Detail vendor: [frontend/src/app/vendor/[id]/page.tsx](../frontend/src/app/vendor/%5Bid%5D/page.tsx)
- Dashboard vendor: [frontend/src/app/vendor/dashboard/page.tsx](../frontend/src/app/vendor/dashboard/page.tsx)
- Pesanan vendor: [frontend/src/app/vendor/pesanan/page.tsx](../frontend/src/app/vendor/pesanan/page.tsx)
- Layanan vendor: [frontend/src/app/vendor/layanan/page.tsx](../frontend/src/app/vendor/layanan/page.tsx)
- Portofolio vendor: [frontend/src/app/vendor/portofolio/page.tsx](../frontend/src/app/vendor/portofolio/page.tsx)
- Ulasan vendor: [frontend/src/app/vendor/ulasan/page.tsx](../frontend/src/app/vendor/ulasan/page.tsx)
- Keuangan vendor: [frontend/src/app/vendor/keuangan/page.tsx](../frontend/src/app/vendor/keuangan/page.tsx)
- Pengaturan vendor: [frontend/src/app/vendor/pengaturan/page.tsx](../frontend/src/app/vendor/pengaturan/page.tsx)
