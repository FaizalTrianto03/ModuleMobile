import 'package:flutter/material.dart';
import 'package:get/get.dart';

void main() {
  runApp(GetMaterialApp(
    home: HomePage(),
    getPages: [
      GetPage(name: '/', page: () => HomePage()),
      GetPage(name: '/detail', page: () => DetailPage()),
    ],
  ));
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Halaman Utama")),
      body: Center(
        child: ElevatedButton(
          onPressed: () => Get.toNamed('/detail'),
          child: Text("Ke Halaman Detail"),
        ),
      ),
    );
  }
}

class DetailPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Halaman Detail")),
      body: Center(
        child: ElevatedButton(
          onPressed: () => Get.back(),
          child: Text("Kembali"),
        ),
      ),
    );
  }
}
