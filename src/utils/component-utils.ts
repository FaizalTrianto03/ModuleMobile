import { $ } from "@qwik.dev/core";

// Utility functions for component system
export function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export function generateId(): string {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getFileName(filePath: string): string {
  if (!filePath) return "code.txt";
  return filePath.split(/[/\\]/).pop() || "code.txt";
}

export function generateSectionId(
  sectionName: string,
  componentType: string = "",
): string {
  if (!sectionName) return generateId();
  const cleanName = sectionName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const prefix = componentType ? `${componentType}-` : "";
  return `${prefix}${cleanName}`;
}

// DaisyUI colors map
export const colorMap: Record<string, string> = {
  orange: "warning",
  navy: "info",
  blue: "info",
  success: "success",
  error: "error",
  warning: "warning",
  default: "neutral",
  primary: "primary",
};

// Toast notification system
export const showToast = $(
  async (
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
  ) => {
    const toastId = generateId();
    const tone =
      { success: "success", error: "error", warning: "warning", info: "info" }[
        type
      ] || "info";

    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toast-container";
      toastContainer.className = "toast toast-top toast-end z-50";
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement("div");
    toast.id = toastId;
    toast.className = `alert alert-${tone} animate-in slide-in-from-top-2`;
    toast.innerHTML = `
    <span>${escapeHtml(message)}</span>
    <button class="btn btn-ghost btn-xs" onclick="this.closest('.alert').remove()">
      <i class="fas fa-times"></i>
    </button>
  `;

    toastContainer.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 4000);
  },
);

// Copy to clipboard utility
export const copyToClipboard = $(async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    await showToast("Copied to clipboard!", "success");
  } catch {
    await showToast("Failed to copy", "error");
  }
});

// Share utilities
export const shareSection = $(async (sectionId: string, title: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set("section", sectionId);

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text: `Check out this section: ${title}`,
        url: url.toString(),
      });
    } catch {
      // Fallback to copying URL
      await copyToClipboard(url.toString());
    }
  } else {
    // Fallback to copying URL
    await copyToClipboard(url.toString());
  }
});
