import { component$ } from "@qwik.dev/core";

// Import semua modul MDX dari src/contents
const modules = import.meta.glob("/contents/*/index.mdx", { eager: true });

export default component$(() => {
  const moduleList = Object.entries(modules);

  return (
    <div>
      <h1>Daftar Modul</h1>
      <ul>
        {moduleList.map(([path]) => {
          // Ambil modulId dari path
          const match = path.match(/\/src\/contents\/([^/]+)\/index\.mdx$/);
          const modulId = match ? match[1] : path;
          return (
            <li key={modulId}>
              <a href={`/modul/${modulId}`}>Modul {modulId}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
