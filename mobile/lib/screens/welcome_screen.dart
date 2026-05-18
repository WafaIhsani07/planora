import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../main.dart' show PlanoraColors;

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: PlanoraColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Spacer(flex: 2),

              // ── Logo + Brand ──────────────────────────────────────────
              Image.asset(
                'assets/images/logo.png',
                height: size.height * 0.13,
              ),
              const SizedBox(height: 20),

              // Brand name — Playfair Display (identik dengan web)
              Text(
                'Planora',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 40,
                  fontWeight: FontWeight.w700,
                  color: PlanoraColors.brandDark,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 10),

              // Tagline — Plus Jakarta Sans
              Text(
                'Wujudkan Momen Terbaikmu',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: PlanoraColors.brandGray,
                      fontSize: 15,
                    ),
                textAlign: TextAlign.center,
              ),

              const Spacer(flex: 3),

              // ── Tombol Daftar Sekarang (Outlined) ────────────────────
              OutlinedButton(
                onPressed: () => Navigator.pushNamed(context, '/register'),
                child: const Text('Daftar Sekarang'),
              ),
              const SizedBox(height: 14),

              // ── Tombol Sudah Punya Akun (Elevated / Primary CTA) ─────
              ElevatedButton(
                onPressed: () => Navigator.pushNamed(context, '/login'),
                child: const Text('Sudah Punya Akun'),
              ),

              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
