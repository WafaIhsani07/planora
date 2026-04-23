import 'package:flutter/material.dart';
import 'dart:async';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    // Mengatur jeda waktu selama 3 detik sebelum berpindah halaman
    Timer(const Duration(seconds: 3), () {
      // Navigasi ke halaman beranda pertama (Welcome Screen)
      Navigator.pushReplacementNamed(context, '/welcome');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/images/logo.png', // Memanggil logo yang telah diregistrasi
              width: 150,
            ),
            const SizedBox(height: 20),
            const CircularProgressIndicator(), // Indikator proses memuat
          ],
        ),
      ),
    );
  }
}
