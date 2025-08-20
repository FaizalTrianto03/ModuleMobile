
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
          title: Text('Layout Practice'),
        ),
        body: Column(
          children: [
            Container(
              color: Colors.red,
              width: double.infinity,
              height: 100,
              child: Center(
                child: Text(
                  'Header',
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Container(
                  color: Colors.green,
                  width: 100,
                  height: 100,
                  child: Center(child: Text('Box 1')),
                ),
                Container(
                  color: Colors.blue,
                  width: 100,
                  height: 100,
                  child: Center(child: Text('Box 2')),
                ),
              ],
            ),
            Padding(
              padding: EdgeInsets.all(20.0),
              child: Text('Footer with padding'),
            ),
          ],
        ),
      ),
    );
  }
}