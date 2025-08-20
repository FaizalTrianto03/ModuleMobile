import { component$, Slot } from "@qwik.dev/core";

/**
 * Komponen DaisyUI mockup-window untuk membungkus blok kode atau konten apapun.
 * Gunakan di MDX seperti:
 *
 * <MockupWindowCode>
 *   <pre>
 *     <code>
 *       kode di sini
 *     </code>
 *   </pre>
 * </MockupWindowCode>
 */
export const MockupWindowCode = component$<{ desc?: string }>(({ desc }) => (
  <div class="mockup-window border-base-300 bg-base-200 my-6 border">
    <div class="bg-base-300 border-base-200 text-base-content/60 rounded-t-box border-b px-4 py-2 text-xs">
      <span class="font-mono">{desc || "code"}</span>
    </div>
    <div class="bg-base-100 rounded-b-box overflow-x-auto px-4">
      <Slot />
    </div>
  </div>
));
