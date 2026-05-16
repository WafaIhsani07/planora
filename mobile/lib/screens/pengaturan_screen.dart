import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../main.dart' show PlanoraColors;

class PengaturanScreen extends StatefulWidget {
  const PengaturanScreen({super.key});

  @override
  State<PengaturanScreen> createState() => _PengaturanScreenState();
}

class _PengaturanScreenState extends State<PengaturanScreen> {
  bool _isLoggingOut = false;

  Future<void> _handleLogout() async {
    setState(() => _isLoggingOut = true);

    try {
      // Coba hit endpoint logout di server (opsional)
      await http.post(Uri.parse('http://10.0.2.2:5000/api/v1/auth/logout'));
      await Future.delayed(const Duration(seconds: 1));

      if (mounted) {
        Navigator.of(context)
            .pushNamedAndRemoveUntil('/login', (Route<dynamic> route) => false);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Gagal melakukan logout, coba lagi.')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoggingOut = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: PlanoraColors.background,
      appBar: AppBar(
        title: const Text('Pengaturan'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            children: [
              // ── Menu List ─────────────────────────────────────────────
              Container(
                decoration: BoxDecoration(
                  color: PlanoraColors.surface,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: PlanoraColors.divider),
                ),
                child: Column(
                  children: [
                    _buildSettingsTile(
                      icon: Icons.person_outline_rounded,
                      title: 'Edit Profil',
                      onTap: () => Navigator.pushNamed(context, '/edit_profil'),
                      tt: tt,
                    ),
                    _buildDivider(),
                    _buildSettingsTile(
                      icon: Icons.lock_outline_rounded,
                      title: 'Keamanan Akun',
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Fitur segera hadir.')),
                        );
                      },
                      tt: tt,
                    ),
                    _buildDivider(),
                    _buildSettingsTile(
                      icon: Icons.notifications_none_rounded,
                      title: 'Notifikasi',
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Fitur segera hadir.')),
                        );
                      },
                      tt: tt,
                    ),
                    _buildDivider(),
                    _buildSettingsTile(
                      icon: Icons.language_rounded,
                      title: 'Bahasa',
                      trailingText: 'ID',
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Fitur segera hadir.')),
                        );
                      },
                      tt: tt,
                    ),
                    _buildDivider(),
                    _buildSettingsTile(
                      icon: Icons.help_outline_rounded,
                      title: 'Pusat Bantuan',
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Fitur segera hadir.')),
                        );
                      },
                      tt: tt,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 28),

              // ── Tombol Logout ─────────────────────────────────────────
              OutlinedButton(
                onPressed: _isLoggingOut ? null : _handleLogout,
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: PlanoraColors.error, width: 1.5),
                  foregroundColor: PlanoraColors.error,
                  minimumSize: const Size(double.infinity, 52),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(32),
                  ),
                ),
                child: _isLoggingOut
                    ? SizedBox(
                        height: 22, width: 22,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.5,
                          valueColor: const AlwaysStoppedAnimation<Color>(
                              PlanoraColors.error),
                        ))
                    : const Text('Keluar Akun'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return const Padding(
      padding: EdgeInsets.symmetric(horizontal: 16),
      child: Divider(height: 1),
    );
  }

  Widget _buildSettingsTile({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    required TextTheme tt,
    String? trailingText,
  }) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
      leading: Container(
        width: 36, height: 36,
        decoration: const BoxDecoration(
          color: PlanoraColors.brandAccent,
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: PlanoraColors.brandDark, size: 18),
      ),
      title: Text(title, style: tt.titleSmall),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (trailingText != null) ...[
            Text(trailingText,
                style: tt.labelMedium?.copyWith(
                  color: PlanoraColors.brandDark,
                  fontWeight: FontWeight.w700,
                )),
            const SizedBox(width: 6),
          ],
          const Icon(Icons.chevron_right_rounded,
              color: PlanoraColors.brandGray, size: 20),
        ],
      ),
      onTap: onTap,
    );
  }
}
