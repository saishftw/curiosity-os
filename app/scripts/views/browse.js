// Browse — the full set of lenses over the same repository. A quiet segmented
// switch flips between feeling, topic, and activity; no lens owns an Idea.

import { el, clear, daysBetween } from "../ui/dom.js";
import { ideaEntry, pageBar } from "../ui/card.js";
import { uiIcon } from "../ui/icons.js";
import { searchIdeas } from "../search.js";

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

  root.appendChild(pageBar("The Library"));

  const lenses = [
    { id: "feeling", label: "By feeling" },
    { id: "topic", label: "By topic" },
    { id: "activity", label: "By activity" },
  ];
  let current = "feeling";
  let query = "";

  const panel = el("div", { class: "browse__panel", id: "browse-panel" });
  const status = el("p", {
    class: "visually-hidden",
    role: "status",
    "aria-live": "polite",
  });

  const renderLenses = () => {
    clear(panel);
    panel.appendChild(renderLens(current, ideas, config, index));
  };

  const renderResults = () => {
    clear(panel);
    const results = searchIdeas(ideas, query, config);
    status.textContent = `${results.length} ${
      results.length === 1 ? "result" : "results"
    } for “${query}”`;
    if (!results.length) {
      panel.appendChild(
        el("div", { class: "search__empty enter" }, [
          el("p", { class: "empty__sub", text: `Nothing matches “${query}” yet.` }),
          el("p", {
            class: "search__hint",
            text: "Try a topic, a feeling, or a word from a last insight.",
          }),
        ])
      );
      return;
    }
    panel.appendChild(
      band(
        {
          icon: "search",
          label: "Results",
          blurb: `${results.length} ${results.length === 1 ? "curiosity" : "curiosities"}`,
        },
        results.map((result, i) =>
          ideaEntry(result.entry, config, i, {
            note: result.matchedLabel && `Matched in ${result.matchedLabel}`,
          })
        ),
        0
      )
    );
  };

  const searchInput = el("input", {
    type: "search",
    id: "library-search",
    class: "search__input",
    placeholder: "Search your curiosities…",
    autocomplete: "off",
    "aria-label": "Search your curiosities",
    "aria-controls": "browse-panel",
  });
  const searchField = el("div", { class: "search enter", style: { "--i": 0 } }, [
    el("span", { class: "search__icon", "aria-hidden": "true" }, [uiIcon("search")]),
    searchInput,
  ]);

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
          renderLenses();
        },
      })
    )
  );

  const applyQuery = (value) => {
    query = value.trim();
    if (query) {
      switcher.hidden = true;
      renderResults();
    } else {
      switcher.hidden = false;
      status.textContent = "";
      renderLenses();
    }
  };

  let debounce;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => applyQuery(searchInput.value), 120);
  });
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && searchInput.value) {
      event.preventDefault();
      searchInput.value = "";
      applyQuery("");
    }
  });

  root.appendChild(searchField);
  root.appendChild(status);
  root.appendChild(switcher);
  root.appendChild(panel);
  renderLenses();
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
