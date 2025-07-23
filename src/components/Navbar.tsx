import { component$, useSignal } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";
import { ThemeToggle } from "./ThemeToggle";

export const Navbar = component$(() => {
  const menuOpen = useSignal(false);

  return (
    <nav class="navbar bg-base-100 sticky top-0 z-50 shadow-md">
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Link href="/" class="btn btn-ghost text-xl normal-case">
            Lab Praktikum Informatika
          </Link>
        </div>
        {/* Desktop Menu */}
        <div class="hidden items-center gap-2 md:flex">
          <Link href="/" class="btn btn-ghost btn-sm">
            Home
          </Link>
          <Link href="/blog" class="btn btn-ghost btn-sm">
            Blog
          </Link>
          {[1, 2, 3, 4, 5, 6].map((modul) => (
            <Link
              key={modul}
              href={`/modul/${modul}`}
              class="btn btn-ghost btn-sm"
            >
              Modul {modul}
            </Link>
          ))}
          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
        {/* Mobile Menu Button */}
        <div class="flex items-center md:hidden">
          <button
            class="btn btn-ghost btn-circle"
            aria-label="Open menu"
            onClick$={() => (menuOpen.value = !menuOpen.value)}
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Dropdown */}
      {menuOpen.value && (
        <div class="bg-base-100 border-base-200 border-t shadow-lg md:hidden">
          <div class="flex flex-col gap-2 p-4">
            <Link
              href="/"
              class="btn btn-ghost btn-sm"
              onClick$={() => (menuOpen.value = false)}
            >
              Home
            </Link>
            <Link
              href="/blog"
              class="btn btn-ghost btn-sm"
              onClick$={() => (menuOpen.value = false)}
            >
              Blog
            </Link>
            {[1, 2, 3, 4, 5, 6].map((modul) => (
              <Link
                key={modul}
                href={`/modul/${modul}`}
                class="btn btn-ghost btn-sm"
                onClick$={() => (menuOpen.value = false)}
              >
                Modul {modul}
              </Link>
            ))}
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
});
