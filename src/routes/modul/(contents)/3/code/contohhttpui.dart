class CountryListPage extends StatelessWidget {
  const CountryListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Daftar Negara')),
      body: FutureBuilder(
        future: fetchCountries(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else {
            final data = snapshot.data as List<dynamic>;
            return ListView.builder(
              itemCount: data.length,
              itemBuilder: (context, index) {
                final name = data[index]['name'];
                return ListTile(
                  leading: const Icon(Icons.public),
                  title: Text(name['common']),
                  subtitle: Text(name['official']),
                );
              },
            );
          }
        },
      ),
    );
  }
}
