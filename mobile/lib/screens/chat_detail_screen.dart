import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import '../services/api_service.dart';
import '../main.dart' show PlanoraColors;
import '../utils/translations.dart';

class ChatDetailScreen extends StatefulWidget {
  const ChatDetailScreen({super.key});

  @override
  State<ChatDetailScreen> createState() => _ChatDetailScreenState();
}

class _ChatDetailScreenState extends State<ChatDetailScreen> {
  final TextEditingController _msgController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  Map<String, dynamic>? _vendorData;
  String? _bookingId;
  String? _currentUserId;

  List<Map<String, dynamic>> _messages = [];
  bool _isLoading = true;
  bool _isSending = false;
  String? _error;

  // Polling interval
  // static const _pollInterval = Duration(seconds: 5);

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args != null && args is Map<String, dynamic>) {
      _vendorData = args;
      _bookingId = args['bookingId']?.toString();
      _loadCurrentUser();
      _fetchMessages();
    }
  }

  Future<void> _loadCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString('user_id');
    if (mounted) setState(() => _currentUserId = userId);
  }

  Future<void> _fetchMessages({bool silent = false}) async {
    if (_bookingId == null) {
      setState(() {
        _error = Translations.t('chatDetail.noBookingId');
        _isLoading = false;
      });
      return;
    }
    if (!silent) setState(() => _isLoading = true);
    final result = await ApiService.getMessages(_bookingId!);
    if (!mounted) return;
    setState(() {
      if (result['success'] == true) {
        final rawList = result['data'] as List<dynamic>;
        _messages = rawList.map((m) {
          final senderId = m['sender']?['id']?.toString() ?? m['senderId']?.toString() ?? '';
          final isMe = senderId == _currentUserId;
          return {
            'id': m['id'],
            'text': m['content'] ?? '',
            'isMe': isMe,
            'isRead': m['isRead'] ?? false,
            'senderId': senderId,
            'senderName': m['sender']?['name'] ?? 'Vendor',
            'time': _formatTime(m['createdAt']?.toString()),
          };
        }).toList();
        _error = null;
      } else {
        _error = result['message'] ?? Translations.t('chatDetail.failLoad');
      }
      _isLoading = false;
    });
    _scrollToBottom();
  }

  String _formatTime(String? rawDate) {
    if (rawDate == null) return '';
    try {
      final dt = DateTime.parse(rawDate).toLocal();
      return DateFormat('HH:mm').format(dt);
    } catch (_) {
      return '';
    }
  }

  Future<void> _sendMessage() async {
    final txt = _msgController.text.trim();
    if (txt.isEmpty || _bookingId == null || _isSending) return;

    _msgController.clear();
    setState(() => _isSending = true);

    final result = await ApiService.sendMessage(_bookingId!, txt);
    if (!mounted) return;

    if (result['success'] == true) {
      // Segera fetch ulang untuk memastikan konsisten dengan backend
      await _fetchMessages(silent: true);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(result['message'] ?? Translations.t('chatDetail.failSend')),
          backgroundColor: PlanoraColors.error,
        ),
      );
    }
    if (mounted) setState(() => _isSending = false);
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
  void dispose() {
    _msgController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;

    if (_vendorData == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Chat')),
        body: Center(child: Text(Translations.t('chatDetail.insufficientData'))),
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
                Text(
                  _bookingId != null ? 'Booking #${_bookingId!.substring(0, 6)}' : 'Chat',
                  style: tt.labelSmall?.copyWith(
                    color: PlanoraColors.brandGray,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          // Refresh manual
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: IconButton(
              icon: const Icon(Icons.refresh_rounded, color: PlanoraColors.brandGray),
              onPressed: () => _fetchMessages(silent: true),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // ── Info Bar ──────────────────────────────────────────────
          if (_bookingId != null)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: const BoxDecoration(
                color: PlanoraColors.brandAccent,
                border: Border(bottom: BorderSide(color: PlanoraColors.divider)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.lock_outline_rounded,
                      size: 13, color: PlanoraColors.brandDark),
                  const SizedBox(width: 8),
                  Text(Translations.t('chatDetail.encrypted'),
                      style: tt.labelSmall?.copyWith(color: PlanoraColors.brandDark)),
                ],
              ),
            ),

          // ── Area Pesan ──────────────────────────────────────────────
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _error != null && _messages.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.cloud_off_rounded,
                                size: 40, color: PlanoraColors.brandGray),
                            const SizedBox(height: 10),
                            Text(_error!, style: tt.bodySmall),
                            const SizedBox(height: 12),
                            ElevatedButton(
                              onPressed: _fetchMessages,
                              child: Text(Translations.t('chatDetail.tryAgain')),
                            ),
                          ],
                        ),
                      )
                    : _messages.isEmpty
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
                                Text('${Translations.t('chatDetail.startConversation')}$name',
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
                                isRead: m['isRead'] == true,
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
                        style: const TextStyle(
                          color: PlanoraColors.brandDark,
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                        ),
                        decoration: InputDecoration(
                          hintText: Translations.t('chatDetail.typeMessage'),
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
                    onTap: _isSending ? null : _sendMessage,
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      width: 44, height: 44,
                      decoration: BoxDecoration(
                        color: _isSending
                            ? PlanoraColors.brandGray
                            : PlanoraColors.brandDark,
                        shape: BoxShape.circle,
                      ),
                      child: _isSending
                          ? const Padding(
                              padding: EdgeInsets.all(10),
                              child: CircularProgressIndicator(
                                strokeWidth: 2.5,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                    PlanoraColors.background),
                              ),
                            )
                          : const Icon(Icons.send_rounded,
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
    required bool isRead,
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
          color: isMe ? PlanoraColors.brandDark : PlanoraColors.surface,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(18),
            topRight: const Radius.circular(18),
            bottomLeft: isMe ? const Radius.circular(18) : const Radius.circular(4),
            bottomRight: isMe ? const Radius.circular(4) : const Radius.circular(18),
          ),
          border: isMe ? null : Border.all(color: PlanoraColors.divider),
        ),
        child: Column(
          crossAxisAlignment:
              isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
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
                  Icon(
                    isRead ? Icons.done_all_rounded : Icons.done_rounded,
                    color: isRead
                        ? const Color(0xFF64B5F6)
                        : PlanoraColors.background.withAlpha(170),
                    size: 12,
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}
