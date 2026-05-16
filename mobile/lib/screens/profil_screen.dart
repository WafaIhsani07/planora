import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import '../main.dart' show PlanoraColors;

class ProfilScreen extends StatefulWidget {
  const ProfilScreen({super.key});

  @override
  State<ProfilScreen> createState() => _ProfilScreenState();
}

class _ProfilScreenState extends State<ProfilScreen> {
  final int _currentIndex = 4;
  Map<String, dynamic>? _userProfile;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchProfile();
  }

  // Mengambil data profil — backend dulu, fallback ke bypass data
  Future<void> _fetchProfile() async {
    // Coba ambil dari backend
    try {
      final token = await ApiService.getToken();
      // Jika token adalah bypass token, langsung pakai data bypass
      if (token == 'bypass_admin_token_planora_2024') {
        await _loadBypassProfile();
        return;
      }
      final result = await ApiService.getProfile();
      if (mounted) {
        if (result['success'] == true) {
          setState(() => _userProfile = result['data']);
        } else {
          // Backend gagal — coba bypass data
          await _loadBypassProfile();
        }
      }
    } catch (e) {
      // Network error — coba bypass data
      if (mounted) await _loadBypassProfile();
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  // Load data profil dari SharedPreferences (bypass/demo mode)
  Future<void> _loadBypassProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final name  = prefs.getString('bypass_name');
    final email = prefs.getString('bypass_email');
    final phone = prefs.getString('bypass_phone');

    if (name != null && mounted) {
      setState(() {
        _userProfile = {
          'name' : name,
          'email': email ?? 'adminplanora@gmail.com',
          'phone': phone ?? '0895619465026',
          'role' : 'ADMIN',
          'avatar': null,
        };
      });
    }
  }

  // Navigasi Bottom Bar
  void _onBottomNavTapped(int index) {
    if (index == 0) Navigator.pushReplacementNamed(context, '/home');
    if (index == 1) Navigator.pushReplacementNamed(context, '/explore');
    if (index == 2) Navigator.pushReplacementNamed(context, '/pesanan');
    if (index == 3) Navigator.pushReplacementNamed(context, '/favorit');
    // index == 4: sedang di halaman Profil
  }

  // Logout: hapus token dan kembali ke halaman login
  Future<void> _logOut() async {
    await ApiService.logout();
    if (mounted) {
      Navigator.pushNamedAndRemoveUntil(context, '/welcome', (route) => false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: PlanoraColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Header Profil ───────────────────────────────────────────
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(24, 20, 24, 32),
                decoration: const BoxDecoration(
                  color: PlanoraColors.background,
                  border: Border(
                    bottom: BorderSide(color: PlanoraColors.divider),
                  ),
                ),
                child: Column(
                  children: [
                    // Baris judul & ikon pengaturan
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Profil Saya', style: tt.headlineMedium),
                        GestureDetector(
                          onTap: () => Navigator.pushNamed(context, '/pengaturan'),
                          child: Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: PlanoraColors.surface,
                              shape: BoxShape.circle,
                              border: Border.all(color: PlanoraColors.divider),
                            ),
                            child: const Icon(
                              Icons.settings_outlined,
                              color: PlanoraColors.brandGray,
                              size: 20,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 28),

                    // Area Dynamic Data dari Backend
                    _isLoading
                        ? const CircularProgressIndicator()
                        : _userProfile == null
                            ? Padding(
                                padding: const EdgeInsets.symmetric(vertical: 20),
                                child: Text(
                                  'Belum ada data profil dari server.',
                                  style: tt.bodyMedium?.copyWith(
                                    color: PlanoraColors.brandGray,
                                    fontStyle: FontStyle.italic,
                                  ),
                                ),
                              )
                            : Column(
                                children: [
                                  // Avatar
                                  Container(
                                    width: 88,
                                    height: 88,
                                    decoration: const BoxDecoration(
                                      color: PlanoraColors.brandAccent,
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(
                                      Icons.person_outline_rounded,
                                      size: 44,
                                      color: PlanoraColors.brandDark,
                                    ),
                                  ),
                                  const SizedBox(height: 14),

                                  // Nama
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        _userProfile!['name'] ?? 'Nama Pengguna',
                                        style: GoogleFonts.playfairDisplay(
                                          fontSize: 20,
                                          fontWeight: FontWeight.w700,
                                          color: PlanoraColors.brandDark,
                                        ),
                                      ),
                                      const SizedBox(width: 6),
                                      const Icon(
                                        Icons.verified_rounded,
                                        color: PlanoraColors.brandAccent,
                                        size: 18,
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),

                                   // Email
                                  Text(
                                    _userProfile!['email'] ?? 'email@pengguna.com',
                                    style: tt.bodySmall,
                                  ),
                                  const SizedBox(height: 4),

                                  // Nomor Telepon
                                  if (_userProfile!['phone'] != null)
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        const Icon(
                                          Icons.phone_outlined,
                                          size: 13,
                                          color: PlanoraColors.brandGray,
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          _userProfile!['phone'],
                                          style: tt.bodySmall,
                                        ),
                                      ],
                                    ),
                                  const SizedBox(height: 8),

                                  // Badge Role
                                  if (_userProfile!['role'] != null)
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 12, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: PlanoraColors.brandAccent,
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                      child: Text(
                                        _userProfile!['role'] == 'ADMIN'
                                            ? '⭐ Admin Planora'
                                            : _userProfile!['role'],
                                        style: tt.labelSmall?.copyWith(
                                          color: PlanoraColors.brandDark,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                  const SizedBox(height: 16),

                                  // Tombol Edit Profil
                                  OutlinedButton.icon(
                                    onPressed: () =>
                                        Navigator.pushNamed(context, '/edit_profil'),
                                    icon: const Icon(Icons.edit_outlined, size: 16),
                                    label: const Text('Edit Profil'),
                                    style: OutlinedButton.styleFrom(
                                      minimumSize: const Size(160, 40),
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 20, vertical: 10),
                                    ),
                                  ),
                                ],
                              ),
                  ],
                ),
              ),

              // ── Menu Opsi ───────────────────────────────────────────────
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Aktivitas', style: tt.titleMedium?.copyWith(color: PlanoraColors.brandGray)),
                    const SizedBox(height: 12),
                    _buildMenuItem(
                      icon: Icons.chat_bubble_outline_rounded,
                      title: 'Chat Vendor',
                      onTap: () => Navigator.pushNamed(context, '/chat_list'),
                    ),
                    _buildMenuItem(
                      icon: Icons.calendar_today_outlined,
                      title: 'Kalender Acara',
                      onTap: () => Navigator.pushNamed(context, '/kalender'),
                    ),
                    _buildMenuItem(
                      icon: Icons.history_rounded,
                      title: 'Riwayat Booking',
                      onTap: () => Navigator.pushNamed(context, '/riwayat'),
                    ),
                    _buildMenuItem(
                      icon: Icons.payment_outlined,
                      title: 'Daftar Pembayaran',
                      onTap: () => Navigator.pushNamed(context, '/pembayaran'),
                    ),
                    const SizedBox(height: 16),

                    // Divider
                    const Divider(height: 1),
                    const SizedBox(height: 16),

                    // Tombol Keluar
                    _buildMenuItem(
                      icon: Icons.logout_rounded,
                      title: 'Keluar',
                      isDestructive: true,
                      onTap: _logOut,
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),

      // ── Bottom Navigation Bar ────────────────────────────────────────────
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: PlanoraColors.divider)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: _onBottomNavTapped,
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home_rounded), label: 'Beranda'),
            BottomNavigationBarItem(icon: Icon(Icons.explore_outlined), activeIcon: Icon(Icons.explore_rounded), label: 'Eksplor'),
            BottomNavigationBarItem(icon: Icon(Icons.receipt_long_outlined), activeIcon: Icon(Icons.receipt_long_rounded), label: 'Pesanan'),
            BottomNavigationBarItem(icon: Icon(Icons.favorite_border_rounded), activeIcon: Icon(Icons.favorite_rounded), label: 'Favorit'),
            BottomNavigationBarItem(icon: Icon(Icons.person_outline_rounded), activeIcon: Icon(Icons.person_rounded), label: 'Profil'),
          ],
        ),
      ),
    );
  }

  // ── Menu Item Row ──────────────────────────────────────────────────────────
  Widget _buildMenuItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    bool isDestructive = false,
  }) {
    final tt = Theme.of(context).textTheme;
    final color = isDestructive ? PlanoraColors.error : PlanoraColors.brandDark;
    final bgColor = isDestructive
        ? PlanoraColors.error.withAlpha(15)
        : PlanoraColors.surface;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isDestructive
                ? PlanoraColors.error.withAlpha(40)
                : PlanoraColors.divider,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: isDestructive
                    ? PlanoraColors.error.withAlpha(20)
                    : PlanoraColors.brandAccent,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 18),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                title,
                style: tt.titleSmall?.copyWith(
                  color: color,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            Icon(
              Icons.chevron_right_rounded,
              color: isDestructive ? PlanoraColors.error : PlanoraColors.brandGray,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }
}
