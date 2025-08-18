import { component$, useSignal, $ } from "@qwik.dev/core";
import {
  QwikRouterProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@qwik.dev/router";
import { RouterHead } from "./components/router-head/router-head";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";
import "./global.css";
import "./prism.css";

export default component$(() => {
  const sidebarOpen = useSignal(false);

  return (
    <QwikRouterProvider>
      <head>
        <meta charset="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        {/* Inline theme script to prevent flicker */}
        <script
          dangerouslySetInnerHTML={`
          (function() {
            try {
              var theme = localStorage.getItem('theme');
              if (theme && theme !== 'system') {
                document.documentElement.setAttribute('data-theme', theme);
              } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
              } else {
                document.documentElement.setAttribute('data-theme', 'light');
              }
            } catch(e) {}
          })();
        `}
        />
        {/* Font Awesome for icons used by the component system */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          referrerPolicy="no-referrer"
        />
        {/* Component system now integrated as Qwik components */}
        <RouterHead />
      </head>
      <body lang="en" class="container mx-auto min-h-screen">
        <div class="drawer lg:drawer-open">
          <input
            id="main-sidebar"
            type="checkbox"
            class="drawer-toggle"
            checked={sidebarOpen.value}
            readOnly
          />
          <div class="drawer-content flex min-h-screen flex-col">
            <Navbar
              onMenuClick$={$(() => (sidebarOpen.value = true))}
              drawerOpen={sidebarOpen.value}
            />
            <main class="px-4 py-6">
              {/* Optional dynamic render root for modules */}
              <div id="module-root" class="hidden" />
              <div class="flex w-full justify-center">
                <RouterOutlet />
              </div>
            </main>
            <ServiceWorkerRegister />
            <Footer />
          </div>
          <div class="drawer-side">
            <label
              for="main-sidebar"
              class="drawer-overlay"
              onClick$={$(() => (sidebarOpen.value = false))}
            ></label>
            <Sidebar
              open={sidebarOpen.value}
              onClose$={$(() => (sidebarOpen.value = false))}
            />
          </div>
        </div>
      </body>
    </QwikRouterProvider>
  );
});
