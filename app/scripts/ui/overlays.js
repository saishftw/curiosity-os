// Lightweight overlays: a bottom sheet, a toast, and a clipboard helper.

import { el } from "./dom.js";

export function toast(message) {
  const node = el("div", { class: "toast", role: "status", text: message });
  document.body.appendChild(node);
  setTimeout(() => {
    node.style.transition = "opacity 200ms ease, transform 200ms ease";
    node.style.opacity = "0";
    node.style.transform = "translate(-50%, 8px)";
    setTimeout(() => node.remove(), 220);
  }, 1900);
}

export async function copyText(text, message = "Copied") {
  try {
    await navigator.clipboard.writeText(text);
    toast(message);
    return true;
  } catch {
    toast("Press ⌘/Ctrl+C to copy");
    return false;
  }
}

export function openUrl(url) {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function openSheet({ title, sub, body }) {
  let overlay;
  const onKey = (event) => {
    if (event.key === "Escape") close();
  };
  const close = () => {
    overlay.style.transition = "opacity 160ms ease";
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 170);
    document.removeEventListener("keydown", onKey);
  };

  const closeBtn = el("button", {
    class: "sheet__close",
    "aria-label": "Close",
    text: "✕",
    onClick: close,
  });

  const card = el(
    "div",
    {
      class: "sheet__card",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": title,
    },
    [
      el("div", { class: "sheet__head" }, [
        el("div", {}, [
          el("h2", { class: "sheet__title", text: title }),
          sub && el("p", { class: "sheet__sub", text: sub }),
        ]),
        closeBtn,
      ]),
      el("div", { class: "sheet__body" }, [body]),
    ]
  );

  overlay = el(
    "div",
    {
      class: "sheet",
      onClick: (event) => {
        if (event.target === overlay) close();
      },
    },
    [card]
  );

  document.body.appendChild(overlay);
  document.addEventListener("keydown", onKey);
  closeBtn.focus();
  return { close };
}
