import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import '../main.dart' show PlanoraColors;

// ─── Data Admin Bypass (Hardcoded untuk Demo) ─────────────────────────────
const String _kBypassEmail    = 'adminplanora@gmail.com';
const String _kBypassPassword = 'planora';
const String _kBypassName     = 'Admin Planora';
const String _kBypassPhone    = '0895619465026';
const String _kBypassToken    = 'bypass_admin_token_planora_2024';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _isPasswordVisible = false;
  bool _isLoading = false;

  // Controller untuk menangkap teks input
  final TextEditingController _emailController    = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  // ── Bypass Login (Demo Mode) ────────────────────────────────────────────
  // Langsung masuk tanpa backend, simpan token dummy ke SharedPreferences
  Future<void> _handleBypassLogin() async {
    // Auto-fill field agar terlihat natural
    setState(() {
      _emailController.text    = _kBypassEmail;
      _passwordController.text = _kBypassPassword;
      _isLoading = true;
    });

    // Simpan token bypass & data profil admin ke SharedPreferences
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('access_token', _kBypassToken);
    await prefs.setString('bypass_name',  _kBypassName);
    await prefs.setString('bypass_email', _kBypassEmail);
    await prefs.setString('bypass_phone', _kBypassPhone);

    // Simulasi loading singkat agar terasa natural
    await Future.delayed(const Duration(milliseconds: 800));

    if (!mounted) return;
    setState(() => _isLoading = false);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('✅ Login berhasil! Selamat datang, Admin Planora')),
    );
    Navigator.pushReplacementNamed(context, '/home');
  }

  // ── Login Normal via Backend ────────────────────────────────────────────
  Future<void> _handleLogin() async {
    final email    = _emailController.text.trim();
    final password = _passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Email dan password wajib diisi')),
      );
      return;
    }

    // Cek apakah kredensial cocok dengan bypass admin
    if (email == _kBypassEmail && password == _kBypassPassword) {
      await _handleBypassLogin();
      return;
    }

    setState(() => _isLoading = true);

    final result = await ApiService.login(email, password);

    if (!mounted) return;

    setState(() => _isLoading = false);

    if (result['success'] == true) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Login berhasil!')),
      );
      Navigator.pushReplacementNamed(context, '/home');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'] ?? 'Login gagal')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: PlanoraColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 28.0, vertical: 48.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // ── Avatar Profil ────────────────────────────────────────
              Center(
                child: Container(
                  width: 96,
                  height: 96,
                  decoration: const BoxDecoration(
                    color: PlanoraColors.brandAccent,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.person_outline_rounded,
                    size: 48,
                    color: PlanoraColors.brandDark,
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // ── Heading ──────────────────────────────────────────────
              Text(
                'Selamat Datang',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 28,
                  fontWeight: FontWeight.w700,
                  color: PlanoraColors.brandDark,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Silakan masuk ke akun Anda',
                style: tt.bodyMedium?.copyWith(color: PlanoraColors.brandGray),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),

              // ── Input Email ──────────────────────────────────────────
              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(
                  hintText: 'Email',
                  prefixIcon: Icon(Icons.email_outlined),
                ),
              ),
              const SizedBox(height: 16),

              // ── Input Password ───────────────────────────────────────
              TextFormField(
                controller: _passwordController,
                obscureText: !_isPasswordVisible,
                decoration: InputDecoration(
                  hintText: 'Password',
                  prefixIcon: const Icon(Icons.lock_outline_rounded),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _isPasswordVisible
                          ? Icons.visibility_rounded
                          : Icons.visibility_off_rounded,
                    ),
                    onPressed: () => setState(
                        () => _isPasswordVisible = !_isPasswordVisible),
                  ),
                ),
              ),
              const SizedBox(height: 36),

              // ── Tombol Masuk ─────────────────────────────────────────
              ElevatedButton(
                onPressed: _isLoading ? null : _handleLogin,
                child: _isLoading
                    ? const SizedBox(
                        width: 22,
                        height: 22,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.5,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            PlanoraColors.brandDark,
                          ),
                        ),
                      )
                    : const Text('Masuk'),
              ),
              const SizedBox(height: 16),

              // ── Bypass Button (Demo Mode) ─────────────────────────────
              // Tombol khusus presentasi — langsung masuk sebagai Admin Planora
              OutlinedButton.icon(
                onPressed: _isLoading ? null : _handleBypassLogin,
                icon: const Icon(Icons.flash_on_rounded, size: 18),
                label: const Text('Masuk sebagai Admin (Demo)'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: PlanoraColors.brandDark,
                  side: const BorderSide(
                    color: PlanoraColors.brandAccent,
                    width: 1.5,
                  ),
                  backgroundColor: PlanoraColors.brandAccent,
                  minimumSize: const Size(double.infinity, 52),
                  shape: const RoundedRectangleBorder(
                    borderRadius: BorderRadius.all(Radius.circular(32)),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // ── Link ke Register ─────────────────────────────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Belum punya akun? ',
                    style: tt.bodySmall?.copyWith(
                      color: PlanoraColors.brandGray,
                    ),
                  ),
                  GestureDetector(
                    onTap: () => Navigator.pushNamed(context, '/register'),
                    child: Text(
                      'Daftar di sini',
                      style: tt.bodySmall?.copyWith(
                        color: PlanoraColors.brandDark,
                        fontWeight: FontWeight.w600,
                        decoration: TextDecoration.underline,
                        decorationColor: PlanoraColors.brandDark,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // ── Info Bypass Credentials ───────────────────────────────
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: PlanoraColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: PlanoraColors.divider),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.info_outline_rounded,
                            size: 14, color: PlanoraColors.brandGray),
                        const SizedBox(width: 6),
                        Text(
                          'Akun Demo',
                          style: tt.labelSmall?.copyWith(
                            color: PlanoraColors.brandGray,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Email : adminplanora@gmail.com',
                      style: tt.labelSmall?.copyWith(
                          color: PlanoraColors.brandGray),
                    ),
                    Text(
                      'Password : planora',
                      style: tt.labelSmall?.copyWith(
                          color: PlanoraColors.brandGray),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
