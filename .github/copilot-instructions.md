# Curiosity OS — Copilot Instructions

> Curiosity OS is a personal **operating system for curiosity**. It is **not** a
> productivity app, project manager, or note-taking tool. Its purpose is to
> **preserve, resume, connect, and evolve thinking over time.**

Before doing anything, read the full specification in [`spec/`](../spec/). This file
is the operational contract for working in this repo. It summarizes the spec and
records the **locked implementation decisions**. When in doubt, the spec wins.

---

## The one question that gates every change

> **Does this make it easier to capture, resume, connect, or evolve curiosity?**

If the answer is no, it probably does not belong in Curiosity OS. Prefer depth over
breadth. Build the smallest valuable thing. Never add a feature for hypothetical
future scale.

---

## Order of authority

When documents disagree, follow this precedence (from [`spec/README.md`](../spec/README.md)):

1. [`spec/01-vision.md`](../spec/01-vision.md)
2. [`spec/DECISIONS.md`](../spec/DECISIONS.md) — amendments override older docs
3. [`spec/06-implementation-manifesto.md`](../spec/06-implementation-manifesto.md)
4. [`spec/02-domain-model.md`](../spec/02-domain-model.md)
5. [`spec/03-workflows.md`](../spec/03-workflows.md)
6. [`spec/05-repository.md`](../spec/05-repository.md)
7. [`spec/04-ui-ux.md`](../spec/04-ui-ux.md)

The Vision is never violated for implementation convenience.

---

## Locked architecture decisions

These are settled. Do not reopen them without the owner's explicit request.

- **Vanilla HTML, CSS, and JavaScript only.** Native ES modules
  (`<script type="module">`). **No frameworks, no bundler, no build step, no npm
  dependencies.** Keep it as simple as possible.
- **The repository is the data and the product.** The app is a **beautiful,
  read-only viewer** over the Markdown + JSON in this repo.
- **Static hosting on GitHub Pages.** No server-side application exists. The page
  `fetch()`es static repo files over HTTPS. This works on Pages and on any local
  static server; it does **not** work from `file://`.
  - Always use **relative fetch paths** (`./generated/index.json`) so the app works
    both on `localhost` and under the `/curiosity-os/` Pages base path.
  - A [`.nojekyll`](../.nojekyll) file keeps Pages from transforming Markdown/JSON.
  - The browser cannot list directories, so [`generated/index.json`](../generated/index.json)
    enumerates all Ideas. Keep it in sync whenever Ideas are created or published.
- **GitHub Copilot is the Librarian.** There is **no LLM wired into the app.** All
  knowledge mutations (Capture, Publish, Knowledge Deltas, Timeline, Metadata, index
  updates) are performed by the agent as **file edits + Git commits.**
- **Local preview:** `python3 -m http.server 8000` from the repo root, then open
  `http://localhost:8000/`. (Or VS Code Live Server.)

---

## Repository layout

App shell (served from repo root so all data is fetchable as `./…`):

```
index.html              # single entry; hash-routed client-side views
.nojekyll               # serve raw Markdown/JSON on GitHub Pages
app/
  styles/
    tokens.css          # design tokens: color, type, space, radius, shadow, motion
    base.css            # reset, root, font-smoothing, base elements
    app.css             # component styles (nav, cards, snapshot, timeline, …)
  scripts/
    app.js              # entry: boot, router wiring, view orchestration
    router.js           # tiny hash router
    data.js             # fetch + cache repo data (index, idea detail)
    markdown.js         # minimal, dependency-free Markdown -> HTML renderer
    views/              # one render function per screen
    ui/                 # small reusable render helpers (card, section, icon)
```

Knowledge data (canonical; per [`spec/05-repository.md`](../spec/05-repository.md)):

