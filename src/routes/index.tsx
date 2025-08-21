import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { ModulList } from "~/components/ModulList";

export default component$(() => {
  return (
    <div>
      <section class="hero bg-base-100 border-base-300 mb-8 flex items-center justify-center border-b shadow-none">
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
              <Link
                href="#modul-list"
                class="btn btn-primary btn-md border-base-300 border px-6 font-medium shadow-none"
              >
                Mulai Belajar
              </Link>
              <Link
                href="/modul"
                class="btn btn-outline btn-md border-base-300 border px-6 font-medium shadow-none"
              >
                Daftar Modul
              </Link>
            </div>
          </div>
          <div class="flex flex-1 items-center justify-center">
            <div class="bg-base-200 border-base-300 flex h-64 w-64 items-center justify-center border">
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
      {/* Hero Section */}
      <div
        id="modul-list"
        class="hero bg-base-100 border-base-300 mb-8 border-b"
      >
        <div class="hero-content flex-col text-center">
          <h1 class="mb-2 text-4xl font-bold tracking-tight">
            Daftar Modul Praktikum
          </h1>
          <p class="mx-auto max-w-xl text-base opacity-80">
            Pilih modul di bawah untuk mulai belajar.
          </p>
        </div>
      </div>
      {/* Grid Card List */}
      <ModulList />
    </div>
  );
});
