import { component$, useResource$, Resource } from "@qwik.dev/core";
import { useLocation } from "@qwik.dev/router";
import { getModulById } from "~/utils/mdx";
import ModulLayout from "./(modules)/layout";

export default component$(() => {
  const loc = useLocation();
  const id = loc.params.id;

  const modulResource = useResource$<any>(async () => {
    return await getModulById(id);
  });

  return (
    <Resource
      value={modulResource}
      onPending={() => <div class="loading loading-spinner loading-lg"></div>}
      onResolved={(modul) =>
        modul ? (
          <ModulLayout>
            <modul.content />
          </ModulLayout>
        ) : (
          <div class="alert alert-error mt-8">Modul not found.</div>
        )
      }
    />
  );
});
