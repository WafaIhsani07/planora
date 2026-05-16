import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../main.dart' show PlanoraColors;

class ChatDetailScreen extends StatefulWidget {
  const ChatDetailScreen({super.key});

  @override
  State<ChatDetailScreen> createState() => _ChatDetailScreenState();
}

class _ChatDetailScreenState extends State<ChatDetailScreen> {
  final TextEditingController _msgController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  Map<String, dynamic>? _vendorData;

  // Pesan disimpan secara lokal di session (belum ada endpoint backend)
  final List<Map<String, dynamic>> _messages = [];

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args != null && args is Map<String, dynamic>) {
      setState(() => _vendorData = args);
    }
  }

  @override
  void dispose() {
    _msgController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    final txt = _msgController.text.trim();
    if (txt.isEmpty) return;

    _msgController.clear();
    setState(() {
      _messages.add({
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'text': txt,
        'isMe': true,
        'time': DateFormat('HH:mm').format(DateTime.now()),
      });
    });
    _scrollToBottom();

    // Simulasi balasan vendor setelah 1 detik
    Future.delayed(const Duration(seconds: 1), () {
      if (!mounted) return;
      setState(() {
        _messages.add({
          'id': '${DateTime.now().millisecondsSinceEpoch}_reply',
          'text': 'Terima kasih atas pesannya! Kami akan segera merespons.',
          'isMe': false,
          'time': DateFormat('HH:mm').format(DateTime.now()),
        });
      });
      _scrollToBottom();
    });
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;

    if (_vendorData == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Chat')),
        body: const Center(child: Text('Data tidak memadai')),
      );
    }

    final name = _vendorData!['name'] ?? 'Vendor';
    final imageUrl = _vendorData!['imageUrl'] ?? '';

    return Scaffold(
      backgroundColor: PlanoraColors.background,
      appBar: AppBar(
        titleSpacing: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          children: [
            // Avatar vendor
            ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: imageUrl.isNotEmpty
                  ? Image.network(
                      imageUrl,
                      width: 38, height: 38,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => _buildAvatarFallback(name, tt),
                    )
                  : _buildAvatarFallback(name, tt),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name,
                    style: tt.titleSmall?.copyWith(color: PlanoraColors.brandDark)),
                const SizedBox(height: 1),
                Text('Online',
                    style: tt.labelSmall?.copyWith(
                      color: PlanoraColors.brandGray,
                      fontWeight: FontWeight.w600,
                    )),
              ],
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: IconButton(
              icon: const Icon(Icons.more_vert_rounded,
                  color: PlanoraColors.brandGray),
              onPressed: () {},
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // ── Banner Info ──────────────────────────────────────────────
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: const BoxDecoration(
              color: PlanoraColors.brandAccent,
              border: Border(bottom: BorderSide(color: PlanoraColors.divider)),
            ),
            child: Row(
              children: [
                const Icon(Icons.info_outline_rounded,
                    size: 14, color: PlanoraColors.brandDark),
                const SizedBox(width: 8),
                Text('Percakapan tersimpan sementara di sesi ini.',
                    style: tt.labelSmall?.copyWith(color: PlanoraColors.brandDark)),
              ],
            ),
          ),

          // ── Area Pesan ──────────────────────────────────────────────
          Expanded(
            child: _messages.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 64, height: 64,
                          decoration: const BoxDecoration(
                            color: PlanoraColors.brandAccent,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.chat_bubble_outline_rounded,
                              size: 30, color: PlanoraColors.brandDark),
                        ),
                        const SizedBox(height: 12),
                        Text('Mulai percakapan dengan $name',
                            style: tt.bodySmall),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    controller: _scrollController,
                    itemCount: _messages.length,
                    itemBuilder: (context, index) {
                      final m = _messages[index];
                      return _buildChatBubble(
                        text: m['text'],
                        time: m['time'],
                        isMe: m['isMe'] == true,
                        tt: tt,
                      );
                    },
                  ),
          ),

          // ── Input Bar ────────────────────────────────────────────────
          SafeArea(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: const BoxDecoration(
                color: PlanoraColors.background,
                border: Border(top: BorderSide(color: PlanoraColors.divider)),
              ),
              child: Row(
                children: [
                  // Tombol lampiran
                  Container(
                    width: 40, height: 40,
                    decoration: BoxDecoration(
                      color: PlanoraColors.surface,
                      shape: BoxShape.circle,
                      border: Border.all(color: PlanoraColors.divider),
                    ),
                    child: const Icon(Icons.add_rounded,
                        color: PlanoraColors.brandGray, size: 22),
                  ),
                  const SizedBox(width: 10),

                  // Input text
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: PlanoraColors.surface,
                        borderRadius: BorderRadius.circular(28),
                        border: Border.all(color: PlanoraColors.divider),
                      ),
                      child: TextField(
                        controller: _msgController,
                        onSubmitted: (_) => _sendMessage(),
                        style: TextStyle(
                          color: PlanoraColors.brandDark,
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                        ),
                        decoration: const InputDecoration(
                          hintText: 'Ketik pesan...',
                          border: InputBorder.none,
                          enabledBorder: InputBorder.none,
                          focusedBorder: InputBorder.none,
                          isDense: true,
                          contentPadding: EdgeInsets.symmetric(vertical: 12),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),

                  // Tombol kirim
                  GestureDetector(
                    onTap: _sendMessage,
                    child: Container(
                      width: 44, height: 44,
                      decoration: const BoxDecoration(
                        color: PlanoraColors.brandDark,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.send_rounded,
                          color: PlanoraColors.background, size: 20),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Fallback avatar saat gambar gagal dimuat
  Widget _buildAvatarFallback(String name, TextTheme tt) {
    return Container(
      width: 38, height: 38,
      decoration: const BoxDecoration(
        color: PlanoraColors.brandAccent,
      ),
      child: Center(
        child: Text(
          name.isNotEmpty ? name[0].toUpperCase() : 'V',
          style: tt.titleMedium?.copyWith(
            color: PlanoraColors.brandDark,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }

  Widget _buildChatBubble({
    required String text,
    required String time,
    required bool isMe,
    required TextTheme tt,
  }) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.75,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          // Bubble saya: brandDark; Bubble vendor: surface
          color: isMe ? PlanoraColors.brandDark : PlanoraColors.surface,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(18),
            topRight: const Radius.circular(18),
            bottomLeft: isMe ? const Radius.circular(18) : const Radius.circular(4),
            bottomRight: isMe ? const Radius.circular(4) : const Radius.circular(18),
          ),
          border: isMe
              ? null
              : Border.all(color: PlanoraColors.divider),
        ),
        child: Column(
          crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            Text(
              text,
              style: tt.bodyMedium?.copyWith(
                color: isMe ? PlanoraColors.background : PlanoraColors.brandDark,
              ),
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  time,
                  style: TextStyle(
                    fontSize: 10,
                    color: isMe
                        ? PlanoraColors.background.withAlpha(170)
                        : PlanoraColors.brandGray,
                  ),
                ),
                if (isMe) ...[
                  const SizedBox(width: 4),
                  Icon(Icons.done_all_rounded,
                      color: PlanoraColors.background.withAlpha(170), size: 12),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}
