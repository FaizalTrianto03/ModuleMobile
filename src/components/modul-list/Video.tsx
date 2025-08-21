import { component$ } from "@builder.io/qwik";
import {
  generateSectionId,
  colorMap,
  shareSection,
} from "~/utils/component-utils";

interface VideoProps {
  title: string;
  description?: string;
  videoId: string;
  shared?: boolean;
  theme?: keyof typeof colorMap;
}

export const Video = component$<VideoProps>(
  ({ title, description, videoId, shared = true, theme = "orange" }) => {
    const id = generateSectionId(title, "video");
    const tone = colorMap[theme] || "primary";

    return (
      <section id={id} class="mb-8 scroll-mt-20">
        <div class="mb-2 flex items-center justify-between">
          <h3 class={`text-xl font-semibold text-${tone}`}>{title}</h3>
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

        {description && <p class="mb-3 opacity-80">{description}</p>}

        <div class="card bg-base-100 border-base-300 overflow-hidden border shadow">
          <figure class="relative w-full" style="padding-bottom:56.25%">
            <iframe
              class="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullscreen
            />
          </figure>
        </div>
      </section>
    );
  },
);
