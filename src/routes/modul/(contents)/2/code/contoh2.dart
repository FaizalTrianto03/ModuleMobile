final media = MediaQuery.of(context);
final screenWidth = media.size.width;
final screenHeight = media.size.height;
final orientation = media.orientation;

return Scaffold(
  body: Center(
    child: Text(
      'Lebar layar: $screenWidth px\nOrientasi: $orientation',
      textAlign: TextAlign.center,
    ),
  ),
);
