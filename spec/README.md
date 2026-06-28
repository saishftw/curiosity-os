# Curiosity OS Specification

## README

Welcome to the Curiosity OS specification.

This repository contains the product vision, architecture, workflows and implementation guidance for Curiosity OS.

Before writing any code, **read this document completely.**

---

# Purpose

Curiosity OS is a personal operating system for curiosity.

It is **not** a productivity application.

It is **not** a project management system.

It is **not** another note-taking application.

Its purpose is to preserve, connect and evolve thinking over time.

Every implementation decision should reinforce this philosophy.

---

# How to Read This Specification

Read the documents **in the following order**.

## 1. Vision & Product Philosophy

Understand **why** Curiosity OS exists.

Do not continue until the philosophy is clear.

---

## 2. Decisions

Read the latest accepted architectural decisions.

These override conflicting statements in older specification documents.

When conflicts exist,

**Decisions.md always takes precedence.**

---

## 3. Domain Model & Entities

Understand what exists inside Curiosity OS.

Do not invent additional entities unless explicitly required.

---

## 4. Workflows & Data Flow

Understand how information moves through the system.

This document defines the lifecycle of every Idea.

---

## 5. UI / UX Specification

Understand how the product should feel.

The implementation should optimize for experience,

not feature count.

---

## 6. Repository & Storage

Understand how knowledge is represented.

The repository is the canonical source of truth.

---

## 7. Implementation Manifesto

Read this before writing any code.

It defines

* implementation philosophy
* constraints
* deferred decisions
* non-goals

---

# Order of Authority

If documents disagree,

follow this precedence.

1. Vision
2. Decisions
3. Implementation Manifesto
4. Domain Model
5. Workflows
6. Repository
7. UI / UX

The Vision should never be violated for implementation convenience.

---

# Before Writing Code

Your first responsibility is **not implementation**.

Your first responsibility is understanding.

Review the specification.

Identify

* inconsistencies
* ambiguity
* unnecessary complexity
* missing decisions

Ask questions before making assumptions.

---

# Design Principles

Throughout implementation, continuously optimize for the following principles.

* Curiosity over productivity
* Resume over search
* Knowledge over notes
* Events over snapshots
* Derived over manual
* Portals over integration
* Curation over accumulation
* Git-first architecture
* AI-assisted, not AI-dependent
* Human-readable repository
* Mobile-first experience

---

# Things You Must Never Assume

Do not invent

* features
* workflows
* metadata
* repository structures
* UI interactions
* AI prompts
* synchronization mechanisms

If something is unspecified,

ask.

---

# Scope of Version One

Version One should focus on doing a few things exceptionally well.

Must support

* Capture an Idea
* Browse Ideas
* Continue Thinking
* Publish Thinking Sessions
* Knowledge curation
* Timeline
* Context Packs
* Beautiful reading experience

Everything else is secondary.

---

# Explicit Non-Goals

Version One should NOT include

* authentication
* collaboration
* cloud synchronization
* notifications
* plugins
* databases
* user management
* task management
* kanban boards
* project tracking

Do not implement these unless explicitly requested.

---

# Architectural Philosophy

Curiosity OS is intentionally simple.

The implementation should prefer

simple,

understandable,

portable

solutions.

Avoid introducing complexity solely for future scalability.

---

# Repository Philosophy

The repository is the product.

The UI is simply one way of interacting with it.

The repository should remain understandable in

GitHub,

VS Code,

or any Markdown reader.

The application must never become the only way to access knowledge.

---

# Working with AI

Treat AI as a collaborator,

not as the product owner.

When making implementation decisions

prefer

clarity,

maintainability,

simplicity,

and explicitness.

Do not optimize prematurely.

---

# When to Stop

If implementation reaches a point where philosophy is unclear,

or multiple valid architectural directions exist,

stop implementation.

Ask the product owner.

Do not guess.

---

# Success Criteria

The implementation is successful if a user can

capture an Idea,

leave it untouched for months,

return,

and immediately understand

* why it mattered,
* what was learned,
* where thinking stopped,
* and how to continue.

---

# Final Principle

Whenever you are about to implement a feature,

ask one question.

> **Does this help the user spend more time thinking and less time managing their thinking?**

If the answer is no,

the feature probably does not belong in Curiosity OS.
