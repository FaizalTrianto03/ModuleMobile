import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    int counter = 0;

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text("Counter Stateless")),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text("Counter: $counter"),
              ElevatedButton(
                onPressed: () {
                  counter++;
                  print("Counter sekarang: $counter");
                },
                child: Text("Tambah"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
