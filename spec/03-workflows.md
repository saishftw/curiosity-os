# Curiosity OS

## Document 3 — Workflows & Data Flow

**Version:** v1.0

**Status:** Workflow Specification

---

# Overview

Curiosity OS is centered around one simple lifecycle.

```text
Capture
    ↓
Explore
    ↓
Continue
    ↓
Publish
    ↓
Librarian
    ↓
Knowledge Updated
    ↓
Timeline Updated
    ↓
Metadata Derived
    ↓
Context Pack Regenerated
```

Everything in the system should fit into this lifecycle.

---

# Guiding Principle

Curiosity OS is **not** where exploration happens.

It is where exploration becomes durable.

Exploration always happens inside external portals.

Curiosity OS simply remembers what survived those explorations.

---

# Workflow 1 — Capture

## Purpose

Capture an idea before it disappears.

Capture should require almost zero thought.

If capturing an idea takes longer than thinking about it, the system has failed.

---

## Sources

Ideas may originate from anywhere.

Examples

* Random thought
* Conversation
* Walking
* ChatGPT
* Claude
* GitHub Copilot
* Reading
* YouTube
* Twitter/X
* Voice Notes

---

## Result

Capturing creates

* new Idea
* initial Timeline Event
* empty Knowledge
* empty Connections
* empty Open Loops
* default metadata

No research happens yet.

---

# Workflow 2 — Continue

## Purpose

Resume exploration with minimal context rebuilding.

---

## Trigger

User opens an Idea.

---

## Curiosity OS generates

A Context Pack.

The Context Pack contains only what is necessary to continue.

Examples

* Current Summary
* Current Intent
* Recent Timeline
* Important Decisions
* Open Loops
* Related Ideas
* Key Knowledge
* Recent Findings
* Relevant Resources

---

## User chooses Portal

Examples

ChatGPT

Claude

GitHub Copilot

VS Code

Voice Notes

---

The Context Pack is copied or made available to the chosen portal.

The portal now has sufficient context to continue.

---

# Workflow 3 — Exploration

Exploration happens entirely outside Curiosity OS.

Curiosity OS does not monitor the session.

It does not synchronize conversations.

It does not store every prompt.

The portal is a temporary workspace.

---

Possible exploration activities

Research

Brainstorming

Coding

Architecture

Reading

Watching videos

Learning

Experimentation

---

# Workflow 4 — Publish

Publish is the most important workflow.

Publishing is **not synchronization.**

Publishing creates durable knowledge.

---

## Trigger

User finishes an exploration session.

---

## Goal

Capture only what is worth remembering.

Not everything discussed.

---

## Portal Responsibility

Every portal should produce the same logical artifact.

A Thinking Session.

Regardless of whether it came from

* Claude
* ChatGPT
* GitHub Copilot
* VS Code
* Voice Notes

The output format should remain consistent.

---

## Thinking Session

A Thinking Session contains

Summary

Insights

Knowledge gained

Knowledge invalidated

Decisions

Open Loops

Connections

Resources

Intent Updates

Questions answered

Questions created

---

The Thinking Session represents

"What changed?"

---

# Workflow 5 — Librarian

The Librarian receives the Thinking Session.

The Librarian is responsible for everything after Publish.

---

Responsibilities

Read Thinking Session.

↓

Extract Knowledge Delta.

↓

Update Markdown.

↓

Append Timeline Event.

↓

Update Connections.

↓

Update Resources.

↓

Update Open Loops.

↓

Refresh Idea Summary.

↓

Recalculate Metadata.

↓

Regenerate Context Pack.

---

No portal performs these responsibilities.

Only the Librarian.

---

# Workflow 6 — Knowledge Delta

The Thinking Session itself is never merged directly.

Instead

The Librarian extracts a Knowledge Delta.

Examples

New discoveries

Architecture decisions

Research findings

Rejected assumptions

New questions

Interesting references

Knowledge Delta is the only thing allowed to modify permanent knowledge.

---

# Workflow 7 — Timeline Update

Every Publish creates exactly one Timeline Event.

Timeline is append-only.

History should never disappear.

Examples

Idea created.

↓

Competitor discovered.

↓

Architecture changed.

↓

Prototype completed.

↓

Research paused.

↓

Returned after six months.

Timeline is history.

Knowledge is understanding.

---

# Workflow 8 — Knowledge Update

