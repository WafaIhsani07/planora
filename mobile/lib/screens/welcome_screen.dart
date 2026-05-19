import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../main.dart' show PlanoraColors;

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          // Gradient peach/salmon — warna brand Planora
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFFFDED7), // brandAccent peach
              Color(0xFFFFC9BD), // peach medium
              Color(0xFFFFB5A7), // peach deeper
            ],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 36.0),
            child: Column(
              children: [
                const Spacer(flex: 3),

                // ── Logo ──────────────────────────────────────────────
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.45),
                    borderRadius: BorderRadius.circular(28),
                  ),
                  child: Image.asset(
                    'assets/images/logo.png',
                    height: size.height * 0.1,
                  ),
                ),
                const SizedBox(height: 28),

                // ── Brand Name ────────────────────────────────────────
                Text(
                  'Planora',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 42,
                    fontWeight: FontWeight.w700,
                    color: PlanoraColors.brandDark,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 12),

                // ── Tagline ───────────────────────────────────────────
                Text(
                  'Wujudkan Momen Terbaikmu\ndengan Vendor Pilihan.',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 15,
                    fontWeight: FontWeight.w400,
                    color: PlanoraColors.brandDark.withValues(alpha: 0.6),
                    height: 1.5,
                  ),
                  textAlign: TextAlign.center,
                ),

                const Spacer(flex: 4),

                // ── Tombol Masuk (Dark filled) ────────────────────────
                SizedBox(
                  width: double.infinity,
                  height: 54,
                  child: ElevatedButton(
                    onPressed: () => Navigator.pushNamed(context, '/login'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: PlanoraColors.brandDark,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: Text(
                      'Masuk',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                // ── Tombol Buat Akun (White outlined) ─────────────────
                SizedBox(
                  width: double.infinity,
                  height: 54,
                  child: OutlinedButton(
                    onPressed: () =>
                        Navigator.pushNamed(context, '/register'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: PlanoraColors.brandDark,
                      backgroundColor: Colors.white.withValues(alpha: 0.5),
                      side: BorderSide(
                        color: PlanoraColors.brandDark.withValues(alpha: 0.2),
                        width: 1.5,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: Text(
                      'Buat Akun',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 48),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
