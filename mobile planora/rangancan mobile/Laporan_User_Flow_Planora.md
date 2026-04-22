# Laporan Alur Pengguna (User Flow) Aplikasi Mobile Planora

Alur pengguna pada aplikasi mobile Planora membedah urutan interaksi prosedural yang mutlak dilalui oleh sosok pelanggan, mulai dari fungsionalitas eksplorasi katalog, reservasi jadwal acara, konfirmasi operasional, hingga transfer pembayaran dan penyelesaian dokumentasi tagihan purnajual (post-sales).

Untuk memudahkan identifikasi hambatan teknis yang berpotensi menggagalkan konversi transaksi, proses di dalam ekosistem aplikasi dipecah menjadi beberapa skenario terpisah. Sebagaimana dijabarkan pada Tabel 1, alur operasional utama dikategorikan berdasarkan skenario makro yang dipicu oleh tindakan inisiatif pelanggan.

**Tabel 1. Skenario Tindakan Operasional Sistem Mobile**

| Skenario Tindakan Inisiatif | Syarat Awal (Pre-condition) | Syarat Akhir Transaksi (Post-condition) | Indikator Keberhasilan Alur |
|---|---|---|---|
| Autentikasi Pengguna | Aplikasi dibuka dan pengguna belum terverifikasi sistem | Identitas pelanggan divalidasi ke peladen dan masuk ke daftar sesi aktif | Berhasil menginisiasi dan melihat panel eksklusif katalog |
| Pemilihan Vendor | Pengguna masuk ke halaman pencarian dan fitur saring aktif | Pemesanan dikirim dari gawai pelanggan ke tabel basis data pusat | Tersampaikannya kuota pesanan tanpa adanya benturan jadwal acara |
| Pelunasan Pelanggan 100% | Penyedia jasa meresmikan status persetujuan dengan pembatasan waktu (H-2) | Arsip mutasi pelunasan (100%) diunggah sebelum batas eksekusi berakhir | Perubahan status pesanan menjadi "Lunas" setelah divalidasi |
| Pembatalan Jadwal | Pengguna menekan inisiatif pembatalan atau sistem jatuh tempo H-2 | Slot waktu dibatalkan dan ketersediaan dikembalikan atau dana dinyatakan hangus | Eksekusi prosedur pembatalan tanpa mengacaukan konsistensi transaksi |

Skenario ekskusi yang memegang peran paling berisiko adalah interaksi penelusuran penyedia jasa (vendor) dan proses reservasi. Pada rentetan operasi ini, sistem dihadapkan dengan pemeriksaan batas kuota secara waktu nyata (real-time). Urutan pemicu peristiwa yang ditinjau dari sisi pengguna hingga mencapai ujung validasi jadwal dapat divisualisasikan dengan Diagram 1.

**Diagram 1. Kode Napkin AI: Prosedural Pencarian dan Reservasi Layanan**
```text
Pelanggan mengakses antarmuka mobile -> Sistem merender antarmuka Beranda
Sistem merender antarmuka Beranda -> Pelanggan melakukan injeksi kueri filter
Pelanggan melakukan injeksi kueri filter -> Sistem menampilkan daftar ringkasan vendor
Sistem menampilkan daftar ringkasan vendor -> Pelanggan mengeklik profil satu entitas
Pelanggan mengeklik profil satu entitas -> Pelanggan membandingkan paket spesifikasi
Pelanggan membandingkan paket spesifikasi -> Pelanggan memasukkan tanggal pelaksanaan acara
Pelanggan memasukkan tanggal pelaksanaan acara -> Sistem melakukan kueri silang jadwal database
Sistem melakukan kueri silang jadwal database -> [Kondisi Berhasil: Kalender Kosong] -> Pelanggan menekan proses pesan final
Sistem melakukan kueri silang jadwal database -> [Kondisi Gagal: Kalender Tertepati] -> Pengguna dipaksa merevisi tanggal
Pelanggan menekan proses pesan final -> Sistem mencatat riwayat pemesanan baru berstatus tunggu
```

