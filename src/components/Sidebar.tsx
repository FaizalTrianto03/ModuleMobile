import { component$, QRL } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";
import { BrandLogo } from "./BrandLogo";
import {
  LuHome,
  LuBookOpen,
  LuUser,
  LuFileText,
  LuFileArchive,
  LuImage,
} from "@qwikest/icons/lucide";
import { getAllModulMeta } from "~/utils/modul-utils";

interface SidebarProps {
  open?: boolean;
  onClose$?: QRL<() => void>;
}

export const Sidebar = component$<SidebarProps>(({ open, onClose$ }) => {
  const modulList = getAllModulMeta();
  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          class="bg-opacity-40 fixed inset-0 z-40 bg-black transition-opacity duration-300 lg:hidden"
          style={{ opacity: open ? 1 : 0 }}
          onClick$={onClose$}
        ></div>
      )}
      <aside
        class={[
          "bg-base-100 text-base-content border-base-300 fixed top-0 left-0 z-50 flex h-full w-72 flex-col border-r p-0 transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:h-screen lg:w-72 lg:flex-shrink-0 lg:translate-x-0",
        ]}
      >
        <div class="flex h-full flex-col">
          <div class="border-base-300 flex h-16 items-center border-b px-6">
            <BrandLogo />
          </div>
          <nav class="flex-1 overflow-y-auto px-2 py-4">
            <ul class="menu menu-lg min-h-full w-full lg:h-full">
              <li>
                <Link href="/" onClick$={onClose$}>
                  <LuHome class="h-4 w-4" /> Home
                </Link>
              </li>
              <li>
                <details open>
                  <summary>
                    <LuBookOpen class="h-4 w-4" /> Modul
                  </summary>
                  <ul>
                    {modulList.map(({ modulId, title }) => (
                      <li key={modulId}>
                        <Link
                          class="text-sm"
                          href={`/modul/${modulId}`}
                          onClick$={onClose$}
                        >
                          <LuFileText class="h-4 w-4" />{" "}
                          {title || `Modul ${modulId}`}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
              <li>
                <details>
                  <summary>
                    <LuFileArchive class="h-4 w-4" /> Resources
                  </summary>
                  <ul>
                    <li>
                      <Link href="/resources/files" onClick$={onClose$}>
                        <LuFileArchive class="h-4 w-4" /> Files
                      </Link>
                    </li>
                    <li>
                      <Link href="/resources/images" onClick$={onClose$}>
                        <LuImage class="h-4 w-4" /> Images
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <details>
                  <summary>
                    <LuUser class="h-4 w-4" /> Profile
                  </summary>
                  <ul>
                    <li>
                      <Link href="/profile" onClick$={onClose$}>
                        <LuUser class="h-4 w-4" /> Profile
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
});
