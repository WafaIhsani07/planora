import 'package:flutter/material.dart';
import 'dart:convert';
import '../services/api_service.dart';
import '../main.dart' show PlanoraColors;

class NotifikasiScreen extends StatefulWidget {
  const NotifikasiScreen({super.key});

  @override
  State<NotifikasiScreen> createState() => _NotifikasiScreenState();
}

class _NotifikasiScreenState extends State<NotifikasiScreen> {
  List<dynamic> _notifications = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchNotifications();
  }

  // Mengambil data notifikasi dari backend API via ApiService (JWT otomatis)
  Future<void> _fetchNotifications() async {
    setState(() => _isLoading = true);
    try {
      final response = await ApiService.getRequest('/notifications');
      if (response.statusCode == 200) {
        final body = json.decode(response.body);
        final data = body['data'] ?? body;
        setState(() {
          _notifications = data is List ? data : [];
        });
      } else {
        setState(() => _notifications = []);
      }
    } catch (e) {
      setState(() => _notifications = []);
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: PlanoraColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // ── Custom Header ─────────────────────────────────────────
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              decoration: const BoxDecoration(
                color: PlanoraColors.background,
                border: Border(bottom: BorderSide(color: PlanoraColors.divider)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      width: 40, height: 40,
                      decoration: BoxDecoration(
                        color: PlanoraColors.surface,
                        shape: BoxShape.circle,
                        border: Border.all(color: PlanoraColors.divider),
                      ),
                      child: const Icon(Icons.arrow_back_rounded,
                          color: PlanoraColors.brandDark, size: 20),
                    ),
                  ),
                  Text('Notifikasi', style: tt.titleLarge),
                  GestureDetector(
                    onTap: _fetchNotifications,
                    child: Container(
                      width: 40, height: 40,
                      decoration: BoxDecoration(
                        color: PlanoraColors.surface,
                        shape: BoxShape.circle,
                        border: Border.all(color: PlanoraColors.divider),
                      ),
                      child: const Icon(Icons.refresh_rounded,
                          color: PlanoraColors.brandGray, size: 20),
                    ),
                  ),
                ],
              ),
            ),

            // ── List Notifikasi ───────────────────────────────────────
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _notifications.isEmpty
                      ? Center(
                          child: Padding(
                            padding: const EdgeInsets.all(32),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 72, height: 72,
                                  decoration: const BoxDecoration(
                                    color: PlanoraColors.brandAccent,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.notifications_none_rounded,
                                      size: 36, color: PlanoraColors.brandDark),
                                ),
                                const SizedBox(height: 16),
                                Text('Belum ada notifikasi.',
                                    style: tt.bodyMedium?.copyWith(
                                      color: PlanoraColors.brandGray,
                                      fontStyle: FontStyle.italic,
                                    )),
                              ],
                            ),
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.all(24),
                          itemCount: _notifications.length,
                          itemBuilder: (context, index) {
                            final item = _notifications[index];
                            return GestureDetector(
                              onTap: () => Navigator.pushNamed(
                                context,
                                '/detail_notifikasi',
                                arguments: item['id']?.toString() ?? '1',
                              ),
                              child: _buildNotifikasiCard(
                                type: item['type'] ?? 'info',
                                title: item['title'] ?? 'Notifikasi',
                                description: item['description'] ?? item['message'] ?? 'Detail notifikasi',
                                time: item['time'] ?? item['createdAt'] ?? 'Baru saja',
                                isUnread: item['isUnread'] ?? item['isRead'] == false,
                                tt: tt,
                              ),
                            );
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotifikasiCard({
    required String type,
    required String title,
    required String description,
    required String time,
    required bool isUnread,
    required TextTheme tt,
  }) {
    // Mapping type → icon & warna dari palette
    IconData iconData;
    Color iconBg;
    Color iconColor;

    switch (type) {
      case 'success':
        iconData = Icons.check_circle_outline_rounded;
        iconBg = PlanoraColors.brandAccent;
        iconColor = PlanoraColors.brandDark;
        break;
      case 'promo':
        iconData = Icons.local_offer_outlined;
        iconBg = PlanoraColors.surface;
        iconColor = PlanoraColors.brandGray;
        break;
      case 'error':
        iconData = Icons.error_outline_rounded;
        iconBg = PlanoraColors.error.withAlpha(15);
        iconColor = PlanoraColors.error;
        break;
      default:
        iconData = Icons.notifications_none_rounded;
        iconBg = PlanoraColors.surface;
        iconColor = PlanoraColors.brandGray;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isUnread ? PlanoraColors.brandAccent.withAlpha(40) : PlanoraColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isUnread ? PlanoraColors.brandAccentHover : PlanoraColors.divider,
          width: isUnread ? 1.5 : 1,
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: iconBg,
              shape: BoxShape.circle,
            ),
            child: Icon(iconData, color: iconColor, size: 20),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(child: Text(title, style: tt.titleSmall)),
                    if (isUnread)
                      Container(
                        width: 8, height: 8,
                        decoration: const BoxDecoration(
                          color: PlanoraColors.brandDark,
                          shape: BoxShape.circle,
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(description,
                    style: tt.bodySmall?.copyWith(height: 1.5),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis),
                const SizedBox(height: 10),
                Text(time,
                    style: tt.labelSmall?.copyWith(color: PlanoraColors.brandGray)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
