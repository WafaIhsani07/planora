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
      },
    );
  }
}
