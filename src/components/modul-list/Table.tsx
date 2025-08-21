import { component$ } from "@builder.io/qwik";
import {
  generateSectionId,
  colorMap,
  shareSection,
} from "~/utils/component-utils";

interface TableProps {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  shared?: boolean;
  theme?: keyof typeof colorMap;
}

export const Table = component$<TableProps>(
  ({ title, headers, rows, shared = false, theme = "orange" }) => {
    const id = generateSectionId(title, "table");
    const tone = colorMap[theme] || "primary";

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

        <div class="overflow-x-auto">
          <table class="table-zebra bg-base-100 border-base-300 table border">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  },
);
