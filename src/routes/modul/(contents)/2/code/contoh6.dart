import 'package:flutter/material.dart';

class ProductCatalogPage extends StatefulWidget {
  const ProductCatalogPage({super.key});

  @override
  State<ProductCatalogPage> createState() => _ProductCatalogPageState();
}

class _ProductCatalogPageState extends State<ProductCatalogPage> {
  double _itemSpacing = 16.0;

  @override
  Widget build(BuildContext context) {
    final mediaQueryData = MediaQuery.of(context);
    final screenWidth = mediaQueryData.size.width;

    // Menentukan jumlah kolom grid berdasarkan breakpoint
    final int crossAxisCount;
    if (screenWidth >= 800) {
      crossAxisCount = 4;
    } else if (screenWidth >= 600) {
      crossAxisCount = 3;
    } else {
      crossAxisCount = 2;
    }

    // Menyesuaikan ukuran teks dan rasio kartu
    final double titleFontSize = screenWidth < 600 ? 14.0 : 18.0;
    const double cardAspectRatio = 0.8;

    return Scaffold(
      appBar: AppBar(title: const Text('Katalog Produk')),
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
              itemCount: 20,
              itemBuilder: (context, index) {
                return Card(
                  elevation: 3,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Expanded(
                        child: Container(
                          color: Colors.grey[200],
                          child: const Icon(Icons.shopping_bag_outlined,
                              size: 48, color: Colors.grey),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Text(
                          'Produk ${index + 1}',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: titleFontSize,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Text('Ubah Jarak Antar Item: ${_itemSpacing.toStringAsFixed(1)}'),
                Slider(
                  value: _itemSpacing,
                  min: 8.0,
                  max: 32.0,
                  divisions: 6,
                  label: _itemSpacing.toStringAsFixed(1),
                  onChanged: (value) => setState(() => _itemSpacing = value),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
