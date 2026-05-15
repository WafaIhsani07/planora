import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

class DetailBookingScreen extends StatefulWidget {
  const DetailBookingScreen({super.key});

  @override
  State<DetailBookingScreen> createState() => _DetailBookingScreenState();
}

class _DetailBookingScreenState extends State<DetailBookingScreen> {
  Map<String, dynamic>? _vendorDetails;
  List<dynamic> _services = [];
  bool _isLoading = true;
  bool _isServicesLoading = true;
  String? _errorMessage;
  String _vendorId = '';

  // Paket layanan yang dipilih user
  Map<String, dynamic>? _selectedService;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args != null) {
      final newId = args.toString();
      // Hindari fetch ulang jika ID tidak berubah (dipanggil > 1x)
      if (_vendorId != newId) {
        _vendorId = newId;
        _fetchVendorDetail();
        _fetchVendorServices();
      }
    } else {
      setState(() {
        _errorMessage = 'ID Vendor tidak ditemukan.';
        _isLoading = false;
        _isServicesLoading = false;
      });
    }
  }

  // T5: Fetch vendor detail via ApiService
  Future<void> _fetchVendorDetail() async {
    setState(() => _isLoading = true);
    final result = await ApiService.getVendorById(_vendorId);
    if (!mounted) return;
    setState(() {
      if (result['success'] == true) {
        _vendorDetails = result['data'];
        _errorMessage = null;
      } else {
        _errorMessage = result['message'] ?? 'Gagal memuat detail vendor.';
      }
      _isLoading = false;
    });
  }

  // T6: Fetch paket layanan vendor via ApiService
  Future<void> _fetchVendorServices() async {
    setState(() => _isServicesLoading = true);
    final result = await ApiService.getVendorServices(_vendorId);
    if (!mounted) return;
    setState(() {
      _services = (result['data'] as List?) ?? [];
      _isServicesLoading = false;
    });
  }

  String _formatCurrency(dynamic value) {
    if (value == null) return 'Rp 0';
    try {
      final double amount =
          value is String ? double.parse(value) : value.toDouble();
      return NumberFormat.currency(
        locale: 'id_ID',
        symbol: 'Rp ',
        decimalDigits: 0,
      ).format(amount);
    } catch (_) {
      return 'Rp 0';
    }
  }

  // T13: Fungsi buka peta
  Future<void> _openMaps(double lat, double lng) async {
    final url = Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng');
    try {
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      } else {
        throw Exception('Tidak bisa membuka URL map');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Gagal meluncurkan peta.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (_errorMessage != null || _vendorDetails == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Detail Vendor')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 48, color: Colors.red),
                const SizedBox(height: 16),
                Text(
                  _errorMessage ?? 'Vendor tidak ditemukan.',
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Kembali'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final vendor = _vendorDetails!;

    // Mapping field dari response backend
    final String imagePath = vendor['avatar'] != null
        ? (vendor['avatar'].toString().startsWith('http')
            ? vendor['avatar']
            : 'http://10.0.2.2:5000/assets/${vendor['avatar']}')
        : '';
    final String category = vendor['category'] ?? 'Vendor';
    final String title = vendor['businessName'] ?? vendor['name'] ?? 'Vendor';
    final String rating = vendor['rating']?.toString() ?? '0.0';
    final String location = vendor['city'] ?? vendor['location'] ?? 'Lokasi belum tersedia';
    final String description = vendor['description'] ?? 'Deskripsi belum tersedia.';

    // Koordinat Peta
    final double? lat = vendor['latitude'] != null ? double.tryParse(vendor['latitude'].toString()) : null;
    final double? lng = vendor['longitude'] != null ? double.tryParse(vendor['longitude'].toString()) : null;

    // Harga tampil dari paket yang dipilih, atau harga terendah dari services
    String displayPrice = '0';
    if (_selectedService != null) {
      displayPrice = _selectedService!['harga']?.toString() ??
          _selectedService!['price']?.toString() ?? '0';
    } else if (_services.isNotEmpty) {
      // Tampilkan harga terendah sebagai "mulai dari"
      final prices = _services
          .map((s) =>
              double.tryParse(s['harga']?.toString() ?? s['price']?.toString() ?? '0') ?? 0)
          .toList();
      prices.sort();
      displayPrice = prices.first.toStringAsFixed(0);
    }

    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // ── Hero Image ──────────────────────────────────────────────────────
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: MediaQuery.of(context).size.height * 0.45,
            child: imagePath.isNotEmpty
                ? Image.network(
                    imagePath,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) =>
                        Container(color: Colors.grey[300]),
                  )
                : Container(
                    color: Colors.grey[300],
                    child:
                        const Center(child: Icon(Icons.image, size: 50, color: Colors.grey)),
                  ),
          ),

          // ── Back Button ─────────────────────────────────────────────────────
          Positioned(
            top: 40,
            left: 16,
            child: CircleAvatar(
              backgroundColor: Colors.white.withValues(alpha: 0.5),
              child: IconButton(
                icon: const Icon(Icons.arrow_back_ios_new,
                    color: Colors.white, size: 20),
                onPressed: () => Navigator.pop(context),
              ),
            ),
          ),

          // ── Sliding Sheet ────────────────────────────────────────────────────
          Positioned.fill(
            top: MediaQuery.of(context).size.height * 0.35,
            child: Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Lokasi
                  Padding(
                    padding: const EdgeInsets.only(top: 24, left: 24, right: 24),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Row(
                            children: [
                              const Icon(Icons.location_on, color: Colors.grey, size: 20),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  location,
                                  style: const TextStyle(color: Colors.grey, fontSize: 14),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (lat != null && lng != null)
                          TextButton.icon(
                            onPressed: () => _openMaps(lat, lng),
                            icon: const Icon(Icons.map, size: 16, color: Color(0xFF00C48C)),
                            label: const Text(
                              'Buka Peta',
                              style: TextStyle(
                                color: Color(0xFF00C48C),
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                            style: TextButton.styleFrom(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                              backgroundColor: const Color(0xFFE8F5E9),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 24.0, vertical: 16),
                    child: Divider(height: 1, color: Colors.grey),
                  ),

                  // Scrollable content
                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.only(bottom: 120),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // ── Deskripsi ──────────────────────────────────────
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 24),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Deskripsi Layanan',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black87,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  description,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    color: Colors.black54,
                                    height: 1.5,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 28),

                          // ── T6: Paket Layanan ──────────────────────────────
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 24),
                            child: const Text(
                              'Paket Layanan',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.black87,
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                          if (_isServicesLoading)
                            const Padding(
                              padding: EdgeInsets.symmetric(vertical: 24),
                              child: Center(child: CircularProgressIndicator()),
                            )
                          else if (_services.isEmpty)
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 24, vertical: 16),
                              child: Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF9F9F9),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: const Color(0xFFEEEEEE)),
                                ),
                                child: const Text(
                                  'Belum ada paket layanan tersedia.',
                                  style: TextStyle(color: Colors.grey, fontStyle: FontStyle.italic),
                                ),
                              ),
                            )
                          else
                            ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              padding: const EdgeInsets.symmetric(horizontal: 24),
                              itemCount: _services.length,
                              itemBuilder: (context, index) {
                                final svc = _services[index];
                                final svcId = svc['id']?.toString() ?? '$index';
                                final svcName = svc['namaLayanan'] ??
                                    svc['name'] ??
                                    'Paket ${index + 1}';
                                final svcDesc = svc['deskripsi'] ??
                                    svc['description'] ?? '';
                                final svcPrice = svc['harga'] ?? svc['price'] ?? 0;
                                final isSelected =
                                    _selectedService?['id']?.toString() == svcId;

                                return GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _selectedService = {
                                        ...svc,
                                        'id': svcId,
                                        'name': svcName,
                                        'price': svcPrice.toString(),
                                      };
                                    });
                                  },
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 200),
                                    margin: const EdgeInsets.only(bottom: 12),
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      color: isSelected
                                          ? const Color(0xFFE8F5E9)
                                          : Colors.white,
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(
                                        color: isSelected
                                            ? const Color(0xFF00C48C)
                                            : const Color(0xFFEEEEEE),
                                        width: isSelected ? 2 : 1,
                                      ),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.grey.withAlpha(13),
                                          blurRadius: 8,
                                          offset: const Offset(0, 3),
                                        ),
                                      ],
                                    ),
                                    child: Row(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        // Pilih radio indicator
                                        Icon(
                                          isSelected
                                              ? Icons.check_circle
                                              : Icons.radio_button_unchecked,
                                          color: isSelected
                                              ? const Color(0xFF00C48C)
                                              : Colors.grey,
                                          size: 22,
                                        ),
                                        const SizedBox(width: 12),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                svcName,
                                                style: TextStyle(
                                                  fontSize: 15,
                                                  fontWeight: FontWeight.bold,
                                                  color: isSelected
                                                      ? const Color(0xFF00C48C)
                                                      : Colors.black87,
                                                ),
                                              ),
                                              if (svcDesc.isNotEmpty) ...[
                                                const SizedBox(height: 4),
                                                Text(
                                                  svcDesc,
                                                  style: const TextStyle(
                                                    fontSize: 12,
                                                    color: Colors.grey,
                                                  ),
                                                ),
                                              ],
                                              const SizedBox(height: 8),
                                              Text(
                                                _formatCurrency(svcPrice),
                                                style: const TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.bold,
                                                  color: Color(0xFF00C48C),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // ── Category + Title + Rating (over hero image) ──────────────────────
          Positioned(
            top: MediaQuery.of(context).size.height * 0.35 - 90,
            left: 24,
            right: 24,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFF00C48C),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    category,
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          shadows: [Shadow(color: Colors.black45, blurRadius: 4)],
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.star, color: Colors.amber, size: 16),
                          const SizedBox(width: 4),
                          Text(rating,
                              style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),

      // ── Bottom Sheet: Harga + Tombol Memesan ─────────────────────────────────
      bottomSheet: Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(color: Colors.black12, blurRadius: 10, offset: Offset(0, -2)),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _selectedService != null ? 'PAKET DIPILIH' : 'MULAI DARI',
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,
                  ),
                ),
                Text(
                  _formatCurrency(displayPrice),
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF00C48C),
                  ),
                ),
              ],
            ),
            Row(
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF0ED),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.bookmark_border, color: Colors.black54),
                    onPressed: () {},
                  ),
                ),
                const SizedBox(width: 16),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _selectedService != null
                        ? const Color(0xFF00C48C)
                        : Colors.grey,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10)),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 14),
                  ),
                  onPressed: _selectedService == null
                      ? () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Silakan pilih paket layanan terlebih dahulu.'),
                            ),
                          );
                        }
                      : () {
                          Navigator.pushNamed(
                            context,
                            '/pemesanan_form',
                            arguments: {
                              'id': _selectedService!['id'],
                              'name': _selectedService!['name'] ??
                                  _selectedService!['namaLayanan'] ??
                                  title,
                              'category': category,
                              'price': _selectedService!['price'] ??
                                  _selectedService!['harga']?.toString() ?? '0',
                              'image': imagePath,
                              'vendorId': _vendorId,
                            },
                          );
                        },
                  child: Text(
                    _selectedService != null ? 'Memesan' : 'Pilih Paket',
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
