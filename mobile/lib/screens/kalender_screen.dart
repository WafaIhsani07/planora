import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import '../services/api_service.dart';
import '../main.dart' show PlanoraColors;

class KalenderScreen extends StatefulWidget {
  const KalenderScreen({super.key});

  @override
  State<KalenderScreen> createState() => _KalenderScreenState();
}

class _KalenderScreenState extends State<KalenderScreen> {
  CalendarFormat _calendarFormat = CalendarFormat.month;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  Map<DateTime, List<dynamic>> _events = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _selectedDay = _focusedDay;
    _fetchEvents();
  }

  Future<void> _fetchEvents() async {
    final result = await ApiService.getBookings();
    if (!mounted) return;

    Map<DateTime, List<dynamic>> parsedEvents = {};
    if (result['success'] == true) {
      final data = (result['data'] as List?) ?? [];
      for (var order in data) {
        final rawDateStr = order['eventDate']?.toString() ?? order['date']?.toString();
        if (rawDateStr == null) continue;
        try {
          DateTime rawDate;
          if (rawDateStr.contains('/')) {
            final parts = rawDateStr.split('/');
            if (parts.length == 3) {
              rawDate = DateTime(
                int.parse(parts[2]), int.parse(parts[0]), int.parse(parts[1]));
            } else {
              rawDate = DateTime.parse(rawDateStr);
            }
          } else {
            rawDate = DateTime.parse(rawDateStr);
          }
          final date = DateTime.utc(rawDate.year, rawDate.month, rawDate.day);
          parsedEvents[date] = [...(parsedEvents[date] ?? []), order];
        } catch (_) {
          // Skip tanggal yang gagal di-parse
        }
      }
    }

    setState(() {
      _events = parsedEvents;
      _isLoading = false;
    });
  }

  List<dynamic> _getEventsForDay(DateTime day) {
    final normalizedDay = DateTime.utc(day.year, day.month, day.day);
    return _events[normalizedDay] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;
    final selectedEvents = _getEventsForDay(_selectedDay ?? _focusedDay);

    return Scaffold(
      backgroundColor: PlanoraColors.background,
      appBar: AppBar(
        title: const Text('Kalender Acara'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // ── TableCalendar ───────────────────────────────────
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                      decoration: BoxDecoration(
                        color: PlanoraColors.surface,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: PlanoraColors.divider),
                      ),
                      child: TableCalendar(
                        firstDay: DateTime.utc(2020, 10, 16),
                        lastDay: DateTime.utc(2030, 3, 14),
                        focusedDay: _focusedDay,
                        calendarFormat: _calendarFormat,
                        selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
                        onDaySelected: (selectedDay, focusedDay) {
                          if (!isSameDay(_selectedDay, selectedDay)) {
                            setState(() {
                              _selectedDay = selectedDay;
                              _focusedDay = focusedDay;
                            });
                          }
                        },
                        onFormatChanged: (format) {
                          if (_calendarFormat != format) {
                            setState(() => _calendarFormat = format);
                          }
                        },
                        onPageChanged: (focusedDay) => _focusedDay = focusedDay,
                        eventLoader: _getEventsForDay,
                        calendarStyle: CalendarStyle(
                          // Hari yang dipilih: brandDark
                          selectedDecoration: const BoxDecoration(
                            color: PlanoraColors.brandDark,
                            shape: BoxShape.circle,
                          ),
                          selectedTextStyle: const TextStyle(
                            color: PlanoraColors.background,
                            fontWeight: FontWeight.w700,
                          ),
                          // Hari ini: brandAccent
                          todayDecoration: const BoxDecoration(
                            color: PlanoraColors.brandAccent,
                            shape: BoxShape.circle,
                          ),
                          todayTextStyle: const TextStyle(
                            color: PlanoraColors.brandDark,
                            fontWeight: FontWeight.w700,
                          ),
                          // Marker event: brandDark dot
                          markerDecoration: BoxDecoration(
                            color: PlanoraColors.brandDark.withAlpha(160),
                            shape: BoxShape.circle,
                          ),
                          defaultTextStyle: const TextStyle(color: PlanoraColors.brandDark),
                          weekendTextStyle: const TextStyle(
                              color: PlanoraColors.brandGray),
                          outsideDaysVisible: false,
                        ),
                        headerStyle: const HeaderStyle(
                          formatButtonVisible: false,
                          titleCentered: true,
                          titleTextStyle: TextStyle(
                            color: PlanoraColors.brandDark,
                            fontWeight: FontWeight.w700,
                            fontSize: 16,
                          ),
                          leftChevronIcon: Icon(
                            Icons.chevron_left_rounded,
                            color: PlanoraColors.brandDark,
                          ),
                          rightChevronIcon: Icon(
                            Icons.chevron_right_rounded,
                            color: PlanoraColors.brandDark,
                          ),
                        ),
                        daysOfWeekStyle: const DaysOfWeekStyle(
                          weekdayStyle: TextStyle(
                            color: PlanoraColors.brandGray,
                            fontWeight: FontWeight.w600,
                            fontSize: 12,
                          ),
                          weekendStyle: TextStyle(
                            color: PlanoraColors.brandGray,
                            fontWeight: FontWeight.w600,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 28),

                    // ── Agenda Section ──────────────────────────────────
                    Text(
                      'Agenda Tanggal ${_selectedDay?.day ?? ""}',
                      style: tt.titleLarge,
                    ),
                    const SizedBox(height: 14),

                    selectedEvents.isEmpty
                        ? Container(
                            width: double.infinity,
                            padding: const EdgeInsets.symmetric(vertical: 28),
                            decoration: BoxDecoration(
                              color: PlanoraColors.surface,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: PlanoraColors.divider),
                            ),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.event_note_rounded,
                                    size: 36, color: PlanoraColors.brandGray),
                                const SizedBox(height: 10),
                                Text('Tidak ada agenda untuk tanggal ini.',
                                    style: tt.bodySmall),
                              ],
                            ),
                          )
                        : ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: selectedEvents.length,
                            itemBuilder: (context, index) =>
                                _buildAgendaCard(selectedEvents[index], tt),
                          ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildAgendaCard(dynamic event, TextTheme tt) {
    final vendorData = event['vendor'] ?? {};
    final layananData = event['layanan'] ?? {};
    final String title = vendorData['businessName'] ??
        vendorData['name'] ??
        layananData['namaLayanan'] ??
        'Acara';

    final avatar = vendorData['avatar']?.toString() ?? '';
    final String imageUrl = avatar.isNotEmpty
        ? (avatar.startsWith('http')
            ? avatar
            : 'http://10.0.2.2:5000/assets/$avatar')
        : 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=300&auto=format&fit=crop';

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: PlanoraColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: PlanoraColors.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(20),
              topRight: Radius.circular(20),
            ),
            child: Image.network(
              imageUrl,
              height: 140,
              width: double.infinity,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(
                height: 140,
                color: PlanoraColors.brandAccent,
                child: const Center(
                  child: Icon(Icons.image_outlined,
                      size: 40, color: PlanoraColors.brandDark),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: tt.titleMedium),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.schedule_rounded,
                        size: 14, color: PlanoraColors.brandGray),
                    const SizedBox(width: 6),
                    Text('Jadwal Mulai Persiapan (08:00 WIB)', style: tt.bodySmall),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
