import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ProfilScreen extends StatefulWidget {
  const ProfilScreen({super.key});

  @override
  State<ProfilScreen> createState() => _ProfilScreenState();
}

class _ProfilScreenState extends State<ProfilScreen> {
  final int _currentIndex = 4; // Index 4 untuk halaman Profil
  Map<String, dynamic>? _userProfile;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchProfile();
  }

  // Mengambil data profil dari backend API
  Future<void> _fetchProfile() async {
    try {
      final response = await http.get(
        Uri.parse('http://10.0.2.2:3000/api/profile'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          _userProfile = data;
        });
      } else {
        setState(() {
          _userProfile = null;
        });
      }
    } catch (e) {
      setState(() {
        _userProfile = null;
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  // Navigasi Bottom Bar
  void _onBottomNavTapped(int index) {
    if (index == 0) {
      Navigator.pushReplacementNamed(context, '/home');
    } else if (index == 1) {
      Navigator.pushReplacementNamed(context, '/explore');
    } else if (index == 2) {
      Navigator.pushReplacementNamed(context, '/pesanan');
    } else if (index == 3) {
      Navigator.pushReplacementNamed(context, '/favorit');
    } else if (index == 4) {
      // Sedang di halaman Profil, tidak perlu push
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9F9F9), // Latar abu sangat lembut
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Bagian Header Profil (Dengan background putih dan lengkungan di bawah)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(24.0, 20.0, 24.0, 32.0),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(
                    bottom: Radius.circular(30), // Melengkung di bawah
                  ),
                ),
                child: Column(
                  children: [
                    // Header (Judul & Ikon Pengaturan)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Profil Saya',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF333333),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                            color: Color(0xFFFAFAFA),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.settings,
                            color: Colors.grey,
                            size: 20,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),

                    // Area Dynamic Data dari Backend
                    _isLoading
                        ? const CircularProgressIndicator()
                        : _userProfile == null
                        ? const Padding(
                            padding: EdgeInsets.symmetric(vertical: 20.0),
                            child: Text(
                              'Belum ada data profil pengguna dari server.',
                              style: TextStyle(
                                color: Colors.grey,
                                fontStyle: FontStyle.italic,
                              ),
                            ),
                          )
                        : Column(
                            children: [
                              // Foto Profil / Avatar
                              Container(
                                width: 100,
                                height: 100,
                                decoration: const BoxDecoration(
                                  color: Color(0xFFF9E5E1), // Peach lembut
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.person,
                                  size: 50,
                                  color: Colors.black54,
                                ),
                              ),
                              const SizedBox(height: 16),

                              // Nama Pengguna
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    _userProfile!['name'] ?? 'Nama Pengguna',
                                    style: const TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                      color: Color(0xFF333333),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  const Icon(
                                    Icons
                                        .verified_user_outlined, // Icon hijau validasi (bisa diganti custom)
                                    color: Color(0xFF00C853),
                                    size: 18,
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),

                              // Email Pengguna
                              Text(
                                _userProfile!['email'] ?? 'email@pengguna.com',
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Menu Opsi Profil
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Column(
                  children: [
                    _buildMenuCard(
                      icon: Icons.chat_bubble,
                      iconColor: const Color(0xFF9C27B0), // Ungu
                      iconBgColor: const Color(0xFFF3E5F5),
                      title: 'Chat Vendor',
                    ),
                    _buildMenuCard(
                      icon: Icons.calendar_today,
                      iconColor: Colors.grey.shade700,
                      iconBgColor: const Color(0xFFEEEEEE),
                      title: 'Kalender Acara',
                    ),
                    _buildMenuCard(
                      icon: Icons.history,
                      iconColor: const Color(0xFF3F51B5), // Biru
                      iconBgColor: const Color(0xFFE8EAF6),
                      title: 'Riwayat Booking',
                    ),
                    _buildMenuCard(
                      icon: Icons.payment,
                      iconColor: const Color(0xFFE53935), // Merah
                      iconBgColor: const Color(0xFFFFEBEE),
                      title: 'Daftar Pembayaran',
                      isRedText: true, // Label text merah sesuai Mockup
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        selectedItemColor: const Color(0xFFFA9081),
        unselectedItemColor: Colors.grey,
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        onTap: _onBottomNavTapped,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_filled),
            label: 'Beranda',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.explore_outlined),
            label: 'Eksplor',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.receipt_long_outlined),
            label: 'Pesanan',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.favorite), label: 'Favorit'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profil'),
        ],
      ),
    );
  }

  // Komponen Card Menu Profil
  Widget _buildMenuCard({
    required IconData icon,
    required Color iconColor,
    required Color iconBgColor,
    required String title,
    bool isRedText = false,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF0F0F0)),
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
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: iconBgColor,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: iconColor, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              title,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: isRedText
                    ? const Color(0xFFE53935)
                    : const Color(0xFF333333),
              ),
            ),
          ),
          const Icon(Icons.chevron_right, color: Colors.grey, size: 20),
        ],
      ),
    );
  }
}
