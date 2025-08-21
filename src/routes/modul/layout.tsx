import { component$, Slot } from "@qwik.dev/core";
import { useDocumentHead } from "@qwik.dev/router";

export default component$(() => {
  const head = useDocumentHead();

  return (
    <article class="prose prose-neutral w-full max-w-screen-lg">
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
