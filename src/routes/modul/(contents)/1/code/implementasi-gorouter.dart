
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

void main() {
  final GoRouter router = GoRouter(
    routes: [
      GoRoute(path: '/', builder: (context, state) => HomePage()),
      GoRoute(path: '/detail', builder: (context, state) => DetailPage()),
    ],
  );
  runApp(MyApp(router: router));
}

class MyApp extends StatelessWidget {
  final GoRouter router;
  MyApp({required this.router});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(routerConfig: router);
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Halaman Utama")),
      body: Center(
        child: ElevatedButton(
          onPressed: () => context.go('/detail'),
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
          onPressed: () => context.go('/'),
          child: Text("Kembali"),
        ),
      ),
    );
  }
}
