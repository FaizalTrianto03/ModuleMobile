
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'counter_state.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => CounterState(),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: CounterApp(),
    );
  }
}