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
    DateTime targetTime = DateTime.now().add(const Duration(hours: 24));
    if (_selectedOrder != null && _selectedOrder!['createdAt'] != null) {
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

    setState(() => _isLoading = true);

    final bookingId = _selectedOrder!['id'].toString();
    final totalPrice = (_selectedOrder!['totalPrice'] ?? 0).toDouble();

    try {
      final payResult = await ApiService.createPayment(
        bookingId: bookingId,
        amount: totalPrice,
        method: 'BANK_TRANSFER',
      );

      if (payResult['success'] == true) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Pembayaran berhasil diajukan! Menunggu konfirmasi admin.')),
          );
        }
        await _fetchOrders();
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(payResult['message'] ?? 'Gagal mengajukan pembayaran.')),
          );
        }
        setState(() => _isLoading = false);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Terjadi kesalahan. Coba lagi.')),
        );
      }
      setState(() => _isLoading = false);
    }
  }

  String _formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    return '${twoDigits(duration.inHours)} : ${twoDigits(duration.inMinutes.remainder(60))} : ${twoDigits(duration.inSeconds.remainder(60))}';
  }

  String _statusLabel(String status) {
    switch (status) {
      case 'PENDING': return 'Menunggu Pembayaran';
      case 'CONFIRMED': return 'Dikonfirmasi';
      case 'IN_PROGRESS': return 'Sedang Berjalan';
      case 'COMPLETED': return 'Selesai / Lunas';
      case 'CANCELLED': return 'Dibatalkan';
      default: return status;
    }
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'PENDING': return PlanoraColors.error;
      case 'CONFIRMED': return const Color(0xFF2E7D32);
      case 'IN_PROGRESS': return PlanoraColors.brandDark;
      case 'COMPLETED': return PlanoraColors.brandGray;
      case 'CANCELLED': return PlanoraColors.brandGray;
      default: return PlanoraColors.brandGray;
    }
  }

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
                      style: tt.bodyMedium?.copyWith(color: PlanoraColors.brandGray)),
                )
              : Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
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
                                          width: 56, height: 56,
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
                                              color: _statusColor(item['status'] ?? ''),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    if (isSelected)
                                      const Icon(Icons.check_circle_rounded,
                                          color: PlanoraColors.brandDark, size: 20),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                      ),

                      const SizedBox(height: 14),

                      // ── Instruksi Pembayaran ──────────────────────────────
                      if (_selectedOrder != null)
                        Expanded(
                          flex: 6,
                          child: SingleChildScrollView(
                            child: Container(
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: PlanoraColors.surface,
                                borderRadius: BorderRadius.circular(24),
                                border: Border.all(color: PlanoraColors.divider),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
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

                                  // Countdown Timer
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                                    decoration: BoxDecoration(
                                      color: PlanoraColors.error.withAlpha(15),
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(
                                          color: PlanoraColors.error.withAlpha(40)),
                                    ),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          'Batas Waktu',
                                          style: tt.bodyMedium?.copyWith(
                                            color: PlanoraColors.error,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                        Text(
                                          _formatDuration(_timeLeft),
                                          style: tt.titleLarge?.copyWith(
                                            color: PlanoraColors.error,
                                            letterSpacing: 2,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(height: 24),

                                  // Bank Transfer info
                                  Text('TRANSFER KE BANK BCA',
                                      style: tt.labelSmall?.copyWith(letterSpacing: 0.8)),
                                  const SizedBox(height: 10),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 20, vertical: 14),
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
                                  const SizedBox(height: 24),

                                  // Tombol Upload Bukti
                                  ElevatedButton.icon(
                                    onPressed: () {
                                      final isPaid =
                                          _selectedOrder!['payment']?['status'] == 'PAID' ||
                                          _selectedOrder!['status'] == 'COMPLETED';
                                      if (isPaid) {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          const SnackBar(content: Text('Pesanan ini sudah dibayar.')),
                                        );
                                      } else {
                                        _uploadProof();
                                      }
                                    },
                                    icon: const Icon(Icons.upload_file_rounded),
                                    label: const Text('Upload Bukti Transfer'),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
    );
  }
}
