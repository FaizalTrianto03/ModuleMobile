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
      <section class="hero bg-base-100 border-base-300 rounded-box mb-8 flex items-center justify-center border-b px-4 py-10 shadow-none">
        <div class="hero-content flex w-full max-w-4xl flex-col items-center gap-8 md:flex-row">
          <div class="flex flex-1 flex-col items-start text-left">
            <h1 class="text-base-content mb-3 text-4xl leading-tight font-bold md:text-5xl">
              Modul Praktikum Mobile
            </h1>
            <p class="text-base-content/70 mb-6 max-w-md text-base">
              Website resmi modul pembelajaran praktikum Laboratorium
              Informatika UMM.
              <br />
              Pilih modul di bawah untuk mulai belajar, atau kunjungi blog untuk
              materi tambahan.
            </p>
            <div class="mt-2 flex gap-3">
              <a
                href="#modul-list"
                class="btn btn-neutral btn-md border-base-300 rounded-lg border px-6 font-medium shadow-none"
              >
                Mulai Belajar
              </a>
              <a
                href="/blog"
                class="btn btn-outline btn-md border-base-300 rounded-lg border px-6 font-medium shadow-none"
              >
                Blog Materi
              </a>
            </div>
          </div>
          <div class="flex flex-1 items-center justify-center">
            <div class="bg-base-200 border-base-300 rounded-box flex h-64 w-64 items-center justify-center border">
              <svg
                width="96"
                height="96"
                fill="none"
                viewBox="0 0 96 96"
                class="text-base-content/40"
              >
                <rect
                  x="12"
                  y="24"
                  width="72"
                  height="48"
                  rx="12"
                  fill="currentColor"
                />
                <rect
                  x="28"
                  y="36"
                  width="40"
                  height="24"
                  rx="6"
                  fill="white"
                />
                <rect
                  x="40"
                  y="44"
                  width="16"
                  height="8"
                  rx="2"
                  fill="#e5e7eb"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
      <div>
        <h2 class="text-base-content bg-base-100 rounded-box mx-auto mt-8 mb-6 w-full max-w-xl pb-2 text-center text-2xl font-bold md:text-3xl">
          Daftar Modul Praktikum
        </h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3" id="modul-list">
          {modules.map((modul) => (
            <div
              class="card bg-base-100 border-base-300 rounded-box border"
              key={modul.id}
            >
              <div class="card-body flex flex-col justify-between">
                <h3 class="card-title text-base-content">{modul.title}</h3>
                <p class="text-base-content/70 mb-4">{modul.desc}</p>
                <div class="card-actions justify-end">
                  <Link
                    href={`/modul/${modul.id}`}
                    class="btn btn-neutral border-base-300 rounded-lg border shadow-none"
                  >
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
