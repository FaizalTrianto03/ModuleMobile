import { component$ } from '@qwik.dev/core';
import { useLocation } from '@qwik.dev/router';

// Import semua modul MDX dari src/contents
const modules = import.meta.glob('/contents/*/index.mdx', { eager: true }) as Record<string, { default: any }>;

export default component$(() => {
  const loc = useLocation();
  const modulId = loc.params.modulId;
  const modulPath = `/contents/${modulId}/index.mdx`;
  const ModulComponent = modules[modulPath]?.default;

  if (!ModulComponent) {
    return <div>Modul <b>{modulId}</b> tidak ditemukan.</div>;
  }

  return (
    <div class="prose lg:prose-xl prose-neutral max-w-none">
      <ModulComponent />
    </div>
  );
});