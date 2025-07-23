/**
 * Utility for dynamic MDX content management.
 * Scans blog posts and modul modules, provides dynamic import by slug or id, and auto-indexes all content.
 */

export interface BlogPost {
  slug: string;
  content: any;
  frontmatter: Record<string, any>;
}

export interface Modul {
  id: string;
  content: any;
  frontmatter: Record<string, any>;
}

const blogPostImports = import.meta.glob("./routes/blog/(posts)/*/index.mdx", {
  eager: false,
});

const blogPostMetaImports = import.meta.glob(
  "./routes/blog/(posts)/*/index.mdx",
  { eager: true },
);

const modulImports = import.meta.glob("./routes/modul/(modules)/*/index.mdx", {
  eager: false,
});

const modulMetaImports = import.meta.glob(
  "./routes/modul/(modules)/*/index.mdx",
  { eager: true },
);

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  for (const path in blogPostImports) {
    const match = RegExp(/\/\(posts\)\/([^/]+)\/index\.mdx$/).exec(path);
    if (match && match[1] === slug) {
      const mod = await blogPostImports[path]();
      return {
        slug,
        content: (mod as any).default,
        frontmatter: (mod as any).frontmatter || {},
      };
    }
  }
  return null;
}

export async function getModulById(id: string): Promise<Modul | null> {
  for (const path in modulImports) {
    const match = RegExp(/\/\(modules\)\/([^/]+)\/index\.mdx$/).exec(path);
    if (match && match[1] === id) {
      const mod = await modulImports[path]();
      return {
        id,
        content: (mod as any).default,
        frontmatter: (mod as any).frontmatter || {},
      };
    }
  }
  return null;
}

export function getAllBlogPosts(): Array<{
  slug: string;
  frontmatter: Record<string, any>;
}> {
  const posts: Array<{ slug: string; frontmatter: Record<string, any> }> = [];
  for (const path in blogPostMetaImports) {
    const match = RegExp(/\/\(posts\)\/([^/]+)\/index\.mdx$/).exec(path);
    if (match) {
      const slug = match[1];
      const mod = blogPostMetaImports[path] as any;
      posts.push({
        slug,
        frontmatter: mod.frontmatter || {},
      });
    }
  }
  // Sort by date descending if available
  posts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date || 0).getTime();
    const dateB = new Date(b.frontmatter.date || 0).getTime();
    return dateB - dateA;
  });
  return posts;
}

export function getAllModuls(): Array<{
  id: string;
  frontmatter: Record<string, any>;
}> {
  const moduls: Array<{ id: string; frontmatter: Record<string, any> }> = [];
  for (const path in modulMetaImports) {
    const match = RegExp(/\/\(modules\)\/([^/]+)\/index\.mdx$/).exec(path);
    if (match) {
      const id = match[1];
      const mod = modulMetaImports[path] as any;
      moduls.push({
        id,
        frontmatter: mod.frontmatter || {},
      });
    }
  }
  // Sort by id (as number if possible)
  moduls.sort((a, b) => {
    const idA = parseInt(a.id, 10);
    const idB = parseInt(b.id, 10);
    if (!isNaN(idA) && !isNaN(idB)) {
      return idA - idB;
    }
    return a.id.localeCompare(b.id);
  });
  return moduls;
}
