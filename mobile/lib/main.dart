import 'package:flutter/material.dart';
import 'splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/welcome_screen.dart';
import 'screens/home_screen.dart';
import 'screens/explore_screen.dart';
import 'screens/pesanan_screen.dart';
import 'screens/favorit_screen.dart';
import 'screens/profil_screen.dart';
import 'screens/notifikasi_screen.dart';
import 'screens/detail_notifikasi_screen.dart';
import 'screens/detail_booking_screen.dart';
import 'screens/detail_booking_batalkan_screen.dart';
import 'screens/pemesanan_form_screen.dart';
import 'screens/kalender_screen.dart';
import 'screens/pengaturan_screen.dart';
import 'screens/chat_list_screen.dart';
import 'screens/chat_detail_screen.dart';
import 'screens/pembayaran_screen.dart';
import 'screens/riwayat_screen.dart';
import 'screens/edit_profil_screen.dart';

void main() {
  runApp(const PlanoraApp());
}

class PlanoraApp extends StatelessWidget {
  const PlanoraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Planora Mobile',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(),
        '/welcome': (context) => const WelcomeScreen(),
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/home': (context) => const HomeScreen(),
        '/explore': (context) => const ExploreScreen(),
        '/pesanan': (context) => const PesananScreen(),
        '/favorit': (context) => const FavoritScreen(),
        '/profil': (context) => const ProfilScreen(),
        '/notifikasi': (context) => const NotifikasiScreen(),
        '/detail_notifikasi': (context) => const DetailNotifikasiScreen(),
        '/detail_booking': (context) => const DetailBookingScreen(),
        '/detail_booking_batalkan': (context) =>
            const DetailBookingBatalkanScreen(),
        '/pemesanan_form': (context) => const PemesananFormScreen(),
        '/kalender': (context) => const KalenderScreen(),
        '/pengaturan': (context) => const PengaturanScreen(),
        '/chat_list': (context) => const ChatListScreen(),
        '/chat_detail': (context) => const ChatDetailScreen(),
        '/pembayaran': (context) => const PembayaranScreen(),
        '/riwayat': (context) => const RiwayatScreen(),
        '/edit_profil': (context) => const EditProfilScreen(),
      },
    );
  }
}
