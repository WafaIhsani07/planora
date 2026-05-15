import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'package:intl/intl.dart';

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
        if (vid.isEmpty) continue;

        final vname = vendorData['businessName'] ?? vendorData['name'] ?? 'Vendor';
        final avatar = vendorData['avatar']?.toString() ?? '';
        final imageUrl = avatar.isNotEmpty
            ? (avatar.startsWith('http')
                ? avatar
                : 'http://10.0.2.2:5000/assets/$avatar')
            : 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=200&auto=format&fit=crop';

        if (!uniqueVendors.containsKey(vid)) {
          uniqueVendors[vid] = {
            'id': vid,
            'name': vname,
            'imageUrl': imageUrl,
            'lastMessage': 'Tekan untuk melihat percakapan',
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
    return Scaffold(
      backgroundColor: const Color(0xFFF9F9F9),
      appBar: AppBar(
        title: const Text(
          'Chat Vendor',
          style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios_new,
            color: Colors.black87,
            size: 20,
          ),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _vendors.isEmpty
          ? const Center(
              child: Padding(
                padding: EdgeInsets.all(32.0),
                child: Text(
                  'Belum ada riwayat pesanan untuk dihubungi.',
                  style: TextStyle(
                    color: Colors.grey,
                    fontStyle: FontStyle.italic,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 16),
              itemCount: _vendors.length,
              itemBuilder: (context, index) {
                final v = _vendors[index];
                return ListTile(
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 8,
                  ),
                  leading: CircleAvatar(
                    backgroundImage: NetworkImage(v['imageUrl']),
                    backgroundColor: Colors.grey.shade300,
                    radius: 26,
                  ),
                  title: Text(
                    v['name'],
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  subtitle: Text(
                    v['lastMessage'],
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  trailing: Text(
                    v['lastTime'],
                    style: TextStyle(
                      color: Colors.green.shade600,
                      fontSize: 12,
                    ),
                  ),
                  onTap: () {
                    Navigator.pushNamed(context, '/chat_detail', arguments: v);
                  },
                );
              },
            ),
    );
  }
}
