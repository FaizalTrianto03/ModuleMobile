import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class AssetDemoPage extends StatelessWidget {
  const AssetDemoPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Demo Aset Adaptif')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Ikon PNG:'),
            const SizedBox(height: 10),
            Image.asset('assets/images/logo.png', width: 120),
            const SizedBox(height: 30),
            const Text('Ikon SVG:'),
            const SizedBox(height: 10),
            SvgPicture.asset(
              'assets/icons/flutter_logo.svg',
              width: 120,
              semanticsLabel: 'Flutter Logo',
            ),
          ],
        ),
      ),
    );
  }
}
