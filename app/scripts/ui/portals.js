// Portal UI: a tinted icon "mark", a labelled chip (optionally a link that opens
// the tool), and grouping by purpose (Think / Build / Notes).

import { el } from "./dom.js";
import { portalIcon } from "./icons.js";

// Which primary action a portal belongs to.
const MODE_BY_CATEGORY = {
  chat: "think",
  research: "think",
  code: "build",
  notes: "notes",
};

const GROUPS = [
  { id: "think", label: "Think here", categories: ["chat", "research"] },
  { id: "build", label: "Build here", categories: ["code"] },
  { id: "notes", label: "Notes", categories: ["notes"] },
];

export function portalMode(portal) {
  return MODE_BY_CATEGORY[portal?.category] || "think";
}

export function portalColor(portal) {
  return portal?.color || "var(--ink-soft)";
}

/** A small tinted tile holding the brand mark. */
export function portalMark(portal, size = "md") {
  return el(
    "span",
    {
      class: `pmark pmark--${size}`,
      "aria-hidden": "true",
      style: { "--portal-color": portalColor(portal) },
    },
    [portalIcon(portal?.id)]
  );
}

/** A labelled portal chip. With `href`, it becomes a link that opens the tool. */
export function portalChip(portal, { href } = {}) {
  const name = portal?.name || portal?.id || "Portal";
  const inner = [portalMark(portal, "sm"), el("span", { class: "pchip__name", text: name })];
  const style = { "--portal-color": portalColor(portal) };

  if (href) {
    return el(
      "a",
      {
        class: "pchip pchip--link",
        href,
        target: "_blank",
        rel: "noopener noreferrer",
        title: `Open ${name}`,
        style,
      },
      [...inner, el("span", { class: "pchip__ext", "aria-hidden": "true", text: "\u2197\uFE0E" })]
    );
  }
  return el("span", { class: "pchip", style }, inner);
}

/**
 * Group an Idea's portals by purpose, resolving a link for each (the per-idea
 * link if present, otherwise the tool's home). Returns only non-empty groups.
 */
export function portalGroups(portalIds = [], config, links = []) {
  const linkFor = (id) => {
    const specific = links.find((l) => l.portalId === id)?.url;
    return specific || config.portals.get(id)?.home || "";
  };
  return GROUPS.map((group) => {
    const portals = portalIds
      .map((id) => config.portals.get(id))
      .filter((p) => p && group.categories.includes(p.category))
      .map((p) => ({ portal: p, href: linkFor(p.id) }));
    return { ...group, portals };
  }).filter((group) => group.portals.length > 0);
}
