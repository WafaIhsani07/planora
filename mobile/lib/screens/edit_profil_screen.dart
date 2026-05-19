import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../main.dart' show PlanoraColors, PlanoraSnackBar;

class EditProfilScreen extends StatefulWidget {
  const EditProfilScreen({super.key});

  @override
  State<EditProfilScreen> createState() => _EditProfilScreenState();
}

class _EditProfilScreenState extends State<EditProfilScreen> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();

  bool _isLoading = true;
  bool _isSaving = false;
  String? _email;
  String? _selectedAvatarUrl;

  @override
  void initState() {
    super.initState();
    _loadCurrentProfile();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  // Tarik data profil saat ini untuk prefill form
  Future<void> _loadCurrentProfile() async {
    final result = await ApiService.getProfile();
    if (!mounted) return;
    setState(() {
      if (result['success'] == true) {
        final data = result['data'] as Map<String, dynamic>? ?? {};
        _nameController.text = data['name'] ?? '';
        _phoneController.text = data['phone'] ?? data['phoneNumber'] ?? '';
        _email = data['email'] ?? '';
        _selectedAvatarUrl = data['avatar']?.toString();
      }
      _isLoading = false;
    });
  }

  void _showAvatarPicker() {
    final List<String> avatars = [
      'https://api.dicebear.com/7.x/lorelei/png?seed=John',
      'https://api.dicebear.com/7.x/lorelei/png?seed=Sasha',
      'https://api.dicebear.com/7.x/lorelei/png?seed=Leo',
      'https://api.dicebear.com/7.x/lorelei/png?seed=Maria',
      'https://api.dicebear.com/7.x/lorelei/png?seed=Max',
      'https://api.dicebear.com/7.x/lorelei/png?seed=Luna',
    ];

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: const BoxDecoration(
            color: PlanoraColors.surface,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(32),
              topRight: Radius.circular(32),
            ),
          ),
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 48,
                height: 5,
                decoration: BoxDecoration(
                  color: PlanoraColors.divider,
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'Pilih Avatar Keren Kamu ✨',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: PlanoraColors.brandDark,
                    ),
              ),
              const SizedBox(height: 8),
              Text(
                'Ekspresikan dirimu dengan avatar pilihan!',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: PlanoraColors.brandGray,
                    ),
              ),
              const SizedBox(height: 24),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                ),
                itemCount: avatars.length,
                itemBuilder: (context, index) {
                  final url = avatars[index];
                  final isSelected = _selectedAvatarUrl == url;
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedAvatarUrl = url;
                      });
                      Navigator.pop(context);
                    },
                    child: Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: isSelected
                              ? PlanoraColors.brandAccent
                              : PlanoraColors.divider,
                          width: isSelected ? 3 : 1.5,
                        ),
                        color: PlanoraColors.divider.withAlpha(20),
                      ),
                      padding: const EdgeInsets.all(4),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(40),
                        child: Image.network(
                          url,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => const Icon(
                            Icons.person_rounded,
                            color: PlanoraColors.brandGray,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  // T12: Simpan perubahan profil via ApiService.updateProfile()
  Future<void> _saveProfile() async {
    final name = _nameController.text.trim();
    final phone = _phoneController.text.trim();

    if (name.isEmpty) {
      PlanoraSnackBar.show(
        context,
        message: 'Nama tidak boleh kosong.',
        isError: true,
      );
      return;
    }

    setState(() => _isSaving = true);

    final result = await ApiService.updateProfile(name, phone, avatar: _selectedAvatarUrl);

    if (!mounted) return;
    setState(() => _isSaving = false);

    if (result['success'] == true) {
      PlanoraSnackBar.show(
        context,
        message: 'Profil berhasil diperbarui!',
      );
      // Pop dengan membawa data baru supaya profil screen bisa refresh
      Navigator.pop(context, {'name': name, 'phone': phone, 'avatar': _selectedAvatarUrl});
    } else {
      PlanoraSnackBar.show(
        context,
        message: result['message'] ?? 'Gagal memperbarui profil.',
        isError: true,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: PlanoraColors.background,
      appBar: AppBar(
        title: const Text('Edit Profil'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                   // ── Avatar placeholder ────────────────────────────────
                  Center(
                    child: GestureDetector(
                      onTap: _showAvatarPicker,
                      behavior: HitTestBehavior.opaque,
                      child: Stack(
                        children: [
                          Container(
                            width: 100,
                            height: 100,
                            decoration: const BoxDecoration(
                              shape: BoxShape.circle,
                              color: PlanoraColors.brandAccent,
                            ),
                            child: _selectedAvatarUrl != null &&
                                    _selectedAvatarUrl!.isNotEmpty
                                ? ClipRRect(
                                    borderRadius: BorderRadius.circular(50),
                                    child: Image.network(
                                      _selectedAvatarUrl!,
                                      width: 100,
                                      height: 100,
                                      fit: BoxFit.cover,
                                      errorBuilder: (_, __, ___) => const Icon(
                                        Icons.person_rounded,
                                        size: 52,
                                        color: PlanoraColors.brandDark,
                                      ),
                                    ),
                                  )
                                : const Icon(
                                    Icons.person_rounded,
                                    size: 52,
                                    color: PlanoraColors.brandDark,
                                  ),
                          ),
                          Positioned(
                            bottom: 0, right: 0,
                            child: Container(
                              padding: const EdgeInsets.all(7),
                              decoration: const BoxDecoration(
                                color: PlanoraColors.brandDark,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.camera_alt_rounded,
                                size: 16,
                                color: PlanoraColors.background,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 28),

                  // ── Form Card ─────────────────────────────────────────
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: PlanoraColors.surface,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: PlanoraColors.divider),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Email (read-only)
                        if (_email != null && _email!.isNotEmpty) ...[
                          Text('EMAIL',
                              style: tt.labelSmall?.copyWith(letterSpacing: 0.8)),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 14),
                            decoration: BoxDecoration(
                              color: PlanoraColors.divider.withAlpha(60),
                              borderRadius: BorderRadius.circular(28),
                              border: Border.all(color: PlanoraColors.divider),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.email_outlined,
                                    color: PlanoraColors.brandGray, size: 18),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Text(_email!,
                                      style: tt.bodyMedium?.copyWith(
                                          color: PlanoraColors.brandGray)),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 20),
                        ],

                        // Nama
                        Text('NAMA LENGKAP',
                            style: tt.labelSmall?.copyWith(letterSpacing: 0.8)),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _nameController,
                          textCapitalization: TextCapitalization.words,
                          decoration: const InputDecoration(
                            hintText: 'Masukkan nama lengkap',
                            prefixIcon: Icon(Icons.person_outline_rounded),
                          ),
                        ),
                        const SizedBox(height: 20),

                        // No. Telepon
                        Text('NOMOR TELEPON',
                            style: tt.labelSmall?.copyWith(letterSpacing: 0.8)),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _phoneController,
                          keyboardType: TextInputType.phone,
                          decoration: const InputDecoration(
                            hintText: 'Masukkan nomor telepon',
                            prefixIcon: Icon(Icons.phone_outlined),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 28),

                  // ── Tombol Simpan ──────────────────────────────────────
                  ElevatedButton(
                    onPressed: _isSaving ? null : _saveProfile,
                    child: _isSaving
                        ? const SizedBox(
                            width: 22, height: 22,
                            child: CircularProgressIndicator(
                              strokeWidth: 2.5,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                  PlanoraColors.brandDark),
                            ))
                        : const Text('Simpan Perubahan'),
                  ),
                ],
              ),
            ),
    );
  }
}
