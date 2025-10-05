import 'package:flutter/material.dart';

class ModularProductGrid extends StatelessWidget {
  final int itemCount;

  const ModularProductGrid({super.key, this.itemCount = 12});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final maxWidth = constraints.maxWidth;

        final int crossAxisCount;
        if (maxWidth >= 700) {
          crossAxisCount = 4;
        } else if (maxWidth >= 500) {
          crossAxisCount = 3;
        } else {
          crossAxisCount = 2;
        }

        final spacing = 12.0;

        return GridView.builder(
          padding: EdgeInsets.all(spacing),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            crossAxisSpacing: spacing,
            mainAxisSpacing: spacing,
          ),
          itemCount: itemCount,
          itemBuilder: (context, index) {
            return Container(
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(10),
              ),
              child: Center(
                child: Text(
                  'Item ${index + 1}',
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
              ),
            );
          },
        );
      },
    );
  }
}

class LayoutBuilderDemoPage extends StatelessWidget {
  const LayoutBuilderDemoPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Demo LayoutBuilder')),
      body: Row(
        children: [
          Container(
            width: 250,
            color: Colors.grey[300],
            child: const ModularProductGrid(itemCount: 8),
          ),
          const Expanded(child: ModularProductGrid(itemCount: 16)),
        ],
      ),
    );
  }
}
