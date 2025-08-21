import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { LuBookOpen } from "@qwikest/icons/lucide";

interface BrandLogoProps {
  class?: string;
}

export const BrandLogo = component$<BrandLogoProps>(({ class: className }) => (
  <Link
    href="/"
    class={[
      "flex items-center gap-2 text-lg font-bold tracking-tight",
      "text-base-content",
      className,
    ]}
  >
    <LuBookOpen class="h-5 w-5" />
    Modul Mobile
  </Link>
));
