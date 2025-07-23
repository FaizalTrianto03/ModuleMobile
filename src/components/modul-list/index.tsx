import { component$, useResource$, Resource } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";
import { getAllModuls } from "~/utils/mdx";

export const ModulList = component$(() => {
  const modulsResource = useResource$(() => {
    return getAllModuls();
  });

  return (
    <Resource
      value={modulsResource}
      onPending={() => (
        <div class="flex items-center justify-center py-12">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      )}
      onResolved={(moduls) => (
        <div class="container mx-auto mt-12">
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {moduls.map((modul) => (
              <div
                key={modul.id}
                class="card bg-base-100 flex h-full flex-col shadow-xl"
              >
                <div class="card-body flex flex-col justify-between">
                  <div>
                    <h2 class="card-title mb-2">
                      {modul.frontmatter.title || `Modul ${modul.id}`}
                    </h2>
                    <p class="text-base-content/70 mb-4 text-sm">
                      {modul.frontmatter.description || ""}
                    </p>
                  </div>
                  <div class="mt-auto flex items-center justify-between">
                    {modul.frontmatter.date && (
                      <span class="badge badge-outline">
                        {modul.frontmatter.date}
                      </span>
                    )}
                    <Link
                      class="btn btn-primary btn-sm"
                      href={`/modul/${modul.id}`}
                      aria-label={`Buka Modul ${modul.frontmatter.title || modul.id}`}
                    >
                      Buka Modul
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
});
