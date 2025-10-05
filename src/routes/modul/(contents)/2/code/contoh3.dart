LayoutBuilder(
  builder: (context, constraints) {
    final width = constraints.maxWidth;

    return Container(
      color: width > 600 ? Colors.green : Colors.orange,
      height: 100,
      child: Center(
        child: Text(
          width > 600 ? 'Tampilan Tablet' : 'Tampilan Ponsel',
          style: const TextStyle(color: Colors.white),
        ),
      ),
    );
  },
);
