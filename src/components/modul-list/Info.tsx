import { component$ } from "@qwik.dev/core";
import { generateSectionId, shareSection } from "~/utils/component-utils";

interface InfoProps {
  title: string;
  content: string;
  type?: "default" | "primary" | "success" | "warning" | "error" | "navy";
  shared?: boolean;
}

export const Info = component$<InfoProps>(
  ({ title, content, shared = false }) => {
    const id = generateSectionId(title, "info");

    return (
      <div id={id} class="alert alert-info mb-6">
        <div>
          <span class="font-semibold">{title}</span>
          <div
            class="prose mt-1 max-w-none"
            dangerouslySetInnerHTML={content}
          />
        </div>
        {shared && (
          <div>
            <button
              class="btn btn-ghost btn-sm"
              onClick$={() => shareSection(id, title)}
              aria-label="Share section"
            >
              <i class="fas fa-share-alt"></i>
            </button>
          </div>
        )}
      </div>
    );
  },
);
