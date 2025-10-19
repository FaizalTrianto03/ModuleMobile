void handleLoginCallback() {
  print('Memproses login...');
  login('admin', '1234').then((success) {
    print(success ? 'Login berhasil!' : 'Login gagal!');
  }).catchError((e) {
    print('Terjadi error: $e');
  });
}