import { component$ } from "@qwik.dev/core";
import { PostList } from "~/components/post-list";

export default component$(() => {
  return (
    <>
      <section class="hero bg-base-200 mb-8 min-h-[30vh]">
        <div class="container mx-auto">
          <div class="hero-content text-center">
            <div class="mx-auto max-w-2xl">
              <h1 class="mb-4 text-5xl font-bold">Blog Praktikum</h1>
              <p class="mb-6 text-lg">
                Temukan artikel, tips, dan materi tambahan seputar pemrograman
                mobile dan praktikum di laboratorium informatika.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div>
        <h2 class="mt-8 mb-6 text-center text-3xl font-bold">
          Artikel Terbaru
        </h2>
        <PostList />
      </div>
    </>
  );
});
