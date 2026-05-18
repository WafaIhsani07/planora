import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // 10.0.2.2 adalah localhost untuk emulator Android
  static const String baseUrl = 'http://10.0.2.2:5000/api/v1';

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
        headers: {'Content-Type': 'application/json'},
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
        headers: {'Content-Type': 'application/json'},
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
          if (token != null) 'Authorization': 'Bearer $token',
        },
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
        return data['data'] ?? [];
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // Buat Pesanan Baru
  static Future<Map<String, dynamic>> createBooking(String layananId, String eventDate, String eventAddress, String notes, {http.Client? client}) async {
    try {
      final response = await postRequest('/bookings', {
        'layananId': layananId,
        'eventDate': eventDate,
        'eventAddress': eventAddress,
        'notes': notes,
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
        return {'success': true, 'data': data['data']};
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
      final response = await getRequest('/users/me', client: client);
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
      final response = await getRequest('/vendors/$vendorId/services', client: client);
      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'data': data['data'] ?? []};
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
    http.Client? client,
  }) async {
    try {
      final response = await postRequest('/payments', {
        'bookingId': bookingId,
        'amount': amount,
        'method': method,
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
    String vendorId,
    int rating,
    String comment, {
    http.Client? client,
  }) async {
    try {
      final response = await postRequest(
        '/vendors/$vendorId/reviews',
        {'rating': rating, 'comment': comment},
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

  // T12: Update profil pengguna (nama, nomor telepon)
  static Future<Map<String, dynamic>> updateProfile(
    String name,
    String phone, {
    http.Client? client,
  }) async {
    final httpClient = client ?? http.Client();
    final token = await getToken();
    try {
      final response = await httpClient.patch(
        Uri.parse('$baseUrl/users/me'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode({'name': name, 'phone': phone}),
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

  // Hapus token (Logout) - Dari upstream/main
  static Future<void> logout() async {
    await clearToken();
  }
}
