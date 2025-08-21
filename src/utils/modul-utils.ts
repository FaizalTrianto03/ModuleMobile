export function getAllModulMeta() {
  // Pakai dua pola: lama dan baru (folder group '(contents)').
  // Penting: escape '(' dan ')' dengan backslash ganda di string TS.
  const modules: Record<string, any> = import.meta.glob(
    [
      "/src/routes/modul/*/index.mdx",
      "/src/routes/modul/\\(contents\\)/*/index.mdx",
    ],
    { eager: true },
  );

  const rx = /\/src\/routes\/modul\/(?:\(contents\)\/)?([^/]+)\/index\.mdx$/;

  return Object.entries(modules).map(([path, mod]) => {
    const match = rx.exec(path);
    const modulId = match ? match[1] : path;
    const title = mod.frontmatter?.title ?? mod.title ?? modulId;
    const description = mod.frontmatter?.description ?? mod.description ?? "";
    return { modulId, title, description };
  });
}
