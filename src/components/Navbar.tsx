import { component$, QRL, useSignal, useVisibleTask$ } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";
import { ThemeToggle } from "./ThemeToggle";
import { LuHome, LuFolder, LuFileText, LuMenu } from "@qwikest/icons/lucide";

interface NavbarProps {
  onMenuClick$?: QRL<() => void>;
  drawerOpen?: boolean;
}

export const Navbar = component$<NavbarProps>(
  ({ onMenuClick$, drawerOpen }) => {
    const showNavbar = useSignal(true);
    const lastScrollY = useSignal(0);

    useVisibleTask$(() => {
      const handleScroll = () => {
        const currentY = window.scrollY;
        if (currentY > lastScrollY.value && currentY > 40) {
          // Scroll down, hide navbar
          showNavbar.value = false;
        } else if (currentY < lastScrollY.value && currentY > 40) {
          // Scroll up, show navbar
          showNavbar.value = true;
        } else if (currentY <= 40) {
          // Always show at top
          showNavbar.value = true;
        }
        lastScrollY.value = currentY;
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    });

    return (
      <nav
        class={[
          "navbar bg-base-100 sticky top-0 w-full shadow-sm transition-transform duration-300",
          showNavbar.value ? "translate-y-0" : "-translate-y-full",
        ]}
        style={drawerOpen ? {} : { zIndex: 10 }}
      >
        <div class="flex-1">
          <Link href="/" class="btn btn-ghost text-xl normal-case">
            Modul Mobile 25/26
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
              <details>
                <summary>
                  <LuFolder class="h-4 w-4" /> Modul{" "}
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
        <div class="ml-2 flex items-center">
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
  },
);
