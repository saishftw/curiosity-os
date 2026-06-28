# Curiosity OS

## Document 4 — UI / UX Specification

**Version:** v1.0

**Status:** Experience Design

---

# Philosophy

Curiosity OS is **not** a productivity application.

It should not look or feel like:

* Jira
* Linear
* Trello
* Asana
* Monday
* Azure DevOps
* GitHub Issues

The user should never feel like they are managing work.

Instead, Curiosity OS should feel like entering a personal library of fascinating unfinished ideas.

---

# Emotional Goals

Every screen should optimize for one or more of these emotions.

* Curiosity
* Wonder
* Discovery
* Momentum
* Excitement
* Reflection

Avoid creating:

* Pressure
* Guilt
* Obligation
* Backlog anxiety
* Completion anxiety

---

# Design Language

The visual language should feel closer to

* Apple Notes
* Apple Journal
* Arc Browser
* Readwise Reader
* Cosmos
* Pinterest (discovery aspect only)

than

* Jira
* Notion databases
* Enterprise dashboards

---

# Overall Experience

The application should encourage wandering.

The user should feel comfortable opening Curiosity OS simply because they are curious.

Not because they have work to do.

---

# Primary Navigation

Keep navigation intentionally small.

Examples

Home

Ideas

Explore

Connections

Search

Settings

Nothing more.

Avoid deep navigation trees.

---

# Home

The Home page should never be a dashboard.

Instead it should feel like an invitation.

Examples

Instead of

"27 Active Ideas"

show

> 🔥 This idea became interesting again.

Instead of

"Recently Updated"

show

> ✨ You discovered something important here.

Instead of

"Tasks"

show

> 🧠 You left an interesting question unanswered.

---

# Home Sections

Examples

🔥 Became interesting again

🧠 Left unfinished

🚀 Ready to build

🌱 New curiosities

🎲 Surprise me

📈 Building momentum

✨ Recently discovered

These sections are views.

Not folders.

---

# Browsing

An Idea may appear in many views simultaneously.

Examples

An AI startup idea may appear under

AI

Startups

Building

Momentum

Recently Active

Connections

The repository should not enforce one hierarchy.

---

# Idea Card

Each Idea appears as a lightweight card.

The card should contain

Name

Short Summary

Current Intent

Momentum

Last Insight

Recent Activity

Connection Count

Portal Icons

Open Loop Count

Avoid information overload.

Cards should invite exploration.

---

# Last Insight

Every card should display

Last Insight

Example

"Discovered that compliance training is passive rather than behavioral."

This is much more valuable than

"Modified 3 days ago."

---

# Resume First

Opening an Idea should never immediately show Markdown.

Instead

show a Resume Snapshot.

---

# Resume Snapshot

The first screen answers

What changed?

↓

What did I learn?

↓

Where did I stop?

↓

What should I do next?

Only then should documents appear.

---

# Timeline

Timeline should feel like reading a story.

Not a Git log.

Examples

June 12

Discovered first competitor.

June 19

Changed business model.

July 3

Prototype completed.

Timeline should highlight evolution.

---

# Knowledge

Markdown should be beautifully rendered.

Reading should feel like reading documentation or a book.

Not editing files.

Support

Images

Code

Callouts

Tables

Links

Embedded media

---

# Context Pack

Context Pack should be hidden.

It exists only when

Continue Thinking

or

Continue Building

is pressed.

The user rarely needs to see it.

---

# Continue Thinking

Primary action.

Visible on every Idea.

Purpose

Launch exploration.

Generate Context Pack.

Continue in selected portal.

---

# Continue Building

Secondary action.

Visible only when repositories exist.

Examples

VS Code

GitHub Copilot

Repository

GitHub

---

# Publish

Publishing should feel satisfying.

Never intimidating.

Examples

Publish Session

Publish Discovery

Save Progress

Avoid

Commit

Merge

Sync

Those are implementation concepts.

---

# Connections

Connections deserve a dedicated visual treatment.

Instead of showing

Related Ideas

simply as a list,

display them as nearby concepts.

Examples

Cybersecurity

↓

Psychology

↓

Behavior Design

↓

Learning

↓

Gamification

Connections should encourage curiosity.

---

# Curiosity Graph

The graph should not be the primary navigation.

It is a discovery tool.

Users should occasionally visit it.

Not rely on it.

Purpose

Reveal unexpected relationships.

---

# Search

Search should support

Ideas

Resources

Knowledge

Timeline

Connections

Open Loops

Search should understand concepts.

Not just keywords.

---

# Views

Every user should be able to browse the same repository in different ways.

---

## Emotional View

Examples

🔥 Became interesting again

🌱 New curiosity

🚀 Close to building

🧠 Left unfinished

🎲 Surprise me

---

## Topic View

Examples

AI

Startups

Psychology

Cybersecurity

Health

Learning

---

## Activity View

Examples

Exploring

Building

Observing

Paused

Researching

---

## Timeline View

Sort by evolution.

---

## Momentum View

Sort by activity.

---

## Connection View

Sort by relationships.

---

No view should own an Idea.

They are simply different perspectives.

---

# Mobile First

Mobile is the primary platform.

Desktop is secondary.

The UI should feel native on a phone.

Everything important should be reachable with one thumb.

---

# Typography

Typography should carry the interface.

Avoid heavy UI.

Prefer whitespace over separators.

Prefer readable text over dense widgets.

---

# Animations

Animations should communicate

continuity,

not decoration.

Examples

Cards gently expanding.

Timeline unfolding.

Connections appearing.

Knowledge fading in.

Avoid flashy transitions.

---

# Color

Color should communicate emotion.

Examples

Warm accent colors for curiosity.

Soft gradients.

Natural surfaces.

Avoid enterprise blues and grays dominating the interface.

---

# Empty States

Empty states should inspire exploration.

Example

Instead of

"No ideas."

show

"What has been on your mind lately?"

---

# Notifications

Notifications should be almost nonexistent.

Curiosity should pull the user.

Notifications should never push the user.

---

# Metrics

Avoid productivity metrics.

Never display

Tasks completed.

Ideas completed.

Completion percentage.

Velocity.

Burndown.

Instead prefer

Ideas explored.

Connections discovered.

Insights gained.

Knowledge accumulated.

Momentum.

---

# Design Anti-Patterns

Do NOT build

Kanban boards

Ticket lists

Priority queues

Status tables

Task assignments

Sprint views

Progress bars

Complex dashboards

Large database grids

Enterprise admin panels

These directly conflict with the philosophy.

---

# Visual Inspiration

The experience should feel like

Walking through a beautiful library.

Browsing an old bookstore.

Exploring interconnected museum exhibits.

Reading marginal notes in your favorite book.

Finding an old notebook and remembering why it excited you.

It should never feel like checking email.

---

# The Magic Test

Every new feature should pass one question.

> **Does this make me want to open Curiosity OS even when I have nothing I need to do?**

If the answer is yes,

the feature belongs.

If the answer is no,

it probably belongs in a productivity application instead.

---

# Final Design Principle

Curiosity OS should become a place the user visits because they are excited to think.

Not because they feel obligated to manage their work.

That single distinction should influence every design decision made throughout the lifetime of the product.
