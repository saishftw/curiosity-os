// Capture — the lowest-friction screen. It gathers the spark of an Idea and
// composes a hand-off for the Librarian (GitHub Copilot), who writes the files
// into the repository and commits them. The viewer itself never writes to disk.

import { el, slugify } from "../ui/dom.js";
import { copyText } from "../ui/overlays.js";
import { portalMark } from "../ui/portals.js";
import { uiIcon } from "../ui/icons.js";

export function captureView(config) {
  const state = { topics: new Set(), portals: new Set() };

  const title = textField({
    id: "cap-title",
    label: "What is the curiosity?",
    hint: "A working name. You can refine it later.",
    placeholder: "e.g. Calm onboarding for anxious users",
  });
  const spark = textField({
    id: "cap-spark",
    label: "What sparked it?",
    hint: "Where did this come from — a thought, a conversation, an article?",
    placeholder: "A late-night thought after reading…",
  });
  const why = textareaField({
    id: "cap-why",
    label: "Why does it pull you?",
    hint: "The feeling underneath. This becomes the summary.",
    placeholder: "It matters because…",
  });
  const intent = textField({
    id: "cap-intent",
    label: "If you had one free hour, what would you do?",
    hint: "Your current intent — the one manually kept signal.",
    placeholder: "Sketch the first version of…",
  });

  const topics = chipset(
    config.topics,
    state.topics,
    (item) => item.name
  );
  const portals = chipset(
    config.portals,
    state.portals,
    (item) => [portalMark(item, "sm"), item.name]
  );

  const handoff = el("div", { "aria-live": "polite" });

  const compose = el(
    "button",
    {
      class: "btn btn--accent btn--icon",
      onClick: () => {
        const value = title.input.value.trim();
        if (!value) {
          title.input.focus();
          return;
        }
        handoff.replaceChildren(
          renderHandoff({
            title: value,
            spark: spark.input.value.trim(),
            why: why.input.value.trim(),
            intent: intent.input.value.trim(),
            topics: [...state.topics],
            portals: [...state.portals],
            config,
          })
        );
        handoff.firstChild?.scrollIntoView({ behavior: "smooth", block: "start" });
      },
    },
    [el("span", { class: "btn__glyph", "aria-hidden": "true" }, [uiIcon("spark")]), "Compose"]
  );

  return el("div", { class: "container" }, [
    el("div", { class: "idea__top enter", style: { "--i": 0 } }, [
      el("a", { class: "backlink", href: "#/" }, [
        uiIcon("back"),
        "All ideas",
      ]),
      el("h1", { class: "idea__title", text: "Capture a curiosity" }),
      el("p", {
        class: "idea__lede",
        text: "Hold the thought before it drifts. No research yet — just enough to find your way back.",
      }),
    ]),
    el("form", { class: "capture enter", style: { "--i": 1 }, onSubmit: (e) => e.preventDefault() }, [
      title.node,
      spark.node,
      why.node,
      intent.node,
      fieldGroup("Topics", "For browsing later — optional.", topics),
      fieldGroup("Where will you explore?", "The portals you might use — optional.", portals),
      el("div", { class: "capture__actions" }, [compose]),
    ]),
    handoff,
  ]);
}

function renderHandoff({ title, spark, why, intent, topics, portals, config }) {
  const slug = slugify(title);
  const topicNames = topics.map((id) => config.topics.get(id)?.name || id);
  const prompt = buildPrompt({ title, slug, spark, why, intent, topics, portals, config });

  return el("section", { class: "handoff enter" }, [
    el("h2", { class: "section__title", text: "Hand this to the Librarian" }),
    el("p", { class: "handoff__lead" }, [
      "Curiosity OS keeps new Ideas in the repository. Paste this to GitHub Copilot ",
      "and it will create ",
      el("code", { text: `ideas/${slug}/` }),
      ", fill it in, and add it to the shelf.",
    ]),
    el("pre", { class: "handoff__pre", text: prompt }),
    el("div", { class: "capture__actions", style: { marginTop: "1rem" } }, [
      el(
        "button",
        {
          class: "btn btn--accent btn--icon",
          onClick: () => copyText(prompt),
        },
        [
          el("span", { class: "btn__glyph", "aria-hidden": "true" }, [uiIcon("copy")]),
          "Copy for Copilot",
        ]
      ),
    ]),
    topicNames.length
      ? el("p", {
          class: "field__hint",
          style: { marginTop: "0.75rem" },
          text: `Topics: ${topicNames.join(", ")}`,
        })
      : null,
  ]);
}

function buildPrompt({ title, slug, spark, why, intent, topics, portals }) {
  const lines = [
    "Capture a new Idea in Curiosity OS.",
    "",
    `Title: ${title}`,
    `Slug: ${slug}`,
  ];
  if (spark) lines.push(`Spark: ${spark}`);
  if (why) lines.push(`Why it pulls me: ${why}`);
  if (intent) lines.push(`Right now: ${intent}`);
  if (topics.length) lines.push(`Topics: ${topics.join(", ")}`);
  if (portals.length) lines.push(`Portals: ${portals.join(", ")}`);
  lines.push(
    "",
    "Please:",
    `1. Create ideas/${slug}/ from templates/idea/.`,
    "2. Fill in idea.json, README.md, an initial timeline.md \u201CCaptured\u201D event,",
    "   default metadata.json, portals.json (the portal IDs above), and open-loops.md.",
    "3. Append this Idea to generated/index.json.",
    "4. Commit it.",
    "",    "Pick an `emblem` for the Idea — one icon name that fits it, from: brain,",
    "shield, coins, gauge, pulse, network, leaf, flask, compass, eye, bolt, globe,",
    "target, rocket — and set it in idea.json and generated/index.json.",
    "",    "Keep it human-readable. Do not add research yet — this is only a capture."
  );
  return lines.join("\n");
}

function textField({ id, label, hint, placeholder }) {
  const input = el("input", {
    id,
    class: "input",
    type: "text",
    placeholder,
    autocomplete: "off",
  });
  return { input, node: wrapField(id, label, hint, input) };
}

function textareaField({ id, label, hint, placeholder }) {
  const input = el("textarea", { id, class: "textarea", placeholder, rows: "3" });
  return { input, node: wrapField(id, label, hint, input) };
}

function wrapField(id, label, hint, control) {
  return el("div", { class: "field" }, [
    el("label", { class: "field__label", for: id, text: label }),
    hint && el("p", { class: "field__hint", text: hint }),
    control,
  ]);
}

function fieldGroup(label, hint, control) {
  return el("div", { class: "field" }, [
    el("p", { class: "field__label", text: label }),
    hint && el("p", { class: "field__hint", text: hint }),
    control,
  ]);
}

function chipset(map, selected, render) {
  const set = el("div", { class: "chipset" });
  for (const item of map.values()) {
    const content = render(item);
    const chip = el(
      "button",
      {
        type: "button",
        class: "chip-toggle",
        "aria-pressed": "false",
        onClick: () => {
          const on = selected.has(item.id);
          if (on) selected.delete(item.id);
          else selected.add(item.id);
          chip.setAttribute("aria-pressed", on ? "false" : "true");
        },
      },
      Array.isArray(content) ? content : [content]
    );
    set.appendChild(chip);
  }
  return set;
}
