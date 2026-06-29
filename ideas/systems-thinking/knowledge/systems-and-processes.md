# Systems and processes

Every engineered system — whether a manufacturing line, a software platform, or a
hospital intake process — shares the same fundamental structure.

## The transformation model

A process is not a sequence of steps. It is a **transformation**:

> **Inputs → Process → Outputs**, operating under **Constraints**

Understanding any system means asking:
- What are the inputs?
- What outputs are we trying to produce?
- What constraints limit what's possible?
- Where are the bottlenecks — the constraints that bind most tightly?

## Business objectives come first

> **Reframe:** Stop asking "how does the current process work?" Start asking "what
> is this process trying to achieve?"

Optimization without purpose risks improving the wrong subsystem. The hierarchy
that prevents this:

1. Business objective
2. Success metrics
3. Current ("As-Is") process
4. Constraints
5. Bottlenecks
6. Improvements
7. Measurement & iteration

## The mapping to software system design

Process engineering and software architecture are both specializations of systems
thinking. Their abstractions map almost exactly:

| Process Engineering       | Software System Design       |
|---------------------------|------------------------------|
| Business objective        | Business requirements        |
| Process capabilities      | Functional requirements      |
| Performance metrics       | Non-functional requirements  |
| Process flow              | Architecture                 |
| Bottlenecks               | System constraints           |

This means fluency in one transfers directly to the other.

## Where optimization opportunities hide

Most gains come not from speeding up existing steps, but from eliminating
non-value-added activities:

- **Waiting** — time spent between steps with no transformation happening.
- **Unnecessary approvals** — gates that add delay without adding verification value.
- **Duplicate work** — the same information processed more than once.
- **Redundant handoffs** — transfers that exist for organizational reasons, not
  logical ones.

## Prior beliefs, preserved

*What was believed before this session, and why it changed:*

**Belief:** Process engineering is primarily about optimizing workflows for metrics
like cost or throughput.

**Why it changed:** Optimization without understanding the business objective risks
improving the wrong thing. The starting point must be purpose, not process.

---

**Belief:** System design and process engineering are analogous — two different names
for the same thing.

**Why it changed:** They are not analogous; they are *siblings*. Both are
specializations of systems thinking and share the same reasoning patterns. System
design is not the parent concept — systems thinking is.