```
ideas/<slug>/
  idea.json             # identity: id, title, slug, created, topics, status, source
  README.md             # landing page: summary, intent, last insight, key decisions
  timeline.md           # append-only history; never hand-edited destructively
  metadata.json         # DERIVED: momentum, interest, confidence, activity, counts…
  portals.json          # references to external systems (links, not data)
  open-loops.md         # unanswered questions framed as invitations, not tasks
  knowledge/            # curated understanding, organized by concept (not by date)
  sessions/             # one Markdown file per Publish; never edited after
  resources/            # books.md, articles.md, videos.md, papers.md, links.md…
  assets/               # images, diagrams, screenshots (binary)
  generated/            # disposable Librarian output (context packs, etc.)
shared/                 # cross-Idea reference knowledge (people, companies, tech)
assets/                 # global images, icons, logos
generated/              # repo-wide generated artifacts; index.json lives here
templates/              # Markdown templates used when authoring new content
config/                 # core application vocabulary (see below)
```

---

## Three kinds of data — treat them differently

Per [`spec/DECISIONS.md`](../spec/DECISIONS.md) (Amendments 7–10):

1. **Core application vocabulary** — static, referenced by ID, **JSON**, lives in
   `config/`: `portals.json`, `topics.json`, `activities.json`, `views.json`,
   `metadata-types.json`. Define once; Ideas reference by ID
   (e.g. `portalIds: ["claude"]`).
2. **User knowledge** — authored, human-readable, **Markdown** (+ small JSON where
   needed), **local to each Idea**. Knowledge, sessions, timeline, open loops,
   intent. **Never normalize personal thinking** into shared entities.
3. **Generated artifacts** — produced by the Librarian, **safe to regenerate**:
   `generated/index.json`, context packs, search index, derived views.

> **Normalize Curiosity OS vocabulary. Do not normalize personal thinking.**

**Human readability is law.** Markdown must read beautifully in GitHub and VS Code.
**Never expose IDs, internal references, or machine structures in Markdown.** Those
belong only in JSON. The Librarian resolves references when generating human content.

---

## The lifecycle, and how the agent performs it

```
Capture -> Explore -> Continue -> Publish -> Librarian -> Knowledge / Timeline /
Metadata / Context Pack updated
```

Exploration happens **outside** Curiosity OS (ChatGPT, Claude, Copilot, VS Code,
voice, reading). Curiosity OS only remembers what survived. As the Librarian, the
agent (you) performs every mutation as transparent file edits:

- **Capture** → create `ideas/<slug>/` from `templates/`, write `idea.json` +
  `README.md` + empty scaffolding + an initial `timeline.md` event + default
  `metadata.json`, then append the Idea to `generated/index.json`. No research yet.
- **Publish** → add one immutable file to `sessions/` (the Thinking Session). Never
  edit a session after it is written.
- **Apply Knowledge Delta** → the session is never merged directly. Extract *what
  changed* and update `knowledge/` (curate, merge duplicates, preserve history),
  append exactly **one** `timeline.md` event, update `open-loops.md`, `resources/`,
  and the `README.md` summary/last-insight/intent.
- **Recalculate Metadata** → recompute `metadata.json` (derived, never hand-authored
  as if it were intent) and refresh `generated/index.json`.

**Rules that protect the repository:**
- Timeline is **append-only**. History is never rewritten or deleted.
- **Preserve dead ends, failed experiments, and rejected assumptions** — they become
  valuable later.
- Metadata is **derived**, never manually curated — except **Intent**, which is the
  one manually maintained field (answers "what should I do next?").
- The repository must stay usable **without** the app or any AI. If it stops being
  understandable in plain GitHub, the implementation has failed.

---

## Vocabulary (use these words; avoid the others)

| Use | Never use in product/UI |
| --- | --- |
| **Idea** | World (renamed — DECISIONS.md Amendment 1) |
| Publish / Publish Discovery / Save Progress | Commit, Merge, Sync |
| Continue Thinking / Continue Building | (no task verbs) |
| Open Loop (an invitation) | Task, Ticket, To-do |
| Momentum, Interest, Insight, Discovery | Velocity, Burndown, % complete |

---

