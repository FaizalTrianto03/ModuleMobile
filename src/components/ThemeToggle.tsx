import { component$, useSignal, $ } from "@qwik.dev/core";

import { LuSun, LuMoon, LuLaptop } from "@qwikest/icons/lucide";

const themes = [
  { name: "Light", value: "light" },
  { name: "Dark", value: "dark" },
  { name: "System", value: "system" },
];

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
      <button
        type="button"
        class="btn btn-ghost btn-circle"
        aria-label="Toggle theme"
      >
        {/* Show icon based on current theme */}
        {theme.value === "light" && <LuSun class="h-5 w-5" />}
        {theme.value === "dark" && <LuMoon class="h-5 w-5" />}
        {theme.value === "system" && <LuLaptop class="h-5 w-5" />}
      </button>
      <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] mt-2 w-36 p-2 shadow">
        {themes.map(({ name, value }) => (
          <li key={value}>
            <button
              class={theme.value === value ? "active" : ""}
              onClick$={async () => {
                await setTheme(value);
              }}
            >
              <span class="flex items-center gap-2">
                {value === "light" && <LuSun class="h-4 w-4" />}
                {value === "dark" && <LuMoon class="h-4 w-4" />}
                {value === "system" && <LuLaptop class="h-4 w-4" />}
                {name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});
