// Publish — a one-click action. It copies a "publish prompt" you paste into the
// chat/session where the thinking happened; the model computes a Knowledge Delta
// (Git-commit style), which you then hand to the Librarian (GitHub Copilot) to
// write into the repository and commit. The viewer never writes to disk.

import { copyText } from "../ui/overlays.js";

export const PUBLISH_PROMPT = `# Curiosity OS — Publish Prompt

You are publishing the results of this exploration session back into Curiosity OS.

## Context

You have access to:

1. The Curiosity OS Context Pack that was provided at the beginning of this session.
2. The entire conversation that occurred after that Context Pack.

The Context Pack already represents the latest state of the Idea.

If no Context Pack was provided at the start of this session, first ask which
Idea this belongs to (slug or title) before continuing, and treat the whole
conversation as new.

Your job is **NOT** to summarize the conversation.

Your job is to compute the **Knowledge Delta**.

Think of this exactly like a Git commit.

Only include information that should permanently update the Idea.

---

# Rules

## DO

- Compare this conversation against the Context Pack.
- Only include information that is genuinely new.
- Capture changes in understanding.
- Capture decisions.
- Capture new research.
- Capture important resources.
- Capture new connections.
- Capture questions that remain unanswered.
- Capture anything that should help Future Me resume thinking.

## DO NOT

- Repeat information already present in the Context Pack.
- Summarize the entire conversation.
- Include conversational filler.
- Include implementation details unless they became important knowledge.
- Include speculative thoughts that were immediately discarded.
- Include chain-of-thought or internal reasoning.

The goal is **compression**, not summarization.

---

# Output Format

## Session Metadata

Curiosity OS cannot observe the session itself — capture these from the portal,
in a structured form:

Idea: (slug or title, from the Context Pack)
Portal: (where this session happened — e.g. ChatGPT, Claude, Cursor)
Model:
Conversation URL: (if available — becomes the Idea's portal link)
Repository / Workspace: (if applicable)
Session Date:
Approximate Duration:
Session Title: (a short, human name for this session)

---

## Knowledge Gained

List only genuinely new knowledge discovered during this session.

Each point should be concise.

Explain *why* the knowledge matters when appropriate.

---

## Knowledge Updated

Existing beliefs that changed.

Format:

Previous

↓

Current

↓

Reason for change

---

## Knowledge Invalidated

Assumptions that were disproved.

Format:

Previous assumption

↓

Why it is no longer believed

---

## Decisions Made

Concrete decisions reached during this session.

Examples:

- Chosen architecture
- Product decisions
- UX decisions
- Research direction
- Technical tradeoffs

Only include decisions that are expected to persist.

---

## Resources Discovered

Group by type.

### Articles

- ...

### Papers

- ...

### Books

- ...

### Videos

- ...

### Repositories

- ...

For each resource include one sentence describing why it matters.

---

## New Connections

Only include meaningful connections.

Format:

Connected To

Reason

Example:

Behavior Design

Reason: Habit formation repeatedly appeared while discussing cybersecurity training.

---

## Open Loops

Questions that remain unanswered.

These should become future exploration points.

---

## Closed Open Loops

Questions that were successfully answered during this session.

These allow Curiosity OS to close previous exploration threads.

---

## Suggested Summary Changes

If the current Idea Summary should change, describe the delta.

Do NOT rewrite the entire summary.

---

## Suggested Intent Changes

If the current Intent should change, explain why and describe only what should change.

Do NOT rewrite the entire Intent.

---

## Suggested Last Insight

The single most important takeaway from this session — one sentence that becomes
the Idea's "last insight" (the first thing Future Me reads on returning).

---

## Timeline Entry

One human-readable line for the timeline: a short title plus a one-sentence
summary of what this session changed. Curiosity OS will date and attribute it.

---

## Suggested Metadata Signals

Do NOT calculate metadata values. Provide qualitative signals with a reason.

Momentum:
Reason:

Interest:
Reason:

Confidence:
Reason:

Novelty:
Reason:

Evidence:
Reason:

Activity: (one of: exploring, building, observing, paused, researching)
Reason:

---

## Next Steps

Imagine the user returns to this Idea six months from now.

Write concise guidance for how to continue — prevent repeated work.

Do not summarize. Do not motivate.

---

## Suggested Repository Updates

Indicate which areas changed (do not edit them):

- Timeline
- Knowledge
- Resources
- Open Loops
- Connections
- Metadata
- Topics (only if genuinely new themes emerged)
- Portals (only if this session used a tool not already listed)

---

# Final Check

Before returning your response, ask yourself:

- Is every section a delta rather than a summary?
- Am I repeating information already present in the Context Pack?
- Would this still be valuable to read six months from now?
- Did I capture only durable knowledge?

If not, refine until the output represents only the lasting changes from this session.
`;

export function copyPublishPrompt() {
  return copyText(
    PUBLISH_PROMPT,
    "Publish prompt copied — paste it into your session"
  );
}
