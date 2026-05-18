import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../main.dart' show PlanoraColors;

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
      return NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0)
          .format(amount);
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
    final tt = Theme.of(context).textTheme;

    if (_isLoading) {
      return const Scaffold(
        backgroundColor: PlanoraColors.background,
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (_errorMessage != null || _vendorDetails == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Detail Vendor')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: PlanoraColors.error.withAlpha(15),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.error_outline_rounded,
                      size: 36, color: PlanoraColors.error),
                ),
                const SizedBox(height: 16),
                Text(
                  _errorMessage ?? 'Vendor tidak ditemukan.',
                  textAlign: TextAlign.center,
                  style: tt.bodyMedium,
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

    final double? lat = vendor['latitude'] != null ? double.tryParse(vendor['latitude'].toString()) : null;
    final double? lng = vendor['longitude'] != null ? double.tryParse(vendor['longitude'].toString()) : null;

    String displayPrice = '0';
    if (_selectedService != null) {
      displayPrice = _selectedService!['harga']?.toString() ?? _selectedService!['price']?.toString() ?? '0';
    } else if (_services.isNotEmpty) {
      final prices = _services
          .map((s) => double.tryParse(s['harga']?.toString() ?? s['price']?.toString() ?? '0') ?? 0)
          .toList();
      prices.sort();
      displayPrice = prices.first.toStringAsFixed(0);
    }

    return Scaffold(
      backgroundColor: PlanoraColors.background,
      body: Stack(
        children: [
          // ── Hero Image ────────────────────────────────────────────────
          Positioned(
            top: 0, left: 0, right: 0,
            height: MediaQuery.of(context).size.height * 0.45,
            child: imagePath.isNotEmpty
                ? Image.network(
                    imagePath,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(color: PlanoraColors.brandAccent),
                  )
                : Container(
                    color: PlanoraColors.brandAccent,
                    child: const Center(
                      child: Icon(Icons.storefront_outlined, size: 60, color: PlanoraColors.brandDark),
                    ),
                  ),
          ),

          // ── Back Button ───────────────────────────────────────────────
          Positioned(
            top: 48,
            left: 16,
            child: GestureDetector(
              onTap: () => Navigator.pop(context),
              child: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: PlanoraColors.brandDark.withAlpha(100),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.arrow_back_rounded,
                  color: PlanoraColors.background,
                  size: 20,
                ),
              ),
            ),
          ),

          // ── Category + Title + Rating (over hero) ─────────────────────
          Positioned(
            top: MediaQuery.of(context).size.height * 0.35 - 90,
            left: 24, right: 24,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: PlanoraColors.brandAccent,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    category,
                    style: tt.labelSmall?.copyWith(
                      color: PlanoraColors.brandDark,
                      fontWeight: FontWeight.w700,
                    ),
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
                          color: PlanoraColors.background,
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          shadows: [Shadow(color: Colors.black45, blurRadius: 6)],
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: PlanoraColors.background.withAlpha(50),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.star_rounded, color: Color(0xFFFFB300), size: 15),
                          const SizedBox(width: 4),
                          Text(
                            rating,
                            style: const TextStyle(
                              color: PlanoraColors.background,
                              fontWeight: FontWeight.w700,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // ── Sliding Sheet ─────────────────────────────────────────────
          Positioned.fill(
            top: MediaQuery.of(context).size.height * 0.35,
            child: Container(
              decoration: const BoxDecoration(
                color: PlanoraColors.background,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(28),
                  topRight: Radius.circular(28),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Lokasi
                  Padding(
                    padding: const EdgeInsets.fromLTRB(24, 20, 24, 0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Row(
                            children: [
                              const Icon(Icons.location_on_outlined,
                                  color: PlanoraColors.brandGray, size: 18),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(location,
                                    style: tt.bodySmall,
                                    overflow: TextOverflow.ellipsis),
                              ),
                            ],
                          ),
                        ),
                        if (lat != null && lng != null)
                          GestureDetector(
                            onTap: () => _openMaps(lat, lng),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: PlanoraColors.brandAccent,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.map_outlined, size: 14, color: PlanoraColors.brandDark),
                                  const SizedBox(width: 4),
                                  Text('Buka Peta',
                                      style: tt.labelSmall?.copyWith(color: PlanoraColors.brandDark)),
                                ],
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                    child: Divider(height: 1),
                  ),

                  // Scrollable content
                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.only(bottom: 120),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Deskripsi
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 24),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Deskripsi Layanan', style: tt.titleMedium),
                                const SizedBox(height: 10),
                                Text(description,
                                    style: tt.bodyMedium?.copyWith(
                                      color: PlanoraColors.brandGray,
                                      height: 1.6,
                                    )),
                              ],
                            ),
                          ),
                          const SizedBox(height: 28),

                          // Paket Layanan
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 24),
                            child: Text('Paket Layanan', style: tt.titleMedium),
                          ),
                          const SizedBox(height: 12),

                          if (_isServicesLoading)
                            const Padding(
                              padding: EdgeInsets.symmetric(vertical: 24),
                              child: Center(child: CircularProgressIndicator()),
                            )
                          else if (_services.isEmpty)
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                              child: Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: PlanoraColors.surface,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: PlanoraColors.divider),
                                ),
                                child: Text('Belum ada paket layanan tersedia.',
                                    style: tt.bodySmall),
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
                                final svcName = svc['namaLayanan'] ?? svc['name'] ?? 'Paket ${index + 1}';
                                final svcDesc = svc['deskripsi'] ?? svc['description'] ?? '';
                                final svcPrice = svc['harga'] ?? svc['price'] ?? 0;
                                final isSelected = _selectedService?['id']?.toString() == svcId;

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
                                          ? PlanoraColors.brandAccent
                                          : PlanoraColors.surface,
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(
                                        color: isSelected
                                            ? PlanoraColors.brandAccentHover
                                            : PlanoraColors.divider,
                                        width: isSelected ? 2 : 1,
                                      ),
                                    ),
                                    child: Row(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Icon(
                                          isSelected
                                              ? Icons.check_circle_rounded
                                              : Icons.radio_button_unchecked_rounded,
                                          color: isSelected
                                              ? PlanoraColors.brandDark
                                              : PlanoraColors.brandGray,
                                          size: 22,
                                        ),
                                        const SizedBox(width: 12),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(svcName,
                                                  style: tt.titleSmall?.copyWith(
                                                    color: isSelected
                                                        ? PlanoraColors.brandDark
                                                        : PlanoraColors.brandDark,
                                                  )),
                                              if (svcDesc.isNotEmpty) ...[
                                                const SizedBox(height: 4),
                                                Text(svcDesc, style: tt.bodySmall),
                                              ],
                                              const SizedBox(height: 8),
                                              Text(_formatCurrency(svcPrice),
                                                  style: tt.titleSmall),
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
        ],
      ),

      // ── Bottom Sheet: Harga + CTA ──────────────────────────────────────
      bottomSheet: Container(
        padding: const EdgeInsets.fromLTRB(24, 14, 24, 24),
        decoration: const BoxDecoration(
          color: PlanoraColors.background,
          border: Border(top: BorderSide(color: PlanoraColors.divider)),
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
                  style: tt.labelSmall?.copyWith(letterSpacing: 0.8),
                ),
                Text(_formatCurrency(displayPrice), style: tt.headlineSmall),
              ],
            ),
            Row(
              children: [
                // Bookmark
                Container(
                  decoration: BoxDecoration(
                    color: PlanoraColors.surface,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: PlanoraColors.divider),
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.bookmark_border_rounded,
                        color: PlanoraColors.brandGray),
                    onPressed: () {},
                  ),
                ),
                const SizedBox(width: 12),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _selectedService != null
                        ? PlanoraColors.brandAccent
                        : PlanoraColors.divider,
                    foregroundColor: _selectedService != null
                        ? PlanoraColors.brandDark
                        : PlanoraColors.brandGray,
                    minimumSize: const Size(120, 50),
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                  ),
                  onPressed: _selectedService == null
                      ? () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Silakan pilih paket layanan terlebih dahulu.')),
                          );
                        }
                      : () {
                          Navigator.pushNamed(
                            context,
                            '/pemesanan_form',
                            arguments: {
                              'id': _selectedService!['id'],
                              'name': _selectedService!['name'] ?? _selectedService!['namaLayanan'] ?? title,
                              'category': category,
                              'price': _selectedService!['price'] ?? _selectedService!['harga']?.toString() ?? '0',
                              'image': imagePath,
                              'vendorId': _vendorId,
                            },
                          );
                        },
                  child: Text(_selectedService != null ? 'Memesan' : 'Pilih Paket'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
