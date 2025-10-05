MaterialApp(
  theme: ThemeData.light().copyWith(
    colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
  ),
  darkTheme: ThemeData.dark().copyWith(
    colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
  ),
  themeMode: ThemeMode.system, // otomatis mengikuti sistem
  home: const HomePage(),
);
