import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
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

// ============================================================
// PLANORA DESIGN SYSTEM — Color Palette (Single Source of Truth)
// ============================================================
class PlanoraColors {
  PlanoraColors._();

  /// Primary background — clean white
  static const Color background = Color(0xFFFFFFFF);

  /// Brand dark — main headings & body text
  static const Color brandDark = Color(0xFF2C2D2A);

  /// Brand accent — primary buttons, highlights (peach soft)
  static const Color brandAccent = Color(0xFFFFDED7);

  /// Brand accent hover — pressed/selected state
  static const Color brandAccentHover = Color(0xFFF8D8D3);

  /// Brand gray — secondary text, subtitles, hints
  static const Color brandGray = Color(0xFFA8A8A8);

  /// Surface — card backgrounds (off-white, subtle)
  static const Color surface = Color(0xFFFAF9F8);

  /// Divider / stroke
  static const Color divider = Color(0xFFEEECE9);

  /// Error
  static const Color error = Color(0xFFD94F4F);
}

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Status bar menyesuaikan warna terang (ikon gelap di atas background putih)
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      statusBarBrightness: Brightness.light,
    ),
  );

  runApp(const PlanoraApp());
}

class PlanoraApp extends StatelessWidget {
  const PlanoraApp({super.key});

  @override
  Widget build(BuildContext context) {
    // ── Base TextTheme: Plus Jakarta Sans ──────────────────────────────────
    final TextTheme baseTextTheme = GoogleFonts.plusJakartaSansTextTheme(
      const TextTheme(
        // Display
        displayLarge: TextStyle(
          fontSize: 32,
          fontWeight: FontWeight.w700,
          color: PlanoraColors.brandDark,
          letterSpacing: -0.5,
        ),
        displayMedium: TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.w700,
          color: PlanoraColors.brandDark,
          letterSpacing: -0.3,
        ),
        displaySmall: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.w700,
          color: PlanoraColors.brandDark,
        ),
        // Headline
        headlineLarge: TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          color: PlanoraColors.brandDark,
        ),
        headlineMedium: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: PlanoraColors.brandDark,
        ),
        headlineSmall: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: PlanoraColors.brandDark,
        ),
        // Title
        titleLarge: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: PlanoraColors.brandDark,
        ),
        titleMedium: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: PlanoraColors.brandDark,
        ),
        titleSmall: TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.w500,
          color: PlanoraColors.brandDark,
        ),
        // Body
        bodyLarge: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w400,
          color: PlanoraColors.brandDark,
        ),
        bodyMedium: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: PlanoraColors.brandDark,
        ),
        bodySmall: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w400,
          color: PlanoraColors.brandGray,
        ),
        // Label
        labelLarge: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: PlanoraColors.brandDark,
          letterSpacing: 0.1,
        ),
        labelMedium: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: PlanoraColors.brandDark,
        ),
        labelSmall: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w400,
          color: PlanoraColors.brandGray,
        ),
      ),
    );

    // ── ColorScheme (M3 compatible) ────────────────────────────────────────
    const ColorScheme colorScheme = ColorScheme(
      brightness: Brightness.light,
      primary: PlanoraColors.brandAccent,
      onPrimary: PlanoraColors.brandDark,
      primaryContainer: PlanoraColors.brandAccentHover,
      onPrimaryContainer: PlanoraColors.brandDark,
      secondary: PlanoraColors.brandGray,
      onSecondary: PlanoraColors.background,
      secondaryContainer: PlanoraColors.divider,
      onSecondaryContainer: PlanoraColors.brandDark,
      error: PlanoraColors.error,
      onError: PlanoraColors.background,
      errorContainer: Color(0xFFFFDAD6),
      onErrorContainer: PlanoraColors.brandDark,
      surface: PlanoraColors.surface,
      onSurface: PlanoraColors.brandDark,
      surfaceContainerHighest: PlanoraColors.divider,
      onSurfaceVariant: PlanoraColors.brandGray,
      outline: PlanoraColors.divider,
      outlineVariant: PlanoraColors.divider,
      shadow: PlanoraColors.brandDark,
      inverseSurface: PlanoraColors.brandDark,
      onInverseSurface: PlanoraColors.background,
      inversePrimary: PlanoraColors.brandAccentHover,
    );

    // ── Shape: border radius 32 (setara 2rem di web) ──────────────────────
    const double kRadius = 32.0;
    const RoundedRectangleBorder kShape = RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(kRadius)),
    );

    return MaterialApp(
      title: 'Planora',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: colorScheme,
        scaffoldBackgroundColor: PlanoraColors.background,
        textTheme: baseTextTheme,

        // ── AppBar ──────────────────────────────────────────────────────────
        appBarTheme: AppBarTheme(
          backgroundColor: PlanoraColors.background,
          foregroundColor: PlanoraColors.brandDark,
          elevation: 0,
          scrolledUnderElevation: 0.5,
          shadowColor: PlanoraColors.divider,
          centerTitle: true,
          titleTextStyle: GoogleFonts.plusJakartaSans(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: PlanoraColors.brandDark,
          ),
          iconTheme: const IconThemeData(color: PlanoraColors.brandDark),
          systemOverlayStyle: SystemUiOverlayStyle.dark,
        ),

        // ── ElevatedButton (Primary CTA) ────────────────────────────────────
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: PlanoraColors.brandAccent,
            foregroundColor: PlanoraColors.brandDark,
            disabledBackgroundColor: PlanoraColors.divider,
            disabledForegroundColor: PlanoraColors.brandGray,
            elevation: 0,
            shadowColor: Colors.transparent,
            shape: kShape,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            minimumSize: const Size(double.infinity, 52),
            textStyle: GoogleFonts.plusJakartaSans(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.2,
            ),
          ).copyWith(
            overlayColor: WidgetStateProperty.resolveWith<Color?>(
              (states) => states.contains(WidgetState.pressed)
                  ? PlanoraColors.brandAccentHover
                  : null,
            ),
          ),
        ),

        // ── OutlinedButton (Secondary CTA) ─────────────────────────────────
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            foregroundColor: PlanoraColors.brandDark,
            side: const BorderSide(color: PlanoraColors.divider, width: 1.5),
            shape: kShape,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            minimumSize: const Size(double.infinity, 52),
            textStyle: GoogleFonts.plusJakartaSans(
              fontSize: 15,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),

        // ── TextButton ──────────────────────────────────────────────────────
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: PlanoraColors.brandDark,
            textStyle: GoogleFonts.plusJakartaSans(
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),

        // ── Card ────────────────────────────────────────────────────────────
        cardTheme: CardThemeData(
          color: PlanoraColors.surface,
          elevation: 0,
          shadowColor: Colors.transparent,
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(kRadius)),
            side: BorderSide(color: PlanoraColors.divider, width: 1),
          ),
          margin: const EdgeInsets.symmetric(horizontal: 0, vertical: 0),
        ),

        // ── Input / TextField ───────────────────────────────────────────────
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: PlanoraColors.surface,
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(kRadius),
            borderSide: const BorderSide(color: PlanoraColors.divider),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(kRadius),
            borderSide: const BorderSide(color: PlanoraColors.divider),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(kRadius),
            borderSide:
                const BorderSide(color: PlanoraColors.brandAccent, width: 2),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(kRadius),
            borderSide: const BorderSide(color: PlanoraColors.error),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(kRadius),
            borderSide:
                const BorderSide(color: PlanoraColors.error, width: 2),
          ),
          hintStyle: GoogleFonts.plusJakartaSans(
            fontSize: 14,
            color: PlanoraColors.brandGray,
            fontWeight: FontWeight.w400,
          ),
          labelStyle: GoogleFonts.plusJakartaSans(
            fontSize: 14,
            color: PlanoraColors.brandGray,
          ),
          floatingLabelStyle: GoogleFonts.plusJakartaSans(
            fontSize: 12,
            color: PlanoraColors.brandDark,
            fontWeight: FontWeight.w500,
          ),
          prefixIconColor: PlanoraColors.brandGray,
          suffixIconColor: PlanoraColors.brandGray,
        ),

        // ── BottomNavigationBar ─────────────────────────────────────────────
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: PlanoraColors.background,
          selectedItemColor: PlanoraColors.brandDark,
          unselectedItemColor: PlanoraColors.brandGray,
          elevation: 0,
          type: BottomNavigationBarType.fixed,
          showSelectedLabels: true,
          showUnselectedLabels: true,
        ),

        // ── NavigationBar (M3) ──────────────────────────────────────────────
        navigationBarTheme: NavigationBarThemeData(
          backgroundColor: PlanoraColors.background,
          indicatorColor: PlanoraColors.brandAccent,
          labelTextStyle: WidgetStateProperty.resolveWith<TextStyle?>(
            (states) => GoogleFonts.plusJakartaSans(
              fontSize: 11,
              fontWeight: states.contains(WidgetState.selected)
                  ? FontWeight.w600
                  : FontWeight.w400,
              color: states.contains(WidgetState.selected)
                  ? PlanoraColors.brandDark
                  : PlanoraColors.brandGray,
            ),
          ),
          iconTheme: WidgetStateProperty.resolveWith<IconThemeData?>(
            (states) => IconThemeData(
              color: states.contains(WidgetState.selected)
                  ? PlanoraColors.brandDark
                  : PlanoraColors.brandGray,
              size: 24,
            ),
          ),
          elevation: 0,
        ),

        // ── Divider ─────────────────────────────────────────────────────────
        dividerTheme: const DividerThemeData(
          color: PlanoraColors.divider,
          thickness: 1,
          space: 1,
        ),

        // ── CircularProgressIndicator ───────────────────────────────────────
        progressIndicatorTheme: const ProgressIndicatorThemeData(
          color: PlanoraColors.brandDark,
        ),

        // ── Chip ─────────────────────────────────────────────────────────────
        chipTheme: ChipThemeData(
          backgroundColor: PlanoraColors.surface,
          selectedColor: PlanoraColors.brandAccent,
          labelStyle: GoogleFonts.plusJakartaSans(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: PlanoraColors.brandDark,
          ),
          side: const BorderSide(color: PlanoraColors.divider),
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(20)),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        ),

        // ── SnackBar ─────────────────────────────────────────────────────────
        snackBarTheme: SnackBarThemeData(
          backgroundColor: PlanoraColors.brandDark,
          contentTextStyle: GoogleFonts.plusJakartaSans(
            fontSize: 13,
            color: PlanoraColors.background,
          ),
          behavior: SnackBarBehavior.floating,
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(16)),
          ),
        ),

        // ── Dialog ───────────────────────────────────────────────────────────
        dialogTheme: const DialogThemeData(
          backgroundColor: PlanoraColors.background,
          elevation: 0,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(kRadius)),
          ),
        ),

        // ── ListTile ─────────────────────────────────────────────────────────
        listTileTheme: const ListTileThemeData(
          iconColor: PlanoraColors.brandGray,
          textColor: PlanoraColors.brandDark,
          contentPadding: EdgeInsets.symmetric(horizontal: 20, vertical: 4),
        ),

        // ── FloatingActionButton ──────────────────────────────────────────────
        floatingActionButtonTheme: const FloatingActionButtonThemeData(
          backgroundColor: PlanoraColors.brandAccent,
          foregroundColor: PlanoraColors.brandDark,
          elevation: 2,
          shape: CircleBorder(),
        ),
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
