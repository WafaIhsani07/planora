class Formatters {
  static double parsePrice(dynamic value) {
    if (value == null) return 0.0;
    if (value is String) {
      return double.tryParse(value) ?? 0.0;
    }
    if (value is num) {
      return value.toDouble();
    }
    return 0.0;
  }
}
