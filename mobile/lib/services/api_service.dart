import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http_parser/http_parser.dart';

class ApiService {
  static String get baseUrl {
    // URL Backend Production di Hugging Face
    return 'https://nooname77-planora-api.hf.space/api/v1';
  }

  // Alamat dasar host (tanpa /api/v1), untuk membangun URL aset gambar
  static String get baseHost => baseUrl.replaceAll('/api/v1', '');

  /// Menghasilkan URL gambar/aset yang benar berdasarkan platform.
  /// - Jika [path] sudah berupa URL lengkap (http...), langsung dikembalikan.
  /// - Jika [path] adalah nama file relatif, URL dibangun menggunakan [baseHost].
  /// - Jika [path] kosong/null, string kosong dikembalikan.
  static String getAssetUrl(String? path) {
    if (path == null || path.trim().isEmpty) return '';
    if (path.startsWith('http')) {
      if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
        return path.replaceAll('localhost', '10.0.2.2');
      }
      return path;
    }
    return '$baseHost/uploads/$path';
  }


  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('access_token');
  }

  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('access_token', token);
  }

  static Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
  }

  // --- Auth API ---
  static Future<Map<String, dynamic>> login(String email, String password, {http.Client? client}) async {
    final httpClient = client ?? http.Client();
    try {
      final response = await httpClient.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
        },
        body: json.encode({
          'email': email,
          'password': password,
          'appType': 'MOBILE', // wajib dikirim ke backend
        }),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        // Simpan token
        final token = data['data']['accessToken'];
        await saveToken(token);
        // Simpan user_id
        final userId = data['data']['user']['id'];
        if (userId != null) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('user_id', userId.toString());
        }
        return {'success': true, 'data': data['data']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Login gagal'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    } finally {
      if (client == null) httpClient.close();
    }
  }

  static Future<Map<String, dynamic>> register(String name, String email, String password, String phone, {http.Client? client}) async {
    final httpClient = client ?? http.Client();
    try {
      final response = await httpClient.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
        },
        body: json.encode({
          'name': name,
          'email': email,
          'password': password,
          'phone': phone,
        }),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 201 && data['success'] == true) {
        return {'success': true, 'data': data['data']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Register gagal'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    } finally {
      if (client == null) httpClient.close();
    }
  }

  // Generic POST request dengan token
  static Future<http.Response> postRequest(String endpoint, Map<String, dynamic> body, {http.Client? client}) async {
    final httpClient = client ?? http.Client();
    final token = await getToken();
    try {
      return await httpClient.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode(body),
      );
    } finally {
      if (client == null) httpClient.close();
    }
  }

  // Generic GET request dengan token
  static Future<http.Response> getRequest(String endpoint, {http.Client? client}) async {
    final httpClient = client ?? http.Client();
    final token = await getToken();
    try {
      return await httpClient.get(
        Uri.parse('$baseUrl$endpoint'),
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
    } finally {
      if (client == null) httpClient.close();
    }
  }

  // Generic PATCH request dengan token
  static Future<http.Response> patchRequest(String endpoint, Map<String, dynamic> body, {http.Client? client}) async {
    final httpClient = client ?? http.Client();
    final token = await getToken();
    try {
      return await httpClient.patch(
        Uri.parse('$baseUrl$endpoint'),
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode(body),
      );
    } finally {
      if (client == null) httpClient.close();
    }
  }

  // Ambil daftar vendor/layanan
  static Future<List<dynamic>> getVendors({http.Client? client}) async {
    try {
      final response = await getRequest('/vendors', client: client);
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final rawData = data['data'];
        
        if (rawData is Map && rawData['vendors'] is List) {
          return rawData['vendors'];
        } else if (rawData is List) {
          return rawData;
        } else if (rawData is Map && rawData['data'] is List) {
          return rawData['data'];
        }
        return [];
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // Buat Pesanan Baru
  static Future<Map<String, dynamic>> createBooking(String layananId, String eventDate, String eventAddress, String notes, {String paymentMode = 'FULL', http.Client? client}) async {
    try {
      final response = await postRequest('/bookings', {
        'layananId': layananId,
        'eventDate': eventDate,
        'eventAddress': eventAddress,
        'notes': notes,
        'paymentMode': paymentMode,
      }, client: client);

      final data = json.decode(response.body);

      if (response.statusCode == 201 && data['success'] == true) {
        return {'success': true, 'data': data['data']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal membuat pesanan'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    }
  }

  // Ambil daftar pesanan saya (Booking List)
  static Future<Map<String, dynamic>> getBookings({http.Client? client}) async {
    try {
      final response = await getRequest('/bookings', client: client);
      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        final rawData = data['data'];
        List<dynamic> bookingsList = [];
        
        if (rawData is Map && rawData['data'] is List) {
          bookingsList = rawData['data'];
        } else if (rawData is List) {
          bookingsList = rawData;
        }
        
        return {'success': true, 'data': bookingsList};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal mengambil pesanan'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    }
  }

  // Ambil profil pengguna yang sedang login (membutuhkan token)
  // Menyatukan rute /users/me dari main dan implementasi dari branch kita
  static Future<Map<String, dynamic>> getProfile({http.Client? client}) async {
    try {
      final response = await getRequest('/users/profile', client: client);
      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'data': data['data']};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Gagal mengambil profil',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    }
  }

  // Ambil detail satu vendor berdasarkan ID
  static Future<Map<String, dynamic>> getVendorById(String id, {http.Client? client}) async {
    try {
      final response = await getRequest('/vendors/$id', client: client);
      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'data': data['data']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Vendor tidak ditemukan'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    }
  }

  // Ambil daftar paket/layanan milik satu vendor
  static Future<Map<String, dynamic>> getVendorServices(String vendorId, {http.Client? client}) async {
    try {
      final response = await getRequest('/vendors/$vendorId', client: client);
      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'data': data['data']['layanan'] ?? []};
      } else {
        return {'success': false, 'data': [], 'message': data['message'] ?? 'Gagal mengambil paket layanan'};
      }
    } catch (e) {
      return {'success': false, 'data': [], 'message': 'Gagal terhubung ke server'};
    }
  }

  // T9: Ambil detail satu booking berdasarkan ID
  static Future<Map<String, dynamic>> getBookingById(String id, {http.Client? client}) async {
    try {
      final response = await getRequest('/bookings/$id', client: client);
      final data = json.decode(response.body);
      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'data': data['data']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Pesanan tidak ditemukan'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    }
  }

  // Buat Pembayaran (inisiasi payment record) - Dari upstream/main
  static Future<Map<String, dynamic>> createPayment({
    required String bookingId,
    required double amount,
    required String method,
    String? type,
    String? proofUrl,
    http.Client? client,
  }) async {
    try {
      final response = await postRequest('/payments', {
        'bookingId': bookingId,
        'amount': amount,
        'method': method,
        if (type != null) 'type': type,
        if (proofUrl != null) 'proofUrl': proofUrl,
      }, client: client);

      final data = json.decode(response.body);

      if ((response.statusCode == 200 || response.statusCode == 201) && data['success'] == true) {
        return {'success': true, 'data': data['data']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal membuat pembayaran'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    }
  }

  /// Mengunggah file bukti pembayaran ke backend
  static Future<Map<String, dynamic>> uploadFile(XFile image, {http.Client? client}) async {
    final token = await getToken();
    try {
      final request = http.MultipartRequest('POST', Uri.parse('$baseUrl/uploads'));
      
      request.headers.addAll({
        'Bypass-Tunnel-Reminder': 'true',
        if (token != null) 'Authorization': 'Bearer $token',
      });
      
      final bytes = await image.readAsBytes();
      final filename = image.name.toLowerCase();
      String mimeType = 'image/jpeg';
      if (filename.endsWith('.png')) {
        mimeType = 'image/png';
      } else if (filename.endsWith('.webp')) {
        mimeType = 'image/webp';
      } else if (filename.endsWith('.gif')) {
        mimeType = 'image/gif';
      }

      request.files.add(http.MultipartFile.fromBytes(
        'file',
        bytes,
        filename: image.name,
        contentType: MediaType.parse(mimeType),
      ));
      
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      final data = json.decode(response.body);

      if (response.statusCode == 201 && data['success'] == true) {
        return {'success': true, 'imageUrl': data['data']['imageUrl']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal mengunggah file'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server untuk unggah file: $e'};
    }
  }

  // T10: Konfirmasi pembayaran - update status booking menjadi PAID
  static Future<Map<String, dynamic>> confirmPayment(String bookingId, {http.Client? client}) async {
    try {
      final response = await postRequest(
        '/bookings/$bookingId/pay',
        {'status': 'PAID'},
        client: client,
      );
      final data = json.decode(response.body);
      if ((response.statusCode == 200 || response.statusCode == 201) &&
          data['success'] == true) {
        return {'success': true, 'data': data['data']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal mengkonfirmasi pembayaran'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    }
  }

  // T11: Tambah ulasan untuk vendor
  static Future<Map<String, dynamic>> addReview(
    String bookingId,
    int rating,
    String comment, {
    http.Client? client,
  }) async {
    try {
      final response = await postRequest(
        '/reviews',
        {
          'bookingId': bookingId,
          'rating': rating,
          'comment': comment,
        },
        client: client,
      );
      final data = json.decode(response.body);
      if ((response.statusCode == 200 || response.statusCode == 201) &&
          data['success'] == true) {
        return {'success': true, 'data': data['data']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal mengirim ulasan'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    }
  }

  // T12: Update profil pengguna (nama, nomor telepon, avatar)
  static Future<Map<String, dynamic>> updateProfile(
    String name,
    String phone, {
    String? avatar,
    http.Client? client,
  }) async {
    final httpClient = client ?? http.Client();
    final token = await getToken();
    try {
      final response = await httpClient.put(
        Uri.parse('$baseUrl/users/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'name': name,
          'phone': phone,
          if (avatar != null) 'avatar': avatar,
        }),
      );
      final data = json.decode(response.body);
      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'data': data['data']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal memperbarui profil'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    } finally {
      if (client == null) httpClient.close();
    }
  }

  // --- Notifications API ---
  static Future<Map<String, dynamic>> getNotifications({
    int page = 1,
    int limit = 20,
    String? type,
    http.Client? client,
  }) async {
    try {
      final queryParams = 'page=$page&limit=$limit${type != null ? '&type=$type' : ''}';
      final response = await getRequest('/notifications?$queryParams', client: client);
      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'data': data['data']['notifications'] ?? []};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal mengambil notifikasi'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    }
  }

  static Future<Map<String, dynamic>> getNotificationById(String id, {http.Client? client}) async {
    try {
      final response = await getRequest('/notifications/$id', client: client);
      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'data': data['data']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Notifikasi tidak ditemukan'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    }
  }

  static Future<Map<String, dynamic>> getUnreadNotificationCount({http.Client? client}) async {
    try {
      final response = await getRequest('/notifications/unread-count', client: client);
      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'data': data['data']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal mengambil jumlah notifikasi'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    }
  }

  static Future<Map<String, dynamic>> markNotificationAsRead(String id, {http.Client? client}) async {
    final httpClient = client ?? http.Client();
    final token = await getToken();
    try {
      final response = await httpClient.patch(
        Uri.parse('$baseUrl/notifications/$id/read'),
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'data': data['data']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal menandai notifikasi'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    } finally {
      if (client == null) httpClient.close();
    }
  }

  static Future<Map<String, dynamic>> markAllNotificationsAsRead({http.Client? client}) async {
    final httpClient = client ?? http.Client();
    final token = await getToken();
    try {
      final response = await httpClient.patch(
        Uri.parse('$baseUrl/notifications/read-all'),
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'data': data['data']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal menandai semua notifikasi'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    } finally {
      if (client == null) httpClient.close();
    }
  }

  // Hapus token (Logout) - Dari upstream/main
  static Future<void> logout() async {
    await clearToken();
  }

  // ── Chat / Messages API ──────────────────────────────────────────────────

  /// Mengambil semua pesan dalam sebuah booking.
  static Future<Map<String, dynamic>> getMessages(
    String bookingId, {
    http.Client? client,
  }) async {
    final httpClient = client ?? http.Client();
    final token = await getToken();
    try {
      final response = await httpClient.get(
        Uri.parse('$baseUrl/bookings/$bookingId/messages'),
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
      final data = json.decode(response.body);
      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'data': data['data'] as List<dynamic>};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal memuat pesan'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    } finally {
      if (client == null) httpClient.close();
    }
  }

  /// Mengirim pesan baru dalam sebuah booking.
  static Future<Map<String, dynamic>> sendMessage(
    String bookingId,
    String content, {
    http.Client? client,
  }) async {
    final httpClient = client ?? http.Client();
    final token = await getToken();
    try {
      final response = await httpClient.post(
        Uri.parse('$baseUrl/bookings/$bookingId/messages'),
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode({'content': content}),
      );
      final data = json.decode(response.body);
      if ((response.statusCode == 200 || response.statusCode == 201) &&
          data['success'] == true) {
        return {'success': true, 'data': data['data']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal mengirim pesan'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    } finally {
      if (client == null) httpClient.close();
    }
  }

  /// Mendapatkan jumlah pesan belum dibaca untuk booking tertentu.
  static Future<int> getUnreadMessageCount(
    String bookingId, {
    http.Client? client,
  }) async {
    final httpClient = client ?? http.Client();
    final token = await getToken();
    try {
      final response = await httpClient.get(
        Uri.parse('$baseUrl/bookings/$bookingId/messages/unread-count'),
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
      final data = json.decode(response.body);
      if (response.statusCode == 200 && data['success'] == true) {
        return (data['data']?['count'] as int?) ?? 0;
      }
      return 0;
    } catch (e) {
      return 0;
    } finally {
      if (client == null) httpClient.close();
    }
  }
  // ── Favorites API ─────────────────────────────────────────────────────────

  /// Mengambil daftar vendor favorit pengguna
  static Future<Map<String, dynamic>> getFavorites({http.Client? client}) async {
    try {
      final response = await getRequest('/favorites', client: client);
      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'data': data['data'] ?? []};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal mengambil favorit'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    }
  }

  /// Menambah atau menghapus vendor dari favorit
  static Future<Map<String, dynamic>> toggleFavorite(String vendorId, {http.Client? client}) async {
    try {
      final response = await postRequest(
        '/favorites/toggle',
        {'vendorId': vendorId},
        client: client,
      );
      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'data': data['data']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal memproses favorit'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Gagal terhubung ke server'};
    }
  }
}
