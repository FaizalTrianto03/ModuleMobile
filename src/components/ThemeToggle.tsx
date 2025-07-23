import { component$, useSignal, $ } from "@qwik.dev/core";

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
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.95 7.05l-.71-.71M4.05 4.05l-.71-.71" />
        </svg>
      </button>
      <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] mt-2 w-36 p-2 shadow">
        {themes.map((t) => (
          <li key={t.value}>
            <button
              class={theme.value === t.value ? "active" : ""}
              onClick$={async () => {
                await setTheme(t.value);
              }}
            >
              {t.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});
