import { component$, QRL } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";
import { ThemeToggle } from "./ThemeToggle";
import {
  LuHome,
  LuBookOpen,
  LuFolder,
  LuFileText,
  LuChevronDown,
  LuMenu,
} from "@qwikest/icons/lucide";

interface NavbarProps {
  onMenuClick$?: QRL<() => void>;
}

export const Navbar = component$<NavbarProps>(({ onMenuClick$ }) => {
  return (
    <nav class="navbar bg-base-100 z-50 w-full shadow-sm">
      <div class="flex-1">
        <Link href="/" class="btn btn-ghost text-xl normal-case">
          Lab Praktikum Informatika
        </Link>
      </div>
      {/* Desktop Menu */}
      <div class="hidden flex-none lg:block">
        <ul class="menu menu-horizontal px-1">
          <li>
            <Link href="/">
              <LuHome class="h-4 w-4" /> Home
            </Link>
          </li>
          <li>
            <Link href="/blog">
              <LuBookOpen class="h-4 w-4" /> Blog
            </Link>
          </li>
          <li>
            <details>
              <summary>
                <LuFolder class="h-4 w-4" /> Modul{" "}
                <LuChevronDown class="inline h-3 w-3" />
              </summary>
              <ul class="bg-base-100 rounded-t-none p-2">
                {[1, 2, 3, 4, 5, 6].map((modul) => (
                  <li key={modul}>
                    <Link href={`/modul/${modul}`}>
                      <LuFileText class="h-4 w-4" /> Modul {modul}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        </ul>
      </div>
      {/* Theme Toggle */}
      <div class="ml-2 hidden lg:flex">
        <ThemeToggle />
      </div>
      {/* Mobile Menu Button */}
      <div class="flex-none lg:hidden">
        <button
          aria-label="open sidebar"
          class="btn btn-square btn-ghost"
          type="button"
          onClick$={onMenuClick$}
        >
          <LuMenu class="h-6 w-6" />
        </button>
      </div>
    </nav>
  );
});
