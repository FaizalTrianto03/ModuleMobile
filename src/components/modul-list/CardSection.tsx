import { component$ } from "@qwik.dev/core";
import {
  generateSectionId,
  colorMap,
  shareSection,
} from "~/utils/component-utils";

interface CardItem {
  title: string;
  description: string;
  image?: string;
}

interface CardSectionProps {
  title: string;
  cards: CardItem[];
  columns?: 1 | 2 | 3;
  shared?: boolean;
  theme?: keyof typeof colorMap;
}

export const CardSection = component$<CardSectionProps>(
  ({ title, cards, columns = 2, shared = false, theme = "orange" }) => {
    const id = generateSectionId(title, "cards");
    const tone = colorMap[theme] || "primary";
    const colClass = Math.min(columns, 3);

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

        <div class={`grid grid-cols-1 gap-6 md:grid-cols-${colClass}`}>
          {cards.map((card, index) => (
            <div
              key={index}
              class={`card bg-base-100 border-base-300 border hover:border-${tone} shadow-sm hover:shadow`}
            >
              {card.image && (
                <figure class="h-48 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    class="h-full w-full object-cover"
                    width="400"
                    height="192"
                  />
                </figure>
              )}
              <div class="card-body">
                <h3 class="card-title">{card.title}</h3>
                <p class="opacity-80">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  },
);
