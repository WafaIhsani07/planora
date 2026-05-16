import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../main.dart' show PlanoraColors;

class FavoritScreen extends StatefulWidget {
  const FavoritScreen({super.key});

  @override
  State<FavoritScreen> createState() => _FavoritScreenState();
}

class _FavoritScreenState extends State<FavoritScreen> {
  final int _currentIndex = 3;
  List<dynamic> _favorites = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchFavorites();
  }

  // Mengambil data favorit dari backend API
  Future<void> _fetchFavorites() async {
    try {
      final vendorsData = await ApiService.getVendors();
      if (mounted) setState(() => _favorites = vendorsData);
    } catch (e) {
      if (mounted) setState(() => _favorites = []);
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  // Navigasi Bottom Bar
  void _onBottomNavTapped(int index) {
    if (index == 0) Navigator.pushReplacementNamed(context, '/home');
    if (index == 1) Navigator.pushReplacementNamed(context, '/explore');
    if (index == 2) Navigator.pushReplacementNamed(context, '/pesanan');
    if (index == 4) Navigator.pushReplacementNamed(context, '/profil');
  }

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: PlanoraColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Header ───────────────────────────────────────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Favorit Saya', style: tt.headlineMedium),
                  Container(
                    width: 44,
                    height: 44,
                    decoration: const BoxDecoration(
                      color: PlanoraColors.brandAccent,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.favorite_rounded,
                      color: PlanoraColors.brandDark,
                      size: 20,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // ── Daftar Favorit ────────────────────────────────────────
              _isLoading
                  ? const Center(
                      child: Padding(
                        padding: EdgeInsets.symmetric(vertical: 40),
                        child: CircularProgressIndicator(),
                      ))
                  : _favorites.isEmpty
                      ? Center(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 48),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 72, height: 72,
                                  decoration: const BoxDecoration(
                                    color: PlanoraColors.brandAccent,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.favorite_border_rounded,
                                      size: 36, color: PlanoraColors.brandDark),
                                ),
                                const SizedBox(height: 16),
                                Text('Belum ada layanan favorit.',
                                    style: tt.bodyMedium?.copyWith(
                                      color: PlanoraColors.brandGray,
                                      fontStyle: FontStyle.italic,
                                    )),
                              ],
                            ),
                          ),
                        )
                      : ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _favorites.length,
                          itemBuilder: (context, index) {
                            final item = _favorites[index];
                            final itemId = item['id']?.toString() ?? '1';
                            final avatar = item['avatar']?.toString() ?? '';
                            final imageUrl = avatar.isNotEmpty
                                ? (avatar.startsWith('http')
                                    ? avatar
                                    : 'http://10.0.2.2:5000/assets/$avatar')
                                : 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=200&auto=format&fit=crop';

                            return GestureDetector(
                              onTap: () => Navigator.pushNamed(
                                  context, '/detail_booking', arguments: itemId),
                              child: _buildFavoriteCard(
                                name: item['businessName'] ?? item['name'] ?? 'Vendor',
                                category: item['category'] ?? 'Kategori',
                                imageUrl: imageUrl,
                                tt: tt,
                              ),
                            );
                          },
                        ),
            ],
          ),
        ),
      ),

      // ── Bottom Navigation Bar ─────────────────────────────────────────
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

  Widget _buildFavoriteCard({
    required String name,
    required String category,
    required String imageUrl,
    required TextTheme tt,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: PlanoraColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: PlanoraColors.divider),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(14),
            child: Image.network(
              imageUrl,
              width: 76,
              height: 76,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(
                width: 76, height: 76,
                color: PlanoraColors.brandAccent,
                child: const Icon(Icons.storefront_outlined, color: PlanoraColors.brandDark),
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: tt.titleMedium,
                    maxLines: 1, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 4),
                Text(category, style: tt.bodySmall),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: PlanoraColors.brandAccent,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text('Lihat Detail',
                      style: tt.labelSmall?.copyWith(
                        color: PlanoraColors.brandDark,
                        fontWeight: FontWeight.w600,
                      )),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(
              color: PlanoraColors.brandAccent,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.favorite_rounded,
              color: PlanoraColors.brandDark,
              size: 18,
            ),
          ),
        ],
      ),
    );
  }
}
