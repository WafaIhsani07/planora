import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../utils/translations.dart';

class DetailNotifikasiScreen extends StatefulWidget {
  const DetailNotifikasiScreen({super.key});

  @override
  State<DetailNotifikasiScreen> createState() => _DetailNotifikasiScreenState();
}

class _DetailNotifikasiScreenState extends State<DetailNotifikasiScreen> {
  Map<String, dynamic>? _detail;
  bool _isLoading = true;
  String? _id;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Mengambil argumen ID dari Route yang dilempar oleh NotifikasiScreen
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args != null && args is String && _id == null) {
      _id = args;
      _fetchDetail();
    } else if (_id == null) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  // Mengambil data detail spesifik dari backend (No Dummy Data)
  Future<void> _fetchDetail() async {
    try {
      final result = await ApiService.getNotificationById(_id!);

      if (result['success'] == true) {
        setState(() {
          _detail = result['data'];
        });
        // Tandai sebagai dibaca secara background
        await ApiService.markNotificationAsRead(_id!);
      } else {
        setState(() {
          _detail = null;
        });
      }
    } catch (e) {
      setState(() {
        _detail = null;
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFAFA),
      body: SafeArea(
        child: Column(
          children: [
            // Custom Header Halaman Sesuai Gambar
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 24.0,
                vertical: 20.0,
              ),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(
                  bottom: BorderSide(color: Color(0xFFF0F0F0), width: 1.0),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Icon(
                      Icons.arrow_back_ios_new,
                      color: Color(0xFF333333),
                      size: 20,
                    ),
                  ),
                  Text(
                    Translations.t('notifDetail.title'),
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF333333),
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      // Implementasi logika hapus pesan bisa dihubungkan ke backend (DELETE request)
                      Navigator.pop(context);
                    },
                    child: const Icon(
                      Icons.delete_outline,
                      color: Color(
                        0xFFFA9081,
                      ), // Warna merah pudar/pink sesuai tombol delete di gambar
                      size: 24,
                    ),
                  ),
                ],
              ),
            ),

            // Area Dynamic Data dari Backend
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _detail == null
                  ? Container(
                      alignment: Alignment.center,
                      padding: EdgeInsets.all(40.0),
                      child: Text(
                        Translations.t('notifDetail.notFound'),
                        style: TextStyle(
                          color: Colors.grey,
                          fontStyle: FontStyle.italic,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    )
                  : SingleChildScrollView(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        children: [
                          // Card Vendor Name
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: const Color(0xFFF0F0F0),
                              ),
                            ),
                            child: Row(
                              children: [
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(12),
                                  child: Image.network(
                                    _detail!['vendorImageUrl'] ??
                                        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=150&auto=format&fit=crop',
                                    width: 50,
                                    height: 50,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      _detail!['vendorName'] ?? Translations.t('notifDetail.vendorNameFallback'),
                                      style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF333333),
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      _detail!['vendorCategory'] ??
                                          Translations.t('notifDetail.categoryFallback'),
                                      style: const TextStyle(
                                        fontSize: 12,
                                        color: Colors.grey,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 20),

                          // Isi Kartu Detail Modul Pesan
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(24),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: const Color(0xFFF0F0F0),
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.grey.withAlpha(8),
                                  blurRadius: 10,
                                  spreadRadius: 1,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  _detail!['title'] ?? Translations.t('notifDetail.title'),
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF333333),
                                  ),
                                ),
                                const SizedBox(height: 20),
                                const Divider(
                                  color: Color(0xFFF0F0F0),
                                  height: 1,
                                ),
                                const SizedBox(height: 20),

                                Text(
                                  _detail!['fullMessage'] ??
                                      Translations.t('notifDetail.loading'),
                                  style: const TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey,
                                    height: 1.6,
                                  ),
                                ),

                                const SizedBox(height: 32),
                                Text(
                                  _detail!['time'] ?? Translations.t('notif.justNow'),
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: Colors.grey.shade400,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
