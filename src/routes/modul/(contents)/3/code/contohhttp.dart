import 'package:http/http.dart' as http;
import 'dart:convert';

Future<List<dynamic>> fetchCountries() async {
  final url = Uri.parse('https://restcountries.com/v3.1/all?fields=name');
  final response = await http.get(url);

  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  } else {
    throw Exception('Gagal memuat data negara. Kode: ${response.statusCode}');
  }
}
