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
        <RouterHead />
      </head>
      <body lang="en" class="flex min-h-screen flex-col">
        <Navbar onMenuClick$={$(() => (sidebarOpen.value = true))} />
        <div class="flex w-full flex-1">
          <Sidebar
            open={sidebarOpen.value}
            onClose$={$(() => (sidebarOpen.value = false))}
          />
          <main class="container mx-auto flex-1 px-4 py-6">
            <RouterOutlet />
          </main>
        </div>
        <ServiceWorkerRegister />
        <Footer />
      </body>
    </QwikRouterProvider>
  );
});
