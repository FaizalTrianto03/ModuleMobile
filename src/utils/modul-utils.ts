export function getAllModulMeta() {
  const modules: Record<string, any> = import.meta.glob(
    "/src/routes/modul/*/index.mdx",
    { eager: true },
  );
  return Object.entries(modules).map(([path, mod]) => {
    const match = RegExp(/\/src\/routes\/modul\/([^/]+)\/index\.mdx$/).exec(
      path,
    );
    const modulId = match ? match[1] : path;
    const title = mod.frontmatter?.title || mod.title;
    const description = mod.frontmatter?.description || mod.description;
    return { modulId, title, description };
  });
}
