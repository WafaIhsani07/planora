import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:async';
import 'package:image_picker/image_picker.dart';
import '../services/api_service.dart';
import '../main.dart' show PlanoraColors;

class PembayaranScreen extends StatefulWidget {
  const PembayaranScreen({super.key});

  @override
  State<PembayaranScreen> createState() => _PembayaranScreenState();
}

class _PembayaranScreenState extends State<PembayaranScreen> {
  List<dynamic> _orders = [];
  bool _isLoading = true;
  Map<String, dynamic>? _selectedOrder;
  Timer? _countdownTimer;
  Duration _timeLeft = const Duration(hours: 23, minutes: 59, seconds: 0);

  final ImagePicker _picker = ImagePicker();
  String? _targetId;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args != null) _targetId = args.toString();
  }

  @override
  void initState() {
    super.initState();
    _fetchOrders();
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    super.dispose();
  }

  Future<void> _fetchOrders() async {
    try {
      final result = await ApiService.getBookings();
      if (result['success'] == true && mounted) {
        final bookings = result['data'] as List<dynamic>? ?? [];
        setState(() {
          _orders = bookings;
          if (_orders.isNotEmpty) {
            if (_targetId != null) {
              _selectedOrder = _orders.firstWhere(
                (o) => o['id'].toString() == _targetId,
                orElse: () => _orders.first,
              );
            } else {
              // Pilih pesanan PENDING terlebih dahulu, jika tidak ada ambil yang pertama
              _selectedOrder = _orders.firstWhere(
                (o) => o['status'] == 'PENDING' || o['status'] == 'CONFIRMED',
                orElse: () => _orders.first,
              );
            }
            _startCountdown();
          }
          _isLoading = false;
        });
      } else {
        if (mounted) setState(() => _isLoading = false);
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _startCountdown() {
    _countdownTimer?.cancel();
    // Hanya jalankan countdown jika order masih PENDING dan belum ada payment
    if (_selectedOrder == null) return;
    final status = _selectedOrder!['status'] ?? '';
    if (status != 'PENDING') return;

    DateTime targetTime = DateTime.now().add(const Duration(hours: 24));
    if (_selectedOrder!['createdAt'] != null) {
      DateTime created = DateTime.parse(_selectedOrder!['createdAt']);
      targetTime = created.add(const Duration(hours: 24));
    }

    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      final difference = targetTime.difference(DateTime.now());
      if (difference.isNegative) {
        timer.cancel();
        if (mounted) setState(() => _timeLeft = Duration.zero);
      } else {
        if (mounted) setState(() => _timeLeft = difference);
      }
    });
  }

  Future<void> _copyBankAccount() async {
    await Clipboard.setData(const ClipboardData(text: '8123456789'));
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Nomor Rekening Disalin')),
      );
    }
  }

  Future<void> _uploadProof() async {
    if (_selectedOrder == null) return;
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
    if (image == null) return;

    if (!mounted) return;
    setState(() => _isLoading = true);

    final bookingId = _selectedOrder!['id'].toString();
    final rawPrice = _selectedOrder!['totalPrice'];
    final totalPrice = rawPrice is num
        ? rawPrice.toDouble()
        : (double.tryParse(rawPrice?.toString() ?? '0') ?? 0.0);

    try {
      // 1. Unggah file gambar bukti transfer
      final uploadResult = await ApiService.uploadFile(image);
      if (!mounted) return;

      if (uploadResult['success'] != true) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(
                  uploadResult['message'] ?? 'Gagal mengunggah bukti gambar.')),
        );
        setState(() => _isLoading = false);
        return;
      }

      final imageUrl = uploadResult['imageUrl'];

      // 2. Kirim data pembayaran ke backend dengan proofUrl
      final payResult = await ApiService.createPayment(
        bookingId: bookingId,
        amount: totalPrice,
        method: 'BANK_TRANSFER',
        proofUrl: imageUrl,
      );
      if (!mounted) return;

      if (payResult['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text(
                  'Bukti pembayaran berhasil dikirim! Menunggu konfirmasi admin.')),
        );
        await _fetchOrders();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(
                  payResult['message'] ?? 'Gagal mengajukan pembayaran.')),
        );
        setState(() => _isLoading = false);
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Terjadi kesalahan. Coba lagi.')),
      );
      setState(() => _isLoading = false);
    }
  }

  String _formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    return '${twoDigits(duration.inHours)} : ${twoDigits(duration.inMinutes.remainder(60))} : ${twoDigits(duration.inSeconds.remainder(60))}';
  }

  String _statusLabel(String status) {
    switch (status) {
      case 'PENDING':
        return 'Menunggu Pembayaran';
      case 'CONFIRMED':
        return 'Dikonfirmasi';
      case 'IN_PROGRESS':
        return 'Sedang Berjalan';
      case 'COMPLETED':
        return 'Selesai / Lunas';
      case 'CANCELLED':
        return 'Dibatalkan';
      default:
        return status;
    }
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'PENDING':
        return PlanoraColors.error;
      case 'CONFIRMED':
        return const Color(0xFF2E7D32);
      case 'IN_PROGRESS':
        return PlanoraColors.brandDark;
      case 'COMPLETED':
        return PlanoraColors.brandGray;
      case 'CANCELLED':
        return PlanoraColors.brandGray;
      default:
        return PlanoraColors.brandGray;
    }
  }

  /// Bantu cek status pembayaran dari selectedOrder
  String? get _paymentStatus =>
      _selectedOrder?['payment']?['status'] as String?;

  bool get _isOrderPending => _selectedOrder?['status'] == 'PENDING';
  bool get _hasPaymentSubmitted =>
      _paymentStatus != null; // Ada payment record
  bool get _isPaymentPendingVerification => _paymentStatus == 'PENDING';
  bool get _isPaymentPaid => _paymentStatus == 'PAID';
  bool get _isPaymentFailed => _paymentStatus == 'FAILED';
  bool get _isOrderConfirmedOrLater =>
      ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED']
          .contains(_selectedOrder?['status']);

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: PlanoraColors.background,
      appBar: AppBar(title: const Text('Daftar Pembayaran')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _orders.isEmpty
              ? Center(
                  child: Text('Tidak ada data pembayaran.',
                      style: tt.bodyMedium
                          ?.copyWith(color: PlanoraColors.brandGray)),
                )
              : Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 24, vertical: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // ── Daftar Pesanan ──────────────────────────────────
                      Expanded(
                        flex: 4,
                        child: ListView.builder(
                          itemCount: _orders.length,
                          itemBuilder: (context, index) {
                            final item = _orders[index];
                            final bool isSelected = _selectedOrder != null &&
                                _selectedOrder!['id'] == item['id'];

                            return GestureDetector(
                              onTap: () {
                                setState(() {
                                  _selectedOrder = item;
                                  _startCountdown();
                                });
                              },
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                margin: const EdgeInsets.only(bottom: 14),
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? PlanoraColors.brandAccent
                                      : PlanoraColors.surface,
                                  borderRadius: BorderRadius.circular(18),
                                  border: Border.all(
                                    color: isSelected
                                        ? PlanoraColors.brandAccentHover
                                        : PlanoraColors.divider,
                                    width: isSelected ? 2 : 1,
                                  ),
                                ),
                                padding: const EdgeInsets.all(14),
                                child: Row(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(12),
                                      child: Image.network(
                                        item['vendor']?['imageUrl'] ??
                                            'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=200&auto=format&fit=crop',
                                        width: 56,
                                        height: 56,
                                        fit: BoxFit.cover,
                                        errorBuilder: (_, __, ___) => Container(
                                          width: 56,
                                          height: 56,
                                          color: PlanoraColors.brandAccent,
                                          child: const Icon(
                                              Icons.storefront_outlined,
                                              color: PlanoraColors.brandDark),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            item['vendor']?['businessName'] ??
                                                item['layanan']?['name'] ??
                                                'Layanan',
                                            style: tt.titleSmall,
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            _statusLabel(item['status'] ?? ''),
                                            style: tt.bodySmall?.copyWith(
                                              fontWeight: FontWeight.w600,
                                              color: _statusColor(
                                                  item['status'] ?? ''),
                                            ),
                                          ),
                                          // Tampilkan badge pembayaran jika ada
                                          if (item['payment'] != null) ...[
                                            const SizedBox(height: 4),
                                            _buildPaymentBadge(
                                                item['payment']['status'] ?? '',
                                                tt),
                                          ],
                                        ],
                                      ),
                                    ),
                                    if (isSelected)
                                      const Icon(Icons.check_circle_rounded,
                                          color: PlanoraColors.brandDark,
                                          size: 20),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                      ),

                      const SizedBox(height: 14),

                      // ── Panel Instruksi Pembayaran (kondisional) ──────────
                      if (_selectedOrder != null)
                        Expanded(
                          flex: 6,
                          child: SingleChildScrollView(
                            child: _buildPaymentPanel(tt),
                          ),
                        ),
                    ],
                  ),
                ),
    );
  }

  /// Badge kecil untuk status pembayaran di dalam list item
  Widget _buildPaymentBadge(String payStatus, TextTheme tt) {
    Color bg;
    Color fg;
    String label;
    switch (payStatus) {
      case 'PENDING':
        bg = const Color(0xFFFFF8E1);
        fg = const Color(0xFFF59E0B);
        label = '⏳ Menunggu Verifikasi Admin';
        break;
      case 'PAID':
        bg = const Color(0xFFE8F5E9);
        fg = const Color(0xFF2E7D32);
        label = '✅ Pembayaran Terverifikasi';
        break;
      case 'FAILED':
        bg = const Color(0xFFFFEBEE);
        fg = PlanoraColors.error;
        label = '❌ Bukti Ditolak Admin';
        break;
      case 'REFUNDED':
        bg = const Color(0xFFF3E5F5);
        fg = const Color(0xFF7B1FA2);
        label = '↩️ Dana Dikembalikan';
        break;
      default:
        return const SizedBox.shrink();
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
          color: bg, borderRadius: BorderRadius.circular(8)),
      child: Text(label,
          style: tt.labelSmall?.copyWith(color: fg, fontWeight: FontWeight.w700)),
    );
  }

  /// Panel bawah yang isinya berbeda tergantung status
  Widget _buildPaymentPanel(TextTheme tt) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: PlanoraColors.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: PlanoraColors.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header panel
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Status & Instruksi', style: tt.titleMedium),
              Text(
                'ID: ${_selectedOrder!['id'].toString().substring(0, 8).toUpperCase()}',
                style: tt.bodySmall,
              ),
            ],
          ),
          const SizedBox(height: 18),

          // ── CASE 1: Sudah dikonfirmasi / berjalan / selesai ─────────────
          if (_isOrderConfirmedOrLater) ...[
            _buildStatusCard(
              icon: Icons.check_circle_rounded,
              iconColor: const Color(0xFF2E7D32),
              bgColor: const Color(0xFFE8F5E9),
              title: _selectedOrder!['status'] == 'COMPLETED'
                  ? 'Pesanan Selesai'
                  : _selectedOrder!['status'] == 'IN_PROGRESS'
                      ? 'Pesanan Sedang Berjalan'
                      : 'Pembayaran Dikonfirmasi',
              subtitle: _selectedOrder!['status'] == 'COMPLETED'
                  ? 'Terima kasih! Layanan telah selesai dikerjakan.'
                  : 'Pembayaran Anda sudah diverifikasi oleh Admin Planora. Vendor siap melayani Anda.',
              tt: tt,
            ),
          ]

          // ── CASE 2: PENDING + bukti bayar sudah terkirim (menunggu verif) ──
          else if (_isOrderPending && _isPaymentPendingVerification) ...[
            _buildStatusCard(
              icon: Icons.hourglass_top_rounded,
              iconColor: const Color(0xFFF59E0B),
              bgColor: const Color(0xFFFFF8E1),
              title: 'Bukti Pembayaran Diterima',
              subtitle:
                  'Bukti transfer Anda sudah kami terima dan sedang diverifikasi oleh Admin Planora. Mohon tunggu, proses biasanya 1×24 jam.',
              tt: tt,
            ),
            const SizedBox(height: 16),
            // Tampilkan bukti yang sudah dikirim
            if (_selectedOrder!['payment']?['proofUrl'] != null) ...[
              Text('Bukti Transfer Anda',
                  style: tt.labelSmall?.copyWith(letterSpacing: 0.8)),
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.network(
                  _selectedOrder!['payment']['proofUrl'],
                  height: 160,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    height: 80,
                    decoration: BoxDecoration(
                      color: PlanoraColors.brandAccent,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Center(
                      child: Text('Bukti transfer terkirim',
                          style: TextStyle(color: PlanoraColors.brandDark)),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Metode: ${_selectedOrder!['payment']['method'] ?? '-'}',
                style: tt.bodySmall?.copyWith(color: PlanoraColors.brandGray),
              ),
            ],
          ]

          // ── CASE 3: PENDING + pembayaran ditolak admin ──────────────────
          else if (_isOrderPending && _isPaymentFailed) ...[
            _buildStatusCard(
              icon: Icons.cancel_rounded,
              iconColor: PlanoraColors.error,
              bgColor: const Color(0xFFFFEBEE),
              title: 'Bukti Pembayaran Ditolak',
              subtitle:
                  'Admin menolak bukti transfer Anda. Silakan unggah ulang bukti yang valid sebelum batas waktu habis.',
              tt: tt,
            ),
            const SizedBox(height: 16),
            // Tampilkan countdown dan form upload ulang
            _buildCountdownWidget(tt),
            const SizedBox(height: 16),
            _buildBankInfo(tt),
            const SizedBox(height: 16),
            _buildUploadButton(tt),
          ]

          // ── CASE 4: PENDING + belum upload bukti bayar ──────────────────
          else if (_isOrderPending && !_hasPaymentSubmitted) ...[
            _buildCountdownWidget(tt),
            const SizedBox(height: 24),
            _buildBankInfo(tt),
            const SizedBox(height: 24),
            _buildUploadButton(tt),
          ]

          // ── CASE 5: Dibatalkan ───────────────────────────────────────────
          else if (_selectedOrder!['status'] == 'CANCELLED') ...[
            _buildStatusCard(
              icon: Icons.remove_circle_rounded,
              iconColor: PlanoraColors.brandGray,
              bgColor: const Color(0xFFF5F5F5),
              title: 'Pesanan Dibatalkan',
              subtitle: _selectedOrder!['cancelReason'] != null
                  ? 'Alasan: ${_selectedOrder!['cancelReason']}'
                  : 'Pesanan ini telah dibatalkan.',
              tt: tt,
            ),
            if (_isPaymentPaid) ...[
              const SizedBox(height: 12),
              _buildStatusCard(
                icon: Icons.replay_rounded,
                iconColor: const Color(0xFF7B1FA2),
                bgColor: const Color(0xFFF3E5F5),
                title: 'Refund Sedang Diproses',
                subtitle: 'Dana pembayaran akan dikembalikan oleh Admin.',
                tt: tt,
              ),
            ],
          ],
        ],
      ),
    );
  }

  Widget _buildStatusCard({
    required IconData icon,
    required Color iconColor,
    required Color bgColor,
    required String title,
    required String subtitle,
    required TextTheme tt,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: iconColor, size: 32),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: tt.titleSmall?.copyWith(
                        color: iconColor, fontWeight: FontWeight.w700)),
                const SizedBox(height: 4),
                Text(subtitle,
                    style: tt.bodySmall
                        ?.copyWith(color: iconColor.withAlpha(200))),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCountdownWidget(TextTheme tt) {
    final isExpired = _timeLeft == Duration.zero;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      decoration: BoxDecoration(
        color: PlanoraColors.error.withAlpha(15),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: PlanoraColors.error.withAlpha(40)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            isExpired ? 'Batas Waktu Habis' : 'Batas Waktu',
            style: tt.bodyMedium?.copyWith(
              color: PlanoraColors.error,
              fontWeight: FontWeight.w600,
            ),
          ),
          Text(
            isExpired ? '00 : 00 : 00' : _formatDuration(_timeLeft),
            style: tt.titleLarge?.copyWith(
              color: PlanoraColors.error,
              letterSpacing: 2,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBankInfo(TextTheme tt) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('TRANSFER KE BANK BCA',
            style: tt.labelSmall?.copyWith(letterSpacing: 0.8)),
        const SizedBox(height: 10),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          decoration: BoxDecoration(
            border: Border.all(color: PlanoraColors.divider),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('8123 4567 89', style: tt.headlineSmall),
              GestureDetector(
                onTap: _copyBankAccount,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: PlanoraColors.brandAccent,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    'SALIN',
                    style: tt.labelSmall?.copyWith(
                      color: PlanoraColors.brandDark,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildUploadButton(TextTheme tt) {
    return ElevatedButton.icon(
      onPressed: _uploadProof,
      icon: const Icon(Icons.upload_file_rounded),
      label: const Text('Upload Bukti Transfer'),
    );
  }
}