## UI / UX laws

The experience must feel like **walking into a personal library of fascinating
unfinished worlds** — calm, warm, elegant, mobile-first. Reference:
[`spec/04-ui-ux.md`](../spec/04-ui-ux.md).

- **Mobile-first.** Design every interaction for a phone held in one hand; desktop
  enhances, never defines.
- **Resume over search.** Opening an Idea shows a **Resume Snapshot** first (*What
  changed? What did I learn? Where did I stop? What next?*) — **never raw Markdown
  first.**
- **Home is an invitation, not a dashboard.** It leads with one **featured** Idea,
  then a few **narrated sections** in the Librarian's quiet voice — *Rediscover*,
  *One-hour explorations* (intent-forward), *Unexpected connections*, *Surprise me* —
  with each Idea appearing only once. The full lenses (emotional 🔥🧠🚀🌱🎲📈✨, topic,
  activity) live on the **Browse** page (`#/browse`); an Idea may appear in many
  views at once and no view owns it.
- **Browse invites, never bombards.** Ideas are shown as quiet editorial
  **entries** (serif title + one evocative *last insight*), **not dense cards**.
  Extra detail (intent, momentum, portals) is revealed on hover/focus on desktop and
  lives in full on the Idea page — progressive disclosure over information overload.
- **Use the whole screen, calmly.** Desktop is a real layout, not a centered phone
  column: a wide editorial page that leads with one **featured** Idea, then emotional
  **views as margin-labelled bands** of entries; the Idea page splits into a reading
  column + a sticky **context margin** (About, open loops, sessions). Mobile stacks
  everything and the Resume Snapshot stays first.
- **Portals are first-class.** The Idea page shows a **Where this lives** section —
  the tools the Idea lives in, grouped Think / Build / Notes with recognizable brand
  icons that link out. **Continue thinking / Continue building** open a portal picker
  that copies the Context Pack and opens the chosen tool. Portals are defined once in
  `config/portals.json` (`category`, brand `color`, `home`, `icon`) and referenced by
  ID; `isBuildable` derives from `category: "code"`. Brand marks are inline SVGs in
  `app/scripts/ui/icons.js`.
- **Connections explain themselves.** Curated per-Idea in
  `ideas/<slug>/connections.json` (`{ to, relation, concepts }`), mirrored into
  `generated/index.json`, and surfaced on the Idea page and Home's *Unexpected
  connections* with the **why** plus shared-concept chips — never a bare list or graph.
- **The Librarian has a quiet voice.** Home sections may carry one subtle, templated
  Librarian line (e.g. "You've circled this for 8 months — it keeps resurfacing"),
  derived from metadata/timeline. It observes; it never nags or interrupts.
- **Timeline reads like a story**, not a Git log.
- **Knowledge reads like a book** — beautiful Markdown with images, code, callouts,
  tables, links.
- Evoke **wonder, curiosity, discovery, momentum, reflection.** Never create
  **guilt, pressure, obligation, or backlog anxiety.**
