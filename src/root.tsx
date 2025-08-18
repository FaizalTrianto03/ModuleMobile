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
      <body lang="en" class="bg-base-200 min-h-screen">
        <div class="drawer lg:drawer-open">
          <input
            id="main-sidebar"
            type="checkbox"
            class="drawer-toggle"
            checked={sidebarOpen.value}
            readOnly
          />
          <div class="drawer-content bg-base-100 border-base-300 flex min-h-screen flex-col border-l">
            <Navbar
              onMenuClick$={$(() => (sidebarOpen.value = true))}
              drawerOpen={sidebarOpen.value}
            />
            <main class="container mx-auto flex-1 px-2 py-6 md:px-6">
              {/* Optional dynamic render root for modules */}
              <div id="module-root" class="hidden" />
              <RouterOutlet />
            </main>
            <div class="border-base-300 border-t">
              <ServiceWorkerRegister />
              <Footer />
            </div>
          </div>
          <div class="drawer-side border-base-300 bg-base-100 border-r">
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
