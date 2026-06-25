import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:async';
import 'package:image_picker/image_picker.dart';
import '../services/api_service.dart';
import '../main.dart' show PlanoraColors;
import '../utils/translations.dart';

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
        SnackBar(content: Text(Translations.t('booking.pay.copied'))),
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

    final String mode = _selectedOrder!['payment']?['mode'] ?? 'FULL';
    final String dpStatus = _selectedOrder!['payment']?['dpStatus'] ?? '';
    
    String type = 'FULL';
    double amountToPay = totalPrice;
    
    if (mode == 'DP') {
      if (dpStatus != 'PAID') {
        type = 'DP';
        amountToPay = double.tryParse(_selectedOrder!['payment']?['dpAmount']?.toString() ?? '0') ?? (totalPrice * 0.3);
      } else {
        type = 'PELUNASAN';
        amountToPay = double.tryParse(_selectedOrder!['payment']?['pelunasanAmount']?.toString() ?? '0') ?? (totalPrice * 0.7);
      }
    }

    try {
      // 1. Unggah file gambar bukti transfer
      final uploadResult = await ApiService.uploadFile(image);
      if (!mounted) return;

      if (uploadResult['success'] != true) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(
                  uploadResult['message'] ?? Translations.t('booking.pay.failUpload'))),
        );
        setState(() => _isLoading = false);
        return;
      }

      final imageUrl = uploadResult['imageUrl'];

      // 2. Kirim data pembayaran ke backend dengan proofUrl
      final payResult = await ApiService.createPayment(
        bookingId: bookingId,
        amount: amountToPay,
        method: 'BANK_TRANSFER',
        proofUrl: imageUrl,
        type: type,
      );
      if (!mounted) return;

      if (payResult['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(Translations.t('booking.pay.success'))),
        );
        await _fetchOrders();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(
                  payResult['message'] ?? Translations.t('booking.pay.failPay'))),
        );
        setState(() => _isLoading = false);
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(Translations.t('booking.pay.error'))),
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
        return Translations.t('booking.pay.status.pending');
      case 'CONFIRMED':
        return Translations.t('booking.pay.status.confirmed');
      case 'IN_PROGRESS':
        return Translations.t('booking.pay.status.inProgress');
      case 'COMPLETED':
        return Translations.t('booking.pay.status.completed');
      case 'CANCELLED':
        return Translations.t('booking.pay.status.cancelled');
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
      appBar: AppBar(title: Text(Translations.t('booking.pay.title'))),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _orders.isEmpty
              ? Center(
                  child: Text(Translations.t('booking.pay.noData'),
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
        label = Translations.t('booking.pay.badge.pending');
        break;
      case 'PAID':
        bg = const Color(0xFFE8F5E9);
        fg = const Color(0xFF2E7D32);
        label = Translations.t('booking.pay.badge.paid');
        break;
      case 'FAILED':
        bg = const Color(0xFFFFEBEE);
        fg = PlanoraColors.error;
        label = Translations.t('booking.pay.badge.failed');
        break;
      case 'REFUNDED':
        bg = const Color(0xFFF3E5F5);
        fg = const Color(0xFF7B1FA2);
        label = Translations.t('booking.pay.badge.refund');
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
              Text(Translations.t('booking.pay.statusInstruct'), style: tt.titleMedium),
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
                  ? Translations.t('booking.pay.case1.completed.title')
                  : _selectedOrder!['status'] == 'IN_PROGRESS'
                      ? Translations.t('booking.pay.case1.inProgress.title')
                      : Translations.t('booking.pay.case1.confirmed.title'),
              subtitle: _selectedOrder!['status'] == 'COMPLETED'
                  ? Translations.t('booking.pay.case1.completed.sub')
                  : Translations.t('booking.pay.case1.confirmed.sub'),
              tt: tt,
            ),
          ]

          // ── CASE 2: PENDING + bukti bayar sudah terkirim (menunggu verif) ──
          else if (_isOrderPending && _isPaymentPendingVerification) ...[
            _buildStatusCard(
              icon: Icons.hourglass_top_rounded,
              iconColor: const Color(0xFFF59E0B),
              bgColor: const Color(0xFFFFF8E1),
              title: Translations.t('booking.pay.case2.title'),
              subtitle: Translations.t('booking.pay.case2.sub'),
              tt: tt,
            ),
            const SizedBox(height: 16),
            // Tampilkan bukti yang sudah dikirim
            if (_selectedOrder!['payment']?['proofUrl'] != null) ...[
              Text(Translations.t('booking.pay.case2.proof'),
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
                '${Translations.t('booking.pay.case2.method')} ${_selectedOrder!['payment']['method'] ?? '-'}',
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
              title: Translations.t('booking.pay.case3.title'),
              subtitle: Translations.t('booking.pay.case3.sub'),
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
              title: Translations.t('booking.pay.case5.title'),
              subtitle: _selectedOrder!['cancelReason'] != null
                  ? '${Translations.t('booking.pay.case5.sub1')} ${_selectedOrder!['cancelReason']}'
                  : Translations.t('booking.pay.case5.sub2'),
              tt: tt,
            ),
            if (_isPaymentPaid) ...[
              const SizedBox(height: 12),
              _buildStatusCard(
                icon: Icons.replay_rounded,
                iconColor: const Color(0xFF7B1FA2),
                bgColor: const Color(0xFFF3E5F5),
                title: Translations.t('booking.pay.case5.refund.title'),
                subtitle: Translations.t('booking.pay.case5.refund.sub'),
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
            isExpired ? Translations.t('booking.pay.countdown.expired') : Translations.t('booking.pay.countdown.limit'),
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
        Text(Translations.t('booking.pay.bank.info'),
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
                    Translations.t('booking.pay.bank.copy'),
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
      label: Text(Translations.t('booking.pay.upload')),
    );
  }
}
