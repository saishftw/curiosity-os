// Home — an invitation, not a dashboard. One Idea leads as a featured editorial
// block; below it, a few narrated sections (the Librarian's quiet voice) gently
// invite you back in. The full set of lenses lives on the Browse page.

import { el, daysBetween } from "../ui/dom.js";
import { ideaEntry, badge } from "../ui/card.js";
import { uiIcon } from "../ui/icons.js";
import { copyPublishPrompt } from "./publish.js";

export function homeView({ config, index }) {
  const ideas = index.ideas || [];
  if (ideas.length === 0) return emptyHome();

  const picks = pickFrontPage(ideas);
  const shown = new Set(
    [picks.featured.slug, picks.archive?.slug, picks.pick?.slug].filter(Boolean)
  );
  const ctx = { ideas, index, config, shown };

  const root = el("div", { class: "container--page home" });
  root.appendChild(masthead(ideas.length));
  root.appendChild(frontPage(picks));

  const sections = el("div", { class: "bands" });
  let order = 3;
  for (const build of [rediscover, oneHour, unexpectedConnections, surprise]) {
    const node = build(ctx, order);
    if (node) {
      sections.appendChild(node);
      order += 1;
    }
  }
  root.appendChild(sections);
  root.appendChild(browseLink());
  return root;
}

function masthead(count) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const tally = `${count} ${count === 1 ? "curiosity" : "curiosities"} in the collection`;
  return el("div", { class: "masthead enter", style: { "--i": 0 } }, [
    el("p", { class: "masthead__eyebrow", text: "A library of curiosities" }),
    el("h1", {
      class: "masthead__title",
      text: "Currently Exploring",
    }),
    el("p", { class: "masthead__edition", text: `${today} · ${tally}` }),
    el("div", { class: "masthead__actions" }, [
      el("button", { class: "btn btn--accent btn--icon", onClick: () => copyPublishPrompt() }, [
        el("span", { class: "btn__glyph", "aria-hidden": "true" }, [uiIcon("upload")]),
        "Publish",
      ]),
      el("a", { class: "btn btn--ghost btn--icon", href: "#/capture" }, [
        el("span", { class: "btn__glyph", "aria-hidden": "true" }, [uiIcon("plus")]),
        "Capture",
      ]),
    ]),
  ]);
}

// — Narrated sections ------------------------------------------------------

function rediscover({ ideas, index, config, shown }, order) {
  const members = ideas
    .filter(
      (i) =>
        !shown.has(i.slug) &&
        (i.signals?.interestingAgain || i.signals?.unfinished)
    )
    .sort((a, b) => a.created.localeCompare(b.created))
    .slice(0, 4);
  if (!members.length) return null;
  members.forEach((m) => shown.add(m.slug));

  const oldest = members[0];
  const months = Math.max(
    1,
    Math.round(daysBetween(index.generatedAt, oldest.created) / 30)
  );
  const note = `You've circled “${oldest.title}” for ${months} month${
    months === 1 ? "" : "s"
  } — it keeps resurfacing.`;

  return narratedBand(
    { icon: "history", label: "Rediscover", note },
    members.map((m, i) => ideaEntry(m, config, i)),
    order
  );
}

function oneHour({ ideas, config, shown }, order) {
  const members = ideas
    .filter((i) => !shown.has(i.slug) && i.intent)
    .sort((a, b) => (b.metadata?.momentum ?? 0) - (a.metadata?.momentum ?? 0))
    .slice(0, 3);
  if (!members.length) return null;
  members.forEach((m) => shown.add(m.slug));

  return narratedBand(
    {
      icon: "timer",
      label: "One-hour explorations",
      note: "Each has a small next step — perfect for an hour you weren't sure how to spend.",
    },
    members.map((m, i) => ideaEntry(m, config, i, { lead: "intent" })),
    order
  );
}

function unexpectedConnections({ ideas, index }, order) {
  const titleFor = (slug) =>
    index.ideas.find((i) => i.slug === slug)?.title || slug;
  const seen = new Set();
  const pairs = [];
  for (const idea of ideas) {
    for (const connection of idea.connections || []) {
      const key = [idea.slug, connection.to].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({ from: idea.title, ...connection });
    }
  }
  if (!pairs.length) return null;

  const cards = pairs.slice(0, 3).map((pair) =>
    el("a", { class: "connection", href: `#/idea/${pair.to}` }, [
      el("div", { class: "connection__main" }, [
        el("h3", { class: "connection__title connection__title--pair" }, [
          el("span", { text: pair.from }),
          el("span", { class: "connection__amp", "aria-hidden": "true", text: "\u2194\uFE0E" }),
          el("span", { text: titleFor(pair.to) }),
        ]),
        pair.relation &&
          el("p", { class: "connection__why", text: pair.relation }),
      ]),
      pair.concepts?.length &&
        el(
          "div",
          { class: "connection__concepts" },
          pair.concepts.map((concept) => el("span", { class: "chip", text: concept }))
        ),
    ])
  );

  return narratedBand(
    {
      icon: "link",
      label: "Unexpected connections",
      note: "Two curiosities that turned out to share a spine.",
    },
    cards,
    order
  );
}

