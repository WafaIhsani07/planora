import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'package:intl/intl.dart';

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
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Ya, Batalkan',
                style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    setState(() => _isLoading = true);

    // Gunakan endpoint PATCH untuk update status menjadi CANCELLED
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

    // Ambil vendorId dari data booking (relasi nested)
    final vendorId = _bookingDetails?['vendor']?['id']?.toString() ??
        _bookingDetails?['vendorId']?.toString() ??
        '';

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
        const SnackBar(
          content: Text('Ulasan berhasil dikirim. Terima kasih!'),
          backgroundColor: Color(0xFF00C48C),
        ),
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
      return NumberFormat.currency(
        locale: 'id_ID',
        symbol: 'Rp ',
        decimalDigits: 0,
      ).format(amount);
    } catch (_) {
      return 'Rp 0';
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (_errorMessage != null || _bookingDetails == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Detail Pesanan')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 48, color: Colors.red),
                const SizedBox(height: 16),
                Text(
                  _errorMessage ?? 'Pesanan tidak ditemukan.',
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

    final detail = _bookingDetails!;

    // Mapping field dari response backend Prisma
    final vendorData = detail['vendor'] ?? detail['layanan']?['vendor'] ?? {};
    final layananData = detail['layanan'] ?? {};

    final String imagePath =
        vendorData['avatar']?.toString().isNotEmpty == true
            ? (vendorData['avatar'].toString().startsWith('http')
                ? vendorData['avatar']
                : 'http://10.0.2.2:5000/assets/${vendorData['avatar']}')
            : 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop';

    final String category = vendorData['category'] ?? 'Wedding Organizer';
    final String title =
        vendorData['businessName'] ?? vendorData['name'] ?? 'Nama Vendor';
    final String description =
        layananData['deskripsi'] ??
        layananData['description'] ??
        vendorData['description'] ??
        'Deskripsi belum tersedia.';
    final String price =
        layananData['harga']?.toString() ??
        layananData['price']?.toString() ??
        detail['totalPrice']?.toString() ?? '0';
    final String scheduleDate =
        detail['eventDate'] != null
            ? detail['eventDate'].toString().substring(0, 10)
            : 'Jadwal belum ditentukan';
    final String statusText = detail['status'] ?? 'PENDING';
    final String pemesan =
        detail['user']?['name'] ?? detail['userName'] ?? 'Pemesan';
    final String alamat =
        detail['eventAddress'] ?? detail['address'] ?? 'Alamat belum diisi';

    // T11: Review form hanya tampil jika status COMPLETED
    final bool isCompleted =
        statusText.toUpperCase() == 'COMPLETED' ||
        statusText.toUpperCase() == 'SELESAI';

    // Warna badge status
    Color statusColor;
    switch (statusText.toUpperCase()) {
      case 'PAID':
      case 'LUNAS':
        statusColor = Colors.green;
        break;
      case 'CANCELLED':
      case 'DIBATALKAN':
        statusColor = Colors.grey;
        break;
      case 'COMPLETED':
      case 'SELESAI':
        statusColor = Colors.blue;
        break;
      default:
        statusColor = Colors.redAccent;
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
            child: Image.network(
              imagePath,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) =>
                  Container(color: Colors.grey[300]),
            ),
          ),

          // ── Back Button ──────────────────────────────────────────────────────
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

          // ── Status Badge ────────────────────────────────────────────────────
          Positioned(
            top: 48,
            right: 16,
            child: Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: statusColor,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                statusText,
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.bold),
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
                  // Jadwal header
                  Padding(
                    padding: const EdgeInsets.only(
                        top: 24, left: 24, right: 24),
                    child: Row(
                      children: [
                        const Icon(Icons.calendar_today,
                            color: Color(0xFF00C48C), size: 20),
                        const SizedBox(width: 8),
                        Text(
                          'Jadwal: $scheduleDate',
                          style: const TextStyle(
                            color: Color(0xFF00C48C),
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(
                        horizontal: 24.0, vertical: 16),
                    child: Divider(height: 1, color: Colors.grey),
                  ),

                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.only(
                          left: 24, right: 24, bottom: 120),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // ── Info Pemesan ─────────────────────────────────
                          _buildInfoRow(Icons.person_outline, 'Pemesan', pemesan),
                          const SizedBox(height: 8),
                          _buildInfoRow(
                              Icons.location_on_outlined, 'Alamat Acara', alamat),
                          const SizedBox(height: 20),
                          const Divider(),
                          const SizedBox(height: 12),

                          // ── Deskripsi Layanan ─────────────────────────────
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
                          const SizedBox(height: 24),

                          // ── T11: Form Ulasan (hanya jika COMPLETED) ───────
                          if (isCompleted) ...[
                            const Divider(),
                            const SizedBox(height: 16),
                            if (_reviewSubmitted)
                              Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFE8F5E9),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                      color: const Color(0xFF00C48C)),
                                ),
                                child: const Row(
                                  children: [
                                    Icon(Icons.check_circle,
                                        color: Color(0xFF00C48C)),
                                    SizedBox(width: 12),
                                    Text('Ulasan sudah dikirim. Terima kasih!',
                                        style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF00C48C))),
                                  ],
                                ),
                              )
                            else if (!_showReviewForm)
                              ElevatedButton.icon(
                                onPressed: () =>
                                    setState(() => _showReviewForm = true),
                                icon: const Icon(Icons.star_outline,
                                    color: Colors.white),
                                label: const Text('Beri Ulasan & Rating',
                                    style: TextStyle(color: Colors.white)),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF00C48C),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  padding: const EdgeInsets.symmetric(
                                      vertical: 12, horizontal: 20),
                                ),
                              )
                            else
                              _buildReviewForm(),
                          ],
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // ── Category + Title ─────────────────────────────────────────────────
          Positioned(
            top: MediaQuery.of(context).size.height * 0.35 - 90,
            left: 24,
            right: 24,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFF00C48C),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(category,
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold)),
                ),
                const SizedBox(height: 8),
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    shadows: [Shadow(color: Colors.black45, blurRadius: 4)],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),

      // ── Bottom Sheet: Harga + Batalkan ────────────────────────────────────
      bottomSheet: Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
                color: Colors.black12,
                blurRadius: 10,
                offset: Offset(0, -2)),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('TOTAL HARGA',
                    style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey)),
                Text(
                  _formatCurrency(price),
                  style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87),
                ),
              ],
            ),
            // Hanya tampilkan tombol batalkan jika status masih PENDING
            if (statusText.toUpperCase() == 'PENDING')
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  side: const BorderSide(color: Colors.redAccent),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10)),
                  padding: const EdgeInsets.symmetric(
                      horizontal: 24, vertical: 14),
                ),
                onPressed: _cancelBooking,
                child: const Text('Batalkan',
                    style: TextStyle(
                        color: Colors.redAccent,
                        fontSize: 16,
                        fontWeight: FontWeight.bold)),
              )
            else
              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0F0F0),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  statusText,
                  style: TextStyle(
                      color: statusColor,
                      fontSize: 14,
                      fontWeight: FontWeight.bold),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18, color: Colors.grey),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label,
                  style: const TextStyle(fontSize: 11, color: Colors.grey)),
              Text(value,
                  style: const TextStyle(
                      fontSize: 14, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
      ],
    );
  }

  // T11: Widget form bintang + teks ulasan
  Widget _buildReviewForm() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF9F9F9),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFEEEEEE)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Beri Rating',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          const SizedBox(height: 12),
          // Bintang interaktif
          Row(
            children: List.generate(5, (i) {
              return GestureDetector(
                onTap: () => setState(() => _reviewRating = i + 1),
                child: Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: Icon(
                    i < _reviewRating ? Icons.star : Icons.star_border,
                    color: const Color(0xFFFBC02D),
                    size: 36,
                  ),
                ),
              );
            }),
          ),
          const SizedBox(height: 16),
          const Text('Tulis Ulasan',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          const SizedBox(height: 8),
          TextField(
            controller: _reviewController,
            maxLines: 3,
            decoration: InputDecoration(
              hintText: 'Ceritakan pengalaman Anda dengan vendor ini...',
              hintStyle:
                  const TextStyle(color: Colors.grey, fontSize: 13),
              filled: true,
              fillColor: Colors.white,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide:
                    const BorderSide(color: Color(0xFFEEEEEE)),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide:
                    const BorderSide(color: Color(0xFFEEEEEE)),
              ),
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _isSubmittingReview ? null : _submitReview,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF00C48C),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                padding:
                    const EdgeInsets.symmetric(vertical: 14),
              ),
              child: _isSubmittingReview
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                          color: Colors.white, strokeWidth: 2))
                  : const Text('Kirim Ulasan',
                      style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 15)),
            ),
          ),
        ],
      ),
    );
  }
}
