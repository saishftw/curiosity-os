// Browse — the full set of lenses over the same repository. A quiet segmented
// switch flips between feeling, topic, and activity; no lens owns an Idea.

import { el, clear, daysBetween } from "../ui/dom.js";
import { ideaEntry } from "../ui/card.js";
import { uiIcon } from "../ui/icons.js";

const VIEW_ICONS = {
  "interesting-again": "flame",
  "left-unfinished": "pause",
  "ready-to-build": "spark",
  "new-curiosities": "leaf",
  "building-momentum": "trend",
  "recently-discovered": "spark",
  "surprise-me": "dice",
};
const ACTIVITY_ICONS = {
  exploring: "compass",
  building: "cube",
  observing: "eye",
  paused: "pause",
  researching: "search",
};

export function browseView({ config, index }) {
  const ideas = index.ideas || [];
  const root = el("div", { class: "container--page browse" });

  root.appendChild(
    el("div", { class: "masthead enter", style: { "--i": 0 } }, [
      el("a", { class: "backlink", href: "#/" }, [
        uiIcon("back"),
        "Home",
      ]),
      el("h1", { class: "masthead__title", text: "Browse everything" }),
    ])
  );

  const lenses = [
    { id: "feeling", label: "By feeling" },
    { id: "topic", label: "By topic" },
    { id: "activity", label: "By activity" },
  ];
  let current = "feeling";

  const panel = el("div", { class: "browse__panel" });
  const render = () => {
    clear(panel);
    panel.appendChild(renderLens(current, ideas, config, index));
  };

  const switcher = el(
    "div",
    { class: "segmented enter", style: { "--i": 1 }, role: "tablist" },
    lenses.map((lens) =>
      el("button", {
        class: "segmented__btn",
        role: "tab",
        "aria-selected": String(lens.id === current),
        text: lens.label,
        onClick: () => {
          if (current === lens.id) return;
          current = lens.id;
          [...switcher.children].forEach((button, i) =>
            button.setAttribute("aria-selected", String(lenses[i].id === current))
          );
          render();
        },
      })
    )
  );

  root.appendChild(switcher);
  root.appendChild(panel);
  render();
  return root;
}

function renderLens(lensId, ideas, config, index) {
  const fragment = document.createDocumentFragment();
  let order = 0;
  const add = (label, members) => {
    if (!members.length) return;
    fragment.appendChild(
      band(label, members.map((m, i) => ideaEntry(m, config, i)), order++)
    );
  };

  if (lensId === "feeling") {
    for (const view of config.views) {
      add(
        { icon: VIEW_ICONS[view.id] || "spark", label: view.label, blurb: view.blurb },
        selectForView(view, ideas, index.generatedAt)
      );
    }
  } else if (lensId === "topic") {
    for (const topic of config.topics.values()) {
      add(
        { label: topic.name },
        ideas.filter((i) => (i.topics || []).includes(topic.id))
      );
    }
  } else {
    for (const activity of config.activities.values()) {
      add(
        { icon: ACTIVITY_ICONS[activity.id] || "compass", label: activity.name },
        ideas.filter((i) => i.activity === activity.id)
      );
    }
  }

  if (!fragment.childNodes.length) {
    fragment.appendChild(
      el("p", { class: "empty__sub", text: "Nothing under this lens yet." })
    );
  }
  return fragment;
}

function band({ icon, label, blurb }, entries, order) {
  return el("section", { class: "band enter", style: { "--i": order } }, [
    el("div", { class: "band__label" }, [
      el("h2", { class: "band__heading" }, [
        icon && el("span", { class: "band__mark", "aria-hidden": "true" }, [uiIcon(icon)]),
        el("span", { text: label }),
      ]),
      blurb && el("p", { class: "band__blurb", text: blurb }),
    ]),
    el("div", { class: "band__entries" }, entries),
  ]);
}

function selectForView(view, ideas, generatedAt) {
  let list = ideas.slice();
  switch (view.mode) {
    case "signal":
      list = list
        .filter((idea) => idea.signals && idea.signals[view.signal])
        .sort((a, b) => b.updated.localeCompare(a.updated));
      break;
    case "new":
      list = list
        .filter((idea) => daysBetween(generatedAt, idea.created) <= 45)
        .sort((a, b) => b.created.localeCompare(a.created));
      break;
    case "momentum":
      list = list
        .filter((idea) => (idea.metadata?.momentum ?? 0) >= 0.6)
        .sort((a, b) => (b.metadata?.momentum ?? 0) - (a.metadata?.momentum ?? 0));
      break;
    case "recent":
      list = list
        .filter((idea) => daysBetween(generatedAt, idea.updated) <= 21)
        .sort((a, b) => b.updated.localeCompare(a.updated));
      break;
    case "random":
      list = list.slice().sort(() => 0).slice(0, 3);
      break;
    default:
      list = [];
  }
  return list;
}