Knowledge should continuously improve.

The Librarian should

Merge duplicates.

Refactor Markdown.

Group related findings.

Maintain readability.

Preserve important history.

Knowledge should become cleaner over time.

Never messier.

---

# Workflow 9 — Metadata Derivation

Metadata should not be edited manually.

The Librarian infers it.

Examples

Momentum

Interest

Confidence

Novelty

Complexity

Evidence

Activity

Last Active

Publish Count

Session Count

Open Loop Count

Connection Count

---

Metadata should always reflect the latest understanding.

---

# Workflow 10 — Context Pack Generation

Whenever an Idea changes

The Context Pack becomes stale.

The Librarian regenerates it.

---

The Context Pack should contain

Current Summary

Current Intent

Latest Discoveries

Recent Timeline

Important Knowledge

Active Open Loops

Relevant Resources

Related Ideas

Current Metadata

The Context Pack is temporary.

It exists only to help another portal continue work.

---

# Workflow 11 — Continue Building

Building follows the same workflow.

Instead of launching Claude

The user launches

GitHub

VS Code

GitHub Copilot

Repository

The Context Pack remains the same.

Only the Portal changes.

---

# Workflow 12 — Observation

Not every interaction is deep research.

Sometimes the user simply discovers something.

Examples

Interesting article.

Screenshot.

Tweet.

Book recommendation.

Podcast.

Quote.

Observation should be extremely lightweight.

The user should be able to attach observations to an Idea in seconds.

Later

The Librarian may promote observations into permanent Knowledge.

---

# Workflow 13 — Connection Discovery

Connections may be

Manual

or

Derived.

The Librarian should continuously look for

Shared concepts.

Shared resources.

Shared topics.

Shared technologies.

Shared people.

Shared companies.

Shared themes.

These become Connections.

Connections should improve over time.

---

# Workflow 14 — Resume

When reopening an Idea

The user should **not** see Markdown first.

The system should first answer

What changed?

What did I learn?

Where did I stop?

What should I explore next?

Only then should deeper documents be shown.

Resume should feel effortless.

---

# Publish Flow

```text
User

↓

Portal

↓

Thinking Session

↓

Publish

↓

Librarian

↓

Knowledge Delta

↓

Knowledge Updated

↓

Timeline Updated

↓

Metadata Derived

↓

Context Pack Updated

↓

Repository Commit
```

---

# Continue Flow

```text
Idea

↓

Context Pack

↓

Portal Selected

↓

Exploration

↓

Thinking Session

↓

Publish
```

---

# Repository Flow

Repository should never be edited directly by portals.

Every repository change must originate from

Thinking Session

↓

Librarian

↓

Knowledge Delta

↓

Repository

This keeps the architecture consistent.

---

# User Interaction Rules

The user should never think about

Repository structure.

Markdown organization.

Metadata updates.

Knowledge merging.

Timeline generation.

Connection updates.

Context regeneration.

The Librarian owns all of this.

---

The user should think only about

Capturing.

Exploring.

Publishing.

Everything else is automatic.

---

# Design Philosophy

Curiosity should flow naturally.

The system should never interrupt exploration.

Publishing should take seconds.

Resuming should take seconds.

Knowledge should improve continuously.

The repository should quietly evolve in the background.

---

# Open Questions

These are intentionally deferred and should not be invented by an implementation AI.

## Publish Transport

How is a Thinking Session transferred from a portal to the Librarian?

Examples

* Clipboard
* MCP
* API
* GitHub Copilot
* Future automation

Implementation intentionally deferred.

---

## Context Pack Delivery

How is the Context Pack injected into a portal?

Implementation intentionally deferred.

---

## Multi-Portal Sessions

Can multiple portals contribute to a single Thinking Session?

Implementation deferred.

---

## Automatic Connection Discovery

How aggressive should the Librarian be when creating Connections?

Needs experimentation.

---

## Knowledge Refactoring

How frequently should the Librarian reorganize Markdown?

Needs experimentation.

---

## Metadata Algorithms

Exact formulas for

Momentum

Interest

Confidence

Novelty

Evidence

are intentionally unspecified.

These should evolve through usage rather than being prematurely optimized.

---

# Guiding Principle

Every workflow should satisfy one rule:

> **The user spends time thinking, never maintaining the system.**

If a workflow introduces maintenance work instead of enabling thinking, it should be redesigned.
