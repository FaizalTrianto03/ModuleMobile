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
      <section class="hero bg-base-100 border-b border-base-300 mb-8 rounded-box shadow-none py-10 px-4 flex items-center justify-center">
        <div class="hero-content flex flex-col md:flex-row items-center gap-8 w-full max-w-4xl">
          <div class="flex-1 flex flex-col items-start text-left">
            <h1 class="mb-3 text-4xl md:text-5xl font-bold text-base-content leading-tight">
              Modul Praktikum Mobile
            </h1>
            <p class="mb-6 text-base text-base-content/70 max-w-md">
              Website resmi modul pembelajaran praktikum Laboratorium Informatika UMM.<br />
              Pilih modul di bawah untuk mulai belajar, atau kunjungi blog untuk materi tambahan.
            </p>
            <div class="flex gap-3 mt-2">
              <a href="#modul-list" class="btn btn-neutral btn-md rounded-lg px-6 font-medium border border-base-300 shadow-none">
                Mulai Belajar
              </a>
              <a href="/blog" class="btn btn-outline btn-md rounded-lg px-6 font-medium border border-base-300 shadow-none">
                Blog Materi
              </a>
            </div>
          </div>
          <div class="flex-1 flex justify-center items-center">
            <div class="w-64 h-64 flex items-center justify-center bg-base-200 border border-base-300 rounded-box">
              <svg width="96" height="96" fill="none" viewBox="0 0 96 96" class="text-base-content/40">
                <rect x="12" y="24" width="72" height="48" rx="12" fill="currentColor" />
                <rect x="28" y="36" width="40" height="24" rx="6" fill="white" />
                <rect x="40" y="44" width="16" height="8" rx="2" fill="#e5e7eb" />
              </svg>
            </div>
          </div>
        </div>
      </section>
      <div>
        <h2 class="mt-8 mb-6 text-center text-2xl md:text-3xl font-bold text-base-content border-b border-base-300 pb-2 bg-base-100 rounded-box w-full max-w-xl mx-auto">
          Daftar Modul Praktikum
        </h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3" id="modul-list">
          {modules.map((modul) => (
            <div class="card bg-base-100 border border-base-300 rounded-box" key={modul.id}>
              <div class="card-body flex flex-col justify-between">
                <h3 class="card-title text-base-content">{modul.title}</h3>
                <p class="mb-4 text-base-content/70">{modul.desc}</p>
                <div class="card-actions justify-end">
                  <Link href={`/modul/${modul.id}`} class="btn btn-neutral border border-base-300 rounded-lg shadow-none">
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
