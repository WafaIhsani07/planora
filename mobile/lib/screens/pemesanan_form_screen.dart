import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'package:intl/intl.dart';
import '../main.dart' show PlanoraColors;
import '../utils/formatters.dart';
import '../utils/translations.dart';

class PemesananFormScreen extends StatefulWidget {
  const PemesananFormScreen({super.key});

  @override
  State<PemesananFormScreen> createState() => _PemesananFormScreenState();
}

class _PemesananFormScreenState extends State<PemesananFormScreen> {
  final TextEditingController _dateController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _notesController = TextEditingController();

  Map<String, dynamic>? _serviceData;
  bool _isSubmitting = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args != null && args is Map<String, dynamic>) {
      _serviceData = args;
    }
  }

  @override
  void dispose() {
    _dateController.dispose();
    _addressController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  String _formatCurrency(dynamic value) {
    if (value == null) return 'Rp 0';
    try {
      final double amount = Formatters.parsePrice(value);
      return NumberFormat.currency(
        locale: 'id_ID',
        symbol: 'Rp ',
        decimalDigits: 0,
      ).format(amount);
    } catch (_) {
      return 'Rp 0';
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 7)),
      firstDate: DateTime.now(),
      lastDate: DateTime(2030),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: const ColorScheme.light(
            primary: PlanoraColors.brandDark,
            onPrimary: PlanoraColors.background,
            surface: PlanoraColors.background,
            onSurface: PlanoraColors.brandDark,
          ),
        ),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() {
        _dateController.text = DateFormat('yyyy-MM-dd').format(picked);
      });
    }
  }

  Future<void> _submitOrder() async {
    if (_dateController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(Translations.t('booking.form.dateReq'))),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    final String layananId = _serviceData?['id']?.toString() ?? '1';
    final String date = _dateController.text;
    final String address = _addressController.text.trim();
    final String notes = _notesController.text.trim();

    final result = await ApiService.createBooking(layananId, date, address, notes);

    if (mounted) {
      setState(() => _isSubmitting = false);

      if (result['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(Translations.t('booking.form.success'))),
        );
        Navigator.pushReplacementNamed(context, '/pesanan');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result['message'] ?? Translations.t('booking.form.fail'))),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;

    if (_serviceData == null) {
      return Scaffold(
        appBar: AppBar(title: Text(Translations.t('booking.form.title'))),
        body: Center(
          child: Text(Translations.t('booking.form.noData'), style: tt.bodyMedium),
        ),
      );
    }

    final String title = _serviceData!['name'] ?? 'Vendor';
    final String category = _serviceData!['category'] ?? 'Kategori';
    final String price = _serviceData!['price']?.toString() ?? '0';
    final String imagePath = _serviceData!['image'] ?? '';

    return Scaffold(
      backgroundColor: PlanoraColors.background,
      appBar: AppBar(title: Text(Translations.t('booking.form.title'))),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(24, 20, 24, 120),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Vendor Info Card ──────────────────────────────────────────
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: PlanoraColors.surface,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: PlanoraColors.divider),
              ),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(14),
                    child: imagePath.isNotEmpty
                        ? Image.network(
                            imagePath,
                            width: 64,
                            height: 64,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(
                              width: 64,
                              height: 64,
                              color: PlanoraColors.brandAccent,
                              child: const Icon(Icons.storefront_outlined,
                                  color: PlanoraColors.brandDark),
                            ),
                          )
                        : Container(
                            width: 64,
                            height: 64,
                            color: PlanoraColors.brandAccent,
                            child: const Icon(Icons.storefront_outlined,
                                color: PlanoraColors.brandDark),
                          ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(title, style: tt.titleMedium,
                            maxLines: 1, overflow: TextOverflow.ellipsis),
                        const SizedBox(height: 4),
                        Text(category, style: tt.bodySmall),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // ── Form Card ─────────────────────────────────────────────────
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: PlanoraColors.surface,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: PlanoraColors.divider),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(Translations.t('booking.form.details'), style: tt.titleLarge),
                  const SizedBox(height: 24),

                  // Tanggal Acara
                  Text(Translations.t('booking.form.eventDate'),
                      style: tt.labelSmall?.copyWith(letterSpacing: 0.8)),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _dateController,
                    readOnly: true,
                    onTap: () => _selectDate(context),
                    decoration: InputDecoration(
                      hintText: Translations.t('booking.form.selectDate'),
                      suffixIcon: const Icon(Icons.calendar_today_rounded, size: 20),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Alamat Acara
                  Text(Translations.t('booking.form.eventAddress'),
                      style: tt.labelSmall?.copyWith(letterSpacing: 0.8)),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _addressController,
                    decoration: InputDecoration(
                      hintText: Translations.t('booking.form.addressHint'),
                      prefixIcon: const Icon(Icons.location_on_outlined),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Catatan Tambahan
                  Text(Translations.t('booking.form.notes'),
                      style: tt.labelSmall?.copyWith(letterSpacing: 0.8)),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _notesController,
                    maxLines: 4,
                    decoration: InputDecoration(
                      hintText: Translations.t('booking.form.notesHint'),
                      alignLabelWithHint: true,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),

      // ── Bottom Sheet: Total + Tombol Pesan ───────────────────────────────
      bottomSheet: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
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
                Text(Translations.t('booking.form.totalPay'),
                    style: tt.labelSmall?.copyWith(letterSpacing: 0.8)),
                Text(
                  _formatCurrency(price),
                  style: tt.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
            SizedBox(
              width: 140,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _submitOrder,
                child: _isSubmitting
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.5,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            PlanoraColors.brandDark,
                          ),
                        ),
                      )
                    : Text(Translations.t('booking.form.orderBtn')),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
