import { component$ } from "@qwik.dev/core";
import { PostCard } from "../card/PostCard";
import { PUBLISHED_POSTS } from "../../constants/posts";

interface PostListProps {
  length?: number;
}

export const PostList = component$(
  ({ length = PUBLISHED_POSTS.length }: PostListProps) => {
    return (
      <div class="container mx-auto mt-12">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PUBLISHED_POSTS.slice(0, length).map((post) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              description={post.description}
              date={post.date}
            />
          ))}
        </div>
      </div>
    );
  },
);
