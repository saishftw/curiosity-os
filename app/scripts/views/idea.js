// The Idea page. Opening an Idea never shows raw Markdown first — it opens with
// an editorial masthead and a Resume Thinking block (last insight, current intent,
// open questions, next step), then the deep content in tabs, with a context rail
// (open loops, connected ideas, edition metadata) alongside.

import { el, frag, formatDate, daysBetween } from "../ui/dom.js";
import { renderMarkdown, parseTimeline, parseBullets } from "../markdown.js";
import { badge } from "../ui/card.js";
import { uiIcon, emblemIcon } from "../ui/icons.js";
import { portalGroups, portalChip, portalMark } from "../ui/portals.js";
import { openSheet, copyText, openUrl } from "../ui/overlays.js";

const ACTIVITY_ICONS = {
  exploring: "compass",
  building: "cube",
  observing: "eye",
  paused: "pause",
  researching: "search",
};
const TAB_ICONS = {
  timeline: "history",
  knowledge: "book",
  sessions: "terminal",
  about: "eye",
};

export function ideaView(data) {
  const { config, entry, timeline, openLoops, connections } = data;
  const events = parseTimeline(timeline);
  const latest = events.length ? events[events.length - 1] : null;
  const loops = parseBullets(openLoops);
  const activity = config.activities.get(entry.activity);

  const rail = ideaRail(entry, { loops, connections, activity, config });
  const tabs = tabsBlock({ events, data, config, rail });

  const main = el("div", { class: "idea__main" }, [
    ideaHead(entry, activity, config),
    whereThisLives(entry, data, config),
    resumeThinking(entry, latest, loops, data, config),
    tabs.node,
  ]);

  const body = el("div", { class: "idea__body" }, [main]);
  const root = el("div", { class: "idea" }, [
    editorialBar(entry),
    el("div", { class: "idea__sheet" }, [body]),
  ]);

  // The context rail is a right-hand column on desktop, and the "About" tab on
  // phones — placed now and kept in sync as the viewport crosses the breakpoint.
  if (tabs.aboutPanel) placeRail(root, body, tabs, rail);
  else body.appendChild(rail);

  return root;
}

function placeRail(root, body, tabs, rail) {
  const mq = window.matchMedia("(max-width: 60rem)");
  const apply = () => {
    if (mq.matches) tabs.aboutPanel.appendChild(rail);
    else body.appendChild(rail);
    tabs.setAboutVisible(mq.matches);
  };
  apply();
  const onChange = () => {
    if (!root.isConnected) {
      mq.removeEventListener("change", onChange);
      return;
    }
    apply();
  };
  mq.addEventListener("change", onChange);
}

function editorialBar(entry) {
  return el("div", { class: "idea__bar" }, [
    el("a", { class: "idea__brand", href: "#/", "aria-label": "Curiosity OS — home" }, [
      uiIcon("spark"),
    ]),
    el("a", { class: "idea__back", href: "#/" }, [
      el("span", { class: "idea__backico", "aria-hidden": "true" }, [uiIcon("back")]),
      el("span", { text: "Back to ideas" }),
    ]),
    el("p", { class: "idea__edition", text: entry.title }),
  ]);
}

function ideaHead(entry, activity, config) {
  const topics = (entry.topics || []).map((id) =>
    el("span", { class: "chip", text: config.topics.get(id)?.name || id })
  );
  return el("section", { class: "idea__head enter", style: { "--i": 0 } }, [
    el("div", { class: "idea__headmain" }, [
      activity && badge(activity.name),
      el("h1", { class: "idea__title", text: entry.title }),
      el("p", { class: "idea__lede", text: entry.summary }),
      topics.length && el("div", { class: "chips idea__topics" }, topics),
      headMeta(entry),
      metaStrip(entry, config),
    ]),
    el("div", { class: "idea__emblem", "aria-hidden": "true" }, [emblemIcon(entry.emblem)]),
  ]);
}

// A compact metadata glance shown only on phones/tablets, where the full
// metadata lives in the "About" tab rather than a side column.
function metaStrip(entry, config) {
  const m = entry.metadata || {};
  const types = config.metadataTypes || [];
  if (!types.length) return null;
  return el(
    "div",
    { class: "idea__metastrip", "aria-hidden": "true" },
    types.map((t) => {
      const filled = Math.max(0, Math.min(5, Math.round((m[t.id] ?? 0) * 5)));
      const accent = t.id === "momentum";
      return el("span", { class: "metastrip__item" }, [
        el("span", { class: "metastrip__label", text: t.name }),
        el(
          "span",
          { class: "meta__dots" },
          Array.from({ length: 5 }, (_, i) =>
            el("span", {
              class: `meta__dot${i < filled ? " meta__dot--on" : ""}${accent ? " meta__dot--accent" : ""}`,
            })
          )
        ),
      ]);
    })
  );
}