Sistem penolakan silang spesifikasi jadwal dalam basis data mutlak diimplementasikan untuk mencegah pemesanan bentrok pada vendor target. Pada Gambar 1 terlihat intervensi sistem dalam memblokir langkah krusial ketika pengguna memaksakan pendaftaran acara pada waktu yang tereliminasi.

**Gambar 1. Umpan Balik Visual Penolakan Reservasi Jadwal**
[Instruksi Gambar: Tampilkan sebuah bingkai yang memperlihatkan tangkapan layar ponsel. Fokuskan sebagian besar gambar pada elemen formulir pemilihan tanggal (date picker). Beri arsiran melintang merah (X) pada salah satu kotak angka dalam matriks kalender. Tampilkan sebuah lapisan jendela pop-up di lokasi tengah layar yang berisi peringatan tegas: "Jadwal Tidak Tersedia atau Telah Terbooking oleh Klien Lain". Letakkan satu buah bujur sangkar di bawah pop-up bertuliskan teks: "Revisi Rencana".]

Apabila tahapan pendaftaran telah dikabulkan secara prosedural oleh penyedia jasa terkait, siklus berlanjut kepada proses peyelesaian transaksi pelunasan komersial. Namun, ketiadaan automasi interkoneksi bank mengharuskan alur transfer berjalan independen di ekosistem eksternal. Urutan untuk menanggulangi pengunggahan arsip digital digambarkan pada Diagram 2.

**Diagram 2. Kode Napkin AI: Pengunggahan Data Keuangan Bukti Rekening**
```text
Vendor meresmikan status kesanggupan operasional -> Pelanggan menerima notifikasi persetujuan pesanan
Pelanggan menerima notifikasi persetujuan pesanan -> Pelanggan mengakses panel Detail Tagihan
Pelanggan mengakses panel Detail Tagihan -> Pelanggan menyalin deretan nomor rekening (fitur salin)
Pelanggan menyalin deretan nomor rekening (fitur salin) -> Pelanggan mentransfer dana penuh (100%) di kanal bank lokal
Pelanggan mentransfer dana penuh (100%) di kanal bank lokal -> Pelanggan beranjak kembali menuju aplikasi internal Planora
Pelanggan beranjak kembali menuju aplikasi internal Planora -> Pelanggan menyematkan berkas tangkapan mutasi bank
Pelanggan menyematkan berkas tangkapan mutasi bank -> Sistem menyusun dan mengirim muatan data bertipe multipart
Sistem menyusun dan mengirim muatan data bertipe multipart -> Sistem mengalihkan status ke tahap Verifikasi Vendor
```

Tindakan pemindahan dokumen bukti mentah ke repositori peladen (server) dari perangkat menuntut keandalan pemograman asinkron guna menangkal pembekuan antarmuka (UI freezing). Mekanisme ini dapat diatur melalui fungsi pertukaran data dua arah. Berikut disajikan contoh logik pemograman Dart (Flutter) dalam memprakarsai protokol antarmuka representasi keadaan (REST API) berorientasi tipe multipart form unggah bukti:

```dart
import 'package:http/http.dart' as http;
import 'dart:io';

/// Prosedur asinkron (User Flow Phase 2) yang memfasilitasi pengguna akhir
/// pada modul Pesanan untuk merespons persetujuan tagihan dari vendor.
Future<void> submitPaymentProofFile(String transactionToken, File imageProofDoc) async {
  final endpointApi = Uri.parse('https://api.planora.com/v1/orders/upload-payment-proof');
  
  try {
    // Alur asinkron di mana modul menyiapkan transmisi dokumen fisik dan teks token
    var multiPartPayload = http.MultipartRequest('POST', endpointApi)
      ..fields['booking_transaction_id'] = transactionToken
      ..files.add(
        await http.MultipartFile.fromPath(
          'receipt_document_scan', 
          imageProofDoc.path,
        )
      );

    var serverResponseResponse = await multiPartPayload.send();

    if (serverResponseResponse.statusCode == 200) {
      print('Siklus Alur Pertama selesai. Sistem meloncat ke Status Pendalaman Vendor');
      // Eksekusi kode yang merekayasa antarmuka visual agar menampilkan status "Pengecekan Dana"
    } else {
      print('Kendala Transfer API terdeteksi. Pesan Error Kegagalan Jaringan akan Tayang');
    }
  } catch (flowException) {
    print('Sistem terinterupsi: Intervensi transmisi jaringan -> $flowException');
  }
}
```

