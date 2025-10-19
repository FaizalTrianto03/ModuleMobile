Future<String> fetchMessage() async {
  await Future.delayed(Duration(seconds: 2));
  return 'Data berhasil diterima';
}
