import { component$, useSignal, $ } from "@builder.io/qwik";

import { LuPalette, LuChevronDown, LuCheck } from "@qwikest/icons/lucide";

const themes = [
  // { name: "System", value: "system" },
  { name: "Light", value: "light" },
  { name: "Dark", value: "dark" },
  { name: "Cupcake", value: "cupcake" },
  { name: "Bumblebee", value: "bumblebee" },
  { name: "Emerald", value: "emerald" },
  { name: "Corporate", value: "corporate" },
  { name: "Synthwave", value: "synthwave" },
  { name: "Retro", value: "retro" },
  { name: "Cyberpunk", value: "cyberpunk" },
  { name: "Valentine", value: "valentine" },
  { name: "Halloween", value: "halloween" },
  { name: "Garden", value: "garden" },
  { name: "Forest", value: "forest" },
  { name: "Aqua", value: "aqua" },
  { name: "Lofi", value: "lofi" },
  { name: "Pastel", value: "pastel" },
  { name: "Fantasy", value: "fantasy" },
  { name: "Wireframe", value: "wireframe" },
  { name: "Black", value: "black" },
  { name: "Luxury", value: "luxury" },
  { name: "Dracula", value: "dracula" },
  { name: "CMYK", value: "cmyk" },
  { name: "Autumn", value: "autumn" },
  { name: "Business", value: "business" },
  { name: "Acid", value: "acid" },
  { name: "Lemonade", value: "lemonade" },
  { name: "Night", value: "night" },
  { name: "Coffee", value: "coffee" },
  { name: "Winter", value: "winter" },
  { name: "Dim", value: "dim" },
  { name: "Nord", value: "nord" },
  { name: "Sunset", value: "sunset" },
];

const themePalette: Record<string, string[]> = {
  // system: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  light: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  dark: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  cupcake: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  bumblebee: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  emerald: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  corporate: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  synthwave: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  retro: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  cyberpunk: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  valentine: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  halloween: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  garden: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  forest: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  aqua: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  lofi: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  pastel: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  fantasy: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  wireframe: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  black: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  luxury: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  dracula: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  cmyk: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  autumn: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  business: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  acid: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  lemonade: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  night: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  coffee: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  winter: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  dim: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  nord: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
  sunset: ["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"],
};

export const ThemeToggle = component$(() => {
  // Read the current theme from the DOM or localStorage, fallback to "system"
  let initialTheme = "system";
  if (typeof document !== "undefined") {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark" || attr) {
      initialTheme = attr;
    }
    const saved = localStorage.getItem("theme");
    if (saved) {
      initialTheme = saved;
    }
  }
  const theme = useSignal(initialTheme);

  const setTheme = $((value: string) => {
    if (value === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", value);
    }
    localStorage.setItem("theme", value);
    theme.value = value;
  });

  return (
    <div class="dropdown dropdown-end">
      <button type="button" class="btn btn-ghost" aria-label="Toggle theme">
        {/* Ganti ikon menjadi palet warna dan tambahkan teks Tema */}
        <span class="flex items-center gap-2">
          <LuPalette class="h-5 w-5" />
          <span class="hidden text-base font-semibold md:inline">Tema</span>
          <LuChevronDown class="ml-1 h-4 w-4" />
        </span>
      </button>
      <ul class="dropdown-content bg-base-100 rounded-box z-[1] mt-2 max-h-96 w-52 overflow-y-auto p-0 shadow">
        {themes.map(({ name, value }) => (
          <li key={value} class="p-0">
            <button
              class="bg-base-100 text-base-content hover:bg-base-200 w-full cursor-pointer rounded-none p-0 text-start font-sans"
              onClick$={async () => {
                await setTheme(value);
              }}
              data-theme={value}
            >
              <span class="flex w-full items-center gap-2 px-4 py-3">
                {/* Palette preview, except for system */}
                {
                  <span class="flex h-full flex-shrink-0 flex-wrap gap-1">
                    {themePalette[value]?.map((colorClass: string) => (
                      <span
                        key={`${value}-${colorClass}`}
                        class={`h-4 w-2 rounded ${colorClass}`}
                      />
                    ))}
                  </span>
                }
                <span class="flex-grow text-sm font-bold">
                  {name.toLowerCase()}
                </span>
                {theme.value === value && <LuCheck class="ml-2 h-4 w-4" />}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});
