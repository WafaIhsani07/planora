import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../main.dart' show PlanoraColors;

class PesananScreen extends StatefulWidget {
  const PesananScreen({super.key});

  @override
  State<PesananScreen> createState() => _PesananScreenState();
}

class _PesananScreenState extends State<PesananScreen> {
  final int _currentIndex = 2;
  List<dynamic> _orders = [];
  bool _isLoading = true;
  bool _isBerjalan = true;

  @override
  void initState() {
    super.initState();
    _fetchOrders();
  }

  // Mengambil data pesanan dari backend API
  Future<void> _fetchOrders() async {
    setState(() => _isLoading = true);
    final result = await ApiService.getBookings();
    if (!mounted) return;
    setState(() {
      if (result['success'] == true) {
        _orders = result['data'] ?? [];
      } else {
        _orders = [];
        WidgetsBinding.instance.addPostFrameCallback((_) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(result['message'] ?? 'Gagal memuat pesanan')),
          );
        });
      }
      _isLoading = false;
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

  // Navigasi Bottom Bar
  void _onBottomNavTapped(int index) {
    if (index == 0) Navigator.pushReplacementNamed(context, '/home');
    if (index == 1) Navigator.pushReplacementNamed(context, '/explore');
    if (index == 3) Navigator.pushReplacementNamed(context, '/favorit');
    if (index == 4) Navigator.pushReplacementNamed(context, '/profil');
  }

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: PlanoraColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Header ─────────────────────────────────────────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('My Orders', style: tt.headlineMedium),
                  GestureDetector(
                    onTap: () => Navigator.pushNamed(context, '/kalender'),
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: PlanoraColors.surface,
                        shape: BoxShape.circle,
                        border: Border.all(color: PlanoraColors.divider),
                      ),
                      child: const Icon(
                        Icons.calendar_today_rounded,
                        color: PlanoraColors.brandGray,
                        size: 20,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // ── Toggle Tab Berjalan / Selesai ──────────────────────────
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: PlanoraColors.surface,
                  borderRadius: BorderRadius.circular(32),
                  border: Border.all(color: PlanoraColors.divider),
                ),
                child: Row(
                  children: [
                    _buildTab('Ongoing', _isBerjalan, () => setState(() => _isBerjalan = true)),
                    _buildTab('Completed', !_isBerjalan, () => setState(() => _isBerjalan = false)),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // ── Banner Jadwal Acara ─────────────────────────────────────
              GestureDetector(
                onTap: () => Navigator.pushNamed(context, '/kalender'),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: PlanoraColors.brandAccent,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: const BoxDecoration(
                          color: PlanoraColors.background,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.calendar_month_rounded,
                          color: PlanoraColors.brandDark,
                          size: 22,
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Event Schedule', style: tt.titleSmall),
                            const SizedBox(height: 2),
                            Text('Monitor important dates', style: tt.bodySmall),
                          ],
                        ),
                      ),
                      const Icon(Icons.chevron_right_rounded, color: PlanoraColors.brandDark),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // ── Daftar Pesanan ─────────────────────────────────────────
              _isLoading
                  ? const Center(child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 40),
                      child: CircularProgressIndicator()))
                  : _orders.isEmpty
                      ? _buildEmptyState(tt)
                      : ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _orders.length,
                          itemBuilder: (context, index) {
                            final item = _orders[index];
                            final status = item['status'] ?? 'PENDING';
                            return _buildOrderCard(item);
                          },
                        ),
            ],
          ),
        ),
      ),

      // ── Bottom Navigation Bar ─────────────────────────────────────────
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: PlanoraColors.divider)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: _onBottomNavTapped,
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home_rounded), label: 'Home'),
            BottomNavigationBarItem(icon: Icon(Icons.explore_outlined), activeIcon: Icon(Icons.explore_rounded), label: 'Explore'),
            BottomNavigationBarItem(icon: Icon(Icons.receipt_long_outlined), activeIcon: Icon(Icons.receipt_long_rounded), label: 'Orders'),
            BottomNavigationBarItem(icon: Icon(Icons.favorite_border_rounded), activeIcon: Icon(Icons.favorite_rounded), label: 'Favorites'),
            BottomNavigationBarItem(icon: Icon(Icons.person_outline_rounded), activeIcon: Icon(Icons.person_rounded), label: 'Profile'),
          ],
        ),
      ),
    );
  }

  // ── Tab Widget ──────────────────────────────────────────────────────────
  Widget _buildTab(String label, bool isActive, VoidCallback onTap) {
    final tt = Theme.of(context).textTheme;
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 11),
          decoration: BoxDecoration(
            color: isActive ? PlanoraColors.brandAccent : Colors.transparent,
            borderRadius: BorderRadius.circular(28),
          ),
          child: Center(
            child: Text(
              label,
              style: tt.labelMedium?.copyWith(
                color: isActive ? PlanoraColors.brandDark : PlanoraColors.brandGray,
                fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
              ),
            ),
          ),
        ),
      ),
    );
  }

  // ── Empty State ─────────────────────────────────────────────────────────
  Widget _buildEmptyState(TextTheme tt) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 48),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: const BoxDecoration(
                color: PlanoraColors.brandAccent,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.receipt_long_outlined,
                  size: 40, color: PlanoraColors.brandDark),
            ),
            const SizedBox(height: 16),
            Text('No order history yet.',
                style: tt.bodyMedium?.copyWith(color: PlanoraColors.brandGray)),
            const SizedBox(height: 6),
            Text('Go find vendors and make your first order!',
                style: tt.bodySmall, textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }

  // ── Order Card ──────────────────────────────────────────────────────────
  Widget _buildOrderCard(Map<String, dynamic> item) {
    final tt = Theme.of(context).textTheme;

    final id = item['id']?.toString() ?? '1';
    final invoiceStatus = item['status'] ?? 'PENDING';
    final status = invoiceStatus;
    final layanan = item['layanan'];
    final layananName = layanan?['namaLayanan'] ?? layanan?['name'] ?? 'Layanan';
    final harga = layanan?['harga'] ?? layanan?['price'] ?? 0;
    final vendorName = item['vendor']?['businessName'] ?? item['vendor']?['name'] ?? layananName;
    final isPaid = invoiceStatus != 'PENDING';
    
    final date = item['eventDate'] != null
        ? item['eventDate'].toString().substring(0, 10)
        : 'Tanggal Acara';
    final price = _formatCurrency(harga);
    const imageUrl = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=200&auto=format&fit=crop';

    final vendorData = item['vendor'] ?? {};
    final vid = vendorData['id']?.toString() ?? '';
    final bid = id;
    final vname = vendorData['businessName'] ?? vendorData['name'] ?? 'Vendor';
    final avatar = vendorData['avatar']?.toString() ?? '';
    final assetUrl = ApiService.getAssetUrl(avatar);
    final finalImageUrl = assetUrl.isNotEmpty ? assetUrl : imageUrl;

    final chatArgs = {
      'id': vid,
      'bookingId': bid,
      'name': vname,
      'imageUrl': finalImageUrl,
    };

    final paymentData = item['payment'];
    final isPaymentPending = paymentData != null && paymentData['status'] == 'PENDING';

    // Status badge color logic
    Color statusBg;
    Color statusFg;
    switch (invoiceStatus.toUpperCase()) {
      case 'CONFIRMED':
      case 'COMPLETED':
        statusBg = PlanoraColors.brandAccent;
        statusFg = PlanoraColors.brandDark;
        break;
      case 'PENDING':
        statusBg = const Color(0xFFFFF3CD);
        statusFg = const Color(0xFF856404);
        break;
      default:
        statusBg = PlanoraColors.divider;
        statusFg = PlanoraColors.brandGray;
    }

    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, '/detail_booking_batalkan', arguments: id),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: PlanoraColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: PlanoraColors.divider),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            // Status badge pojok kanan atas
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color: statusBg,
                borderRadius: const BorderRadius.only(
                  topRight: Radius.circular(20),
                  bottomLeft: Radius.circular(16),
                ),
              ),
              child: Text(
                invoiceStatus,
                style: tt.labelSmall?.copyWith(
                  color: statusFg,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.3,
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(14),
                    child: Image.network(
                      finalImageUrl,
                      width: 68,
                      height: 68,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        width: 68, height: 68,
                        color: PlanoraColors.brandAccent,
                        child: const Icon(Icons.storefront_outlined, color: PlanoraColors.brandDark),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(vendorName, style: tt.titleSmall, maxLines: 1, overflow: TextOverflow.ellipsis),
                        if (layananName.isNotEmpty) ...[
                          const SizedBox(height: 2),
                          Text(layananName, style: tt.bodySmall, maxLines: 1, overflow: TextOverflow.ellipsis),
                        ],
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            const Icon(Icons.calendar_today_outlined, size: 13, color: PlanoraColors.brandGray),
                            const SizedBox(width: 4),
                            Text(date, style: tt.bodySmall),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(price, style: tt.titleSmall),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: isPaid
                              ? [
                                  OutlinedButton(
                                    onPressed: () {
                                      Navigator.pushNamed(context, '/chat_detail', arguments: chatArgs);
                                    },
                                    style: OutlinedButton.styleFrom(
                                      minimumSize: const Size(0, 36),
                                      padding: const EdgeInsets.symmetric(horizontal: 16),
                                    ),
                                    child: const Text('Contact'),
                                  ),
                                  const SizedBox(width: 8),
                                  ElevatedButton(
                                    onPressed: () {
                                      Navigator.pushNamed(context, '/detail_booking_batalkan', arguments: id);
                                    },
                                    style: ElevatedButton.styleFrom(
                                      minimumSize: const Size(0, 36),
                                      padding: const EdgeInsets.symmetric(horizontal: 16),
                                    ),
                                    child: const Text('Details'),
                                  ),
                                ]
                              : isPaymentPending
                                  ? [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFFFF3CD),
                                          borderRadius: BorderRadius.circular(12),
                                          border: Border.all(color: const Color(0xFFFFEBA8)),
                                        ),
                                        child: Text(
                                          'Awaiting Verification',
                                          style: tt.labelSmall?.copyWith(
                                            color: const Color(0xFF856404),
                                            fontWeight: FontWeight.w700,
                                          ),
                                        ),
                                      ),
                                    ]
                                  : [
                                      ElevatedButton(
                                        onPressed: () => Navigator.pushNamed(context, '/pembayaran', arguments: id),
                                        style: ElevatedButton.styleFrom(
                                          minimumSize: const Size(0, 36),
                                          padding: const EdgeInsets.symmetric(horizontal: 16),
                                        ),
                                        child: const Text('Pay Now'),
                                      ),
                                    ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
