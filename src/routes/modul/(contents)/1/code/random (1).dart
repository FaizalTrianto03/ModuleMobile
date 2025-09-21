
import 'dart:math';

String generateRandomString() {
  const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  Random random = Random();
  return List.generate(
    10,
    (index) => characters[random.nextInt(characters.length)],
  ).join();
}

int generateRandomNumber() {
  Random random = Random();
  return random.nextInt(100); // Angka random dari 0 hingga 99
}
