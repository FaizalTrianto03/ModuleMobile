import { component$ } from "@builder.io/qwik";
import { ModuleHeader } from "./ModuleHeader";
import { Info } from "./Info";
import { Material } from "./Material";
import { Code } from "./Code";
import { Command } from "./Command";
import { CardSection } from "./CardSection";
import { AccordionSection } from "./AccordionSection";
import { Video } from "./Video";
import { Table } from "./Table";

// Union type for all component data
export type ComponentData =
  | { type: "moduleHeader"; data: any }
  | { type: "info"; data: any }
  | { type: "material"; data: any }
  | { type: "code"; data: any }
  | { type: "command"; data: any }
  | { type: "cardSection"; data: any }
  | { type: "accordionSection"; data: any }
  | { type: "video"; data: any }
  | { type: "table"; data: any };

interface ComponentRendererProps {
  component: ComponentData;
}

export const ComponentRenderer = component$<ComponentRendererProps>(
  ({ component }) => {
    const { type, data } = component;

    switch (type) {
      case "moduleHeader":
        return <ModuleHeader {...data} />;

      case "info":
        return <Info {...data} />;

      case "material":
        return <Material {...data} />;

      case "code":
        return <Code {...data} />;

      case "command":
        return <Command {...data} />;

      case "cardSection":
        return <CardSection {...data} />;

      case "accordionSection":
        return <AccordionSection {...data} />;

      case "video":
        return <Video {...data} />;

      case "table":
        return <Table {...data} />;

      default:
        console.warn(`Unknown component type: ${type}`);
        return (
          <div class="alert alert-error">
            Unknown component type: <strong>{type}</strong>
          </div>
        );
    }
  },
);
