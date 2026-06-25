import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../utils/translations.dart';
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
      
      // Resolve category secara dinamis dari relasi backend
      String catName = 'Vendor';
      final layananList = item['layanan'];
      if (item['category'] != null && item['category'].toString().isNotEmpty) {
        catName = item['category'].toString();
      } else if (layananList is List && layananList.isNotEmpty) {
        final firstLayanan = layananList[0];
        if (firstLayanan is Map && firstLayanan['kategori'] is Map) {
          catName = firstLayanan['kategori']['name'] ?? 'Vendor';
        }
      }
      
      final category = catName.toLowerCase();
      final matchesSearch = _searchQuery.isEmpty || name.contains(_searchQuery.toLowerCase());
      
      bool matchesCategory = _selectedCategory.isEmpty;
      if (_selectedCategory.isNotEmpty) {
        final selCat = _selectedCategory.toLowerCase();
        if (category == selCat) {
          matchesCategory = true;
        } else if (selCat == 'foto' && category.contains('foto')) {
          matchesCategory = true;
        } else if (selCat == 'katering' && (category.contains('catering') || category.contains('sajian') || category.contains('katering'))) {
          matchesCategory = true;
        } else if (selCat == 'dekorasi' && category.contains('dekor')) {
          matchesCategory = true;
        } else if (selCat == 'gedung' && (category.contains('wedding') || category.contains('organizer') || category.contains('gedung'))) {
          matchesCategory = true;
        }
      }
      
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
              Text(Translations.t('explore.title'), style: tt.headlineMedium),
              const SizedBox(height: 18),

              // Search Bar
              TextField(
                onChanged: (val) => setState(() => _searchQuery = val),
                decoration: InputDecoration(
                  hintText: Translations.t('explore.search'),
                  prefixIcon: const Icon(Icons.search_rounded),
                ),
              ),
              const SizedBox(height: 32),

              Text(Translations.t('explore.categories'), style: tt.titleLarge),
              const SizedBox(height: 16),
              _buildCategoryGrid(),
              const SizedBox(height: 32),

              Text(Translations.t('explore.youMightLike'), style: tt.titleLarge),
              const SizedBox(height: 14),

              _isLoading
                  ? const Center(child: Padding(padding: EdgeInsets.symmetric(vertical: 40), child: CircularProgressIndicator()))
                  : _filteredRecommendations.isEmpty
                      ? Center(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 40),
                            child: Text(Translations.t('explore.noData'),
                                style: tt.bodyMedium?.copyWith(color: PlanoraColors.brandGray, fontStyle: FontStyle.italic)),
                          ),
                        )
                      : ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _filteredRecommendations.length,
                        itemBuilder: (context, index) {
                            final item = _filteredRecommendations[index];
                            final rawAvatar = (item['user'] != null && item['user']['avatar'] != null) 
                                ? item['user']['avatar'].toString() 
                                : (item['avatar']?.toString() ?? '');
                            final assetUrl = ApiService.getAssetUrl(rawAvatar);
                            final imageUrl = assetUrl.isNotEmpty
                                ? assetUrl
                                : 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=200&auto=format&fit=crop';
                            
                            // Resolve category secara dinamis
                            String catName = 'Vendor';
                            final layananList = item['layanan'];
                            if (item['category'] != null && item['category'].toString().isNotEmpty) {
                              catName = item['category'].toString();
                            } else if (layananList is List && layananList.isNotEmpty) {
                              final firstLayanan = layananList[0];
                              if (firstLayanan is Map && firstLayanan['kategori'] is Map) {
                                catName = firstLayanan['kategori']['name'] ?? 'Vendor';
                              }
                            }

                            return _buildCard(
                              id: item['id']?.toString() ?? '1',
                              name: item['businessName'] ?? item['name'] ?? 'Layanan',
                              category: catName,
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
          items: [
            BottomNavigationBarItem(icon: const Icon(Icons.home_outlined), activeIcon: const Icon(Icons.home_rounded), label: Translations.t('nav.home')),
            BottomNavigationBarItem(icon: const Icon(Icons.explore_outlined), activeIcon: const Icon(Icons.explore_rounded), label: Translations.t('nav.explore')),
            BottomNavigationBarItem(icon: const Icon(Icons.receipt_long_outlined), activeIcon: const Icon(Icons.receipt_long_rounded), label: Translations.t('nav.orders')),
            BottomNavigationBarItem(icon: const Icon(Icons.favorite_border_rounded), activeIcon: const Icon(Icons.favorite_rounded), label: Translations.t('nav.favorites')),
            BottomNavigationBarItem(icon: const Icon(Icons.person_outline_rounded), activeIcon: const Icon(Icons.person_rounded), label: Translations.t('nav.profile')),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryGrid() {
    final categories = [
      _Cat(Icons.domain_rounded, 'venue', Translations.t('cat.venue')),
      _Cat(Icons.restaurant_rounded, 'katering', Translations.t('cat.catering')),
      _Cat(Icons.face_retouching_natural, 'mua', Translations.t('cat.mua')),
      _Cat(Icons.camera_alt_rounded, 'foto', Translations.t('cat.photo')),
      _Cat(Icons.eco_rounded, 'dekorasi', Translations.t('cat.decoration')),
      _Cat(Icons.music_note_rounded, 'entertainment', Translations.t('cat.entertainment')),
      _Cat(Icons.checkroom_rounded, 'wear', Translations.t('cat.wear')),
      _Cat(Icons.more_horiz_rounded, 'others', Translations.t('cat.others')),
    ];

    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 4,
      mainAxisSpacing: 12,
      crossAxisSpacing: 8,
      children: categories.map((cat) {
        final isSelected = _selectedCategory == cat.filterKey;
        final tt = Theme.of(context).textTheme;
        return GestureDetector(
          onTap: () => setState(() => _selectedCategory = isSelected ? '' : cat.filterKey),
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
            Hero(
              tag: 'vendor-img-$id',
              child: ClipRRect(
                borderRadius: BorderRadius.circular(14),
                child: Image.network(imageUrl, width: 80, height: 80, fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(width: 80, height: 80, color: PlanoraColors.brandAccent,
                        child: const Icon(Icons.storefront_outlined, color: PlanoraColors.brandDark))),
              ),
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
                        child: Text(Translations.t('home.viewDetails'), style: tt.labelSmall?.copyWith(color: PlanoraColors.brandDark, fontWeight: FontWeight.w600)),
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
  final String filterKey;
  final String label;
  const _Cat(this.icon, this.filterKey, this.label);
}
