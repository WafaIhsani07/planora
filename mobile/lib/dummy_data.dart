class DummyData {
  static const List<Map<String, dynamic>> vendors = [
    {
      'id': 'v1', '_id': 'v1',
      'name': 'Gedung Serbaguna Planora',
      'category': 'Gedung',
      'price': 5000000,
      'rating': '4.8',
      'imageUrl': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400&auto=format&fit=crop',
      'description': 'Gedung mewah dengan kapasitas 1000 orang, parkir luas, dan fasilitas lengkap untuk acara pernikahan Anda.',
      'location': 'Jl. K.H. Sudirman No 123, Jakarta Selatan',
      'facilities': ['Kapasitas 1000', 'AC Central', 'Ruang Rias', 'Parkir Luas']
    },
    {
      'id': 'v2', '_id': 'v2',
      'name': 'Katering Sejahtera',
      'category': 'Katering',
      'price': 2500000,
      'rating': '4.9',
      'imageUrl': 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=400&auto=format&fit=crop',
      'description': 'Paket katering pernikahan lengkap dan bebas atur menu favorit keluarga.',
      'location': 'Jl. Merdeka Barat, Bandung',
      'facilities': ['Bebas Ongkir', 'Prasmanan', 'Pondokan', 'Testing Makanan']
    }
  ];

  static const List<Map<String, dynamic>> orders = [
    {
      'id': 'ord1', '_id': 'ord1',
      'invoiceStatus': 'INV-20260429-001',
      'name': 'Gedung Serbaguna Planora',
      'date': '2026-05-10',
      'price': 5000000,
      'imageUrl': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400&auto=format&fit=crop',
      'isPaid': false,
      'status': 'Belum Dibayar'
    },
    {
      'id': 'ord2', '_id': 'ord2',
      'invoiceStatus': 'INV-20260429-002',
      'name': 'Katering Sejahtera',
      'date': '2026-04-15',
      'price': 2500000,
      'imageUrl': 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=400&auto=format&fit=crop',
      'isPaid': true,
      'status': 'Selesai'
    }
  ];
}