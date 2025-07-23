import { component$, Slot } from "@qwik.dev/core";
import { useDocumentHead } from "@qwik.dev/router";

export default component$(() => {
  const head = useDocumentHead();

  return (
    <article class="prose bg-base-100 dark:prose-invert mx-auto mt-8 max-w-3xl rounded-xl p-8 shadow-xl">
      <header class="mb-6">
        <h1 class="mb-2 text-4xl font-bold">{head.title}</h1>
        {head.frontmatter?.date && (
          <span class="badge badge-outline">{head.frontmatter.date}</span>
        )}
      </header>
      <section>
        <Slot />
      </section>
    </article>
  );
});