function surprise({ ideas, index, config, shown }, order) {
  const pool = ideas.filter((i) => !shown.has(i.slug));
  if (!pool.length) return null;
  const pick = seededShuffle(pool, index.generatedAt)[0];
  shown.add(pick.slug);
  return narratedBand(
    { icon: "dice", label: "Surprise me", note: "A door you forgot was here." },
    [ideaEntry(pick, config, 0)],
    order
  );
}

// — Building blocks --------------------------------------------------------

function narratedBand({ icon, label, note }, entries, order) {
  return el("section", { class: "band enter", style: { "--i": order } }, [
    el("div", { class: "band__label" }, [
      el("h2", { class: "band__heading" }, [
        icon &&
          el("span", { class: "band__mark", "aria-hidden": "true" }, [uiIcon(icon)]),
        el("span", { text: label }),
      ]),
      note &&
        el("p", { class: "band__note" }, [
          el("span", { class: "band__note-mark", "aria-hidden": "true" }, [
            uiIcon("spark"),
          ]),
          note,
        ]),
    ]),
    el("div", { class: "band__entries" }, entries),
  ]);
}

function browseLink() {
  return el("div", { class: "home__browse enter" }, [
    el("a", { class: "btn btn--ghost btn--icon", href: "#/browse" }, [
      "Browse everything",
      el("span", { class: "btn__glyph", "aria-hidden": "true" }, [uiIcon("arrow")]),
    ]),
  ]);
}

// The front page: a featured lead story plus a right rail (an archive find and an
// inverted editorial pick). With few Ideas it draws all three; the bands below
// then surface only what isn't already on the front page.
function pickFrontPage(ideas) {
  const sorted = ideas
    .slice()
    .sort((a, b) => (b.metadata?.momentum ?? 0) - (a.metadata?.momentum ?? 0));
  const featured = sorted[0];
  const archive =
    ideas.find(
      (i) =>
        i.slug !== featured.slug &&
        (i.signals?.interestingAgain || i.signals?.unfinished)
    ) || sorted.find((i) => i.slug !== featured.slug);
  const pick = sorted.find(
    (i) => i.slug !== featured.slug && i.slug !== archive?.slug
  );
  return { featured, archive, pick };
}

function frontPage({ featured, archive, pick }) {
  const rail = [
    archive && railCard(archive, "Worth revisiting", "history"),
    pick && pickCard(pick),
  ].filter(Boolean);
  return el(
    "section",
    {
      class: `frontpage enter${rail.length ? "" : " frontpage--solo"}`,
      style: { "--i": 1 },
    },
    [
      leadCard(featured),
      rail.length ? el("div", { class: "frontpage__rail" }, rail) : null,
    ]
  );
}

function leadCard(idea) {
  const insight = idea.lastInsight || idea.summary;
  return el("a", { class: "frontpage__lead", href: `#/idea/${idea.slug}` }, [
    el("div", { class: "frontpage__kicker" }, [badge("Top of mind", "feature")]),
    el("h2", { class: "frontpage__headline", text: idea.title }),
    el("hr", { class: "frontpage__rule" }),
    el("div", { class: "frontpage__meta" }, [
      el("div", {}, [
        el("p", { class: "frontpage__label", text: "Current intent" }),
        el("p", { class: "frontpage__intent", text: idea.intent }),
      ]),
      el("div", {}, [
        el("p", { class: "frontpage__label", text: "Last insight" }),
        el("blockquote", { class: "frontpage__insight", text: insight }),
      ]),
    ]),
  ]);
}

function railCard(idea, kicker, icon) {
  return el("a", { class: "frontpage__archive", href: `#/idea/${idea.slug}` }, [
    el("p", { class: "frontpage__railkicker" }, [
      el("span", { class: "frontpage__railicon", "aria-hidden": "true" }, [uiIcon(icon)]),
      kicker,
    ]),
    el("h3", { class: "frontpage__railhead", text: idea.title }),
    el("p", { class: "frontpage__railbody", text: idea.summary }),
  ]);
}

function pickCard(idea) {
  return el("a", { class: "frontpage__pick", href: `#/idea/${idea.slug}` }, [
    el("p", { class: "frontpage__pickkicker" }, [
      el("span", { class: "frontpage__railicon", "aria-hidden": "true" }, [uiIcon("spark")]),
      "The Librarian's pick",
    ]),
    el("h3", { class: "frontpage__railhead", text: idea.title }),
    el("p", { class: "frontpage__railbody", text: idea.summary }),
  ]);
}

// A shuffle seeded by the day, so "Surprise me" is stable within a visit.
function seededShuffle(list, seedString) {
  let seed = [...String(seedString)].reduce((sum, ch) => sum + ch.charCodeAt(0), 7);
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function emptyHome() {
  return el("section", { class: "container empty enter" }, [
    el("div", { class: "empty__art", "aria-hidden": "true" }, [uiIcon("spark")]),
    el("h1", {
      class: "empty__title",
      text: "What has been on your mind lately?",
    }),
    el("p", {
      class: "empty__sub",
      text: "Capture the first curiosity, and it will be waiting here when you return.",
    }),
    el("p", { style: { marginTop: "1.5rem" } }, [
      el("a", { class: "btn btn--accent btn--icon", href: "#/capture" }, [
        el("span", { class: "btn__glyph", "aria-hidden": "true" }, [uiIcon("plus")]),
        "Capture an idea",
      ]),
    ]),
  ]);
}
