import 'package:flutter/material.dart';
import 'dart:convert';
import '../services/api_service.dart';

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
        // Backend mengembalikan { success: true, data: [...] }
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
    return Scaffold(
      backgroundColor: const Color(0xFFFAFAFA),
      body: SafeArea(
        child: Column(
          children: [
            // Custom Header
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 24.0,
                vertical: 20.0,
              ),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(
                  bottom: BorderSide(color: Color(0xFFF0F0F0), width: 1.0),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Icon(
                      Icons.arrow_back_ios_new,
                      color: Color(0xFF333333),
                      size: 20,
                    ),
                  ),
                  const Text(
                    'Notifikasi',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF333333),
                    ),
                  ),
                  GestureDetector(
                    onTap: _fetchNotifications,
                    child: const Icon(
                      Icons.refresh,
                      color: Colors.grey,
                      size: 24,
                    ),
                  ),
                ],
              ),
            ),

            // List Notifikasi Dynamic
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _notifications.isEmpty
                  ? const Center(
                      child: Padding(
                        padding: EdgeInsets.symmetric(vertical: 40.0),
                        child: Text(
                          'Belum ada notifikasi dari server.',
                          style: TextStyle(
                            color: Colors.grey,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(24.0),
                      itemCount: _notifications.length,
                      itemBuilder: (context, index) {
                        final item = _notifications[index];
                        return GestureDetector(
                          onTap: () {
                            Navigator.pushNamed(
                              context,
                              '/detail_notifikasi',
                              arguments: item['id']?.toString() ?? '1',
                            );
                          },
                          child: _buildNotifikasiCard(
                            type: item['type'] ?? 'info',
                            title: item['title'] ?? 'Notifikasi',
                            description:
                                item['description'] ?? item['message'] ?? 'Detail notifikasi',
                            time: item['time'] ?? item['createdAt'] ?? 'Baru saja',
                            isUnread: item['isUnread'] ?? item['isRead'] == false,
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
  }) {
    IconData iconData;
    Color iconColor;
    Color iconBgColor;
    Color borderColor = const Color(0xFFF0F0F0);

    if (type == 'success') {
      iconData = Icons.check;
      iconColor = const Color(0xFF00C853);
      iconBgColor = const Color(0xFFE8F5E9);
      borderColor = const Color(0xFFE0F2F1);
    } else if (type == 'promo') {
      iconData = Icons.local_offer;
      iconColor = Colors.grey.shade700;
      iconBgColor = const Color(0xFFF5E6E6);
    } else if (type == 'error' || type == 'info') {
      iconData = Icons.event_busy;
      iconColor = Colors.grey.shade600;
      iconBgColor = const Color(0xFFF5F5F5);
    } else {
      iconData = Icons.notifications;
      iconColor = Colors.grey;
      iconBgColor = const Color(0xFFEEEEEE);
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor, width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withAlpha(13),
            blurRadius: 10,
            spreadRadius: 1,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: iconBgColor,
              shape: BoxShape.circle,
            ),
            child: Icon(iconData, color: iconColor, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF333333),
                        ),
                      ),
                    ),
                    if (isUnread)
                      Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: Color(0xFF00E676),
                          shape: BoxShape.circle,
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 13,
                    color: Colors.grey,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  time,
                  style: TextStyle(fontSize: 11, color: Colors.grey.shade400),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
