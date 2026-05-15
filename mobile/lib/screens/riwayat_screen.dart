import 'package:flutter/material.dart';
import '../services/api_service.dart';

class RiwayatScreen extends StatefulWidget {
  const RiwayatScreen({super.key});

  @override
  State<RiwayatScreen> createState() => _RiwayatScreenState();
}

class _RiwayatScreenState extends State<RiwayatScreen> {
  List<dynamic> _histories = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchHistory();
  }

  Future<void> _fetchHistory() async {
    setState(() => _isLoading = true);
    final result = await ApiService.getBookings();
    if (!mounted) return;
    setState(() {
      if (result['success'] == true) {
        final data = (result['data'] as List?) ?? [];
        // Filter pesanan yang sudah selesai / lunas
        _histories = data
            .where(
              (o) =>
                  o['isPaid'] == true ||
                  o['status']?.toString().toUpperCase() == 'LUNAS' ||
                  o['status']?.toString().toUpperCase() == 'SELESAI' ||
                  o['status']?.toString().toUpperCase() == 'COMPLETED' ||
                  o['status']?.toString().toUpperCase() == 'PAID',
            )
            .toList();

        // Jika tidak ada yang selesai, tampilkan semua agar layar tidak kosong
        if (_histories.isEmpty) {
          _histories = data;
        }
      } else {
        _histories = [];
      }
      _isLoading = false;
    });
  }

  Future<void> _deleteHistory(String id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Hapus Riwayat?'),
        content: const Text(
          'Riwayat booking yang dihapus tidak akan ditampilkan lagi.',
        ),
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Batal', style: TextStyle(color: Colors.black54)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFFA9081),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Hapus', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    setState(() => _isLoading = true);

    try {
      // Gunakan endpoint cancel booking (PATCH /bookings/:id/cancel)
      final response = await ApiService.postRequest(
        '/bookings/$id/cancel',
        {'status': 'CANCELLED'},
      );

      if (response.statusCode == 200 ||
          response.statusCode == 204 ||
          response.statusCode == 202) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Riwayat berhasil dihapus!')),
          );
        }
        _fetchHistory();
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Gagal menghapus riwayat.')),
          );
        }
        setState(() => _isLoading = false);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Terjadi kesalahan koneksi server.')),
        );
      }
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9F9F9),
      appBar: AppBar(
        title: const Text(
          'Riwayat Booking',
          style: TextStyle(
            color: Colors.black87,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        backgroundColor: Colors.white,
        centerTitle: true,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black87),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _histories.isEmpty
          ? const Center(
              child: Padding(
                padding: EdgeInsets.all(32.0),
                child: Text(
                  'Belum ada riwayat booking.',
                  style: TextStyle(
                    color: Colors.grey,
                    fontStyle: FontStyle.italic,
                    fontSize: 15,
                  ),
                ),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
              itemCount: _histories.length,
              itemBuilder: (context, index) {
                final item = _histories[index];
                final String id = item['id']?.toString() ?? '';

                // Mapping field dari response backend
                final vendorData = item['vendor'] ?? {};
                final layananData = item['layanan'] ?? {};
                final String vendorName =
                    vendorData['businessName'] ??
                    vendorData['name'] ??
                    layananData['namaLayanan'] ??
                    'Vendor';

                final avatar = vendorData['avatar']?.toString() ?? '';
                final String imageUrl = avatar.isNotEmpty
                    ? (avatar.startsWith('http')
                        ? avatar
                        : 'http://10.0.2.2:5000/assets/$avatar')
                    : 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=200&auto=format&fit=crop';

                final bool isSelesai =
                    item['isPaid'] == true ||
                    item['status']?.toString().toUpperCase() == 'LUNAS' ||
                    item['status']?.toString().toUpperCase() == 'SELESAI' ||
                    item['status']?.toString().toUpperCase() == 'COMPLETED' ||
                    item['status']?.toString().toUpperCase() == 'PAID';
                final String statusText = isSelesai
                    ? 'Selesai'
                    : 'Berjalan / Tertunda';
                final Color statusColor = isSelesai
                    ? const Color(0xFF00C853)
                    : Colors.orange;

                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 16,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFF0F0F0)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.03),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(
                          imageUrl,
                          width: 60,
                          height: 60,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(
                            width: 60,
                            height: 60,
                            color: Colors.grey[300],
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              vendorName,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: Colors.black87,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              statusText,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: statusColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(
                          Icons.delete_outline,
                          color: Colors.grey,
                        ),
                        onPressed: id.isNotEmpty
                            ? () => _deleteHistory(id)
                            : null,
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
