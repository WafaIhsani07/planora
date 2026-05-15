import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../main.dart' show PlanoraColors;

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final int _currentIndex = 1;
  List<dynamic> _recommendations = [];
  bool _isLoading = true;
  String _searchQuery = '';
  String _selectedCategory = '';

  List<dynamic> get _filteredRecommendations {
    return _recommendations.where((item) {
      final name = (item['businessName'] ?? item['name'] ?? '').toString().toLowerCase();
      final category = (item['category'] ?? '').toString().toLowerCase();
      final matchesSearch = _searchQuery.isEmpty || name.contains(_searchQuery.toLowerCase());
      final matchesCategory = _selectedCategory.isEmpty || category == _selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    }).toList();
  }

  @override
  void initState() {
    super.initState();
    _fetchRecommendations();
  }

  Future<void> _fetchRecommendations() async {
    try {
      final vendorsData = await ApiService.getVendors();
      if (mounted) setState(() => _recommendations = vendorsData);
    } catch (e) {
      if (mounted) setState(() => _recommendations = []);
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _onBottomNavTapped(int index) {
    if (index == 0) Navigator.pushReplacementNamed(context, '/home');
    if (index == 2) Navigator.pushReplacementNamed(context, '/pesanan');
    if (index == 3) Navigator.pushReplacementNamed(context, '/favorit');
    if (index == 4) Navigator.pushReplacementNamed(context, '/profil');
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
              Text('Eksplor Layanan', style: tt.headlineMedium),
              const SizedBox(height: 18),

              // Search Bar
              TextField(
                onChanged: (val) => setState(() => _searchQuery = val),
                decoration: const InputDecoration(
                  hintText: 'Cari gedung, katering...',
                  prefixIcon: Icon(Icons.search_rounded),
                ),
              ),
              const SizedBox(height: 32),

              Text('Kategori Jasa', style: tt.titleLarge),
              const SizedBox(height: 16),
              _buildCategoryGrid(),
              const SizedBox(height: 32),

              Text('Mungkin Anda Suka', style: tt.titleLarge),
              const SizedBox(height: 14),

              _isLoading
                  ? const Center(child: Padding(padding: EdgeInsets.symmetric(vertical: 40), child: CircularProgressIndicator()))
                  : _filteredRecommendations.isEmpty
                      ? Center(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 40),
                            child: Text('Belum ada rekomendasi layanan dari server.',
                                style: tt.bodyMedium?.copyWith(color: PlanoraColors.brandGray, fontStyle: FontStyle.italic)),
                          ),
                        )
                      : ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _filteredRecommendations.length,
                          itemBuilder: (context, index) {
                            final item = _filteredRecommendations[index];
                            final avatar = item['avatar']?.toString() ?? '';
                            final imageUrl = avatar.isNotEmpty
                                ? (avatar.startsWith('http') ? avatar : 'http://10.0.2.2:5000/assets/$avatar')
                                : 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=200&auto=format&fit=crop';
                            return _buildCard(
                              id: item['id']?.toString() ?? '1',
                              name: item['businessName'] ?? item['name'] ?? 'Layanan',
                              category: item['category'] ?? 'Kategori',
                              rating: item['rating']?.toString() ?? '0.0',
                              imageUrl: imageUrl,
                            );
                          },
                        ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(border: Border(top: BorderSide(color: PlanoraColors.divider))),
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

  Widget _buildCategoryGrid() {
    final categories = [
      _Cat(Icons.domain_rounded, 'Gedung'),
      _Cat(Icons.restaurant_rounded, 'Katering'),
      _Cat(Icons.face_retouching_natural, 'MUA'),
      _Cat(Icons.camera_alt_rounded, 'Foto'),
      _Cat(Icons.eco_rounded, 'Dekorasi'),
      _Cat(Icons.music_note_rounded, 'Hiburan'),
      _Cat(Icons.checkroom_rounded, 'Busana'),
      _Cat(Icons.more_horiz_rounded, 'Lainnya'),
    ];

    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 4,
      mainAxisSpacing: 12,
      crossAxisSpacing: 8,
      children: categories.map((cat) {
        final isSelected = _selectedCategory == cat.label;
        final tt = Theme.of(context).textTheme;
        return GestureDetector(
          onTap: () => setState(() => _selectedCategory = isSelected ? '' : cat.label),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: isSelected ? PlanoraColors.brandAccent : PlanoraColors.surface,
                  shape: BoxShape.circle,
                  border: Border.all(color: isSelected ? PlanoraColors.brandAccentHover : PlanoraColors.divider),
                ),
                child: Icon(cat.icon, size: 24, color: isSelected ? PlanoraColors.brandDark : PlanoraColors.brandGray),
              ),
              const SizedBox(height: 6),
              Text(
                cat.label,
                style: tt.labelSmall?.copyWith(
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                  color: isSelected ? PlanoraColors.brandDark : PlanoraColors.brandGray,
                ),
                overflow: TextOverflow.ellipsis,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildCard({required String id, required String name, required String category, required String rating, required String imageUrl}) {
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
            ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: Image.network(imageUrl, width: 80, height: 80, fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(width: 80, height: 80, color: PlanoraColors.brandAccent,
                      child: const Icon(Icons.storefront_outlined, color: PlanoraColors.brandDark))),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: tt.titleMedium, maxLines: 1, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 4),
                  Text(category, style: tt.bodySmall),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(color: PlanoraColors.brandAccent, borderRadius: BorderRadius.circular(20)),
                        child: Text('Lihat Detail', style: tt.labelSmall?.copyWith(color: PlanoraColors.brandDark, fontWeight: FontWeight.w600)),
                      ),
                      Row(children: [
                        const Icon(Icons.star_rounded, color: Color(0xFFFFB300), size: 15),
                        const SizedBox(width: 3),
                        Text(rating, style: tt.bodySmall),
                      ]),
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

class _Cat {
  final IconData icon;
  final String label;
  const _Cat(this.icon, this.label);
}
