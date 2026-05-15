import 'package:flutter/material.dart';
import '../services/api_service.dart';

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

      final matchesSearch =
          _searchQuery.isEmpty || name.contains(_searchQuery.toLowerCase());
      final matchesCategory =
          _selectedCategory.isEmpty ||
          category == _selectedCategory.toLowerCase();

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
      if (mounted) {
        setState(() {
          _recommendations = vendorsData;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _recommendations = []);
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  // Navigasi Bottom Bar
  void _onBottomNavTapped(int index) {
    if (index == 0) {
      Navigator.pushReplacementNamed(context, '/home');
    } else if (index == 1) {
      // Sedang di halaman Eksplor
    } else if (index == 2) {
      Navigator.pushReplacementNamed(context, '/pesanan');
    } else if (index == 3) {
      Navigator.pushReplacementNamed(context, '/favorit');
    } else if (index == 4) {
      Navigator.pushReplacementNamed(context, '/profil');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 24.0,
              vertical: 20.0,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Judul Halaman
                const Text(
                  'Eksplor Layanan',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF333333),
                  ),
                ),
                const SizedBox(height: 20),

                // Search Bar
                TextField(
                  onChanged: (val) => setState(() => _searchQuery = val),
                  decoration: InputDecoration(
                    hintText: 'Cari gedung, katering...',
                    hintStyle: const TextStyle(color: Colors.grey),
                    prefixIcon: const Icon(Icons.search, color: Colors.grey),
                    filled: true,
                    fillColor: const Color(0xFFFAFAFA),
                    contentPadding: const EdgeInsets.symmetric(vertical: 16),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20),
                      borderSide: const BorderSide(color: Color(0xFFEFEFEF)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20),
                      borderSide: const BorderSide(color: Color(0xFFEFEFEF)),
                    ),
                  ),
                ),
                const SizedBox(height: 32),

                // Kategori Jasa (Grid)
                const Text(
                  'Kategori Jasa',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF333333),
                  ),
                ),
                const SizedBox(height: 20),
                _buildCategoryGrid(),
                const SizedBox(height: 32),

                // Mungkin Anda Suka (Rekomendasi dari API)
                const Text(
                  'Mungkin Anda Suka',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF333333),
                  ),
                ),
                const SizedBox(height: 16),

                // Area Dynamic Data dari Backend
                _isLoading
                    ? const Center(child: CircularProgressIndicator())
                    : _filteredRecommendations.isEmpty
                    ? const Center(
                        child: Padding(
                          padding: EdgeInsets.symmetric(vertical: 40.0),
                          child: Text(
                            'Belum ada rekomendasi layanan dari server.',
                            style: TextStyle(
                              color: Colors.grey,
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                        ),
                      )
                    : ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: _filteredRecommendations.length,
                        itemBuilder: (context, index) {
                          final item = _filteredRecommendations[index];
                          // Mapping field dari backend (businessName, avatar, dll)
                          final avatar = item['avatar']?.toString() ?? '';
                          final imageUrl = avatar.isNotEmpty
                              ? (avatar.startsWith('http')
                                  ? avatar
                                  : 'http://10.0.2.2:5000/assets/$avatar')
                              : 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=200&auto=format&fit=crop';

                          return _buildRecommendationCard(
                            id: item['id']?.toString() ?? '1',
                            name: item['businessName'] ?? item['name'] ?? 'Layanan',
                            category: item['category'] ?? 'Kategori',
                            price: 'Lihat Detail',
                            rating: item['rating']?.toString() ?? '0.0',
                            imageUrl: imageUrl,
                            context: context,
                          );
                        },
                      ),
              ],
            ),
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
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite_border),
            label: 'Favorit',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            label: 'Profil',
          ),
        ],
      ),
    );
  }

  // Komponen Grid Kategori
  Widget _buildCategoryGrid() {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 4,
      mainAxisSpacing: 16,
      crossAxisSpacing: 8,
      children: [
        _buildCategoryItem(
          Icons.domain,
          const Color(0xFF4285F4),
          const Color(0xFFE8F0FE),
          'Gedung',
        ),
        _buildCategoryItem(
          Icons.restaurant,
          const Color(0xFFF2994A),
          const Color(0xFFFCE8E6),
          'Katering',
        ),
        _buildCategoryItem(
          Icons.face_retouching_natural,
          const Color(0xFFE91E63),
          const Color(0xFFFCE4EC),
          'MUA',
        ),
        _buildCategoryItem(
          Icons.camera_alt,
          const Color(0xFF9C27B0),
          const Color(0xFFF3E5F5),
          'Foto',
        ),
        _buildCategoryItem(
          Icons.eco,
          const Color(0xFF34A853),
          const Color(0xFFE8F5E9),
          'Dekorasi',
        ),
        _buildCategoryItem(
          Icons.music_note,
          const Color(0xFFFBC02D),
          const Color(0xFFFFF9C4),
          'Hiburan',
        ),
        _buildCategoryItem(
          Icons.checkroom,
          const Color(0xFF3F51B5),
          const Color(0xFFE8EAF6),
          'Busana',
        ),
        _buildCategoryItem(
          Icons.more_horiz,
          const Color(0xFF607D8B),
          const Color(0xFFECEFF1),
          'Lainnya',
        ),
      ],
    );
  }

  Widget _buildCategoryItem(
    IconData icon,
    Color iconColor,
    Color bgColor,
    String label,
  ) {
    bool isSelected = _selectedCategory == label;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedCategory = isSelected ? '' : label;
        });
      },
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircleAvatar(
            radius: 28,
            backgroundColor: isSelected
                ? iconColor.withValues(alpha: 0.3)
                : bgColor,
            child: Icon(icon, color: iconColor, size: 28),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
              color: isSelected ? iconColor : const Color(0xFF555555),
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  // Komponen Card Rekomendasi
  Widget _buildRecommendationCard({
    required String id,
    required String name,
    required String category,
    required String price,
    required String rating,
    required String imageUrl,
    required BuildContext context,
  }) {
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, '/detail_booking', arguments: id);
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(16),
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
            ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Image.network(
                imageUrl,
                width: 80,
                height: 80,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(
                  width: 80,
                  height: 80,
                  color: Colors.grey[300],
                  child: const Icon(Icons.storefront, color: Colors.grey),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    category,
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        price,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF00C853),
                        ),
                      ),
                      Row(
                        children: [
                          const Icon(Icons.star, color: Colors.amber, size: 16),
                          const SizedBox(width: 4),
                          Text(
                            rating,
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                            ),
                          ),
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
