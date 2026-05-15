import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'package:intl/intl.dart';
import '../main.dart' show PlanoraColors;

class DetailBookingBatalkanScreen extends StatefulWidget {
  const DetailBookingBatalkanScreen({super.key});

  @override
  State<DetailBookingBatalkanScreen> createState() =>
      _DetailBookingBatalkanScreenState();
}

class _DetailBookingBatalkanScreenState
    extends State<DetailBookingBatalkanScreen> {
  Map<String, dynamic>? _bookingDetails;
  bool _isLoading = true;
  String? _errorMessage;
  String _bookingId = '1';

  // T11: State untuk form ulasan
  bool _showReviewForm = false;
  int _reviewRating = 0;
  final TextEditingController _reviewController = TextEditingController();
  bool _isSubmittingReview = false;
  bool _reviewSubmitted = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args != null) {
      final newId = args.toString();
      if (_bookingId != newId || _bookingDetails == null) {
        _bookingId = newId;
        _fetchBookingDetails();
      }
    } else {
      setState(() {
        _errorMessage = 'Booking ID tidak ditemukan.';
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _reviewController.dispose();
    super.dispose();
  }

  // T9: Fetch booking detail via ApiService (JWT Bearer otomatis)
  Future<void> _fetchBookingDetails() async {
    setState(() => _isLoading = true);
    final result = await ApiService.getBookingById(_bookingId);
    if (!mounted) return;
    setState(() {
      if (result['success'] == true) {
        _bookingDetails = result['data'];
        _errorMessage = null;
      } else {
        _errorMessage = result['message'] ?? 'Gagal memuat detail pesanan.';
      }
      _isLoading = false;
    });
  }

  Future<void> _cancelBooking() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Batalkan Pesanan'),
        content: const Text('Apakah Anda yakin ingin membatalkan pesanan ini?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Tidak'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: PlanoraColors.error,
              foregroundColor: PlanoraColors.background,
            ),
            child: const Text('Ya, Batalkan'),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    setState(() => _isLoading = true);

    final result = await ApiService.postRequest(
      '/bookings/$_bookingId/cancel',
      {'status': 'CANCELLED'},
    );

    if (!mounted) return;

    if (result.statusCode == 200 || result.statusCode == 204) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Pesanan berhasil dibatalkan.')),
      );
      Navigator.pop(context, true);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Gagal membatalkan, coba lagi.')),
      );
      setState(() => _isLoading = false);
    }
  }

  // T11: Submit ulasan via ApiService.addReview()
  Future<void> _submitReview() async {
    if (_reviewRating == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Pilih bintang rating terlebih dahulu.')),
      );
      return;
    }
    if (_reviewController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Tulis ulasan Anda terlebih dahulu.')),
      );
      return;
    }

    setState(() => _isSubmittingReview = true);

    final vendorId = _bookingDetails?['vendor']?['id']?.toString() ??
        _bookingDetails?['vendorId']?.toString() ?? '';

    if (vendorId.isEmpty) {
      setState(() => _isSubmittingReview = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vendor ID tidak ditemukan.')),
      );
      return;
    }

    final result = await ApiService.addReview(
      vendorId,
      _reviewRating,
      _reviewController.text.trim(),
    );

    if (!mounted) return;
    setState(() => _isSubmittingReview = false);

    if (result['success'] == true) {
      setState(() {
        _reviewSubmitted = true;
        _showReviewForm = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Ulasan berhasil dikirim. Terima kasih!')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'] ?? 'Gagal mengirim ulasan.')),
      );
    }
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

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;

    if (_isLoading) {
      return const Scaffold(
        backgroundColor: PlanoraColors.background,
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (_errorMessage != null || _bookingDetails == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Detail Pesanan')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 72, height: 72,
                  decoration: BoxDecoration(
                    color: PlanoraColors.error.withAlpha(15),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.error_outline_rounded,
                      size: 36, color: PlanoraColors.error),
                ),
                const SizedBox(height: 16),
                Text(_errorMessage ?? 'Pesanan tidak ditemukan.',
                    textAlign: TextAlign.center, style: tt.bodyMedium),
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

    final detail = _bookingDetails!;
    final vendorData = detail['vendor'] ?? detail['layanan']?['vendor'] ?? {};
    final layananData = detail['layanan'] ?? {};

    final String imagePath =
        vendorData['avatar']?.toString().isNotEmpty == true
            ? (vendorData['avatar'].toString().startsWith('http')
                ? vendorData['avatar']
                : 'http://10.0.2.2:5000/assets/${vendorData['avatar']}')
            : 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop';

    final String category = vendorData['category'] ?? 'Wedding Organizer';
    final String title = vendorData['businessName'] ?? vendorData['name'] ?? 'Nama Vendor';
    final String description = layananData['deskripsi'] ?? layananData['description'] ??
        vendorData['description'] ?? 'Deskripsi belum tersedia.';
    final String price = layananData['harga']?.toString() ??
        layananData['price']?.toString() ?? detail['totalPrice']?.toString() ?? '0';
    final String scheduleDate = detail['eventDate'] != null
        ? detail['eventDate'].toString().substring(0, 10)
        : 'Jadwal belum ditentukan';
    final String statusText = detail['status'] ?? 'PENDING';
    final String pemesan = detail['user']?['name'] ?? detail['userName'] ?? 'Pemesan';
    final String alamat = detail['eventAddress'] ?? detail['address'] ?? 'Alamat belum diisi';

    final bool isCompleted = statusText.toUpperCase() == 'COMPLETED' ||
        statusText.toUpperCase() == 'SELESAI';

    // Status badge mapping ke palette
    Color statusBg;
    Color statusFg;
    switch (statusText.toUpperCase()) {
      case 'PAID':
      case 'LUNAS':
      case 'CONFIRMED':
        statusBg = PlanoraColors.brandAccent;
        statusFg = PlanoraColors.brandDark;
        break;
      case 'CANCELLED':
      case 'DIBATALKAN':
        statusBg = PlanoraColors.divider;
        statusFg = PlanoraColors.brandGray;
        break;
      case 'COMPLETED':
      case 'SELESAI':
        statusBg = PlanoraColors.brandAccent;
        statusFg = PlanoraColors.brandDark;
        break;
      default:
        statusBg = const Color(0xFFFFF3CD);
        statusFg = const Color(0xFF856404);
    }

    return Scaffold(
      backgroundColor: PlanoraColors.background,
      body: Stack(
        children: [
          // ── Hero Image ──────────────────────────────────────────────
          Positioned(
            top: 0, left: 0, right: 0,
            height: MediaQuery.of(context).size.height * 0.45,
            child: Image.network(
              imagePath,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) =>
                  Container(color: PlanoraColors.brandAccent),
            ),
          ),

          // ── Back Button ─────────────────────────────────────────────
          Positioned(
            top: 48, left: 16,
            child: GestureDetector(
              onTap: () => Navigator.pop(context),
              child: Container(
                width: 40, height: 40,
                decoration: BoxDecoration(
                  color: PlanoraColors.brandDark.withAlpha(100),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.arrow_back_rounded,
                    color: PlanoraColors.background, size: 20),
              ),
            ),
          ),

          // ── Status Badge ────────────────────────────────────────────
          Positioned(
            top: 52, right: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
              decoration: BoxDecoration(
                color: statusBg,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(statusText,
                  style: tt.labelSmall?.copyWith(
                    color: statusFg, fontWeight: FontWeight.w700)),
            ),
          ),

          // ── Category + Title (over hero) ────────────────────────────
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
                  child: Text(category,
                      style: tt.labelSmall?.copyWith(
                        color: PlanoraColors.brandDark, fontWeight: FontWeight.w700)),
                ),
                const SizedBox(height: 8),
                Text(title,
                    style: const TextStyle(
                      color: PlanoraColors.background,
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      shadows: [Shadow(color: Colors.black45, blurRadius: 6)],
                    )),
              ],
            ),
          ),

          // ── Sliding Sheet ───────────────────────────────────────────
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
                  // Jadwal header
                  Padding(
                    padding: const EdgeInsets.fromLTRB(24, 20, 24, 0),
                    child: Row(
                      children: [
                        const Icon(Icons.calendar_today_rounded,
                            color: PlanoraColors.brandDark, size: 18),
                        const SizedBox(width: 8),
                        Text('Jadwal: $scheduleDate',
                            style: tt.titleSmall),
                      ],
                    ),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                    child: Divider(height: 1),
                  ),

                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.only(left: 24, right: 24, bottom: 120),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Info rows
                          _buildInfoRow(Icons.person_outline_rounded, 'Pemesan', pemesan, tt),
                          const SizedBox(height: 8),
                          _buildInfoRow(Icons.location_on_outlined, 'Alamat Acara', alamat, tt),
                          const SizedBox(height: 20),
                          const Divider(),
                          const SizedBox(height: 12),

                          // Deskripsi
                          Text('Deskripsi Layanan', style: tt.titleMedium),
                          const SizedBox(height: 10),
                          Text(description,
                              style: tt.bodyMedium?.copyWith(
                                color: PlanoraColors.brandGray, height: 1.6)),
                          const SizedBox(height: 24),

                          // T11: Form Ulasan (hanya jika COMPLETED)
                          if (isCompleted) ...[
                            const Divider(),
                            const SizedBox(height: 16),
                            if (_reviewSubmitted)
                              Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: PlanoraColors.brandAccent,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: PlanoraColors.brandAccentHover),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.check_circle_rounded,
                                        color: PlanoraColors.brandDark),
                                    const SizedBox(width: 12),
                                    Text('Ulasan sudah dikirim. Terima kasih!',
                                        style: tt.titleSmall),
                                  ],
                                ),
                              )
                            else if (!_showReviewForm)
                              ElevatedButton.icon(
                                onPressed: () => setState(() => _showReviewForm = true),
                                icon: const Icon(Icons.star_outline_rounded),
                                label: const Text('Beri Ulasan & Rating'),
                              )
                            else
                              _buildReviewForm(tt),
                          ],
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

      // ── Bottom Sheet ─────────────────────────────────────────────────
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
                Text('TOTAL HARGA',
                    style: tt.labelSmall?.copyWith(letterSpacing: 0.8)),
                Text(_formatCurrency(price), style: tt.headlineSmall),
              ],
            ),
            if (statusText.toUpperCase() == 'PENDING')
              OutlinedButton(
                onPressed: _cancelBooking,
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(0, 48),
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  side: const BorderSide(color: PlanoraColors.error),
                  foregroundColor: PlanoraColors.error,
                ),
                child: const Text('Batalkan'),
              )
            else
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: statusBg,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(statusText,
                    style: tt.labelMedium?.copyWith(
                      color: statusFg, fontWeight: FontWeight.w600)),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value, TextTheme tt) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18, color: PlanoraColors.brandGray),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: tt.bodySmall),
              Text(value, style: tt.titleSmall),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildReviewForm(TextTheme tt) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: PlanoraColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: PlanoraColors.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Beri Rating', style: tt.titleMedium),
          const SizedBox(height: 12),
          Row(
            children: List.generate(5, (i) {
              return GestureDetector(
                onTap: () => setState(() => _reviewRating = i + 1),
                child: Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: Icon(
                    i < _reviewRating ? Icons.star_rounded : Icons.star_outline_rounded,
                    color: const Color(0xFFFBC02D),
                    size: 36,
                  ),
                ),
              );
            }),
          ),
          const SizedBox(height: 16),
          Text('Tulis Ulasan', style: tt.titleMedium),
          const SizedBox(height: 8),
          TextField(
            controller: _reviewController,
            maxLines: 3,
            decoration: const InputDecoration(
              hintText: 'Ceritakan pengalaman Anda dengan vendor ini...',
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: _isSubmittingReview ? null : _submitReview,
            child: _isSubmittingReview
                ? const SizedBox(
                    width: 20, height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2.5,
                        valueColor: AlwaysStoppedAnimation<Color>(PlanoraColors.brandDark)))
                : const Text('Kirim Ulasan'),
          ),
        ],
      ),
    );
  }
}
