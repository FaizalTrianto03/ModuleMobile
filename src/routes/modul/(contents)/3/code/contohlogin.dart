Future<bool> login(String username, String password) async {
  await Future.delayed(Duration(seconds: 2)); // simulasi waktu respon server
  return username == 'admin' && password == '1234';
}
