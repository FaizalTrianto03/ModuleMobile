import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { MockupWindowCode } from "./MockupWindowCode";

/**
 * Komponen blok kode dengan syntax highlight PrismJS dan style DaisyUI mockup-window.
 * Gunakan di MDX:
 * <CodeBlock code={`fvm flutter run`} language="bash" />
 */
interface CodeBlockProps {
  code: string;
  language?: string;
  desc?: string;
}

export const CodeBlock = component$<CodeBlockProps>(
  ({ code, language = "bash", desc }) => {
    const html = useSignal<string>("");

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

        const lang = Prism.languages[language] || Prism.languages.bash;
        html.value = Prism.highlight(code, lang, language);
      } catch {
        // Fallback: tampilkan plain text jika gagal highlight
        html.value = code;
      }
    });

    return (
      <MockupWindowCode desc={desc}>
        <pre class="m-0 -mt-2 border-0 bg-transparent p-0">
          <code
            class={`language-${language}`}
            dangerouslySetInnerHTML={html.value}
          />
        </pre>
      </MockupWindowCode>
    );
  },
);
