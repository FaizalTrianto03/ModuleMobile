import { component$, $ } from "@qwik.dev/core";
import {
  generateSectionId,
  colorMap,
  shareSection,
  copyToClipboard,
} from "~/utils/component-utils";

interface CommandItem {
  command: string;
  output?: string;
  comment?: string;
}

interface CommandProps {
  title: string;
  description?: string;
  commands: CommandItem[];
  type?: "terminal" | "powershell" | "cmd";
  shared?: boolean;
  theme?: keyof typeof colorMap;
}

export const Command = component$<CommandProps>(
  ({
    title,
    description,
    commands,
    type = "terminal",
    shared = false,
    theme = "orange",
  }) => {
    const id = generateSectionId(title, "command");
    const tone = colorMap[theme] || "primary";
    const prompt =
      { terminal: "$", powershell: "PS>", cmd: "C:>" }[type] || "$";

    const copyAllCommands = $(() => {
      const allCommands = commands
        .map((cmd) => cmd.command)
        .filter(Boolean)
        .join("\n");
      copyToClipboard(allCommands);
    });

    return (
      <section id={id} class="mb-8 scroll-mt-20">
        <div class="mb-2 flex items-center justify-between">
          <h3 class={`text-xl font-semibold text-${tone}`}>{title}</h3>
          {shared && (
            <button
              class="btn btn-ghost btn-sm"
              onClick$={() => shareSection(id, title)}
              aria-label="Share section"
            >
              <i class="fas fa-share-alt"></i>
            </button>
          )}
        </div>

        {description && <p class="mb-3 opacity-80">{description}</p>}

        <div class="card bg-base-100 border-base-300 border shadow">
          <div class="border-base-300 flex items-center justify-between border-b px-3 py-2">
            <span class="text-xs uppercase opacity-70">{type}</span>
            <button
              class="btn btn-ghost btn-xs"
              onClick$={copyAllCommands}
              title="Copy all"
            >
              <i class="fas fa-copy"></i>
            </button>
          </div>

          <div class="mockup-code">
            <div class="p-3">
              {commands.map((cmd, index) => (
                <div key={index} class="group mb-2">
                  <div class="flex items-center gap-2 font-mono text-sm">
                    <span class="opacity-50">{prompt}</span>
                    <span>{cmd.command}</span>
                    <button
                      class="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100"
                      onClick$={() => copyToClipboard(cmd.command)}
                      title="Copy"
                    >
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                  {cmd.output && (
                    <pre class="mt-1 ml-6 text-xs whitespace-pre-wrap opacity-80">
                      {cmd.output}
                    </pre>
                  )}
                  {cmd.comment && (
                    <div class="mt-1 ml-6 text-xs opacity-60">
                      # {cmd.comment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);
