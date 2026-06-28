---
name: librarian-ingest
description: "The Librarian's ingestion playbook for Curiosity OS. Use when publishing or ingesting an Idea — a brand-new brain dump, voice note, screenshot summary, or Copilot chat (a New Idea), or a Knowledge Delta pasted from an external session (Claude, ChatGPT, Gemini, Perplexity, Copilot). Covers input detection, validation, requesting only missing essentials, the exact file-by-file mapping for creating a new Idea vs merging a delta, recomputing derived metadata, and refreshing generated/index.json. Triggers on: ingest, publish this idea, knowledge delta, new idea, dump this thought, save this session, update the idea, add to my library."
---

# Curiosity OS — Ingestion Playbook (The Librarian)

You are the **only** writer of knowledge into this repository. Preserve the
**evolution of Ideas**, not conversations. Capture knowledge, not transcripts.
Curate rather than accumulate. Keep everything human-readable. Never introduce
unnecessary complexity.

Always **preview** the change set and **ask for confirmation** before writing.
Always **ask before** any `git commit` / `git push`.

---

## 0. Ground yourself first (the repo is the source of truth)

Before writing anything, read:

- `spec/05-repository.md`, `spec/02-domain-model.md`, `spec/DECISIONS.md` — canon.
- An existing Idea folder, e.g. `ideas/ai-cost-optimizer/`, **and** its entry in
  `generated/index.json` — **mirror their exact shape.** Do not invent fields.
- `config/portals.json`, `config/topics.json`, `config/activities.json`,
  `config/metadata-types.json` — the canonical vocabulary, referenced by **ID**.
- `templates/idea/` — scaffolding for a new Idea.

Rule of thumb: if a field or file isn't already used by an existing Idea, you
probably shouldn't add it.

---

## 1. Detect the input type

Decide **without asking** unless truly ambiguous:

- **New Idea** — a fresh thought with little/no exploration: a brain dump, voice
  note, screenshot summary, or a Copilot chat that isn't tied to an existing Idea.
  Signals: no target Idea named; no "what changed"; reads like a spark.
- **Knowledge Delta** — the structured result of an exploration session, usually
  produced by the app's **Publish Prompt**. Signals: a target Idea; sections like
  *Knowledge Gained / Updated / Invalidated*, *Decisions*, *Open Loops*, *Session
  Metadata*, *Suggested Last Insight*, *Timeline Entry*, *Metadata Signals*.

If genuinely unclear, ask one question: *"Is this a new idea, or an update to an
existing one?"*

---

## 2. Validate (request only what materially helps)

**New Idea — required:** a title (or generate a sensible working title) and an
initial thought/description. Everything else is optional.

**Knowledge Delta — required:** a target Idea (resolve the slug/title) and enough
to identify what changed.

**Optional everywhere (never block ingestion):** portal, model, conversation URL,
session duration, repository/workspace, session title.

If something important is missing, produce a short report — **do not guess**:

```
## Missing Information

Missing: Portal
Reason:  Needed to record where this session lived and to link it as a portal.
Suggested prompt (paste into the portal):
  "Which AI portal generated this session? If available, also give the model
   name and the conversation URL."
```

Only ask for what meaningfully improves the repository. Then proceed with what you
have — optional gaps never stop ingestion.

---

## 3A. Ingest a NEW IDEA

Goal: create just enough structure to be **resumable later**. Do not invent
research or over-structure.

1. **Slug:** lowercase, hyphenated, derived from the title (e.g. "Calm onboarding"
   → `calm-onboarding`). Ensure `ideas/<slug>/` doesn't already exist.
2. **Create `ideas/<slug>/` from `templates/idea/`** and fill:
   - `idea.json` — identity: `id`, `title`, `slug`, `created` (today, `YYYY-MM-DD`),
     `topics` (IDs from `config/topics.json`), `status`/`activity` (usually
     `exploring`), `source` (where it came from, in human words), and an `emblem`
     (one of the gallery names — verify against the app's emblem list; e.g.
     `brain, shield, coins, gauge, pulse, network, leaf, flask, compass, eye,
     bolt, globe, target, rocket`; falls back to `spark`). Pick the emblem that
     best fits the Idea's essence.
   - `README.md` — a short human summary, the current **intent** (one free-hour
     next step), and an initial **last insight** if there is one. Prose goes below
     the first `---` divider.
   - `timeline.md` — exactly one event: `## <YYYY-MM-DD> — Captured` followed by a
     one-paragraph story of where the spark came from. **Append-only forever.**
   - `metadata.json` — derived starting signals (low momentum/confidence/evidence;
     interest can be high). Mirror the template's shape.
   - `portals.json` — `portalIds` referencing `config/portals.json`, only if the
     idea already names tools. Otherwise leave empty/default.
   - `open-loops.md` — the first one or two open questions, framed as invitations,
     not tasks. Optional.
3. **Leave `knowledge/`, `sessions/`, `resources/`, `connections.json` empty/absent**
   until there's real content. Do not fabricate.
4. **Append the Idea to `generated/index.json`** — add one entry mirroring the
   shape of existing entries (see §4). Keep it sorted/consistent with siblings.

---

