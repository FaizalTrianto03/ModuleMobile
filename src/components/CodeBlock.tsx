import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";
import { MockupWindowCode } from "./MockupWindowCode";

/**
 * Komponen blok kode dengan syntax highlight PrismJS, style DaisyUI mockup-window, dan fitur copy.
 * Gunakan di MDX:
 * <CodeBlock code={`fvm flutter run`} language="bash" desc="Install Flutter" />
 */
interface CodeBlockProps {
  code: string;
  language?: string;
  desc?: string;
}

export const CodeBlock = component$<CodeBlockProps>(
  ({ code, language = "bash", desc }) => {
    const html = useSignal<string>("");
    const isCopied = useSignal<boolean>(false);
    const isLoading = useSignal<boolean>(false);

    useTask$(async ({ track }) => {
      track(() => code);
      track(() => language);

      // Dynamic import PrismJS core dan bahasa hanya di client
      const Prism =
        (await import("prismjs")).default || (await import("prismjs"));

      // Dynamic import bahasa PrismJS sesuai kebutuhan
      try {
        // @ts-expect-error: No types for dynamic PrismJS language import
        if (language === "bash") await import("prismjs/components/prism-bash");
        // @ts-expect-error: No types for dynamic PrismJS language import
        if (language === "dart") await import("prismjs/components/prism-dart");
        // @ts-expect-error: No types for dynamic PrismJS language import
        if (language === "yaml") await import("prismjs/components/prism-yaml");
        // @ts-expect-error: No types for dynamic PrismJS language import
        if (language === "powershell") await import("prismjs/components/prism-powershell");
        
        const lang = Prism.languages[language] || Prism.languages.bash;
        html.value = Prism.highlight(code, lang, language);
      } catch {
        // Fallback: tampilkan plain text jika gagal highlight
        html.value = code;
      }
    });

    const handleCopy = $(async () => {
      try {
        isLoading.value = true;
        await navigator.clipboard.writeText(code);
        isCopied.value = true;
        
        // Reset status setelah 2 detik
        setTimeout(() => {
          isCopied.value = false;
        }, 2000);
      } catch (error) {
        console.error("Failed to copy code:", error);
        // Fallback untuk browser yang tidak support clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        
        isCopied.value = true;
        setTimeout(() => {
          isCopied.value = false;
        }, 2000);
      } finally {
        isLoading.value = false;
      }
    });

    return (
      <MockupWindowCode desc={desc}>
        <div class="relative">
          {/* Copy Button */}
          <button
            type="button"
            onClick$={handleCopy}
            disabled={isLoading.value}
            class={`
              btn btn-ghost btn-sm absolute right-2 top-2 z-10
              transition-all duration-200 ease-in-out
              ${isCopied.value 
                ? "btn-success text-success-content" 
                : "text-base-content/60 hover:text-base-content hover:bg-base-300"
              }
              ${isLoading.value ? "loading" : ""}
            `}
            aria-label={isCopied.value ? "Kode berhasil disalin" : "Salin kode"}
          >
            {isLoading.value ? (
              <span class="loading loading-spinner loading-xs"></span>
            ) : isCopied.value ? (
              <>
                <svg 
                  class="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="hidden sm:inline ml-1">Tersalin</span>
              </>
            ) : (
              <>
                <svg 
                  class="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span class="hidden sm:inline ml-1">Salin</span>
              </>
            )}
          </button>

          {/* Code Content */}
          <pre class="m-0 -mt-2 border-0 bg-transparent p-0 pr-20">
            <code
              class={`language-${language}`}
              dangerouslySetInnerHTML={html.value}
            />
          </pre>
        </div>
      </MockupWindowCode>
    );
  },
);