Penyempurnaan logika bisnis pada purnajual Planora ini juga mencakup penanganan skenario pembatalan, baik secara sukarela maupun otomatis oleh sistem (Auto-cancel). Regulasi platform secara spesifik mewajibkan pelunasan penuh sebesar 100% selambat-lambatnya dua hari (H-2) sebelum tanggal pelaksaan pekerjaan. Apabila kewajiban belum dipenuhi, sistem akan membatalkan agenda dan jadwal vendor kembali dibebaskan. Sebaliknya, apabila pelunasan 100% telah dilakukan namun pengguna membatalkan pada periode H-1, maka mekanisme pengembalian dana ditiadakan (No Refund).

Berdasarkan batasan ketat dalam perlindungan penyedia jasa tersebut, alur pembatalan diuraikan secara prosedural pada Diagram 3. Diagram ini memandu pemrogram peladen dalam menyusun intervensi latar belakang.

**Diagram 3. Kode Napkin AI: Pembatalan Pesanan dan Kebijakan Hangus**
```text
Pesanan awal disetujui vendor (Menunggu Bayar) -> Sistem memicu batas kadaluwarsa H-2
Sistem memicu batas kadaluwarsa H-2 -> [Terjadi Pembiaran] -> Sistem memicu Pembatalan Otomatis (Auto-Cancel)
Sistem memicu batas kadaluwarsa H-2 -> [Pelanggan Inisiatif Batal Sebelum H-2] -> Sistem memeriksa status uang masuk
Sistem memicu Pembatalan Otomatis (Auto-Cancel) -> Jadwal dibebaskan secara mutlak tanpa penalti
Sistem memeriksa status uang masuk -> [Uang Belum Masuk] -> Pesanan dibatalkan pelanngan tanpa dikenai biaya
Sistem memeriksa status uang masuk -> [Uang Telah Lunas & Batal di H-1] -> Pesanan diarsip dan ditandai permanen
Pesanan diarsip dan ditandai permanen -> Pelanggan mendapati pop-up peringatan penolakan Refund
Pelanggan mendapati pop-up peringatan penolakan Refund -> Vendor menerima kompensasi penuh (100%)
```

Dalam implementasi layar, visualisasi kondisi yang tidak bisa di-"undo" ini membutuhkan antarmuka penegas ekstra di depan mata konsumen. Pada Gambar 2 ditegaskan pentingnya fitur penghalang sebelum tombol pembatalan disentuh.

**Gambar 2. Umpan Balik Visual Mitigasi Pembatalan H-1 (No Refund)**
[Instruksi Gambar: Tampilkan halaman detail pesanan berstatus berjalan. Fokuskan pada modal (pop-up) jendela peringatan yang menyembul dominan ke tengah layar saat tombol "Batalkan Acara" disentuh. Sertakan ikon segitiga seru bermakna fatal, dengan font deskriptif tebal "Perhatian! Pembatalan dilakukan H-1 acara. Dana 100% yang disetor kepada vendor TIDak Dapat Dikembalikan (Hangus) menyusul kesepakatan aplikasi!". Tempatkan dua tombol konfirmasi di bawahnya (Lanjutkan Batal - Kembali).]

Ketangguhan aliran penanganan skenario di atas merepresentasikan fungsionalitas logika yang matang dan adaptif terhadap kondisi terburuk. Serangkaian tahapan prosedural ini mengokohkan rekayasa peladen sebagai penghubung kebijakan bisnis terhadap kebebasan navigasi para pengguna akhir.