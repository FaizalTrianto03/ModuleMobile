import { component$, useResource$, Resource } from "@qwik.dev/core";
import { PostCard } from "../card/PostCard";
import { getAllBlogPosts } from "~/utils/mdx";

interface PostListProps {
  length?: number;
}

export const PostList = component$(({ length }: PostListProps) => {
  const postsResource = useResource$(() => {
    return getAllBlogPosts();
  });

  return (
    <Resource
      value={postsResource}
      onPending={() => (
        <div class="flex items-center justify-center py-12">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      )}
      onResolved={(posts) => (
        <div class="container mx-auto mt-12">
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, length ?? posts.length).map((post) => (
              <PostCard
                key={post.slug}
                slug={post.slug}
                title={post.frontmatter.title}
                description={post.frontmatter.description}
                date={post.frontmatter.date}
              />
            ))}
          </div>
        </div>
      )}
    />
  );
});
