import { component$ } from "@qwik.dev/core";
import { useLocation } from "@qwik.dev/router";
import { ModuleRenderer } from "~/components/modul-list";

export default component$(() => {
  const location = useLocation();
  const modulId = location.params.id;

  // Path ke file JSON modul
  const jsonPath = `/data/modul-${modulId}.json`;

  return (
    <div class="container mx-auto px-4 py-6">
      <div class="mb-6">
        <h1 class="text-3xl font-bold">Modul {modulId}</h1>
        <p class="mt-2 text-lg opacity-70">
          Sistem komponen Qwik yang menggantikan component.js
        </p>
      </div>

      <ModuleRenderer jsonPath={jsonPath} />
    </div>
  );
});
