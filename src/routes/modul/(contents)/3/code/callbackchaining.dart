void main() {
  print('Memulai...');
  fetchMessage().then((data) {
    print(data);
  }).catchError((error) {
    print('Error: $error');
  });
}
