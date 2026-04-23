import 'package:flutter/material.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFAFA),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 40.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Spacer(),
              // Render Logo Utama
              Image.asset('assets/images/logo.png', height: 120),
              const SizedBox(height: 24),
              // Teks Identitas
              const Text(
                'PLANORA',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 4.0,
                  color: Color(0xFF4A4A4A),
                ),
              ),
              const SizedBox(height: 8),
              // Teks Slogan (Tagline)
              const Text(
                'Wujudkan Momen Terbaikmu',
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
              const Spacer(),
              // Tombol Tindakan 1: Daftar (Outlined)
              SizedBox(
                width: double.infinity,
                height: 55,
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(
                      color: Color(0xFF7A6A58),
                      width: 1.5,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: () {
                    // Merujuk aplikasi ke layar pendaftaran (Register)
                    Navigator.pushNamed(context, '/register');
                  },
                  child: const Text(
                    'Daftar Sekarang',
                    style: TextStyle(
                      fontSize: 16,
                      color: Color(0xFF7A6A58),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              // Tombol Tindakan 2: Masuk (Elevated)
              SizedBox(
                width: double.infinity,
                height: 55,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF7A6A58),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: () {
                    Navigator.pushNamed(context, '/login');
                  },
                  child: const Text(
                    'Sudah Punya Akun',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
