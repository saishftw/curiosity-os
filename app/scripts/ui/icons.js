// Inline, monochrome SVG marks for each portal. Zero-dependency: every icon uses
// `currentColor`, so the portal's brand tint is applied by the surrounding chip.
// These are simplified, original geometric marks evoking each tool — not exact
// trademark artwork.

const MARKS = {
  // ChatGPT — a six-lobed rosette (three rotated ellipses).
  chatgpt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true" focusable="false">
    <ellipse cx="12" cy="12" rx="8" ry="3.4"/>
    <ellipse cx="12" cy="12" rx="8" ry="3.4" transform="rotate(60 12 12)"/>
    <ellipse cx="12" cy="12" rx="8" ry="3.4" transform="rotate(120 12 12)"/>
  </svg>`,

  // Claude — a radiating sunburst.
  claude: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true" focusable="false">
    <path d="M15.5 12h5M14.5 14.5l3.5 3.5M12 15.5v5M9.5 14.5l-3.5 3.5M8.5 12h-5M9.5 9.5 6 6M12 8.5v-5M14.5 9.5 18 6"/>
  </svg>`,

  // Gemini — a four-point spark.
  gemini: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M12 2c.3 4.9 5.1 9.7 10 10-4.9.3-9.7 5.1-10 10-.3-4.9-5.1-9.7-10-10 4.9-.3 9.7-5.1 10-10Z"/>
  </svg>`,

  // Perplexity — two interlocking rings.
  perplexity: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true" focusable="false">
    <circle cx="9.2" cy="12" r="5.3"/>
    <circle cx="14.8" cy="12" r="5.3"/>
  </svg>`,

  // Grok — angular diagonal shards.
  grok: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M12.6 3H17l-5 8.8-2.3-1.3L12.6 3Z"/>
    <path d="M9.6 12.3 7 21h4.4l2-3.6-3.8-5.1Z"/>
  </svg>`,

  // GitHub Copilot — a visored face.
  "github-copilot": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path d="M5 12.5C5 9 7.6 7 12 7s7 2 7 5.5V16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3.5Z"/>
    <path d="M12 7c0-1.6-1-3-3-3"/>
    <circle cx="9.3" cy="13" r="1.15" fill="currentColor" stroke="none"/>
    <circle cx="14.7" cy="13" r="1.15" fill="currentColor" stroke="none"/>
  </svg>`,

  // Claude Code — a terminal.
  "claude-code": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <rect x="3" y="5" width="18" height="14" rx="3"/>
    <path d="M7.5 10.5 10 13l-2.5 2.5"/>
    <path d="M12.5 15.5H16"/>
  </svg>`,

  // Cursor — an isometric cube.
  cursor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z"/>
    <path d="M12 12v9M12 12l8-4.5M12 12 4 7.5"/>
  </svg>`,

  // GitHub — a branch/merge graph.
  github: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true" focusable="false">
    <path d="M7 8.4C7 12.5 12 12 12 16.4M17 8.4C17 12.5 12 12 12 16.4"/>
    <circle cx="7" cy="6.3" r="2.1" fill="currentColor" stroke="none"/>
    <circle cx="17" cy="6.3" r="2.1" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="18.5" r="2.1" fill="currentColor" stroke="none"/>
  </svg>`,

  // Notes — a lined notebook.
  notes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <rect x="5" y="3.5" width="14" height="17" rx="2.5"/>
    <path d="M9 8h6M9 12h6M9 16h4"/>
  </svg>`,

  _fallback: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true" focusable="false">
    <rect x="4" y="4" width="16" height="16" rx="5"/>
    <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/>
  </svg>`,
};

/** Return an <svg> element for a portal id, or a neutral fallback. */
export function portalIcon(name) {
  const template = document.createElement("template");
  template.innerHTML = (MARKS[name] || MARKS._fallback).trim();
  return template.content.firstElementChild;
}

// UI marks — clean line icons (lucide-ish) used for section markers, badges,
// nav, and small affordances. Monochrome via currentColor.
const UI_MARKS = {
  spark: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c.45 5.1 3.4 8.05 8.5 8.5-5.1.45-8.05 3.4-8.5 8.5-.45-5.1-3.4-8.05-8.5-8.5C8.6 10.05 11.55 7.1 12 2Z"/></svg>`,
  history: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5v5h5"/><path d="M4.5 9.5A9 9 0 1 1 3.2 14"/><path d="M12 8v4.5l3 1.7"/></svg>`,
  timer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5"/><path d="M9.5 2.5h5"/><path d="M19.5 6 18 7.5"/></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 1 0-5-5l-1.5 1.5"/><path d="M14 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 1 0 5 5l1.5-1.5"/></svg>`,
  dice: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16"/><g fill="currentColor" stroke="none"><circle cx="9" cy="9" r="1.3"/><circle cx="15" cy="9" r="1.3"/><circle cx="9" cy="15" r="1.3"/><circle cx="15" cy="15" r="1.3"/></g></svg>`,
  flame: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c.5 3 4 4.7 4 8.5a4 4 0 0 1-8 0c0-1.3.5-2.2 1.1-2.9C9.8 10 10 8.7 9.7 7.5 11.2 8 12 6.2 12 3Z"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M9 5v14"/><path d="M15 5v14"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19c-1-8 5-14 15-14 0 9-6 15-14 14"/><path d="M5 19c2-4 5-6 9-7"/></svg>`,
  trend: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 16l5-5 4 4 8-8"/><path d="M15 7h5v5"/></svg>`,
  square: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="4.5" y="4.5" width="15" height="15"/></svg>`,
  compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2.2 4.8-4.8 2.2 2.2-4.8z"/></svg>`,
  cube: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 20 7.5v9L12 21 4 16.5v-9z"/><path d="M12 12v9M12 12l8-4.5M12 12 4 7.5"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="m11 6-6 6 6 6"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>`,
  "check-square": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16"/><path d="m8.4 12 2.5 2.5 4.7-5.2"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11"/><path d="M15 9V4H4v11h5"/></svg>`,
  external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 5h5v5"/><path d="m19 5-8 8"/><path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 6c-1.5-1.2-3.6-2-6-2H4v13h2c2.4 0 4.5.8 6 2 1.5-1.2 3.6-2 6-2h2V4h-2c-2.4 0-4.5.8-6 2z"/><path d="M12 6v13"/></svg>`,
  terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14"/><path d="m7 10 3 2.5L7 15"/><path d="M12.5 15H16"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11.5 12 5l8 6.5"/><path d="M6 10.2V19h12v-8.8"/></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="m12 4 8 4.5-8 4.5-8-4.5z"/><path d="m4 13.5 8 4.5 8-4.5"/></svg>`,
  tag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h7l9 9-7 7-9-9z"/><circle cx="8.6" cy="8.6" r="1.25" fill="currentColor" stroke="none"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c1-3.6 4-5.2 7-5.2s6 1.6 7 5.2"/></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V4"/><path d="m7.5 8.5 4.5-4.5 4.5 4.5"/><path d="M5 16v3h14v-3"/></svg>`,
};