- **Empty states inspire** ("What has been on your mind lately?"), never scold ("No
  ideas").
- **Forbidden UI:** kanban boards, ticket lists, priority queues, status tables,
  sprint/burndown views, progress bars, completion %, dense dashboards, enterprise
  admin panels, productivity metrics.

---

## Design system — Newsprint (governing visual language)

The app uses a **Newsprint** aesthetic (light mode only). It overrides the soft/warm
token choices; the craft principles below still apply where they don't conflict.

- **Tokens** live in [`app/styles/tokens.css`](../app/styles/tokens.css): paper
  `#f9f9f7`, ink `#111`, one **editorial red `#cc0000` used sparingly**, **zero radius
  everywhere**, hard 1px ink borders, **hard offset shadows** (`4px 4px 0`) for hover
  lift, and a faint dot-grid `--bg-tint`.
- **Type:** Playfair Display (display/headlines), Lora (body), Inter (UI/labels),
  JetBrains Mono (metadata/labels), from Google Fonts in [`index.html`](../index.html).
  Big serif headlines; mono uppercase labels.
- **Structure over decoration:** bordered **cards with zero radius**; the featured lead
  is a **red headline**; the Resume Snapshot is a 4-cell grid with one **inverted
  (black)** cell and one **red** cell.
- **Badges:** small black boxes, white uppercase labels (`badge()` in
  [`card.js`](../app/scripts/ui/card.js)); `badge--feature` adds a red spark.
- **No emoji.** Section markers, the Librarian voice, nav, and loops use **inline line
  SVGs** (`uiIcon()` in [`app/scripts/ui/icons.js`](../app/scripts/ui/icons.js)). Portal
  marks are **monochrome** bordered tiles (brand colour set aside for the B&W look).
- **Images** render grayscale with a 1px ink border. Buttons/inputs **invert on hover**.

---

## Craft quality — `make-interfaces-feel-better`

Every UI change must still apply the skill at
[`.github/skills/make-interfaces-feel-better/SKILL.md`](skills/make-interfaces-feel-better/SKILL.md)
**where it doesn't conflict with Newsprint** (Newsprint wins on radius, borders,
shadows, image outlines, and colour). Keep the universal craft rules below.
We have no Tailwind/Motion, so implement these in **hand-written CSS** (the skill
gives CSS-only patterns for all of them):

- **Concentric radius:** `outerRadius = innerRadius + padding` on nested surfaces.
- **Shadows over borders** for depth (layered transparent `box-shadow`); keep real
  borders only for dividers/inputs.
- **Optical alignment** over geometric (icon-side padding ≈ text-side − 2px).
- **Interruptible CSS transitions** for interactive state; reserve `@keyframes` for
  one-shot enter sequences.
- **Split & stagger enter** animations (opacity + `translateY(12px)` + `blur(4px)`,
  ~100ms apart). **Subtle exits** (small fixed `translateY`, shorter duration).
- **`tabular-nums`** for any dynamic numbers (counts, momentum).
- **`text-wrap: balance`** on headings, **`pretty`** on body/cards.
- **`-webkit-font-smoothing: antialiased`** on the root.
- **Image outlines:** `rgba(0,0,0,0.1)` light / `rgba(255,255,255,0.1)` dark, inset.
- **Scale on press:** `scale(0.96)` (never below `0.95`).
- **Never `transition: all`** — name exact properties. Use `will-change` only on
  `transform`/`opacity`/`filter`, never `all`.
- **≥40×40px hit areas** on interactive elements (extend small controls with a
  pseudo-element).
- Always respect `prefers-reduced-motion: reduce`.

Animations communicate **continuity**, not decoration: cards gently expand, the
timeline unfolds, knowledge fades in. Color carries emotion — warm accents and soft
surfaces; avoid enterprise blue/gray dominance.

---

## Coding conventions

- Semantic, accessible HTML. Keyboard-navigable. Real `<a>`/`<button>` elements.
- Small, focused ES modules with named exports. No global mutable state beyond a
  thin cache in `data.js`. No inline event handlers in HTML.
- Pure render functions return DOM nodes / HTML strings from data; keep fetching in
  `data.js` and rendering in `views/`.
- Escape any text interpolated into HTML to prevent injection — even local content.
- Fail gracefully: if a fetch 404s, show a calm empty/placeholder state, never a
  stack trace.
- Comment **why**, not what. Do not add comments, docstrings, or types to code you
  didn't change.

---

## Non-goals (do not build without explicit request)

Authentication, collaboration, cloud sync, notifications, plugins, databases, user
management, task management, kanban, project tracking, due dates, priorities,
permissions, sprint planning, progress bars, completion metrics.

---

## When to stop and ask

If the philosophy is unclear, or multiple valid architectural directions exist,
**stop and ask the owner.** Do not invent features, workflows, metadata, repository
structures, UI interactions, or synchronization mechanisms. If something is
unspecified, ask before assuming.
