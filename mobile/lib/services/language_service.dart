import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/translations.dart';

class LanguageService {
  static final ValueNotifier<String> currentLangNotifier = ValueNotifier<String>('en');

  static Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    final lang = prefs.getString('app_language') ?? 'en';
    setLanguage(lang);
  }

  static Future<void> setLanguage(String lang) async {
    Translations.currentLang = lang;
    currentLangNotifier.value = lang;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('app_language', lang);
  }
}
