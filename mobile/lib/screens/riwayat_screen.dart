import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../main.dart' show PlanoraColors;

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
        _histories = data.where((o) =>
          o['isPaid'] == true ||
          o['status']?.toString().toUpperCase() == 'LUNAS' ||
          o['status']?.toString().toUpperCase() == 'SELESAI' ||
          o['status']?.toString().toUpperCase() == 'COMPLETED' ||
          o['status']?.toString().toUpperCase() == 'PAID',
        ).toList();

        // Jika tidak ada yang selesai, tampilkan semua agar layar tidak kosong
        if (_histories.isEmpty) _histories = data;
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
        content: const Text('Riwayat booking yang dihapus tidak akan ditampilkan lagi.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Batal'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: PlanoraColors.error,
              foregroundColor: PlanoraColors.background,
            ),
            child: const Text('Hapus'),
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
    final tt = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: PlanoraColors.background,
      appBar: AppBar(
        title: const Text('Riwayat Booking'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _histories.isEmpty
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 72,
                          height: 72,
                          decoration: const BoxDecoration(
                            color: PlanoraColors.brandAccent,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.history_rounded,
                              size: 36, color: PlanoraColors.brandDark),
                        ),
                        const SizedBox(height: 16),
                        Text('Belum ada riwayat booking.',
                            style: tt.bodyMedium?.copyWith(
                              color: PlanoraColors.brandGray,
                              fontStyle: FontStyle.italic,
                            )),
                      ],
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

                    final String statusText = isSelesai ? 'Selesai' : 'Berjalan / Tertunda';
                    final Color statusColor = isSelesai
                        ? const Color(0xFF2E7D32)
                        : const Color(0xFF856404);
                    final Color statusBg = isSelesai
                        ? PlanoraColors.brandAccent
                        : const Color(0xFFFFF3CD);

                    return Container(
                      margin: const EdgeInsets.only(bottom: 14),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: PlanoraColors.surface,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: PlanoraColors.divider),
                      ),
                      child: Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(13),
                            child: Image.network(
                              imageUrl,
                              width: 60,
                              height: 60,
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => Container(
                                width: 60, height: 60,
                                color: PlanoraColors.brandAccent,
                                child: const Icon(Icons.storefront_outlined,
                                    color: PlanoraColors.brandDark),
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(vendorName,
                                    style: tt.titleSmall,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis),
                                const SizedBox(height: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: statusBg,
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    statusText,
                                    style: tt.labelSmall?.copyWith(
                                      color: statusColor,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline_rounded,
                                color: PlanoraColors.brandGray),
                            onPressed: id.isNotEmpty ? () => _deleteHistory(id) : null,
                          ),
                        ],
                      ),
                    );
                  },
                ),
    );
  }
}
