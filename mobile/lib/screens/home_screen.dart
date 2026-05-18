import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';
import '../main.dart' show PlanoraColors;

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  List<dynamic> _vendors = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchVendors();
  }

  // Fungsi untuk menarik data aktual dari Backend
  Future<void> _fetchVendors() async {
    setState(() => _isLoading = true);
    final vendorsData = await ApiService.getVendors();
    setState(() {
      _vendors = vendorsData;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: PlanoraColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Header ────────────────────────────────────────────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Hai, Pengguna ✨',
                    style: tt.headlineMedium,
                  ),
                  // Tombol notifikasi
                  GestureDetector(
                    onTap: () => Navigator.pushNamed(context, '/notifikasi'),
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: PlanoraColors.surface,
                        shape: BoxShape.circle,
                        border: Border.all(color: PlanoraColors.divider),
                      ),
                      child: const Icon(
                        Icons.notifications_none_rounded,
                        color: PlanoraColors.brandGray,
                        size: 22,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // ── Search Bar ────────────────────────────────────────────────
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      decoration: const InputDecoration(
                        hintText: 'Cari layanan impianmu...',
                        prefixIcon: Icon(Icons.search_rounded),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  // Filter button
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      color: PlanoraColors.brandDark,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: IconButton(
                      icon: const Icon(
                        Icons.tune_rounded,
                        color: PlanoraColors.background,
                        size: 20,
                      ),
                      onPressed: () {},
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),

              // ── Penawaran Spesial Banner ───────────────────────────────────
              Text('Penawaran Spesial', style: tt.titleLarge),
              const SizedBox(height: 14),
              ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: Stack(
                  children: [
                    Image.network(
                      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop',
                      width: double.infinity,
                      height: 180,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        width: double.infinity,
                        height: 180,
                        color: PlanoraColors.brandAccent,
                      ),
                    ),
                    // Gradient overlay
                    Positioned.fill(
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.centerLeft,
                            end: Alignment.centerRight,
                            colors: [
                              PlanoraColors.brandDark.withAlpha(210),
                              Colors.transparent,
                            ],
                          ),
                        ),
                      ),
                    ),
                    // Teks di atas banner
                    Positioned(
                      left: 24,
                      top: 0,
                      bottom: 0,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Diskon up to\n30%',
                            style: GoogleFonts.playfairDisplay(
                              fontSize: 22,
                              fontWeight: FontWeight.w700,
                              color: PlanoraColors.background,
                              height: 1.3,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'Sewa Gedung VIP',
                            style: tt.bodySmall?.copyWith(
                              color: PlanoraColors.background.withAlpha(200),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // ── Rekomendasi Vendor ────────────────────────────────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Rekomendasi Vendor', style: tt.titleLarge),
                  TextButton(
                    onPressed: () =>
                        Navigator.pushNamed(context, '/explore'),
                    child: Text(
                      'Lihat Semua',
                      style: tt.labelMedium?.copyWith(
                        color: PlanoraColors.brandDark,
                        decoration: TextDecoration.underline,
                        decorationColor: PlanoraColors.brandDark,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Area Dynamic Data dari Backend
              _isLoading
                  ? const Center(
                      child: Padding(
                        padding: EdgeInsets.symmetric(vertical: 40),
                        child: CircularProgressIndicator(),
                      ),
                    )
                  : _vendors.isEmpty
                      ? Center(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 40),
                            child: Text(
                              'Belum ada data vendor dari server.',
                              style: tt.bodyMedium?.copyWith(
                                color: PlanoraColors.brandGray,
                                fontStyle: FontStyle.italic,
                              ),
                            ),
                          ),
                        )
                      : ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _vendors.length,
                          itemBuilder: (context, index) {
                            final vendor = _vendors[index];
                            return _buildVendorCard(
                              id: vendor['id']?.toString() ?? '1',
                              name: vendor['businessName'] ?? 'Vendor Name',
                              category: vendor['city'] ?? 'Kota',
                              price: 'Lihat Detail',
                              rating: vendor['rating']?.toString() ?? '0.0',
                              imageUrl: vendor['avatar'] ??
                                  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=200&auto=format&fit=crop',
                              context: context,
                            );
                          },
                        ),
            ],
          ),
        ),
      ),

      // ── Bottom Navigation Bar ─────────────────────────────────────────────
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  // ── Reusable Bottom Nav (seragam di semua layar utama) ──────────────────
  Widget _buildBottomNav() {
    return Container(
      decoration: const BoxDecoration(
        border: Border(top: BorderSide(color: PlanoraColors.divider)),
      ),
      child: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() => _currentIndex = index);
          if (index == 1) Navigator.pushReplacementNamed(context, '/explore');
          if (index == 2) Navigator.pushReplacementNamed(context, '/pesanan');
          if (index == 3) Navigator.pushReplacementNamed(context, '/favorit');
          if (index == 4) Navigator.pushReplacementNamed(context, '/profil');
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home_rounded),
            label: 'Beranda',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.explore_outlined),
            activeIcon: Icon(Icons.explore_rounded),
            label: 'Eksplor',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.receipt_long_outlined),
            activeIcon: Icon(Icons.receipt_long_rounded),
            label: 'Pesanan',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite_border_rounded),
            activeIcon: Icon(Icons.favorite_rounded),
            label: 'Favorit',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline_rounded),
            activeIcon: Icon(Icons.person_rounded),
            label: 'Profil',
          ),
        ],
      ),
    );
  }

  // ── Vendor Card ───────────────────────────────────────────────────────────
  Widget _buildVendorCard({
    required String id,
    required String name,
    required String category,
    required String price,
    required String rating,
    required String imageUrl,
    required BuildContext context,
  }) {
    final tt = Theme.of(context).textTheme;

    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, '/detail_booking', arguments: id),
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: PlanoraColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: PlanoraColors.divider),
        ),
        child: Row(
          children: [
            // Thumbnail
            ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: Image.network(
                imageUrl,
                width: 80,
                height: 80,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(
                  width: 80,
                  height: 80,
                  color: PlanoraColors.brandAccent,
                  child: const Icon(
                    Icons.storefront_outlined,
                    color: PlanoraColors.brandDark,
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
                  Text(
                    name,
                    style: tt.titleMedium,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    category,
                    style: tt.bodySmall,
                  ),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Tag harga
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: PlanoraColors.brandAccent,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          price,
                          style: tt.labelSmall?.copyWith(
                            color: PlanoraColors.brandDark,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      // Rating
                      Row(
                        children: [
                          const Icon(
                            Icons.star_rounded,
                            color: Color(0xFFFFB300),
                            size: 15,
                          ),
                          const SizedBox(width: 3),
                          Text(rating, style: tt.bodySmall),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
