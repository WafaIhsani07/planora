# Laporan Arsitektur Informasi Aplikasi Mobile Planora

Perancangan arsitektur informasi merupakan fondasi fundamental dalam pengembangan perangkat lunak, khususnya untuk sistem berskala menengah hingga besar yang melibatkan banyak entitas pengguna. Pada struktur aplikasi mobile Planora, arsitektur informasi disusun secara sistematis guna memastikan pelanggan dapat menemukan informasi, mengeksekusi pesanan, dan menyelesaikan administrasi keuangan tanpa mengalami beban kognitif yang berlebihan (cognitive overload).

Sebagaimana ditunjukkan pada Tabel 1, struktur antarmuka aplikasi seluler ini diklasifikasikan menjadi empat modul utama. Klasifikasi ini disusun dengan mempertimbangkan hukum perancangan antarmuka, di mana rute interaksi yang paling sering diakses diletakkan pada titik henti terdekat jari pengguna.

**Tabel 1. Klasifikasi Modul Utama dan Fungsionalitas Aplikasi Mobile Planora**

| Nama Modul Navigasi | Fungsi Pemrosesan Utama | Indikator Keberhasilan Interaksi |
|---|---|---|
| Beranda (Home) | Pencarian vendor, filter kategori layanan, dan tinjauan portofolio | Pengguna dapat menemukan vendor spesifik dalam maksimal tiga kali ketukan layar |
| Riwayat Pesanan (Orders) | Peninjauan status transaksi, unggah bukti transfer perbankan, dan pemberian ulasan | Pengguna dapat membedakan status pesanan berjalan dan selesai secara visual |
| Notifikasi (Notifications) | Penerimaan pembaruan sistem dan validasi jadwal dari penyedia jasa | Pengguna memberikan respons langsung terhadap peringatan penolakan atau kewajiban bayar |
| Profil (Account) | Pengaturan kredensial akun, data pribadi, dan preferensi antarmuka | Pengguna dapat memperbarui identitas dan kata sandi tanpa bantuan administrator |

Keempat modul utama di atas kemudian dibedah menjadi struktur hierarki yang lebih dalam. Hal ini diperlukan karena antarmuka seluler memiliki luas penampang layar yang terbatas, sehingga penyajian informasi harus bertingkat (nested). Pada Diagram 1, seluruh fungsionalitas turunan dari setiap modul dipetakan ke dalam bentuk percabangan silsilah yang menjabarkan ruang kerja pelanggan.

**Diagram 1. Kode Napkin AI: Struktur Hierarki Informasi Mobile Planora**
```text
Aplikasi Mobile Planora
├── 1. Modul Eksplorasi Beranda
│   ├── Fungsionalitas Pencarian Teks dan Filter Geografis
│   ├── Daftar Katalog Kategori Jasa Event
│   └── Antarmuka Detail Profil Vendor Terpilih
│       ├── Rincian Harga dan Paket Layanan Spesifik
│       ├── Tinjauan Galeri Media Portofolio Acara
│       └── Formulir Pemilihan Tanggal dan Penjadwalan
├── 2. Modul Manajemen Pesanan Pelanggan
│   ├── Halaman Transaksi Aktif Berjalan
│   │   ├── Panel Informasi Jatuh Tempo Pelunasan (H-2)
│   │   └── Formulir Pengunggahan Bukti Transfer Pelunasan 100%
│   └── Halaman Daftar Riwayat Transaksi Selesai
│       ├── Daftar Pesanan Dibatalkan (Otomatis/Manual)
│       └── Formulir Pemasukan Penilaian Bintang dan Ulasan Terbuka
├── 3. Modul Pusat Notifikasi
│   ├── Peringatan Validasi Jadwal dari Pihak Vendor
│   └── Pemberitahuan Tegasan Jatuh Tempo Pembayaran H-2
└── 4. Modul Personalisasi Profil
    ├── Antarmuka Pengubahan Data Demografis
    ├── Pusat Bantuan dan Kebijakan Layanan
    └── Fungsionalitas Pemutusan Sesi (Logout)
```

