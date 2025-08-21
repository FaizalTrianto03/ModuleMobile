import { component$ } from "@builder.io/qwik";
import { generateSectionId, colorMap } from "~/utils/component-utils";

interface ModuleHeaderProps {
  title: string;
  moduleName: string;
  description?: string;
  theme?: keyof typeof colorMap;
}

export const ModuleHeader = component$<ModuleHeaderProps>(
  ({ title, moduleName, description, theme = "orange" }) => {
    const id = generateSectionId(title, "header");
    const badgeTone = colorMap[theme] || "primary";

    return (
      <section id={id} class="hero bg-base-200 rounded-box mb-8">
        <div class="hero-content text-center">
          <div class="max-w-3xl">
            <div class={`badge badge-${badgeTone} badge-lg mb-4`}>
              {moduleName}
            </div>
            <h1 class="text-4xl font-bold md:text-5xl">{title}</h1>
            {description && (
              <p class="mt-4 text-lg opacity-80">{description}</p>
            )}
          </div>
        </div>
      </section>
    );
  },
);
