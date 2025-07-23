import { component$ } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";
import type { Post } from "~/constants/posts";

export const PostCard = component$(
  ({ title, slug, date, description }: Post) => {
    return (
      <div class="card bg-base-100 h-full shadow-xl">
        <div class="card-body flex flex-col justify-between">
          <div>
            <h2 class="card-title mb-2">{title}</h2>
            <p class="text-base-content/70 mb-4 text-sm">{description}</p>
          </div>
          <div class="mt-auto flex items-center justify-between">
            <span class="badge badge-outline">
              {new Date(date).toLocaleDateString()}
            </span>
            <Link
              class="btn btn-primary btn-sm"
              href={`/blog/${slug}`}
              aria-label={`Read article: ${title}`}
            >
              Read article
            </Link>
          </div>
        </div>
      </div>
    );
  },
);
