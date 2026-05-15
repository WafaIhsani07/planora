import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:async';
import '../services/api_service.dart';
import 'package:intl/intl.dart';

class PembayaranScreen extends StatefulWidget {
  const PembayaranScreen({super.key});

  @override
  State<PembayaranScreen> createState() => _PembayaranScreenState();
}

class _PembayaranScreenState extends State<PembayaranScreen> {
  List<dynamic> _orders = [];
  bool _isLoading = true;
  bool _isConfirming = false;
  Map<String, dynamic>? _selectedOrder;
  Timer? _countdownTimer;
  Duration _timeLeft = const Duration(hours: 23, minutes: 59, seconds: 0);

  String? _targetId;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args != null) {
      _targetId = args.toString();
    }
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

  // T10: Ambil daftar booking via ApiService (JWT Bearer otomatis)
  Future<void> _fetchOrders() async {
    setState(() => _isLoading = true);

    final result = await ApiService.getBookings();

    if (!mounted) return;
    setState(() {
      if (result['success'] == true) {
        // Tampilkan hanya yang belum dibayar (status PENDING)
        final all = (result['data'] as List?) ?? [];
        _orders = all
            .where((o) =>
                o['status']?.toString().toUpperCase() == 'PENDING' ||
                o['status']?.toString().toUpperCase() == 'MENUNGGU_PEMBAYARAN')
            .toList();

        if (_orders.isNotEmpty) {
          if (_targetId != null) {
            _selectedOrder = _orders.firstWhere(
              (o) => o['id'].toString() == _targetId,
              orElse: () => _orders.first,
            );
          } else {
            _selectedOrder = _orders.first;
          }
          _startCountdown();
        }
      } else {
        _orders = [];
      }
      _isLoading = false;
    });
  }

  void _startCountdown() {
    _countdownTimer?.cancel();
    DateTime targetTime = DateTime.now().add(const Duration(hours: 24));
    if (_selectedOrder?['createdAt'] != null) {
      try {
        final created = DateTime.parse(_selectedOrder!['createdAt']);
        targetTime = created.add(const Duration(hours: 24));
      } catch (_) {}
    }

    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      final diff = targetTime.difference(DateTime.now());
      if (!mounted) {
        timer.cancel();
        return;
      }
      setState(() {
        _timeLeft = diff.isNegative ? Duration.zero : diff;
      });
      if (diff.isNegative) timer.cancel();
    });
  }

  Future<void> _copyBankAccount() async {
    await Clipboard.setData(const ClipboardData(text: '8123456789'));
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Nomor Rekening Disalin')),
    );
  }

  // T10: Konfirmasi pembayaran via ApiService.confirmPayment()
  Future<void> _confirmPayment() async {
    if (_selectedOrder == null) return;

    final orderId = _selectedOrder!['id']?.toString() ?? '';
    if (orderId.isEmpty) return;

    setState(() => _isConfirming = true);

    final result = await ApiService.confirmPayment(orderId);

    if (!mounted) return;
    setState(() => _isConfirming = false);

    if (result['success'] == true) {
      _countdownTimer?.cancel();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Pembayaran berhasil dikonfirmasi!'),
          backgroundColor: Color(0xFF00C853),
        ),
      );
      // Kembali ke layar pesanan
      Navigator.pushReplacementNamed(context, '/pesanan');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(result['message'] ?? 'Gagal mengkonfirmasi pembayaran.'),
        ),
      );
    }
  }

  String _formatDuration(Duration duration) {
    String two(int n) => n.toString().padLeft(2, '0');
    return '${two(duration.inHours)} : ${two(duration.inMinutes.remainder(60))} : ${two(duration.inSeconds.remainder(60))}';
  }

  String _formatCurrency(dynamic value) {
    if (value == null) return 'Rp 0';
    try {
      final double amount =
          value is String ? double.parse(value) : value.toDouble();
      return NumberFormat.currency(
              locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0)
          .format(amount);
    } catch (_) {
      return 'Rp 0';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9F9F9),
      appBar: AppBar(
        title: const Text(
          'Daftar Pembayaran',
          style: TextStyle(
              color: Colors.black87,
              fontWeight: FontWeight.bold,
              fontSize: 18),
        ),
        backgroundColor: Colors.white,
        centerTitle: true,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black87),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _orders.isEmpty
              ? Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.receipt_long_outlined,
                          size: 64, color: Colors.grey.shade300),
                      const SizedBox(height: 16),
                      const Text(
                        'Tidak ada tagihan yang perlu dibayar.',
                        style: TextStyle(color: Colors.grey, fontSize: 15),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Semua pesanan sudah dibayar atau belum ada pesanan.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey, fontSize: 13),
                      ),
                    ],
                  ),
                )
              : Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 24, vertical: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // ── Daftar Tagihan ───────────────────────────────────
                      Expanded(
                        flex: 4,
                        child: ListView.builder(
                          itemCount: _orders.length,
                          itemBuilder: (context, index) {
                            final item = _orders[index];
                            final isSelected = _selectedOrder != null &&
                                _selectedOrder!['id'] == item['id'];

                            // Nama dari relasi nested vendor atau layanan
                            final vendorName =
                                item['vendor']?['businessName'] ??
                                    item['vendor']?['name'] ??
                                    item['layanan']?['namaLayanan'] ??
                                    'Vendor';
                            final harga = item['layanan']?['harga'] ??
                                item['totalPrice'] ??
                                0;
                            final imageUrl =
                                item['vendor']?['avatar'] ?? '';

                            return GestureDetector(
                              onTap: () {
                                setState(() {
                                  _selectedOrder = item;
                                  _startCountdown();
                                });
                              },
                              child: Container(
                                margin:
                                    const EdgeInsets.only(bottom: 16),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius:
                                      BorderRadius.circular(16),
                                  border: Border.all(
                                    color: isSelected
                                        ? const Color(0xFF00C853)
                                        : const Color(0xFFE0E0E0),
                                    width: isSelected ? 2 : 1,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black
                                          .withValues(alpha: 0.05),
                                      blurRadius: 8,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                padding: const EdgeInsets.all(12),
                                child: Row(
                                  children: [
                                    ClipRRect(
                                      borderRadius:
                                          BorderRadius.circular(12),
                                      child: imageUrl.isNotEmpty
                                          ? Image.network(
                                              imageUrl.startsWith('http')
                                                  ? imageUrl
                                                  : 'http://10.0.2.2:5000/assets/$imageUrl',
                                              width: 60,
                                              height: 60,
                                              fit: BoxFit.cover,
                                              errorBuilder: (_, __, ___) =>
                                                  Container(
                                                      width: 60,
                                                      height: 60,
                                                      color:
                                                          Colors.grey[300]),
                                            )
                                          : Container(
                                              width: 60,
                                              height: 60,
                                              decoration: BoxDecoration(
                                                color: Colors.grey[200],
                                                borderRadius:
                                                    BorderRadius.circular(
                                                        12),
                                              ),
                                              child: const Icon(
                                                  Icons.storefront,
                                                  color: Colors.grey),
                                            ),
                                    ),
                                    const SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
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
                                            _formatCurrency(harga),
                                            style: const TextStyle(
                                              fontSize: 13,
                                              fontWeight: FontWeight.bold,
                                              color: Color(0xFF00C853),
                                            ),
                                          ),
                                          const SizedBox(height: 2),
                                          const Text(
                                            'Menunggu Pembayaran',
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: Color(0xFFE53935),
                                              fontWeight: FontWeight.bold,
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
                      ),

                      const SizedBox(height: 16),

                      // ── Panel Status & Instruksi ──────────────────────────
                      if (_selectedOrder != null)
                        Expanded(
                          flex: 6,
                          child: SingleChildScrollView(
                            child: Container(
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(24),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black
                                        .withValues(alpha: 0.05),
                                    blurRadius: 10,
                                    offset: const Offset(0, -4),
                                  ),
                                ],
                              ),
                              child: Column(
                                crossAxisAlignment:
                                    CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Status & Instruksi',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                      color: Colors.black87,
                                    ),
                                  ),
                                  const SizedBox(height: 20),

                                  // Countdown timer
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 16, horizontal: 20),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFFFF0ED),
                                      borderRadius:
                                          BorderRadius.circular(16),
                                    ),
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        const Text(
                                          'Batas Waktu',
                                          style: TextStyle(
                                            color: Color(0xFFE53935),
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        Text(
                                          _formatDuration(_timeLeft),
                                          style: const TextStyle(
                                            color: Color(0xFFE53935),
                                            fontWeight: FontWeight.bold,
                                            fontSize: 18,
                                            letterSpacing: 2,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(height: 24),

                                  // Nomor rekening
                                  const Text(
                                    'TRANSFER KE BANK BCA',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.grey,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                  const SizedBox(height: 12),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 20, vertical: 12),
                                    decoration: BoxDecoration(
                                      border: Border.all(
                                          color: Colors.grey.shade300),
                                      borderRadius:
                                          BorderRadius.circular(16),
                                    ),
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        const Text(
                                          '8123 4567 89',
                                          style: TextStyle(
                                            fontSize: 20,
                                            fontWeight: FontWeight.bold,
                                            color: Colors.black87,
                                          ),
                                        ),
                                        InkWell(
                                          onTap: _copyBankAccount,
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 16,
                                                vertical: 8),
                                            decoration: BoxDecoration(
                                              color:
                                                  const Color(0xFFE8F5E9),
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                            ),
                                            child: const Text(
                                              'SALIN',
                                              style: TextStyle(
                                                fontWeight: FontWeight.bold,
                                                color: Color(0xFF00C853),
                                                fontSize: 12,
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(height: 32),

                                  // T10: Tombol konfirmasi pembayaran
                                  SizedBox(
                                    width: double.infinity,
                                    child: ElevatedButton(
                                      onPressed: _isConfirming
                                          ? null
                                          : _confirmPayment,
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor:
                                            const Color(0xFF00C853),
                                        padding: const EdgeInsets.symmetric(
                                            vertical: 16),
                                        shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(16),
                                        ),
                                        elevation: 2,
                                      ),
                                      child: _isConfirming
                                          ? const SizedBox(
                                              width: 22,
                                              height: 22,
                                              child:
                                                  CircularProgressIndicator(
                                                color: Colors.white,
                                                strokeWidth: 2,
                                              ),
                                            )
                                          : const Text(
                                              'Konfirmasi Pembayaran',
                                              style: TextStyle(
                                                fontSize: 16,
                                                fontWeight: FontWeight.bold,
                                                color: Colors.white,
                                              ),
                                            ),
                                    ),
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
