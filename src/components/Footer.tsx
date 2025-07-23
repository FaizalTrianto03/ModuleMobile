import { component$ } from "@qwik.dev/core";
import { ThemeToggle } from "./ThemeToggle";

export const Footer = component$(() => (
  <footer class="bg-base-200 text-base-content mt-12 px-4 pt-10 pb-4">
    <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-4">
      <div>
        <span class="footer-title">Modul Praktikum</span>
        <a class="link link-hover" href="/">
          Home
        </a>
        <a class="link link-hover" href="/blog">
          Blog
        </a>
        {[1, 2, 3, 4, 5, 6].map((modul) => (
          <a key={modul} class="link link-hover" href={`/modul/${modul}`}>
            Modul {modul}
          </a>
        ))}
      </div>
      <div>
        <span class="footer-title">Lab Informatika UMM</span>
        <a class="link link-hover" href="mailto:lab@informatika.umm.ac.id">
          lab@informatika.umm.ac.id
        </a>
        <a
          class="link link-hover"
          href="https://informatika.umm.ac.id/"
          target="_blank"
          rel="noopener"
        >
          Website Jurusan
        </a>
      </div>
      <div>
        <span class="footer-title">Social & Theme</span>
        <div class="mt-2 flex items-center gap-4">
          <a class="btn btn-ghost btn-circle" href="#" aria-label="Instagram">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.25a5.25 5.25 0 1 1-5.25 5.25 5.25 5.25 0 0 1 5.25-5.25zm0 1.5a3.75 3.75 0 1 0 3.75 3.75A3.75 3.75 0 0 0 12 5.25zm5.5 1.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
            </svg>
          </a>
          <a class="btn btn-ghost btn-circle" href="#" aria-label="YouTube">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.8 8.001a2.75 2.75 0 0 0-1.94-1.94C18.2 5.5 12 5.5 12 5.5s-6.2 0-7.86.56a2.75 2.75 0 0 0-1.94 1.94C2.5 9.66 2.5 12 2.5 12s0 2.34.56 3.999a2.75 2.75 0 0 0 1.94 1.94C5.8 18.5 12 18.5 12 18.5s6.2 0 7.86-.56a2.75 2.75 0 0 0 1.94-1.94C21.5 14.34 21.5 12 21.5 12s0-2.34-.56-3.999zM10 15.5v-7l6 3.5-6 3.5z" />
            </svg>
          </a>
          <ThemeToggle />
        </div>
      </div>
      <div class="flex flex-col items-start justify-end md:items-end">
        <span class="footer-title">
          © {new Date().getFullYear()} Lab Informatika UMM
        </span>
      </div>
    </div>
  </footer>
));
