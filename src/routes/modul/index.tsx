import { component$ } from "@qwik.dev/core";
import { ModulList } from "~/components/modul-list";

export default component$(() => {
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
      <ModulList />
    </>
  );
});