function headMeta(entry) {
  const bits = [];
  if (entry.created) bits.push(`Captured ${formatDate(entry.created, "short")}`);
  if (entry.updated) bits.push(`Last active ${daysAgo(entry.updated)}`);
  const n = entry.metadata?.counts?.sessions;
  if (n) bits.push(`${n} session${n === 1 ? "" : "s"}`);
  const out = [];
  bits.forEach((bit, i) => {
    if (i) out.push(el("span", { class: "idea__metadot", "aria-hidden": "true", text: "·" }));
    out.push(el("span", { text: bit }));
  });
  return el("p", { class: "idea__metaline" }, out);
}

function daysAgo(iso) {
  const today = new Date().toISOString().slice(0, 10);
  const days = daysBetween(today, iso);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

// — Resume thinking: the first thing you see. Four cells, two of them loud. —
function resumeThinking(entry, latest, loops, data, config) {
  const insight = entry.lastInsight || (latest && latest.title) || "Still early.";
  const intent = entry.intent || "Decide the next small step.";
  const last = entry.updated ? daysAgo(entry.updated) : "recently";

  return el("section", { class: "resume enter", style: { "--i": 2 } }, [
    el("div", { class: "resume__head" }, [
      el("span", { class: "resume__mark", "aria-hidden": "true" }, [uiIcon("spark")]),
      el("span", { class: "resume__title", text: "Resume thinking" }),
      el("span", { class: "resume__hint", text: "Pick up where you left off" }),
    ]),
    el("div", { class: "resume__grid" }, [
      resumeCell("Last insight", el("p", { class: "resume__body", text: insight }), last),
      resumeCell(
        "Current intent",
        el("p", { class: "resume__body", text: intent }),
        `Updated ${last}`
      ),
      openCell(loops),
      nextCell(intent, entry, data, config),
    ]),
  ]);
}

function resumeCell(label, body, foot) {
  return el("div", { class: "resume__cell" }, [
    el("p", { class: "resume__label", text: label }),
    body,
    foot && el("p", { class: "resume__foot num", text: foot }),
  ]);
}

function openCell(loops) {
  const body = loops.length
    ? el(
        "ul",
        { class: "resume__qs" },
        loops.slice(0, 3).map((q) =>
          el("li", { class: "resume__q" }, [
            el("span", { class: "resume__qmark", "aria-hidden": "true" }),
            el("span", { text: truncate(q, 72) }),
          ])
        )
      )
    : el("p", { class: "resume__body", text: "No open loops yet." });
  return el("div", { class: "resume__cell resume__cell--ink" }, [
    el("p", { class: "resume__label", text: "Open questions" }),
    body,
    el("p", {
      class: "resume__foot num",
      text: `${loops.length} open loop${loops.length === 1 ? "" : "s"}`,
    }),
  ]);
}

function nextCell(intent, entry, data, config) {
  return el("div", { class: "resume__cell resume__cell--accent" }, [
    el("div", {}, [
      el("p", { class: "resume__label", text: "Next step" }),
      el("p", { class: "resume__body resume__body--lead", text: intent }),
    ]),
    el(
      "button",
      {
        class: "resume__continue",
        onClick: () => continueIn(entry, data, config),
      },
      [
        el("span", { text: "Continue" }),
        el("span", { class: "resume__continueico", "aria-hidden": "true" }, [uiIcon("arrow")]),
      ]
    ),
  ]);
}

// — Where this lives: the tools the Idea lives in; brand colour blooms on hover. —
function whereThisLives(entry, data, config) {
  if (!entry.portalIds?.length) return null;
  const groups = portalGroups(entry.portalIds, config, data.portalLinks);
  if (!groups.length) return null;
  return el("section", { class: "where enter", style: { "--i": 1 } }, [
    el("div", { class: "where__head" }, [
      el("span", { class: "where__mark", "aria-hidden": "true" }, [uiIcon("compass")]),
      el("span", { class: "where__title", text: "Portals" }),
      el("span", { class: "where__hint", text: "Continue in your tools" }),
    ]),
    el(
      "div",
      { class: "where__groups" },
      groups.map((group) =>
        el("div", { class: "where__group" }, [
          el("p", { class: "where__label", text: group.label }),
          el(
            "div",
            { class: "where__chips" },
            group.portals.map(({ portal, href }) =>
              portalChip(portal, { href: href || undefined })
            )
          ),
        ])
      )
    ),
  ]);
}

// — Tabs: the deep content, plus an "About" tab that carries the context rail on
//   phones (on desktop the rail is a side column, so About is hidden there). —
function tabsBlock({ events, data, config, rail }) {
  const tabs = [];
  if (events.length) {
    tabs.push({ id: "timeline", label: "Timeline", node: timelinePanel(events) });
  }
  const knowledgeNode = knowledgePanel(data.readme, data.knowledge);
  if (knowledgeNode) tabs.push({ id: "knowledge", label: "Knowledge", node: knowledgeNode });
  if (data.sessions.length) {
    tabs.push({ id: "sessions", label: "Sessions", node: sessionsPanel(data.sessions, config) });
  }
  if (rail) tabs.push({ id: "about", label: "About", node: null, about: true });
  if (!tabs.length) return { node: null, aboutPanel: null, setAboutVisible: () => {} };

  const list = el("div", { class: "tabs__list", role: "tablist", "aria-label": "Idea content" });
  const panels = el("div", { class: "tabs__panels" });
  let aboutPanel = null;
  let aboutTab = null;

  const visible = () => [...list.children].filter((b) => b.offsetParent !== null);
  const select = (idx) => {
    [...list.children].forEach((b, i) => {
      b.setAttribute("aria-selected", String(i === idx));
      b.tabIndex = i === idx ? 0 : -1;
    });
    [...panels.children].forEach((p, i) =>
      i === idx ? p.removeAttribute("hidden") : p.setAttribute("hidden", "")
    );
  };
  const onKeys = (event, idx) => {
    const vis = visible();
    const pos = vis.indexOf(list.children[idx]);
    let nextBtn = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextBtn = vis[(pos + 1) % vis.length];
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextBtn = vis[(pos - 1 + vis.length) % vis.length];
    else if (event.key === "Home") nextBtn = vis[0];
    else if (event.key === "End") nextBtn = vis[vis.length - 1];
    if (nextBtn) {
      event.preventDefault();
      const i = [...list.children].indexOf(nextBtn);
      select(i);
      nextBtn.focus();
    }
  };

  tabs.forEach((tab, i) => {
    const btn = el(
      "button",
      {
        class: `tabs__tab${tab.about ? " tabs__tab--about" : ""}`,
        role: "tab",
        id: `tab-${tab.id}`,
        "aria-controls": `panel-${tab.id}`,
        "aria-selected": String(i === 0),
        tabindex: i === 0 ? "0" : "-1",
        onClick: () => select(i),
        onKeydown: (event) => onKeys(event, i),
      },
      [
        el("span", { class: "tabs__ico", "aria-hidden": "true" }, [uiIcon(TAB_ICONS[tab.id] || "spark")]),
        el("span", { class: "tabs__label", text: tab.label }),
      ]
    );
    const panel = el(
      "section",
      {
        class: `tabs__panel${tab.about ? " tabs__panel--about" : ""}`,
        role: "tabpanel",
        id: `panel-${tab.id}`,
        "aria-labelledby": `tab-${tab.id}`,
        tabindex: "0",
        hidden: i !== 0,
      },
      tab.node ? [tab.node] : []
    );
    if (tab.about) {
      aboutPanel = panel;
      aboutTab = btn;
    }
    list.appendChild(btn);
    panels.appendChild(panel);
  });

  const setAboutVisible = (mobile) => {
    if (!mobile && aboutTab && aboutTab.getAttribute("aria-selected") === "true") select(0);
  };

  return {
    node: el("div", { class: "tabs enter", style: { "--i": 3 } }, [list, panels]),
    aboutPanel,
    setAboutVisible,
  };
}

function timelinePanel(events) {
  return el("div", { class: "panel-body" }, [
    el("h2", { class: "panel__heading", text: "The evolution of this idea" }),
    el(
      "div",
      { class: "timeline" },
      events
        .slice()
        .reverse()
        .map((event, i) =>
          el("div", { class: "tl-event", style: { "--i": i } }, [
            el("p", { class: "tl-event__date num", text: formatDate(event.date) }),
            el("h3", { class: "tl-event__title", text: event.title }),
            event.body &&
              el("div", { class: "tl-event__body prose", html: renderMarkdown(event.body) }),
          ])
        )
    ),
  ]);
}

function knowledgePanel(readme, knowledge) {
  const body = readmeBody(readme);
  if (!body.trim() && !knowledge.length) return null;
  const node = el("div", { class: "panel-body" });
  if (body.trim()) {
    node.appendChild(el("div", { class: "prose", html: renderMarkdown(body) }));
  }
  knowledge.forEach((doc, i) =>
    node.appendChild(
      el("details", { class: "panel", open: i === 0 }, [
        el("summary", { class: "panel__head" }, [
          el("span", { class: "panel__title", text: doc.title }),
          el("span", { class: "panel__chev", "aria-hidden": "true" }, [uiIcon("chevron")]),
        ]),
        el("div", { class: "panel__body prose", html: renderMarkdown(stripLeadingH1(doc.md)) }),
      ])
    )
  );
  return node;
}

// Knowledge files needn't repeat their own title — the accordion head already
// shows it (from index.json). Drop a redundant leading H1 if present.
function stripLeadingH1(md) {
  return String(md).replace(/^\s*#\s+.*(?:\r?\n)+/, "");
}

function sessionsPanel(sessions, config) {
  const items = sessions
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((session) => {
      const portal = config.portals.get(session.portalId);
      return el("details", { class: "session" }, [
        el("summary", { class: "session__head" }, [
          portalMark(portal, "sm"),
          el("span", { class: "session__date num", text: formatDate(session.date) }),
          el("span", { class: "session__portal", text: portal?.name || session.portalId }),
        ]),
        el("div", { class: "session__body prose", html: renderMarkdown(session.md) }),
      ]);
    });
  return el("div", { class: "panel-body" }, [
    el("h2", { class: "panel__heading", text: "Thinking sessions" }),
    frag(items),
  ]);
}

// — Context rail: open loops, connected ideas, and the edition metadata. —
function ideaRail(entry, { loops, connections, activity, config }) {
  const rail = el("aside", { class: "idea__rail enter", style: { "--i": 1 } });
  rail.appendChild(metadataBlock(entry, activity, config));
  rail.appendChild(openLoopsBlock(loops));
  if (connections?.length) rail.appendChild(connectedBlock(connections));
  return rail;
}

function railHead(title, count) {
  return el("div", { class: "railblock__head" }, [
    el("h2", { class: "railblock__title", text: title }),
    count != null && el("span", { class: "railblock__count num", text: String(count) }),
  ]);
}

function openLoopsBlock(loops) {
  const list = loops.length
    ? el(
        "ul",
        { class: "looplist" },
        loops.map((q) =>
          el("li", { class: "loopitem" }, [
            el("span", { class: "loopitem__ico", "aria-hidden": "true" }, [uiIcon("check-square")]),
            el("span", { class: "loopitem__text", text: q }),
          ])
        )
      )
    : el("p", { class: "rail__empty", text: "No open loops right now." });
  return el("section", { class: "railblock" }, [railHead("Open loops", loops.length), list]);
}

function connectedBlock(connections) {
  const list = el(
    "div",
    { class: "connlist" },
    connections.map((c) =>
      el("a", { class: "connitem", href: `#/idea/${c.to}` }, [
        el("span", { class: "connitem__tile", "aria-hidden": "true" }, [uiIcon("link")]),
        el("span", { class: "connitem__text" }, [
          el("span", { class: "connitem__title", text: c.title || c.to }),
          c.relation && el("span", { class: "connitem__why", text: `Why: ${truncate(c.relation, 80)}` }),
        ]),
      ])
    )
  );
  return el("section", { class: "railblock" }, [railHead("Connected ideas", connections.length), list]);
}

function metadataBlock(entry, activity, config) {
  const m = entry.metadata || {};
  const counts = m.counts || {};
  const scalars = (config.metadataTypes || []).map((t) =>
    scalarRow(t.name, m[t.id] ?? 0, t.id === "momentum")
  );
  const activityVal = el("span", { class: "meta__text" }, [
    el("span", { class: "meta__actico", "aria-hidden": "true" }, [
      uiIcon(ACTIVITY_ICONS[entry.activity] || "compass"),
    ]),
    activity?.name || entry.activity || "—",
  ]);
  return el("section", { class: "railblock" }, [
    railHead("Edition metadata", null),
    el("div", { class: "meta" }, [
      ...scalars,
      metaRow("Activity", activityVal),
      metaRow(
        "Last active",
        el("span", { class: "meta__text num", text: entry.updated ? daysAgo(entry.updated) : "—" })
      ),
      metaRow("Sessions", el("span", { class: "meta__text num", text: String(counts.sessions ?? 0) })),
      metaRow("Connections", el("span", { class: "meta__text num", text: String(counts.connections ?? 0) })),
    ]),
  ]);
}

function metaRow(label, valueNode) {
  return el("div", { class: "meta__row" }, [
    el("span", { class: "meta__label", text: label }),
    valueNode,
  ]);
}

function scalarRow(label, value, accent) {
  const filled = Math.max(0, Math.min(5, Math.round(value * 5)));
  const dots = el(
    "span",
    { class: "meta__dots" },
    Array.from({ length: 5 }, (_, i) =>
      el("span", {
        class: `meta__dot${i < filled ? " meta__dot--on" : ""}${accent ? " meta__dot--accent" : ""}`,
      })
    )
  );
  return el("div", { class: "meta__row" }, [
    el("span", { class: "meta__label", text: label }),
    el("span", { class: "meta__val" }, [dots, el("span", { class: "meta__word", text: scaleWord(value) })]),
  ]);
}

function scaleWord(v) {
  if (v >= 0.85) return "Very high";
  if (v >= 0.65) return "High";
  if (v >= 0.45) return "Medium";
  if (v >= 0.25) return "Low";
  return "Quiet";
}

function continueIn(entry, data, config) {
  const pack = buildContextPack(entry, data);
  const groups = portalGroups(entry.portalIds, config, data.portalLinks);
  const sub =
    groups.length > 0
      ? "Pick where to continue — your context pack is copied as you go."
      : "Copy this context pack into your tool to pick up where you left off.";

  const groupNodes = groups.map((group) =>
    el("div", { class: "picker__group" }, [
      el("p", { class: "picker__grouplabel", text: group.label }),
      el(
        "div",
        { class: "picker" },
        group.portals.map(({ portal, href }) =>
          el(
            "button",
            {
              class: "picker__row",
              style: { "--portal-color": portal.color || "var(--ink-soft)" },
              onClick: async () => {
                await copyText(pack);
                if (href) openUrl(href);
              },
            },
            [
              portalMark(portal, "md"),
              el("span", { class: "picker__name", text: portal.name }),
              el("span", {
                class: "picker__cta",
                text: href ? "Copy & open ↗" : "Copy",
              }),
            ]
          )
        )
      ),
    ])
  );

  const packView = el(
    "details",
    { class: "picker__pack", open: groups.length === 0 },
    [
      el("summary", { text: "View context pack" }),
      el("pre", { class: "pack__pre", text: pack }),
      el(
        "button",
        {
          class: "btn btn--ghost",
          style: { marginTop: "0.75rem" },
          onClick: () => copyText(pack),
        },
        ["Copy only"]
      ),
    ]
  );

  openSheet({
    title: "Continue",
    sub,
    body: el("div", {}, [...groupNodes, packView]),
  });
}

function buildContextPack(entry, data) {
  const recent = parseTimeline(data.timeline).slice(-3).reverse();
  const loops = parseBullets(data.openLoops);
  const lines = [
    `# Context Pack — ${entry.title}`,
    "",
    `Right now: ${entry.intent}`,
    "",
    `Summary: ${entry.summary}`,
    "",
    `Last insight: ${entry.lastInsight}`,
  ];
  if (recent.length) {
    lines.push("", "Recent timeline:");
    recent.forEach((event) => lines.push(`- ${event.date} — ${event.title}`));
  }
  if (loops.length) {
    lines.push("", "Open loops:");
    loops.forEach((question) => lines.push(`- ${question}`));
  }
  if (data.knowledge.length) {
    lines.push("", "Knowledge on file:");
    data.knowledge.forEach((doc) => lines.push(`- ${doc.title}`));
  }
  lines.push("", "Continue from here.");
  return lines.join("\n");
}

// Show only the curated prose beneath the README divider (the title, summary, and
// intent already live in the head and resume blocks).
function readmeBody(readme) {
  const parts = String(readme).split(/\n---\s*\n/);
  return parts.length > 1 ? parts.slice(1).join("\n---\n") : "";
}

function truncate(value, max = 150) {
  const text = String(value).replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}


