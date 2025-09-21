
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
          title: Text('Container Example'),
        ),
        body: Container(
          color: Colors.blue,
          width: 200,
          height: 100,
          child: Center(
            child: Text(
              'Hello, Container!',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ),
      ),
    );
  }
}