import { component$, useSignal, useTask$, $ } from "@qwik.dev/core";
import { ComponentRenderer, ComponentData } from "./ComponentRenderer";
import { showToast } from "~/utils/component-utils";

interface ModuleData {
  title?: string;
  description?: string;
  components: ComponentData[];
}

interface ModuleRendererProps {
  jsonPath: string;
  containerId?: string;
}

export const ModuleRenderer = component$<ModuleRendererProps>(
  ({ jsonPath, containerId = "module-root" }) => {
    const moduleData = useSignal<ModuleData | null>(null);
    const isLoading = useSignal(true);
    const error = useSignal<string | null>(null);

    // Load and render module
    useTask$(async () => {
      try {
        isLoading.value = true;
        error.value = null;

        await showToast("Loading module...", "info");

        const response = await fetch(jsonPath);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: ModuleData = await response.json();

        if (!data.components || !Array.isArray(data.components)) {
          throw new Error(
            "Invalid JSON structure: components array is required",
          );
        }

        moduleData.value = data;

        // Update document title and meta description
        if (data.title) {
          document.title = data.title;
        }
        if (data.description) {
          let meta = document.querySelector('meta[name="description"]');
          if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("name", "description");
            document.head.appendChild(meta);
          }
          meta.setAttribute("content", data.description);
        }

        await showToast("Content loaded!", "success");

        // Navigate to section if specified in URL
        navigateToSection();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        error.value = errorMessage;
        console.error("Failed to load module:", err);
        await showToast("Failed to load module", "error");
      } finally {
        isLoading.value = false;
      }
    });

    // Navigate to section from URL params
    const navigateToSection = $(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const sectionId = urlParams.get("section");
      if (!sectionId) return;

      const element = document.getElementById(sectionId);
      if (!element) return;

      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });

      // Highlight the section briefly
      element.classList.add("ring", "ring-primary");
      setTimeout(() => {
        element.classList.remove("ring", "ring-primary");
      }, 2000);
    });

    if (isLoading.value) {
      return (
        <div class="flex items-center justify-center py-12">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      );
    }

    if (error.value) {
      return (
        <div class="alert alert-error">
          <span>{error.value}</span>
        </div>
      );
    }

    if (!moduleData.value) {
      return null;
    }

    return (
      <div id={containerId}>
        {moduleData.value.components.map((component, index) => (
          <ComponentRenderer key={index} component={component} />
        ))}
      </div>
    );
  },
);
