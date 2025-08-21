import { component$ } from "@builder.io/qwik";
import {
  generateSectionId,
  colorMap,
  shareSection,
} from "~/utils/component-utils";

interface MaterialProps {
  title: string;
  content: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  shared?: boolean;
  theme?: keyof typeof colorMap;
}

export const Material = component$<MaterialProps>(
  ({ title, content, level = "h2", shared = false, theme = "default" }) => {
    const id = generateSectionId(title, "material");
    const tone = colorMap[theme] || "primary";

    const headingClass =
      {
        h1: "text-3xl md:text-4xl font-bold",
        h2: "text-2xl md:text-3xl font-bold",
        h3: "text-xl md:text-2xl font-semibold",
        h4: "text-lg font-semibold",
        h5: "text-base font-semibold",
        h6: "text-sm font-semibold",
      }[level] || "text-2xl font-bold";

    return (
      <section id={id} class="mb-8 scroll-mt-20">
        <div class="mb-3 flex items-center justify-between">
          {level === "h1" && (
            <h1 class={`${headingClass} text-${tone}`}>{title}</h1>
          )}
          {level === "h2" && (
            <h2 class={`${headingClass} text-${tone}`}>{title}</h2>
          )}
          {level === "h3" && (
            <h3 class={`${headingClass} text-${tone}`}>{title}</h3>
          )}
          {level === "h4" && (
            <h4 class={`${headingClass} text-${tone}`}>{title}</h4>
          )}
          {level === "h5" && (
            <h5 class={`${headingClass} text-${tone}`}>{title}</h5>
          )}
          {level === "h6" && (
            <h6 class={`${headingClass} text-${tone}`}>{title}</h6>
          )}
          {shared && (
            <button
              class="btn btn-ghost btn-sm"
              onClick$={() => shareSection(id, title)}
              aria-label="Share section"
            >
              <i class="fas fa-share-alt"></i>
            </button>
          )}
        </div>
        <div
          class="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={content}
        />
      </section>
    );
  },
);
