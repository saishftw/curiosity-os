# Curiosity OS

## Amendments v1

**Status:** Accepted Decisions

This document contains architectural decisions made after the initial specification documents were written.

These amendments take precedence over conflicting statements in the original specification.

---

# Amendment 1 — Rename "World" to "Idea"

Replace every occurrence of **World** with **Idea** throughout the specification.

This includes (but is not limited to):

* World → Idea
* World Summary → Idea Summary
* World Timeline → Idea Timeline
* World Knowledge → Idea Knowledge
* Related Worlds → Related Ideas

Reason:

"Idea" is more approachable, immediately understandable, and better reflects the original vision. The novelty of Curiosity OS comes from what an Idea can become rather than inventing new terminology.

---

# Amendment 2 — Repository Philosophy

Clarify the repository philosophy.

Replace the statement:

> "The Git repository is the canonical knowledge store."

With:

> **The Git repository is the canonical source of truth. Human knowledge is stored primarily in Markdown, while application state, references and configuration are stored in JSON.**

Reason:

Markdown and JSON serve different purposes.

Markdown exists for humans.

JSON exists for the application.

---

# Amendment 3 — Core Application Vocabulary

Introduce the concept of **Core Entities**.

Core Entities define Curiosity OS itself.

Examples:

* Portals
* Topics
* Activities
* Views
* Metadata Types

These should exist once and be referenced by Ideas.

Example

Instead of embedding

Claude

inside every Idea,

Ideas should reference

portalId = "claude"

Reason:

Avoid duplicated application vocabulary.

Keep the repository consistent.

---

# Amendment 4 — User Knowledge Remains Local

Only normalize application vocabulary.

Never normalize user knowledge.

The following should remain local to an Idea:

* Knowledge
* Thinking Sessions
* Timeline
* Open Loops
* Intent
* Research
* Architecture
* Findings
* Decisions

Reason:

These are unique to each Idea.

Creating shared entities for them introduces unnecessary complexity.

---

# Amendment 5 — Reference Model

The repository should use lightweight references where appropriate.

Core Entities are referenced by ID.

Example

Idea

↓

portalIds

↓

["claude", "github-copilot"]

rather than duplicating Portal definitions.

Human-facing Markdown should never expose internal IDs.

References are an implementation detail.

---

# Amendment 6 — Human Readability First

Markdown should remain beautiful and readable.

Do not expose:

* IDs
* Internal references
* Machine-specific structures

Those belong exclusively in JSON.

The Librarian is responsible for resolving references when generating human-readable content.

---

# Amendment 7 — Three Types of Data

Curiosity OS stores three kinds of information.

## 1. Core Application Vocabulary

Static.

Referenced.

JSON.

Examples

* Portals
* Topics
* Activities
* Views
* Metadata Types

---

## 2. User Knowledge

Authored.

Readable.

Markdown (+ supporting JSON where appropriate).

Examples

* Idea Knowledge
* Research
* Timeline
* Sessions
* Open Loops

---

## 3. Generated Artifacts

Produced by the Librarian.

Safe to regenerate.

Examples

* Context Packs
* Search Index
* Recommendations
* Curiosity Graph
* Derived Views

---

# Amendment 8 — Metadata Definitions

Separate

Metadata Definition

from

Metadata Value.

Example

metadata-types.json

defines

Momentum

Interest

Confidence

Novelty

Evidence

Activity

An individual Idea stores only the current values.

Reason:

Keeps metadata extensible while avoiding duplicated definitions.

---

# Amendment 9 — Relationships

Avoid creating a dedicated relationships layer or graph database abstraction.

Relationships should remain lightweight references between entities.

The implementation should remain Git-first rather than database-first.

Reason:

Curiosity OS is not implementing a graph database.

It is implementing a portable knowledge repository with references.

---

# Amendment 10 — Repository Simplicity

Do not over-normalize.

Promote something to a Core Entity only if it represents application vocabulary reused across many Ideas.

Do not create entities simply because relational databases would.

The guiding principle is:

> **Normalize Curiosity OS vocabulary. Do not normalize personal thinking.**

---

# Amendment 11 — Source of Truth

The Librarian should operate primarily on the repository structure and referenced entities.

It should understand:

* Markdown
* JSON
* References

It should not require a database server.

The repository itself remains the system.

---

# Final Principle

Whenever implementation requires choosing between:

* cleaner architecture

and

* preserving the simplicity of a Git-first repository,

prefer the Git-first repository unless there is a compelling reason not to.

Curiosity OS should remain understandable even when opened directly in GitHub or VS Code without the application running.
