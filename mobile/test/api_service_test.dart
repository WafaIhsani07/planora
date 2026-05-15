import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:mobile/services/api_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('ApiService Auth Tests', () {
    test('register success returns true and data', () async {
      final mockClient = MockClient((request) async {
        // Cek URL endpoint
        expect(request.url.toString(), '${ApiService.baseUrl}/auth/register');
        
        return http.Response(
          json.encode({
            'success': true,
            'data': {'id': 'user-1', 'email': 'test@test.com'}
          }),
          201,
        );
      });

      final result = await ApiService.register(
        'Test User', 'test@test.com', 'password123', '08123456789',
        client: mockClient,
      );

      expect(result['success'], true);
      expect(result['data']['email'], 'test@test.com');
      expect(result['data']['id'], 'user-1');
    });

    test('register failed returns false and error message', () async {
      final mockClient = MockClient((request) async {
        return http.Response(
          json.encode({
            'success': false,
            'message': 'Email sudah digunakan'
          }),
          400,
        );
      });

      final result = await ApiService.register(
        'Test User', 'test@test.com', 'password123', '08123456789',
        client: mockClient,
      );

      expect(result['success'], false);
      expect(result['message'], 'Email sudah digunakan');
    });

    test('register exception handles properly', () async {
      final mockClient = MockClient((request) async {
        throw Exception('Network error');
      });

      final result = await ApiService.register(
        'Test User', 'test@test.com', 'password123', '08123456789',
        client: mockClient,
      );

      expect(result['success'], false);
      expect(result['message'], 'Gagal terhubung ke server');
    });
  });

  group('ApiService Booking Tests', () {
    test('createBooking success returns data', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.toString(), '${ApiService.baseUrl}/bookings');
        final body = json.decode(request.body);
        expect(body['layananId'], 'layanan-1');
        expect(body['eventDate'], '2026-12-31');
        
        return http.Response(
          json.encode({
            'success': true,
            'data': {'id': 'booking-1', 'status': 'PENDING'}
          }),
          201,
        );
      });

      final result = await ApiService.createBooking(
        'layanan-1', '2026-12-31', 'Jakarta', 'Catatan khusus',
        client: mockClient,
      );

      expect(result['success'], true);
      expect(result['data']['id'], 'booking-1');
    });

    test('createBooking fail returns error message', () async {
      final mockClient = MockClient((request) async {
        return http.Response(
          json.encode({
            'success': false,
            'message': 'Layanan tidak ditemukan'
          }),
          404,
        );
      });

      final result = await ApiService.createBooking(
        'layanan-1', '2026-12-31', 'Jakarta', 'Catatan khusus',
        client: mockClient,
      );

      expect(result['success'], false);
      expect(result['message'], 'Layanan tidak ditemukan');
    });

    test('getBookings success returns list of bookings', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.toString(), '${ApiService.baseUrl}/bookings');
        
        return http.Response(
          json.encode({
            'success': true,
            'data': [
              {'id': 'b1', 'status': 'PENDING'},
              {'id': 'b2', 'status': 'CONFIRMED'}
            ]
          }),
          200,
        );
      });

      final result = await ApiService.getBookings(client: mockClient);

      expect(result['success'], true);
      expect(result['data'].length, 2);
      expect(result['data'][0]['id'], 'b1');
    });

    test('getBookings fails with 401 returns unauthorized message', () async {
      final mockClient = MockClient((request) async {
        return http.Response(
          json.encode({
            'success': false,
            'message': 'Unauthorized'
          }),
          401,
        );
      });

      final result = await ApiService.getBookings(client: mockClient);

      expect(result['success'], false);
      expect(result['message'], 'Unauthorized');
    });

    test('getBookings catches exception and returns connection error', () async {
      final mockClient = MockClient((request) async {
        throw Exception('Network Down');
      });

      final result = await ApiService.getBookings(client: mockClient);

      expect(result['success'], false);
      expect(result['message'], 'Gagal terhubung ke server');
    });
  });

  group('ApiService Profile Tests', () {
    test('[POSITIF] getProfile mengembalikan data user saat 200', () async {
      SharedPreferences.setMockInitialValues({'access_token': 'valid-token'});

      final mockClient = MockClient((request) async {
        expect(request.url.toString(), '${ApiService.baseUrl}/users/me');
        expect(request.headers['Authorization'], 'Bearer valid-token');

        return http.Response(
          json.encode({
            'success': true,
            'data': {
              'id': 'user-1',
              'name': 'Budi Santoso',
              'email': 'budi@test.com',
              'role': 'CUSTOMER',
            }
          }),
          200,
        );
      });

      final result = await ApiService.getProfile(client: mockClient);

      expect(result['success'], true);
      expect(result['data']['name'], 'Budi Santoso');
      expect(result['data']['email'], 'budi@test.com');
    });

    test('[NEGATIF] getProfile mengembalikan error saat token tidak valid (401)', () async {
      SharedPreferences.setMockInitialValues({'access_token': 'expired-token'});

      final mockClient = MockClient((request) async {
        return http.Response(
          json.encode({'success': false, 'message': 'Token tidak valid'}),
          401,
        );
      });

      final result = await ApiService.getProfile(client: mockClient);

      expect(result['success'], false);
      expect(result['message'], 'Token tidak valid');
    });

    test('[NEGATIF] getProfile handles network exception', () async {
      final mockClient = MockClient((request) async {
        throw Exception('Connection refused');
      });

      final result = await ApiService.getProfile(client: mockClient);

      expect(result['success'], false);
      expect(result['message'], 'Gagal terhubung ke server');
    });
  });

  group('ApiService Payment Tests', () {
    test('[POSITIF] createPayment berhasil membuat data pembayaran', () async {
      SharedPreferences.setMockInitialValues({'access_token': 'valid-token'});

      final mockClient = MockClient((request) async {
        expect(request.url.toString(), '${ApiService.baseUrl}/payments');
        final body = json.decode(request.body);
        expect(body['bookingId'], 'booking-1');
        expect(body['method'], 'BANK_TRANSFER');

        return http.Response(
          json.encode({
            'success': true,
            'data': {
              'id': 'pay-1',
              'status': 'PENDING',
              'bookingId': 'booking-1'
            }
          }),
          201,
        );
      });

      final result = await ApiService.createPayment(
        bookingId: 'booking-1',
        amount: 5000000,
        method: 'BANK_TRANSFER',
        client: mockClient,
      );

      expect(result['success'], true);
      expect(result['data']['status'], 'PENDING');
    });

    test('[NEGATIF] createPayment gagal jika booking tidak ditemukan (404)', () async {
      SharedPreferences.setMockInitialValues({'access_token': 'valid-token'});

      final mockClient = MockClient((request) async {
        return http.Response(
          json.encode({'success': false, 'message': 'Booking tidak ditemukan'}),
          404,
        );
      });

      final result = await ApiService.createPayment(
        bookingId: 'invalid-id',
        amount: 5000000,
        method: 'BANK_TRANSFER',
        client: mockClient,
      );

      expect(result['success'], false);
      expect(result['message'], 'Booking tidak ditemukan');
    });

    test('[NEGATIF] createPayment menangani exception jaringan', () async {
      final mockClient = MockClient((request) async {
        throw Exception('Network Error');
      });

      final result = await ApiService.createPayment(
        bookingId: 'booking-1',
        amount: 5000000,
        method: 'BANK_TRANSFER',
        client: mockClient,
      );

      expect(result['success'], false);
      expect(result['message'], 'Gagal terhubung ke server');
    });
  });
}