Struktur hierarki turunan tersebut memerlukan implementasi komponen kode yang konsisten dalam framework pengembangan. Pendekatan perancangan pada aplikasi mobile modern lazimnya menggunakan komponen navigasi statis pada bagian bawah layar. Komponen tersebut mengikat keempat modul utama menjadi satu kesatuan rute. 

Implementasi rekayasa kerangka dasar dari arsitektur tersebut dapat dikonstruksikan ke dalam kode program yang sesungguhnya. Berikut adalah potongan sintaks bahasa pemrograman Dart menggunakan framework Flutter untuk merepresentasikan klasifikasi arsitektur informasi pada Tabel 1 ke dalam rute tampilan seluler:

```dart
import 'package:flutter/material.dart';

/// Kelas utama yang merepresentasikan struktur dasar arsitektur informasi
/// Aplikasi mobile Planora menggunakan paradigma BottomNavigationBar
class PlanoraMainArchitect extends StatefulWidget {
  @override
  _PlanoraMainArchitectState createState() => _PlanoraMainArchitectState();
}

class _PlanoraMainArchitectState extends State<PlanoraMainArchitect> {
  int _currentHierarchyIndex = 0;
  
  // Mengelompokkan keempat sub-sistem utama sesuai rancangan pada Tabel 1
  final List<Widget> _modulePages = [
    HomeExplorationPage(), // Modul Beranda (Pencarian & Katalog)
    OrderManagementPage(), // Modul Pesanan (Upload Bukti & Riwayat)
    NotificationCenter(),  // Modul Notifikasi (Pembaruan Status)
    UserProfileConfig(),   // Modul Pengaturan Identitas Akun
  ];

  void _onNavigationTapped(int index) {
    setState(() {
      _currentHierarchyIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: _modulePages[_currentHierarchyIndex],
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _currentHierarchyIndex,
        onTap: _onNavigationTapped,
        selectedItemColor: Colors.blue.shade800,
        unselectedItemColor: Colors.grey.shade600,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.search_rounded), label: 'Beranda'),
          BottomNavigationBarItem(icon: Icon(Icons.receipt_long), label: 'Pesanan'),
          BottomNavigationBarItem(icon: Icon(Icons.notifications_active), label: 'Notifikasi'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profil'),
        ],
      ),
    );
  }
}
```

Agar pemahaman atas komponen teknis di atas lebih konkret dalam tataran visual, pengembang memerlukan kerangka sketsa awal. Pada Gambar 1 terlihat posisi mutlak letak menu primer yang didesain tetap berada pada ruang jangkuan ibu jari, memastikan pengoperasian sistem dapat berjalan ergonomis.

**Gambar 1. Sketsa Wireframe Kerangka Dasar Tata Letak Mobile**
[Instruksi Gambar: Tampilkan kerangka gambar layar ponsel cerdas (smartphone) dalam orientasi vertikal memanjang. Fokuskan gambar pada bagian seperempat paling bawah. Gambar sebuah bilah panjang horizontal yang menempel sempurna menutupi sisi bawah layar. Di dalam bilah mendatar tersebut, sisipkan empat bentuk siluet ikon secara berurutan dan berjarak sama: ikon kaca pembesar (Beranda), ikon kertas struk (Pesanan), ikon lonceng bermodel dering (Notifikasi), dan ikon garis batas kepala manusia (Profil). Sisakan sisa ruang atas layar berupa kotak kosong tebal berlabel "Area Konten Dinamis Dinonjolkan".]

Pendekatan arsitektur di atas mereduksi kebingungan perpindahan rute antar halaman secara drastis. Struktur percabangan fungsional dapat dipelihara seiring eskalasi kebutuhan antarmuka yang lebih ekstensif di kemudian hari.