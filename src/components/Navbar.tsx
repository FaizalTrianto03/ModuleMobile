import { component$, QRL, useSignal, useVisibleTask$ } from "@qwik.dev/core";
import { ThemeToggle } from "./ThemeToggle";
import { BrandLogo } from "./BrandLogo";
import { LuMenu } from "@qwikest/icons/lucide";

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
          showNavbar.value = false;
        } else if (currentY < lastScrollY.value && currentY > 40) {
          showNavbar.value = true;
        } else if (currentY <= 40) {
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
          "navbar bg-base-100 border-base-300 sticky top-0 flex h-16 w-full items-center border-b px-4 transition-transform duration-300 md:px-8",
          showNavbar.value ? "translate-y-0" : "-translate-y-full",
        ]}
        style={{ zIndex: drawerOpen ? 0 : 20 }}
      >
        {/* Left: Brand (mobile only) */}
        <div class="flex flex-shrink-0 items-center gap-2 lg:hidden">
          <BrandLogo />
        </div>
        {/* Center: empty (no menu) */}
        <div class="flex-1"></div>
        {/* Right: Theme Toggle */}
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <button
            aria-label="Open sidebar"
            class="btn btn-square btn-ghost border-base-300 border lg:hidden"
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