/** Return an <svg> element for a UI mark, defaulting to the spark. */
export function uiIcon(name) {
  const template = document.createElement("template");
  template.innerHTML = (UI_MARKS[name] || UI_MARKS.spark).trim();
  return template.content.firstElementChild;
}

// Idea emblems — a small gallery of evocative marks the Librarian (Copilot)
// chooses from per Idea (stored as `emblem` in idea.json / index.json). Larger,
// more illustrative than the UI marks; rendered white inside the head's box.
const EMBLEM_MARKS = {
  brain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M12 5.4a3 3 0 0 0-5.3-1.9A3 3 0 0 0 4 8.4a3 3 0 0 0 .2 5.4A3 3 0 0 0 7.5 18 3 3 0 0 0 12 18.8Z"/><path d="M12 5.4a3 3 0 0 1 5.3-1.9A3 3 0 0 1 20 8.4a3 3 0 0 1-.2 5.4A3 3 0 0 1 16.5 18 3 3 0 0 1 12 18.8Z"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v5.5c0 4.4-3 7.4-7 8.5-4-1.1-7-4.1-7-8.5V6z"/><path d="m9 12 2 2 4-4.5"/></svg>`,
  coins: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><ellipse cx="8.5" cy="7" rx="4.5" ry="2.3"/><path d="M4 7v4c0 1.3 2 2.3 4.5 2.3"/><ellipse cx="15.5" cy="14" rx="4.5" ry="2.3"/><path d="M11 14.2v3.8c0 1.3 2 2.3 4.5 2.3s4.5-1 4.5-2.3v-4"/></svg>`,
  gauge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 18a8 8 0 1 1 15 0"/><path d="M12 14.5 15.6 11"/></svg>`,
  pulse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h4l2.5-6 4.5 12 2.5-6H21"/></svg>`,
  network: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="6" cy="6" r="2.2"/><circle cx="18" cy="6" r="2.2"/><circle cx="12" cy="18" r="2.2"/><path d="M7.6 7.6 10.6 16M16.4 7.6 13.4 16M8.2 6h7.6"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19c-1-8 5-14 15-14 0 9-6 15-14 14"/><path d="M5 19c2-4 5-6 9-7"/></svg>`,
  flask: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6M10 3v6.5l-4.6 7.4A2 2 0 0 0 7.1 20h9.8a2 2 0 0 0 1.7-3.1L14 9.5V3"/><path d="M7.5 14.5h9"/></svg>`,
  compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2.2 4.8-4.8 2.2 2.2-4.8z"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M13 3 5 13.5h6l-1 7.5 8-10.5h-6z"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18"/></svg>`,
  target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none"/></svg>`,
  rocket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 14.5c-1.2 1-1.5 4.5-1.5 4.5s3.5-.3 4.5-1.5m-3.5-3C5 12 9 4 18 4c0 9-8 13-9.5 13.5z"/><circle cx="14.5" cy="9.5" r="1.4"/></svg>`,
};

/**
 * Return an <svg> emblem for an Idea. `name` comes from the Idea's `emblem`
 * field; unknown or missing names fall back to the spark.
 */
export function emblemIcon(name) {
  const template = document.createElement("template");
  template.innerHTML = (EMBLEM_MARKS[name] || UI_MARKS.spark).trim();
  return template.content.firstElementChild;
}

/** The emblem names the Librarian may choose from (for prompts/tooling). */
export const EMBLEM_NAMES = Object.keys(EMBLEM_MARKS);
