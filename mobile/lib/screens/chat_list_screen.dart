import 'package:flutter/material.dart';
import '../dummy_data.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart';

class ChatListScreen extends StatefulWidget {
  const ChatListScreen({super.key});

  @override
  State<ChatListScreen> createState() => _ChatListScreenState();
}

class _ChatListScreenState extends State<ChatListScreen> {
  bool _isLoading = true;
  List<dynamic> _vendors = DummyData.vendors;

  @override
  void initState() {
    super.initState();
    _fetchVendorsFromOrders();
  }

  Future<void> _fetchVendorsFromOrders() async {
    try {
      final response = await http.get(
        Uri.parse('http://10.0.2.2:3000/api/orders'),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as List;

        // Extract unique vendors based on orders
        Map<String, dynamic> uniqueVendors = {};
        for (var order in data) {
          final vid =
              order['vendorId']?.toString() ?? order['id']?.toString() ?? '1';
          final vname = order['name'] ?? "Vendor Name";
          final img =
              order['imageUrl'] ??
              'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=200&auto=format&fit=crop';
          if (!uniqueVendors.containsKey(vid)) {
            uniqueVendors[vid] = {
              'id': vid,
              'name': vname,
              'imageUrl': img,
              'lastMessage': "Tekan untuk melihat percakapan",
              'lastTime': DateFormat('HH:mm').format(DateTime.now()),
            };
          }
        }

        setState(() {
          _vendors = uniqueVendors.values.toList();
          _isLoading = false;
        });
      } else {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
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
              child: Text(
                "Belum ada riwayat pesanan (vendor) untuk dihubungi.",
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
