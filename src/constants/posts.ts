/**
 * Represents a blog post.
 */
export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
}

/**
 * This is a list of published blog posts. These will appear on the /blog/<slug> route.
 * The slug _MUST_ match the filename of the post in the `src/routes/blog` directory.
 *
 * Take frontmatter from the post markdown file to use here once the post is ready.
 * This leads to duplication, but it's necessary as far as I know at this point.
 * I have not found a straightforward way to load the markdown files with a dynamic path.
 */
export const PUBLISHED_POSTS: Readonly<Post[]> = [
  {
    slug: "build-a-theme-toggle-in-qwik-pt-two",
    title: "Build a Dark Mode Theme Toggle with Qwik and Tailwind CSS, Part 2",
    description:
      "Learn how to build a dark mode theme toggle component using the Qwik frontend framework and Tailwind CSS. Part 2.",
    date: "2024-06-07",
  },
  {
    slug: "build-a-theme-toggle-in-qwik-pt-one",
    title: "Build a Dark Mode Theme Toggle with Qwik and Tailwind CSS, Part 1",
    description:
      "Learn how to build a dark mode theme toggle component using the Qwik frontend framework and Tailwind CSS.",
    date: "2024-05-31",
  },
  {
    slug: "creating-a-blog-with-qwik",
    title: "Creating a Personal Blog Website with Qwik",
    description:
      "Learn how to create a personal blog website using the Qwik frontend framework.",
    date: "2024-05-20",
  },
];
