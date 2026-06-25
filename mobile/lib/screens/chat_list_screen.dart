import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'package:intl/intl.dart';
import 'package:intl/intl.dart';
import '../main.dart' show PlanoraColors;
import '../utils/translations.dart';

class ChatListScreen extends StatefulWidget {
  const ChatListScreen({super.key});

  @override
  State<ChatListScreen> createState() => _ChatListScreenState();
}

class _ChatListScreenState extends State<ChatListScreen> {
  bool _isLoading = true;
  List<dynamic> _vendors = [];

  @override
  void initState() {
    super.initState();
    _fetchVendorsFromOrders();
  }

  Future<void> _fetchVendorsFromOrders() async {
    final result = await ApiService.getBookings();
    if (!mounted) return;

    if (result['success'] == true) {
      final data = (result['data'] as List?) ?? [];

      // Extract unique vendors dari daftar booking
      Map<String, dynamic> uniqueVendors = {};
      for (var order in data) {
        final vendorData = order['vendor'] ?? {};
        final vid = vendorData['id']?.toString() ?? order['id']?.toString() ?? '';
        final bid = order['id']?.toString() ?? '';
        if (vid.isEmpty || bid.isEmpty) continue;

        final vname = vendorData['businessName'] ?? vendorData['name'] ?? 'Vendor';
        final rawAvatar = (vendorData['user'] != null && vendorData['user']['avatar'] != null)
            ? vendorData['user']['avatar'].toString()
            : vendorData['avatar']?.toString() ?? '';
        final assetUrl = ApiService.getAssetUrl(rawAvatar);
        final imageUrl = assetUrl.isNotEmpty
            ? assetUrl
            : 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=200&auto=format&fit=crop';

        // Ambil preview pesan terakhir dari order jika tersedia
        final lastMsgList = order['messages'] as List? ?? [];
        final lastMsg = lastMsgList.isNotEmpty
            ? lastMsgList.last['content']?.toString() ?? Translations.t('chatList.tapToView')
            : Translations.t('chatList.tapToView');

        // Gunakan bookingId terbaru jika vendor sama
        if (!uniqueVendors.containsKey(vid)) {
          uniqueVendors[vid] = {
            'id': vid,
            'bookingId': bid,
            'name': vname,
            'imageUrl': imageUrl,
            'lastMessage': lastMsg,
            'lastTime': DateFormat('HH:mm').format(DateTime.now()),
          };
        }
      }

      setState(() {
        _vendors = uniqueVendors.values.toList();
        _isLoading = false;
      });
    } else {
      setState(() {
        _vendors = [];
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: PlanoraColors.background,
      appBar: AppBar(
        title: Text(Translations.t('chatList.title')),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _vendors.isEmpty
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
                          child: const Icon(Icons.chat_bubble_outline_rounded,
                              size: 36, color: PlanoraColors.brandDark),
                        ),
                        const SizedBox(height: 16),
                        Text(Translations.t('chatList.noHistory'),
                            style: tt.bodyMedium?.copyWith(
                              color: PlanoraColors.brandGray,
                              fontStyle: FontStyle.italic,
                            ),
                            textAlign: TextAlign.center),
                      ],
                    ),
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                  itemCount: _vendors.length,
                  itemBuilder: (context, index) {
                    final v = _vendors[index];
                    return GestureDetector(
                      onTap: () => Navigator.pushNamed(context, '/chat_detail', arguments: v),
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: PlanoraColors.surface,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: PlanoraColors.divider),
                        ),
                        child: Row(
                          children: [
                            // Avatar
                            ClipRRect(
                              borderRadius: BorderRadius.circular(20),
                              child: Image.network(
                                v['imageUrl'],
                                width: 52, height: 52,
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => Container(
                                  width: 52, height: 52,
                                  decoration: const BoxDecoration(
                                    color: PlanoraColors.brandAccent,
                                  ),
                                  child: Center(
                                    child: Text(
                                      v['name'].isNotEmpty
                                          ? v['name'][0].toUpperCase()
                                          : 'V',
                                      style: tt.titleLarge?.copyWith(
                                          color: PlanoraColors.brandDark),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 14),
                            // Info
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(v['name'], style: tt.titleSmall,
                                      maxLines: 1, overflow: TextOverflow.ellipsis),
                                  const SizedBox(height: 4),
                                  Text(v['lastMessage'], style: tt.bodySmall,
                                      maxLines: 1, overflow: TextOverflow.ellipsis),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            // Waktu
                            Text(v['lastTime'],
                                style: tt.labelSmall?.copyWith(
                                    color: PlanoraColors.brandGray)),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
