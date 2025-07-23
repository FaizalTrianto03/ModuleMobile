import { component$ } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";

const modules = [
  { id: 1, title: "Modul 1", desc: "Pengenalan & Setup Lingkungan Mobile" },
  { id: 2, title: "Modul 2", desc: "Dasar-dasar Pemrograman Mobile" },
  { id: 3, title: "Modul 3", desc: "UI/UX Mobile & Komponen Dasar" },
  { id: 4, title: "Modul 4", desc: "Networking & API di Mobile" },
  { id: 5, title: "Modul 5", desc: "State Management & Storage" },
  { id: 6, title: "Modul 6", desc: "Deployment & Testing Mobile App" },
];

export default component$(() => {
  return (
    <>
      <section class="hero bg-base-200 mb-8">
        <div class="hero-content text-center">
          <div class="mx-auto max-w-2xl">
            <h1 class="mb-4 text-5xl font-bold">Modul Praktikum Mobile</h1>
            <p class="mb-6 text-lg">
              Selamat datang di website resmi modul pembelajaran praktikum
              Laboratorium Informatika UMM. Pilih salah satu modul di bawah
              untuk memulai pembelajaran, atau kunjungi blog untuk materi
              tambahan.
            </p>
          </div>
        </div>
      </section>
      <div>
        <h2 class="mt-8 mb-6 text-center text-3xl font-bold">
          Daftar Modul Praktikum
        </h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((modul) => (
            <div class="card bg-base-100 shadow-xl" key={modul.id}>
              <div class="card-body flex flex-col justify-between">
                <h3 class="card-title">{modul.title}</h3>
                <p class="mb-4">{modul.desc}</p>
                <div class="card-actions justify-end">
                  <Link href={`/modul/${modul.id}`} class="btn btn-secondary">
                    Buka Modul
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
