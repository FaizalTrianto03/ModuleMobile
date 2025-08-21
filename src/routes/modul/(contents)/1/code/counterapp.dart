
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'counter_state.dart';

class CounterApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Provider Example'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Consumer<CounterState>(
              builder: (context, counterState, child) {
                return Text(
                  'Counter: ${counterState.counter}',
                  style: TextStyle(fontSize: 24),
                );
              },
            ),
            ElevatedButton(
              onPressed: () {
                Provider.of<CounterState>(context, listen: false).increment();
              },
              child: Text('Increment'),
            ),
          ],
        ),
      ),
    );
  }
}