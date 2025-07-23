import { component$, useResource$, Resource } from "@qwik.dev/core";
import { useLocation } from "@qwik.dev/router";
import { getBlogPostBySlug } from "~/utils/mdx";
import BlogPostLayout from "./(posts)/layout";

export default component$(() => {
  const loc = useLocation();
  const slug = loc.params.slug;

  const postResource = useResource$<any>(async () => {
    return await getBlogPostBySlug(slug);
  });

  return (
    <Resource
      value={postResource}
      onPending={() => <div class="loading loading-spinner loading-lg"></div>}
      onResolved={(post) =>
        post ? (
          <BlogPostLayout>
            <post.content />
          </BlogPostLayout>
        ) : (
          <div class="alert alert-error mt-8">Post not found.</div>
        )
      }
    />
  );
});
