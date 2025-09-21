import { component$ } from "@builder.io/qwik";
import { generateSectionId, shareSection } from "~/utils/component-utils";
import { 
  LuInfo, 
  LuCheckCircle, 
  LuAlertTriangle, 
  LuXCircle, 
  LuBell,
  LuShare2,
  LuX,
  LuExternalLink
} from "@qwikest/icons/lucide";

interface InformationProps {
  title: string;
  content: string;
  type?: "info" | "success" | "warning" | "error" | "neutral";
  icon?: any;
  link?: {
    text: string;
    url: string;
    external?: boolean;
  };
  footer?: string;
  shared?: boolean;
  dismissible?: boolean;
}

export const Information = component$<InformationProps>(
  ({ 
    title, 
    content, 
    type = "info", 
    icon, 
    link,
    footer,
    shared = false, 
    dismissible = false 
  }) => {
    const id = generateSectionId(title, "information");
    
    // Map alert types to DaisyUI classes
    const alertTypeClasses = {
      info: "alert",
      success: "alert alert-success", 
      warning: "alert alert-warning",
      error: "alert alert-error",
      neutral: "alert"
    };

    // Default icons for each type
    const defaultIcons = {
      info: LuInfo,
      success: LuCheckCircle,
      warning: LuAlertTriangle, 
      error: LuXCircle,
      neutral: LuBell
    };

    const alertClass = `${alertTypeClasses[type]} mb-6`;
    const IconComponent = icon || defaultIcons[type];

    return (
      <div id={id} role="alert" class={alertClass}>
        {/* Icon */}
        <IconComponent class="h-6 w-6 shrink-0 stroke-current" />
        
        {/* Content */}
        <div class="flex-1">
          <h3 class="text-lg font-bold">{title}</h3>
          
          <div class="mt-2">
            <div
              class="max-w-none"
              dangerouslySetInnerHTML={content}
            />
          </div>

          {/* Link */}
          {link && (
            <div class="mt-2">
              <a 
                href={link.url}
                class="link link-primary inline-flex items-center gap-1 font-medium"
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
              >
                {link.text}
                {link.external && <LuExternalLink class="h-4 w-4" />}
              </a>
            </div>
          )}

          {/* Footer */}
          {footer && (
            <div class="mt-2 text-sm opacity-75">
              {footer}
            </div>
          )}
        </div>

        {/* Action buttons */}
        {(shared || dismissible) && (
          <div class="flex flex-col gap-1">
            {shared && (
              <button
                class="btn btn-ghost btn-sm btn-square"
                onClick$={() => shareSection(id, title)}
                aria-label="Share section"
                title="Share section"
              >
                <LuShare2 class="h-4 w-4" />
              </button>
            )}
            
            {dismissible && (
              <button
                class="btn btn-ghost btn-sm btn-square"
                onClick$={(event) => {
                  const alertElement = (event.target as HTMLElement).closest('.alert');
                  if (alertElement) {
                    alertElement.remove();
                  }
                }}
                aria-label="Dismiss alert"
                title="Dismiss"
              >
                <LuX class="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
); 