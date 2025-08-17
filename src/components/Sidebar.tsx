import { component$, QRL } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";
import {
  LuHome,
  LuFolder,
  LuFileText,
  LuFile,
  LuImage,
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
          class="bg-opacity-40 fixed inset-0 z-40 bg-black transition-opacity duration-300 lg:hidden"
          style={{ opacity: open ? 1 : 0 }}
          onClick$={onClose$}
        ></div>
      )}
      <aside
        class={[
          // Mobile: fixed, overlays content, slides in/out
          "bg-base-200 text-base-content rounded-box fixed top-0 left-0 z-50 h-full w-80 p-6 transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
          // Desktop: static, part of flex layout, always visible, full height, no rounded corners
          "lg:static lg:h-screen lg:w-80 lg:flex-shrink-0 lg:translate-x-0 lg:rounded-none",
        ]}
        style={
          {
            // No extra style needed; classes handle layout
          }
        }
      >
        <ul class="menu menu-md min-h-full w-full lg:h-full">
          <li>
            <Link href="/" onClick$={onClose$}>
              <LuHome class="h-4 w-4" /> Home
            </Link>
          </li>
          <li>
            <details open>
              <summary>
                <LuFolder class="h-4 w-4" /> Modul{" "}
              </summary>
              <ul>
                {[1, 2, 3, 4, 5, 6].map((modul) => (
                  <li key={modul}>
                    <Link href={`/modul/${modul}`} onClick$={onClose$}>
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
        </ul>
      </aside>
    </>
  );
});
