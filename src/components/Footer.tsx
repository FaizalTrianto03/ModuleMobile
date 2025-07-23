import { component$ } from "@qwik.dev/core";

export const Footer = component$(() => (
  <footer class="footer bg-base-200 text-base-content mt-12 p-10">
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
      <span class="footer-title">Social</span>
      <a class="link link-hover" href="#">
        Instagram
      </a>
      <a class="link link-hover" href="#">
        YouTube
      </a>
    </div>
    <div>
      <span class="footer-title">
        © {new Date().getFullYear()} Lab Informatika UMM
      </span>
    </div>
  </footer>
));
