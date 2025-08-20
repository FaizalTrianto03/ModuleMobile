
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('Widget Tree Example'),
        ),
        body: Column(
          children: [
            Text('Parent Widget'),
            Row(
              children: [
                Text('Child Widget 1'),
                Text('Child Widget 2'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}