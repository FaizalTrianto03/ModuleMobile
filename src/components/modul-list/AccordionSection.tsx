import { component$ } from "@builder.io/qwik";
import {
  generateSectionId,
  colorMap,
  shareSection,
} from "~/utils/component-utils";

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionSectionProps {
  title: string;
  items: AccordionItem[];
  allowMultiple?: boolean;
  shared?: boolean;
  theme?: keyof typeof colorMap;
}

export const AccordionSection = component$<AccordionSectionProps>(
  ({
    title,
    items,
    allowMultiple = false,
    shared = false,
    theme = "orange",
  }) => {
    const id = generateSectionId(title, "accordion");
    const tone = colorMap[theme] || "primary";

    return (
      <section id={id} class="mb-8 scroll-mt-20">
        <div class="mb-4 flex items-center justify-between">
          <h2 class={`text-2xl font-bold text-${tone}`}>{title}</h2>
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

        <div class="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              class="collapse-arrow border-base-300 collapse border"
            >
              <input
                type="checkbox"
                name={allowMultiple ? undefined : "accordion"}
              />
              <div class="collapse-title font-medium">{item.title}</div>
              <div class="collapse-content">
                <div
                  class="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={item.content}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  },
);
