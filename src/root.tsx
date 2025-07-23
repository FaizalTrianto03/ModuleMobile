import { component$ } from "@qwik.dev/core";
import {
  QwikRouterProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@qwik.dev/router";
import { RouterHead } from "./components/router-head/router-head";
import { Navbar } from "./components/Navbar";

import { Footer } from "./components/Footer";
import "./global.css";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */
  return (
    <QwikRouterProvider>
      <head>
        <meta charSet="utf-8" />
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
      <body lang="en">
        <Navbar />
        <RouterOutlet />
        <ServiceWorkerRegister />
        <Footer />
      </body>
    </QwikRouterProvider>
  );
});
