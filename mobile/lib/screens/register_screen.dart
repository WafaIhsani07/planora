import 'package:flutter/material.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  bool _isPasswordHidden = true;

  // Controller untuk menangkap input pendaftaran
  final TextEditingController _namaController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void dispose() {
    _namaController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  // Logika bypass registrasi sementara
  void _handleRegister() {
    final nama = _namaController.text;

    // Tampilkan notifikasi simulasi penyimpanan
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Registrasi diproses untuk: ${nama.isEmpty ? "Pengguna Baru" : nama}',
        ),
      ),
    );

    // Navigasi paksa ke halaman login atau beranda
    Navigator.pushReplacementNamed(context, '/login');
  }

  // Fungsi bantuan untuk merender kolom isian agar seragam
  Widget _buildInputField({
    required String hintText,
    TextEditingController? controller,
    IconData? suffixIcon,
    bool isPassword = false,
    VoidCallback? onSuffixPressed,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: const Color(0xFFF9F9F9), // Latar belakang abu-abu terang
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE8E8E8)),
      ),
      child: TextField(
        controller: controller,
        obscureText: isPassword && _isPasswordHidden,
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: const TextStyle(
            color: Color(0xFFB0B0B0),
            fontSize: 14,
            fontWeight: FontWeight.normal,
          ),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 20,
            vertical: 18,
          ),
          suffixIcon: suffixIcon != null
              ? IconButton(
                  icon: Icon(suffixIcon, color: const Color(0xFFB0B0B0)),
                  onPressed: onSuffixPressed,
                )
              : null,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          // Memungkinkan halaman di-scroll jika keyboard muncul
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 40.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Elemen Avatar Profil
              Center(
                child: Stack(
                  alignment: Alignment.bottomRight,
                  children: [
                    const CircleAvatar(
                      radius: 50,
                      backgroundColor: Color(
                        0xFFF4DFD8,
                      ), // Warna krem sesuai desain
                      child: Icon(
                        Icons.person,
                        size: 50,
                        color: Color(0xFF7A6A58),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(2),
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.add_circle,
                        color: Color(0xFF4DB6AC),
                        size: 24,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              // Judul Utama Lapisan Form
              const Text(
                'Buat Akun Baru',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF7A6A58),
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              // Formulir Masukan Data
              _buildInputField(
                hintText: 'Nama Lengkap',
                controller: _namaController,
              ),
              _buildInputField(hintText: 'Tempat, Tanggal Lahir'),
              _buildInputField(hintText: 'Alamat'),
              _buildInputField(
                hintText: 'Domisili',
                suffixIcon: Icons.keyboard_arrow_down,
              ),
              _buildInputField(
                hintText: 'Password',
                controller: _passwordController,
                isPassword: true,
                suffixIcon: _isPasswordHidden
                    ? Icons.visibility
                    : Icons.visibility_off,
                onSuffixPressed: () {
                  setState(() {
                    _isPasswordHidden = !_isPasswordHidden;
                  });
                },
              ),
              const SizedBox(height: 24),
              // Tombol Eksekusi Pendaftaran
              SizedBox(
                width: double.infinity,
                height: 55,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(
                      0xFFA59B92,
                    ), // Warna tombol lebih pudar
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 0,
                  ),
                  onPressed: _handleRegister,
                  child: const Text(
                    'Daftar',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
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
