import { component$, QRL } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";
import { ThemeToggle } from "./ThemeToggle";
import {
  LuHome,
  LuBookOpen,
  LuFolder,
  LuFileText,
  LuFile,
  LuImage,
  LuChevronDown,
  LuFileArchive,
} from "@qwikest/icons/lucide";

interface SidebarProps {
  open?: boolean; // for mobile drawer
  onClose$?: QRL<() => void>; // for mobile drawer close
}

export const Sidebar = component$<SidebarProps>(({ open, onClose$ }) => {
  // Overlay for mobile, rendered outside the aside
  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          class="bg-opacity-40 fixed inset-0 z-40 bg-black lg:hidden"
          onClick$={onClose$}
        ></div>
      )}
      <aside
        class={[
          // Mobile: fixed, overlays content, slides in/out
          "bg-base-200 text-base-content rounded-box fixed top-0 left-0 z-50 h-full w-64 p-4 transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
          // Desktop: static, part of flex layout, always visible
          "lg:static lg:w-64 lg:flex-shrink-0 lg:translate-x-0",
        ]}
        style={
          {
            // No extra style needed; classes handle layout
          }
        }
      >
        <ul class="menu menu-xs min-h-full w-full">
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
            <details open>
              <summary>
                <LuFolder class="h-4 w-4" /> Modul{" "}
                <LuChevronDown class="inline h-3 w-3" />
              </summary>
              <ul>
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
          <li>
            <details>
              <summary>
                <LuFileArchive class="h-4 w-4" /> Resources{" "}
                <LuChevronDown class="inline h-3 w-3" />
              </summary>
              <ul>
                <li>
                  <button type="button">
                    <LuFile class="h-4 w-4" /> resume.pdf
                  </button>
                </li>
                <li>
                  <details open>
                    <summary>
                      <LuFolder class="h-4 w-4" /> My Files{" "}
                      <LuChevronDown class="inline h-3 w-3" />
                    </summary>
                    <ul>
                      <li>
                        <button type="button">
                          <LuFileText class="h-4 w-4" /> Project-final.psd
                        </button>
                      </li>
                      <li>
                        <button type="button">
                          <LuFileText class="h-4 w-4" /> Project-final-2.psd
                        </button>
                      </li>
                      <li>
                        <details open>
                          <summary>
                            <LuImage class="h-4 w-4" /> Images{" "}
                            <LuChevronDown class="inline h-3 w-3" />
                          </summary>
                          <ul>
                            <li>
                              <button type="button">
                                <LuImage class="h-4 w-4" /> Screenshot1.png
                              </button>
                            </li>
                            <li>
                              <button type="button">
                                <LuImage class="h-4 w-4" /> Screenshot2.png
                              </button>
                            </li>
                            <li>
                              <details open>
                                <summary>
                                  <LuFolder class="h-4 w-4" /> Others{" "}
                                  <LuChevronDown class="inline h-3 w-3" />
                                </summary>
                                <ul>
                                  <li>
                                    <button type="button">
                                      <LuImage class="h-4 w-4" />{" "}
                                      Screenshot3.png
                                    </button>
                                  </li>
                                </ul>
                              </details>
                            </li>
                          </ul>
                        </details>
                      </li>
                    </ul>
                  </details>
                </li>
                <li>
                  <button type="button">
                    <LuFile class="h-4 w-4" /> reports-final-2.pdf
                  </button>
                </li>
              </ul>
            </details>
          </li>
          <li class="mt-4">
            <ThemeToggle />
          </li>
        </ul>
      </aside>
    </>
  );
});
