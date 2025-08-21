import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import {
  LuInstagram,
  LuYoutube,
  LuFacebook,
  LuBookOpen,
  LuHome,
  LuUser,
} from "@qwikest/icons/lucide";

export const Footer = component$(() => (
  <footer class="border-base-300 bg-base-100 mt-8 w-full border-t px-4 py-8 md:px-8">
    <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-4">
      <div>
        <div class="mb-2 flex items-center gap-2 text-lg font-bold">
          <LuBookOpen class="h-5 w-5" />
          Modul Mobile
        </div>
        <div class="mb-2 text-sm opacity-70">
          made by UMM Infotech Information System Division
        </div>
        <div class="mt-2 flex gap-3">
          <Link
            href="https://instagram.com/"
            target="_blank"
            aria-label="Instagram"
            class="btn btn-sm btn-ghost rounded-full"
          >
            <LuInstagram class="h-5 w-5" />
          </Link>
          <Link
            href="https://youtube.com/"
            target="_blank"
            aria-label="YouTube"
            class="btn btn-sm btn-ghost rounded-full"
          >
            <LuYoutube class="h-5 w-5" />
          </Link>
          <Link
            href="https://facebook.com/"
            target="_blank"
            aria-label="Facebook"
            class="btn btn-sm btn-ghost rounded-full"
          >
            <LuFacebook class="h-5 w-5" />
          </Link>
        </div>
      </div>
      <div>
        <div class="mb-2 text-base font-semibold">Navigation</div>
        <ul class="flex flex-col gap-1">
          <li>
            <Link href="/" class="flex items-center gap-2 hover:underline">
              <LuHome class="h-4 w-4" /> Home
            </Link>
          </li>
          <li>
            <Link
              href="/modul/1"
              class="flex items-center gap-2 hover:underline"
            >
              <LuBookOpen class="h-4 w-4" /> Modul
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              class="flex items-center gap-2 hover:underline"
            >
              <LuUser class="h-4 w-4" /> Profile
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <div class="mb-2 text-base font-semibold">Shortcut</div>
        <ul class="flex flex-col gap-1">
          <li>
            <Link
              href="https://infotech.umm.ac.id/"
              target="_blank"
              class="hover:underline"
            >
              I-Lab
            </Link>
          </li>
          <li>
            <Link
              href="mailto:lab@informatika.umm.ac.id"
              class="hover:underline"
            >
              lab@informatika.umm.ac.id
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <div class="mb-2 text-base font-semibold">Legal</div>
        <ul class="flex flex-col gap-1">
          <li>
            <button type="button" class="hover:underline">
              Terms of use
            </button>
          </li>
          <li>
            <button type="button" class="hover:underline">
              Privacy policy
            </button>
          </li>
          <li>
            <button type="button" class="hover:underline">
              Cookie policy
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div class="mt-8 text-center text-xs opacity-60">
      &copy; {new Date().getFullYear()} Lab Informatika UMM. All rights
      reserved.
    </div>
  </footer>
));
