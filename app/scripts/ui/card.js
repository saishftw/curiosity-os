// Idea browse units — quiet, typographic invitations rather than dense cards.
// `ideaEntry` is a single editorial row (title + one evocative line, with the
// rest revealed on hover/focus). `featuredLead` gives one Idea room to breathe.

import { el } from "./dom.js";
import { portalMark } from "./portals.js";
import { uiIcon } from "./icons.js";

// A page header bar that mirrors the Idea page's editorial bar: a bordered
// back cell (matching .idea__back) merged with a mono edition label, so the
// back control looks identical across the Library, Capture, and Idea screens.
export function pageBar(edition, { href = "#/", label = "Home" } = {}) {
  return el("div", { class: "pagebar" }, [
    el("a", { class: "idea__brand", href: "#/", "aria-label": "Curiosity OS — home" }, [
      uiIcon("spark"),
    ]),
    el("a", { class: "idea__back", href }, [
      el("span", { class: "idea__backico", "aria-hidden": "true" }, [uiIcon("back")]),
      el("span", { text: label }),
    ]),
    edition && el("p", { class: "idea__edition", text: edition }),
  ]);
}

export function momentumLevel(value) {
  if (value >= 0.7) return 3;
  if (value >= 0.45) return 2;
  return 1;
}

export function isBuildable(entry, config) {
  return (entry.portalIds || []).some(
    (id) => config?.portals.get(id)?.category === "code"
  );
}

function momentum(value) {
  const level = momentumLevel(value);
  const label = level === 3 ? "High momentum" : level === 2 ? "Steady" : "Quiet";
  const dots = el("span", { class: "momentum__dots", "aria-hidden": "true" });
  for (let n = 1; n <= 3; n++) {
    dots.appendChild(
      el("span", {
        class: `momentum__dot${n <= level ? " momentum__dot--on" : ""}`,
      })
    );
  }
  return el("span", { class: "momentum", title: label }, [
    dots,
    el("span", { class: "visually-hidden", text: label }),
  ]);
}

function portalsRow(entry, config) {
  const ids = (entry.portalIds || []).slice(0, 4);
  return el(
    "span",
    { class: "portals" },
    ids.map((id) => portalMark(config.portals.get(id), "sm"))
  );
}

// A small editorial badge — black box, white uppercase label. `feature` adds a
// red spark mark.
export function badge(label, variant) {
  return el("span", { class: `badge${variant ? ` badge--${variant}` : ""}` }, [
    variant === "feature" &&
      el("span", { class: "badge__mark", "aria-hidden": "true" }, [uiIcon("spark")]),
    label,
  ]);
}

// A single Idea as a calm editorial row. Only the title and one evocative line
// are shown at rest; intent, momentum, and portals appear on hover or focus.
export function ideaEntry(entry, config, position = 0, opts = {}) {
  const intentLead = opts.lead === "intent" && Boolean(entry.intent);
  const lead = intentLead ? entry.intent : entry.lastInsight || entry.summary;
  const revealLabel = intentLead ? "Last insight" : "Right now";
  const revealText = intentLead ? entry.lastInsight : entry.intent;
  const activity = config.activities.get(entry.activity);
  return el(
    "a",
    {
      class: "entry enter",
      href: `#/idea/${entry.slug}`,
      style: { "--i": position },
    },
    [
      activity && badge(activity.name),
      el("div", { class: "entry__head" }, [
        el("h3", { class: "entry__title", text: entry.title }),
        el("span", { class: "entry__arrow", "aria-hidden": "true" }, [uiIcon("arrow")]),
      ]),
      lead &&
        el("p", {
          class: `entry__insight${intentLead ? " entry__insight--intent" : ""}`,
          text: lead,
        }),
      opts.note && el("p", { class: "entry__matched", text: opts.note }),
      el("div", { class: "entry__more" }, [
        el("div", { class: "entry__more-inner" }, [
          revealText &&
            el("span", { class: "entry__intent" }, [
              el("span", { text: revealLabel }),
              revealText,
            ]),
          momentum(entry.metadata?.momentum ?? 0),
          portalsRow(entry, config),
        ]),
      ]),
    ]
  );
}

// One Idea given room to breathe at the top of Home — an editorial lead.
export function featuredLead(entry, view, config) {
  const insight = entry.lastInsight || entry.summary;
  return el(
    "a",
    { class: "featured enter", href: `#/idea/${entry.slug}`, style: { "--i": 1 } },
    [
      el("div", { class: "featured__body" }, [
        el("div", { class: "featured__kicker" }, [badge(view.label, "feature")]),
        el("h2", { class: "featured__title", text: entry.title }),
        entry.intent &&
          el("p", { class: "featured__intent" }, [
            el("span", { text: "Right now" }),
            entry.intent,
          ]),
        el("span", { class: "featured__cta" }, [
          "Resume",
          el("span", { "aria-hidden": "true", text: "→" }),
        ]),
      ]),
      insight && el("blockquote", { class: "featured__quote", text: insight }),
    ]
  );
}
