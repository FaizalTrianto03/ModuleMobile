import { component$, useSignal, useTask$, $ } from "@qwik.dev/core";
import {
  generateSectionId,
  getFileName,
  colorMap,
  shareSection,
  copyToClipboard,
} from "~/utils/component-utils";

interface CodeProps {
  title?: string;
  description?: string;
  filePath: string;
  language?: string;
  shared?: boolean;
  theme?: keyof typeof colorMap;
}

export const Code = component$<CodeProps>(
  ({
    title,
    description,
    filePath,
    language = "javascript",
    shared = true,
    theme = "orange",
  }) => {
    const codeContent = useSignal<string>("Loading...");
    const isLoading = useSignal(true);
    const isFullscreen = useSignal(false);
    const tone = colorMap[theme] || "primary";
    const containerId = generateSectionId(
      title || getFileName(filePath),
      "code",
    );

    // Load code file content
    useTask$(async () => {
      try {
        let normalizedPath = filePath;
        if (normalizedPath.startsWith("./"))
          normalizedPath = normalizedPath.substring(2);
        if (
          !normalizedPath.startsWith("/") &&
          !normalizedPath.startsWith("http")
        ) {
          normalizedPath = "/" + normalizedPath;
        }

        const response = await fetch(normalizedPath);
        if (!response.ok)
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const content = await response.text();
        codeContent.value = content;
      } catch (error) {
        console.error(`Failed to read file: ${filePath}`, error);
        codeContent.value = `// Error: Could not load file ${getFileName(filePath)}\n// ${error instanceof Error ? error.message : "Unknown error"}`;
      } finally {
        isLoading.value = false;
      }
    });

    const downloadFile = $(() => {
      if (!filePath) return;
      let p = filePath.startsWith("./") ? filePath.substring(2) : filePath;
      if (!p.startsWith("/") && !p.startsWith("http")) p = "/" + p;

      const a = document.createElement("a");
      a.href = p;
      a.download = getFileName(filePath);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    const toggleFullscreen = $(() => {
      isFullscreen.value = !isFullscreen.value;
      if (isFullscreen.value) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
    });

    if (!filePath) {
      return (
        <div class="alert alert-error mb-6">
          filePath is required for code component
        </div>
      );
    }

    return (
      <div
        id={containerId}
        class={`card bg-base-100 border-base-300 mb-8 overflow-hidden border shadow ${
          isFullscreen.value ? "bg-base-100 fixed inset-0 overflow-auto" : ""
        }`}
      >
        <div class="card-body gap-2">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="card-title">{title || getFileName(filePath)}</h3>
              {description && <p class="text-sm opacity-70">{description}</p>}
            </div>
            {shared && (
              <button
                class={`btn btn-outline btn-${tone} btn-sm`}
                onClick$={() =>
                  shareSection(containerId, title || getFileName(filePath))
                }
              >
                <i class="fas fa-share-alt"></i>
              </button>
            )}
          </div>

          <div class="bg-base-200 rounded-box">
            <div class="border-base-300 flex items-center justify-between border-b px-3 py-2">
              <div class="flex items-center gap-2 text-sm opacity-70">
                <span class="kbd kbd-sm">{getFileName(filePath)}</span>
              </div>
              <div class="flex items-center gap-1">
                <button
                  class="btn btn-ghost btn-xs"
                  onClick$={downloadFile}
                  title="Download"
                >
                  <i class="fas fa-download"></i>
                </button>
                <button
                  class="btn btn-ghost btn-xs"
                  onClick$={() => copyToClipboard(codeContent.value)}
                  title="Copy"
                >
                  <i class="fas fa-copy"></i>
                </button>
                <button
                  class="btn btn-ghost btn-xs"
                  onClick$={toggleFullscreen}
                  title={isFullscreen.value ? "Exit Fullscreen" : "Fullscreen"}
                >
                  <i
                    class={`fas fa-${isFullscreen.value ? "compress" : "expand"}`}
                  ></i>
                </button>
              </div>
            </div>

            {isLoading.value && (
              <div class="flex items-center gap-2 px-4 py-3">
                <span
                  class={`loading loading-spinner loading-sm text-${tone}`}
                ></span>
                <span class="text-sm opacity-70">Loading code...</span>
              </div>
            )}

            <div class="overflow-x-auto">
              <pre class="mockup-code !bg-base-200 !p-0">
                <code
                  class={`language-${language} block p-4`}
                  dangerouslySetInnerHTML={codeContent.value}
                />
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
