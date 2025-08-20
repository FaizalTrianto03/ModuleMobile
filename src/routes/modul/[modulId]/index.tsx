import { component$, isDev } from "@qwik.dev/core";
import { useLocation } from "@qwik.dev/router";

// Import semua modul MDX dari src/contents
const modules: Record<string, any> = import.meta.glob(
  "/src/contents/*/index.mdx",
  {
    eager: !isDev,
  },
);

export default component$(() => {
  const loc = useLocation();
  const modulId = loc.params.modulId;
  const modulPath = `/src/contents/${modulId}/index.mdx`;
  const ModulComponent = modules[modulPath]?.default;

  if (!ModulComponent) {
    return (
      <div>
        Modul <b>{modulId}</b> tidak ditemukan.
      </div>
    );
  }

  return (
    <div class="prose prose-neutral w-full max-w-screen-lg">
      <ModulComponent />
    </div>
  );
});
