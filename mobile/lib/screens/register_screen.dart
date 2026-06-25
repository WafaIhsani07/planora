import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';
import '../main.dart' show PlanoraColors;
import '../utils/translations.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  bool _isPasswordHidden = true;
  bool _isConfirmPasswordHidden = true;
  bool _isLoading = false;
  bool _agreeTerms = false;

  final TextEditingController _namaController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  @override
  void dispose() {
    _namaController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    final nama = _namaController.text.trim();
    final email = _emailController.text.trim();
    final phone = _phoneController.text.trim();
    final password = _passwordController.text;
    final confirmPassword = _confirmPasswordController.text;

    if (nama.isEmpty ||
        email.isEmpty ||
        phone.isEmpty ||
        password.isEmpty ||
        confirmPassword.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(Translations.t('register.allFieldsRequired'))),
      );
      return;
    }

    if (password != confirmPassword) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(Translations.t('register.passwordMismatch'))),
      );
      return;
    }

    if (!_agreeTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text(Translations.t('register.mustAgree'))),
      );
      return;
    }

    setState(() => _isLoading = true);

    final result = await ApiService.register(nama, email, password, phone);

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (result['success'] == true) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(Translations.t('register.success'))),
      );
      Navigator.pushReplacementNamed(context, '/login');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'] ?? Translations.t('register.fail'))),
      );
    }
  }

  // Helper: Build a labeled text field
  Widget _buildField({
    required String label,
    required TextEditingController controller,
    TextInputType keyboardType = TextInputType.text,
    bool obscureText = false,
    Widget? suffixIcon,
    String? hintText,
    TextCapitalization textCapitalization = TextCapitalization.none,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: PlanoraColors.brandDark,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          obscureText: obscureText,
          textCapitalization: textCapitalization,
          decoration: InputDecoration(
            hintText: hintText,
            filled: true,
            fillColor: PlanoraColors.surface,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: PlanoraColors.divider),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: PlanoraColors.divider),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide:
                  const BorderSide(color: PlanoraColors.brandDark, width: 1.5),
            ),
            suffixIcon: suffixIcon,
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: PlanoraColors.background,
      body: Column(
        children: [
          // ── Header bar berwarna brand ──────────────────────────────
          Container(
            width: double.infinity,
            padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top + 8,
              bottom: 16,
            ),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xFFFFDED7),
                  Color(0xFFFFC9BD),
                ],
              ),
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(32),
                bottomRight: Radius.circular(32),
              ),
            ),
          ),

          // ── Content ───────────────────────────────────────────────
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Back + Title row
                  Row(
                    children: [
                      GestureDetector(
                        onTap: () => Navigator.pop(context),
                        child: const Icon(
                          Icons.arrow_back_rounded,
                          color: PlanoraColors.brandDark,
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Text(
                        Translations.t('register.title'),
                        style: GoogleFonts.playfairDisplay(
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                          color: PlanoraColors.brandDark,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 28),

                  // ── Nama Lengkap ────────────────────────────────────
                  _buildField(
                    label: Translations.t('register.fullName'),
                    controller: _namaController,
                    hintText: Translations.t('register.nameHint'),
                    textCapitalization: TextCapitalization.words,
                  ),
                  const SizedBox(height: 18),

                  // ── Email ───────────────────────────────────────────
                  _buildField(
                    label: Translations.t('register.email'),
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    hintText: Translations.t('register.emailHint'),
                  ),
                  const SizedBox(height: 18),

                  // ── Phone Number ────────────────────────────────────
                  _buildField(
                    label: Translations.t('register.phone'),
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    hintText: Translations.t('register.phoneHint'),
                  ),
                  const SizedBox(height: 18),

                  // ── Password ────────────────────────────────────────
                  _buildField(
                    label: Translations.t('register.password'),
                    controller: _passwordController,
                    obscureText: _isPasswordHidden,
                    hintText: Translations.t('register.passwordHint'),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _isPasswordHidden
                            ? Icons.visibility_off_rounded
                            : Icons.visibility_rounded,
                        color: PlanoraColors.brandGray,
                        size: 20,
                      ),
                      onPressed: () => setState(
                          () => _isPasswordHidden = !_isPasswordHidden),
                    ),
                  ),
                  const SizedBox(height: 18),

                  // ── Konfirmasi Password ─────────────────────────────
                  _buildField(
                    label: Translations.t('register.confirmPassword'),
                    controller: _confirmPasswordController,
                    obscureText: _isConfirmPasswordHidden,
                    hintText: Translations.t('register.passwordHint'),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _isConfirmPasswordHidden
                            ? Icons.visibility_off_rounded
                            : Icons.visibility_rounded,
                        color: PlanoraColors.brandGray,
                        size: 20,
                      ),
                      onPressed: () => setState(() =>
                          _isConfirmPasswordHidden =
                              !_isConfirmPasswordHidden),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // ── Checkbox Syarat & Ketentuan ──────────────────────
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        width: 22,
                        height: 22,
                        child: Checkbox(
                          value: _agreeTerms,
                          onChanged: (val) =>
                              setState(() => _agreeTerms = val ?? false),
                          activeColor: PlanoraColors.brandAccent,
                          checkColor: PlanoraColors.brandDark,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(4),
                          ),
                          side: const BorderSide(
                            color: PlanoraColors.brandDark,
                            width: 1.5,
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text.rich(
                          TextSpan(
                            text: Translations.t('register.agreeText'),
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 12,
                              color: PlanoraColors.brandGray,
                            ),
                            children: [
                              TextSpan(
                                text: Translations.t('register.terms'),
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: PlanoraColors.brandDark,
                                  decoration: TextDecoration.underline,
                                ),
                              ),
                              TextSpan(
                                text: Translations.t('register.and'),
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 12,
                                  color: PlanoraColors.brandGray,
                                ),
                              ),
                              TextSpan(
                                text: Translations.t('register.privacy'),
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: PlanoraColors.brandDark,
                                  decoration: TextDecoration.underline,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 28),

                  // ── Tombol Buat Akun ─────────────────────────────────
                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _handleRegister,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: PlanoraColors.brandAccent,
                        foregroundColor: PlanoraColors.brandDark,
                        disabledBackgroundColor:
                            PlanoraColors.brandAccent.withValues(alpha: 0.5),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: _isLoading
                          ? const SizedBox(
                              width: 22,
                              height: 22,
                              child: CircularProgressIndicator(
                                strokeWidth: 2.5,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                    PlanoraColors.brandDark),
                              ),
                            )
                          : Text(
                              Translations.t('register.title'),
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // ── Link ke Login ────────────────────────────────────
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        Translations.t('register.haveAccount'),
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 13,
                          color: PlanoraColors.brandGray,
                        ),
                      ),
                      GestureDetector(
                        onTap: () =>
                            Navigator.pushReplacementNamed(context, '/login'),
                        child: Text(
                          Translations.t('register.signIn'),
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: PlanoraColors.brandDark,
                            decoration: TextDecoration.underline,
                            decorationColor: PlanoraColors.brandDark,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
