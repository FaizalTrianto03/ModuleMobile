import { component$ } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";

export const Footer = component$(() => (
  <>
    <footer class="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
      <nav>
        <h6 class="footer-title">Modul Praktikum</h6>
        <Link class="link link-hover" href="/">
          Home
        </Link>
        <Link class="link link-hover" href="/blog">
          Blog
        </Link>
        {[1, 2, 3, 4, 5, 6].map((modul) => (
          <Link key={modul} class="link link-hover" href={`/modul/${modul}`}>
            Modul {modul}
          </Link>
        ))}
      </nav>
      <nav>
        <h6 class="footer-title">Company</h6>
        <Link
          class="link link-hover"
          href="https://informatika.umm.ac.id/"
          target="_blank"
          rel="noopener"
        >
          Website Jurusan
        </Link>
        <Link class="link link-hover" href="mailto:lab@informatika.umm.ac.id">
          lab@informatika.umm.ac.id
        </Link>
        <button type="button" class="link link-hover">
          About us
        </button>
        <button type="button" class="link link-hover">
          Contact
        </button>
      </nav>
      <nav>
        <h6 class="footer-title">Legal</h6>
        <button type="button" class="link link-hover">
          Terms of use
        </button>
        <button type="button" class="link link-hover">
          Privacy policy
        </button>
        <button type="button" class="link link-hover">
          Cookie policy
        </button>
      </nav>
      <nav></nav>
    </footer>
    <footer class="footer bg-base-200 text-base-content border-base-300 border-t px-10 py-4">
      <aside class="grid-flow-col items-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill-rule="evenodd"
          clip-rule="evenodd"
          class="fill-primary"
        >
          <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
        </svg>
        <p>
          Lab Informatika UMM
          <br />
          Providing reliable tech & education since 1992
        </p>
      </aside>
      <nav class="md:place-self-center md:justify-self-end">
        <div class="grid grid-flow-col gap-4">
          <Link
            href="https://instagram.com/"
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="fill-current"
            >
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.25a5.25 5.25 0 1 1-5.25 5.25 5.25 5.25 0 0 1 5.25-5.25zm0 1.5a3.75 3.75 0 1 0 3.75 3.75A3.75 3.75 0 0 0 12 5.25zm5.5 1.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
            </svg>
          </Link>
          <Link
            href="https://youtube.com/"
            target="_blank"
            rel="noopener"
            aria-label="YouTube"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="fill-current"
            >
              <path d="M21.8 8.001a2.75 2.75 0 0 0-1.94-1.94C18.2 5.5 12 5.5 12 5.5s-6.2 0-7.86.56a2.75 2.75 0 0 0-1.94 1.94C2.5 9.66 2.5 12 2.5 12s0 2.34.56 3.999a2.75 2.75 0 0 0 1.94 1.94C5.8 18.5 12 18.5 12 18.5s6.2 0 7.86-.56a2.75 2.75 0 0 0 1.94-1.94C21.5 14.34 21.5 12 21.5 12s0-2.34-.56-3.999zM10 15.5v-7l6 3.5-6 3.5z" />
            </svg>
          </Link>
          <Link
            href="https://facebook.com/"
            target="_blank"
            rel="noopener"
            aria-label="Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="fill-current"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </Link>
        </div>
      </nav>
    </footer>
  </>
));
