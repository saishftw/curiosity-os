# Curiosity OS

## Document 6 — Implementation Manifesto

**Version:** v1.0

**Status:** Implementation Guide

---

# Purpose

This document exists to guide implementation decisions.

Whenever a technical decision is unclear, prioritize the principles in this document over implementation convenience.

The implementation should optimize for longevity, maintainability, and preserving curiosity—not for feature count.

---

# Product Goal

Build a system that compounds curiosity over years.

Do not build another note-taking application.

Do not build another project management application.

Do not build another productivity tool.

The purpose is to preserve and evolve thinking.

---

# Build the Smallest Valuable System

The first version should feel magical because it is simple.

Not because it has many features.

Prefer depth over breadth.

Avoid feature creep.

---

# What NOT to Build

Do NOT implement:

* Task management
* Priorities
* Due dates
* Kanban boards
* Sprint planning
* Project tracking
* Progress bars
* Completion percentages
* Notifications that create pressure
* Complex dashboards
* Enterprise workflows
* User management
* Collaboration
* Permissions
* Authentication
* Cloud synchronization
* Database servers

Every one of these should require explicit justification before being added.

---

# Build Around Ideas

Everything begins with an Idea.

Do not build independent modules.

Every screen should ultimately relate back to an Idea.

---

# The Repository Is Sacred

The Git repository is the canonical source of truth.

Never make the application state diverge from the repository.

If a choice exists between convenience and repository integrity,

choose repository integrity.

---

# AI Should Assist, Not Own

The Librarian is an assistant.

It should

organize,

suggest,

derive,

summarize,

connect.

It should not silently rewrite user knowledge.

Every meaningful change should be understandable.

---

# Preserve Human Thinking

Never discard information simply because newer information exists.

Preserve

dead ends,

failed experiments,

incorrect assumptions,

rejected ideas.

These often become valuable later.

---

# Curate Instead of Accumulate

The repository should become easier to understand over time.

The Librarian should

merge duplicates,

organize research,

surface themes,

improve summaries,

without destroying history.

---

# Implementation Philosophy

Prefer

simple,

composable,

transparent

systems.

Avoid

magic hidden logic.

The user should always understand why something happened.

---

# Mobile First

Design every interaction assuming the user is holding a phone.

Desktop should enhance the experience,

not define it.

---

# AI First, Not AI Dependent

The repository should remain usable without AI.

AI should improve the experience.

It should never become required for accessing knowledge.

---

# Human Readability

Every important file should remain pleasant to read in GitHub.

If the repository becomes difficult to understand outside Curiosity OS,

the implementation has failed.

---

# Local First

Assume the repository exists locally.

Do not require internet connectivity for the core experience.

Future cloud synchronization is an enhancement.

Not a dependency.

---

# Progressive Enhancement

Every new feature should improve an existing workflow.

Never introduce complexity solely to support future possibilities.

Future-proof through clean architecture,

not through speculative implementation.

---

# Favor Composition

Small reusable components are preferred over large feature-specific implementations.

Examples

One Timeline component.

One Idea Card component.

One Knowledge Renderer.

One Context Pack Generator.

Reuse them everywhere.

---

# Derived Data

Whenever possible,

derive,

don't store.

Examples

Momentum.

Interest.

Connections.

Activity.

Last Active.

These should emerge from the repository,

not become additional maintenance.

---

# The Librarian

Treat the Librarian as a service layer.

Responsibilities

Read.

Understand.

Organize.

Suggest.

Generate.

Never allow the Librarian to become tightly coupled to the UI.

---

# Portals

Portals are temporary.

They may disappear.

New portals may appear.

The implementation should make adding a new portal inexpensive.

Avoid portal-specific assumptions.

---

# Context Packs

Context Packs are generated views.

Never manually edit them.

Never treat them as permanent knowledge.

They exist only to continue thinking elsewhere.

---

# Knowledge

Knowledge should improve continuously.

Knowledge should never become

a chronological dump,

or

a transcript.

Knowledge is distilled understanding.

---

# Timeline

Timeline is immutable.

Never rewrite history.

Never delete meaningful events.

Every publish contributes to the story of an Idea.

---

# Sessions

Sessions are immutable.

A published Thinking Session becomes historical evidence.

It should never silently change afterwards.

---

# Performance Philosophy

Do not optimize prematurely.

The repository will initially contain

tens,

not thousands,

of Ideas.

Choose simplicity over scalability.

Scalability can come later.

---

# Version One Priorities

The first version should successfully support

✓ Capture an Idea

✓ Browse Ideas

✓ Continue Thinking

✓ Publish a Thinking Session

✓ Librarian updates Knowledge

✓ Timeline updates

✓ Derived metadata

✓ Beautiful reading experience

Everything else is secondary.

---

# Explicitly Deferred

These are intentionally outside Version One.

Do not implement unless requested.

* Real-time synchronization
* MCP integrations
* Automatic portal publishing
* AI-generated relationship inference
* Embeddings
* Semantic search
* Knowledge graph visualizations
* Collaboration
* Multi-user support
* Plugins
* Cloud storage
* Native applications

The architecture should allow these later.

The implementation should not build them today.

---

# Decision Framework

When making any implementation decision,

ask these questions in order.

## 1

Does this make curiosity easier to capture?

---

## 2

Does this make curiosity easier to resume?

---

## 3

Does this preserve knowledge better?

---

## 4

Does this reduce friction?

---

## 5

Does this keep the repository understandable?

---

## 6

Can this be removed without hurting the core experience?

If yes,

it probably belongs in Version Two.

---

# When the AI Should Ask the User

Never invent behavior for

Metadata algorithms.

Librarian intelligence.

Relationship inference.

UI aesthetics.

Animation style.

Prompt engineering.

Repository conventions.

Naming decisions.

Whenever uncertainty affects philosophy,

ask the user.

Do not guess.

---

# Open Loops

The following areas are intentionally unresolved.

Implementation should pause and ask before proceeding if these become blockers.

## Publish Mechanism

Clipboard

GitHub Copilot

MCP

API

Future automation

---

## Prompt Templates

How should Context Packs be formatted for each portal?

---

## Metadata Algorithms

How should Momentum,

Interest,

Confidence,

Novelty,

Evidence

be calculated?

---

## Repository Evolution

At what point should local entities become shared entities?

---

## Curiosity Graph

How should relationships be visualized?

---

## Search

Should search be keyword-based,

AI-assisted,

or hybrid?

---

## Mobile UX

What gestures,

animations,

and interactions best support curiosity?

---

# Definition of Success

A user should be able to

capture an idea,

forget about it for six months,

return,

and immediately feel

"I remember exactly why this excited me."

That is success.

---

# Final Principle

Every implementation decision should optimize for one outcome.

> **Help the user spend more time thinking and less time managing their thinking.**

If a feature increases management more than it increases thinking,

it should not be implemented.
