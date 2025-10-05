import 'package:flutter/material.dart';

class ResponsiveCatalogInteractive extends StatefulWidget {
  const ResponsiveCatalogInteractive({super.key});

  @override
  State<ResponsiveCatalogInteractive> createState() =>
      _ResponsiveCatalogInteractiveState();
}

class _ResponsiveCatalogInteractiveState
    extends State<ResponsiveCatalogInteractive> {
  double _itemSpacing = 16.0;
  double _scaleFactor = 1.0;

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final int crossAxisCount = screenWidth >= 800
        ? 4
        : screenWidth >= 600
            ? 3
            : 2;

    final double cardAspectRatio = 0.8 * _scaleFactor;

    return Scaffold(
      appBar: AppBar(title: const Text('Katalog Responsif (Interaktif)')),
      body: Column(
        children: [
          Expanded(
            child: GridView.builder(
              padding: EdgeInsets.all(_itemSpacing),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: crossAxisCount,
                crossAxisSpacing: _itemSpacing,
                mainAxisSpacing: _itemSpacing,
                childAspectRatio: cardAspectRatio,
              ),
              itemCount: 12,
              itemBuilder: (context, index) {
                return Card(
                  elevation: 3,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.shopping_bag_outlined,
                          size: 48, color: Colors.grey),
                      const SizedBox(height: 8),
                      Text('Produk ${index + 1}',
                          style: const TextStyle(fontWeight: FontWeight.bold)),
                    ],
                  ),
                );
              },
            ),
          ),
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.grey[50],
            child: Column(
              children: [
                Text('Jarak antar item: ${_itemSpacing.toStringAsFixed(1)}'),
                Slider(
                  value: _itemSpacing,
                  min: 8,
                  max: 32,
                  divisions: 6,
                  label: '${_itemSpacing.toStringAsFixed(1)}',
                  onChanged: (value) =>
                      setState(() => _itemSpacing = value),
                ),
                const SizedBox(height: 8),
                ElevatedButton.icon(
                  onPressed: () {
                    setState(() {
                      _scaleFactor =
                          _scaleFactor == 1.0 ? 1.2 : 1.0; // toggle skala
                    });
                  },
                  icon: const Icon(Icons.aspect_ratio),
                  label: const Text('Ubah Skala Kartu'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
