import { component$ } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";

export const Navbar = component$(() => {
  return (
    <div class="navbar bg-base-100 shadow-md">
      <div class="container mx-auto flex justify-between">
        <div class="flex items-center gap-2">
          <Link href="/" class="btn btn-ghost text-xl normal-case">
            Lab Praktikum Informatika
          </Link>
        </div>
        <div class="flex gap-2">
          <Link href="/" class="btn btn-ghost btn-sm">
            Home
          </Link>
          <Link href="/blog" class="btn btn-ghost btn-sm">
            Blog
          </Link>
          {[1, 2, 3, 4, 5, 6].map((modul) => (
            <Link
              key={modul}
              href={`/modul/${modul}`}
              class="btn btn-ghost btn-sm"
            >
              Modul {modul}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
});
