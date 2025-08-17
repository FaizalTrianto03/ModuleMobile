import { component$ } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";

export default component$(() => {
  const modules = [
    {
      id: 1,
      title: "Pengenalan React Native",
      description: "Dasar-dasar React Native dan setup environment",
    },
    {
      id: 2,
      title: "Components & Navigation",
      description: "Membuat komponen dan navigasi antar halaman",
    },
    {
      id: 3,
      title: "State Management",
      description: "Mengelola state aplikasi dengan hooks dan context",
    },
    {
      id: 4,
      title: "API Integration",
      description: "Integrasi dengan REST API dan data fetching",
    },
    {
      id: 5,
      title: "Native Modules",
      description: "Menggunakan native modules dan device features",
    },
    {
      id: 6,
      title: "Testing & Deployment",
      description: "Testing aplikasi dan deployment ke app stores",
    },
  ];

  return (
    <>
      <section class="hero bg-base-200 mb-8 min-h-[30vh]">
        <div class="hero-content text-center">
          <div class="max-w-2xl">
            <h1 class="mb-4 text-5xl font-bold">Daftar Modul Praktikum</h1>
            <p class="mb-6 text-lg">
              Pilih modul praktikum mobile yang tersedia di bawah ini. Setiap
              modul berisi materi, tugas, dan sumber belajar interaktif.
            </p>
          </div>
        </div>
      </section>

      <div class="container mx-auto px-4">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <div
              key={module.id}
              class="card bg-base-100 border-base-300 border shadow-sm transition-shadow hover:shadow-md"
            >
              <div class="card-body">
                <h2 class="card-title text-xl">{module.title}</h2>
                <p class="mb-4 opacity-80">{module.description}</p>
                <div class="card-actions justify-end">
                  <Link href={`/modul/${module.id}`} class="btn btn-primary">
                    Mulai Belajar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
});
