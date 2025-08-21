import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { getAllModulMeta } from "~/utils/modul-utils";

export const ModulList = component$(() => {
  const moduleList = getAllModulMeta();

  return (
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {moduleList.map(({ modulId, title, description }) => (
        <div
          key={modulId}
          class="card card-border bg-base-100 border-base-300 hover:border-primary/70 rounded-xl border transition-all"
        >
          <div class="card-body flex flex-col gap-2 p-5">
            <h2 class="mb-1 text-lg font-semibold">
              {title || `Module ${modulId}`}
            </h2>
            <div class="text-base-content/70 mb-2 flex-1 text-sm">
              {description ||
                "Click below to open this module and start learning."}
            </div>
            <div class="mt-auto flex justify-end">
              <Link
                href={`/modul/${modulId}`}
                class="btn btn-outline btn-primary btn-sm rounded-lg"
              >
                Open
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
