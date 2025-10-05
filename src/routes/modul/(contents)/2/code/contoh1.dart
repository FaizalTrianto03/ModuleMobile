// Contoh desain statis (tidak responsif)
Container(
  width: 300,
  height: 400,
  color: Colors.blue,
);

// Contoh desain responsif menggunakan MediaQuery
Container(
  width: MediaQuery.of(context).size.width * 0.8,
  height: MediaQuery.of(context).size.height * 0.5,
  color: Colors.blue,
);