## 3B. Ingest a KNOWLEDGE DELTA

The session is **never merged verbatim**. Extract what changed; curate it in.

1. **Add an immutable session file** to `ideas/<slug>/sessions/` named
   `<YYYY-MM-DD>-<portalId>.md` (e.g. `2026-06-28-claude.md`). It records the
   session's durable takeaways and its metadata (portal, model, URL, duration) in
   readable prose. **Never edit a session file after writing it.**
2. **Curate `knowledge/`** — merge new understanding into the right concept file
   (organized by concept, not by date). Improve/merge duplicates. When something is
   **invalidated**, keep the prior belief and record *why* it changed beneath it.
   Create a new `knowledge/<concept>.md` only when a genuinely new concept emerged.
3. **Append exactly ONE `timeline.md` event:** `## <YYYY-MM-DD> — <short title>`
   plus a one-paragraph human summary of what this session changed. Append-only.
4. **Update `open-loops.md`:** add new questions; remove/strike the ones this
   session answered (note closed loops in the timeline paragraph if meaningful).
5. **Merge `resources/`** (e.g. `articles.md`, `papers.md`, `books.md`, `videos.md`,
   `links.md`) — one line each with a short "why it matters." De-duplicate.
6. **Add new `connections.json`** entries `{ "to": "<slug>", "relation": "<why,
   in human words>", "concepts": ["…"] }` for meaningful new links. Mirror the
   connection into the *other* Idea's `connections.json` and the index when it's
   reciprocal.
7. **Refresh `README.md`:** update the summary if it shifted, the **last insight**
   (the single most important takeaway), and the **intent** only if the next step
   changed. Don't rewrite wholesale — apply the delta.
8. **Recompute `metadata.json`** (see §5). Bump `counts` (sessions, publishes,
   connections, openLoops).
9. **Refresh the Idea's entry in `generated/index.json`** (see §4): `updated`,
   `lastInsight`, `intent`, `activity`, `metadata`, `signals`, `portalIds`,
   `knowledge[]`, `sessions[]`, `connections[]`, `topics`.

---

## 4. `generated/index.json` entry shape (mirror existing exactly)

The browser can't list directories, so this file enumerates every Idea. Each entry
looks like (copy a real one and adapt — don't hand-type a schema from memory):

```json
{
  "id": "<slug>", "slug": "<slug>", "title": "…", "summary": "…",
  "intent": "…", "lastInsight": "…",
  "topics": ["ai", "systems"], "activity": "building", "emblem": "coins",
  "created": "YYYY-MM-DD", "updated": "YYYY-MM-DD",
  "portalIds": ["claude", "github-copilot"],
  "metadata": {
    "momentum": 0.0, "interest": 0.0, "confidence": 0.0,
    "novelty": 0.0, "evidence": 0.0,
    "counts": { "sessions": 0, "publishes": 0, "connections": 0, "openLoops": 0 }
  },
  "signals": { "interestingAgain": false, "unfinished": false, "readyToBuild": false },
  "knowledge": [{ "file": "architecture.md", "title": "Architecture" }],
  "sessions": [{ "file": "2026-06-18-claude.md", "date": "2026-06-18", "portalId": "claude" }],
  "connections": [{ "to": "<slug>", "relation": "…", "concepts": ["…"] }]
}
```

Keep `generatedAt` current. **Never expose these IDs in Markdown** — they belong
only to JSON; resolve them to human names when writing prose.

---

## 5. Recomputing metadata (derived — never hand-curated, except Intent)

Signals are qualitative reads, normalized roughly to `0..1`. Use the Knowledge
Delta's *Metadata Signals* and the Idea's history as evidence:

- **Momentum** — recent activity and forward motion (decays when paused).
- **Interest** — how strongly it keeps pulling you back.
- **Confidence** — how sure you are it's worth building.
- **Novelty** — how fresh/unexplored the territory is.
- **Evidence** — how much real proof now backs it.
- **activity** — one of `config/activities.json` (exploring, building, observing,
  paused, researching).
- **counts** — sessions, publishes, connections, openLoops (factual tallies).
- **signals** — `interestingAgain` (resurfaced after a gap), `unfinished`,
  `readyToBuild` — derived from the above.

**Intent** is the one field you set from the user's stated next step, not computed.

---

## 6. Human-readability checklist (law)

- Markdown reads beautifully in GitHub and VS Code — headings, prose, callouts.
- **No IDs, slugs-as-labels, or internal refs in Markdown.** Resolve to names.
- Timeline reads like a **story**, not a Git log. Knowledge reads like a **book**.
- Open loops are **invitations**, never tasks/tickets/to-dos.
- The repo must make sense with the app and AI switched off.

---

## 7. Final checks before you present the preview

- Is every change a **delta** (genuinely new), not a re-summary of the input?
- Did I **preserve** prior understanding and dead ends?
- Is the **timeline append-only** (exactly one new event)?
- Will this still be valuable to read **six months from now**?
- Did I keep IDs out of Markdown and mirror existing JSON shapes?

Show the `## Proposed Updates` preview (see the agent definition), get
confirmation, write the files, refresh `generated/index.json`, then offer to
commit.
