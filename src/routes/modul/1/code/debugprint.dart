
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: ProfilingWidget(),
    );
  }
}

class ProfilingWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    debugPrint('ProfilingWidget is rebuilding!');
    return Scaffold(
      appBar: AppBar(
        title: Text('Profiling Example'),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            debugPrint('Button pressed!');
          },
          child: Text('Press Me'),
        ),
      ),
    );
  }
}