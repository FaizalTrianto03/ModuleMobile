import { component$ } from "@qwik.dev/core";
import { ModulList } from "~/components/ModulList";

export default component$(() => {
  return (
    <div class="min-h-screen">
      {/* Hero Section */}
      <div class="hero bg-base-100 border-base-300 mb-8 border-b">
        <div class="hero-content flex-col text-center">
          <h1 class="mb-2 text-4xl font-bold tracking-tight">Modul List</h1>
          <p class="mx-auto max-w-xl text-base opacity-80">
            Explore all learning modules. Each module is presented in a clean
            bordered card. Click "Open" to view the details.
          </p>
        </div>
      </div>
      {/* Grid Card List */}
      <ModulList />
    </div>
  );
});
