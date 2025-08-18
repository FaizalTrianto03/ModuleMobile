import { component$ } from "@builder.io/qwik";

// Import semua modul MDX dari src/contents
const modules = import.meta.glob("/src/contents/*/index.mdx", { eager: true });

export default component$(() => {
  const moduleList = Object.entries(modules);

  return (
    <div class="bg-base-200 min-h-screen">
      {/* Hero Section */}
      <div class="hero bg-base-100 border-base-300 mb-8 border-b">
        <div class="hero-content flex-col px-4 py-10 text-center">
          <h1 class="mb-2 text-4xl font-bold tracking-tight">Modul List</h1>
          <p class="mx-auto max-w-xl text-base opacity-80">
            Explore all learning modules. Each module is presented in a clean
            bordered card. Click "Open" to view the details.
          </p>
        </div>
      </div>
      {/* Grid Card List */}
      <div class="container mx-auto px-2 md:px-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {moduleList.map(([path]) => {
            const match = path.match(/\/src\/contents\/([^/]+)\/index\.mdx$/);
            const modulId = match ? match[1] : path;
            return (
              <div
                key={modulId}
                class="card card-border bg-base-100 border-base-300 hover:border-primary/70 rounded-xl border transition-all"
              >
                <div class="card-body flex flex-col gap-2 p-5">
                  <h2 class="mb-1 text-lg font-semibold">Module {modulId}</h2>
                  <div class="text-base-content/70 mb-2 flex-1 text-sm">
                    Click below to open this module and start learning.
                  </div>
                  <div class="mt-auto flex justify-end">
                    <a
                      href={`/modul/${modulId}`}
                      class="btn btn-outline btn-primary btn-sm rounded-lg"
                    >
                      Open
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
