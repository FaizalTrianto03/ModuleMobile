import { component$, useSignal, useVisibleTask$, $ } from "@qwik.dev/core";

const themes = [
  { name: "Light", value: "light" },
  { name: "Dark", value: "dark" },
  { name: "System", value: "system" },
];

export const ThemeToggle = component$(() => {
  const theme = useSignal("system");

  const setTheme = $((value: string) => {
    if (value === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", value);
    }
    localStorage.setItem("theme", value);
  });

  useVisibleTask$(async () => {
    // On mount, set theme from localStorage or system
    const saved = localStorage.getItem("theme");
    if (saved) {
      theme.value = saved;
      await setTheme(saved);
    } else {
      await setTheme("system");
    }
  });

  return (
    <div class="dropdown dropdown-end">
      <label
        tabIndex={0}
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
      </label>
      <ul
        tabIndex={0}
        class="dropdown-content menu bg-base-100 rounded-box z-[1] mt-2 w-36 p-2 shadow"
      >
        {themes.map((t) => (
          <li key={t.value}>
            <button
              class={theme.value === t.value ? "active" : ""}
              onClick$={async () => {
                theme.value = t.value;
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
