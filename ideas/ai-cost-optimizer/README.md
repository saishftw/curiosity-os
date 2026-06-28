# AI Cost Optimizer

> A transparent proxy that watches how teams actually spend on LLM APIs and quietly
> removes the waste — without changing the model or the meaning of a single prompt.

**Right now:** Prototype the token-usage analyzer against one week of real Claude logs.

**Last insight:** Most overspend isn't model choice — it's redundant context re-sent
on every turn.

---

## Why this matters

AI bills are becoming material and unpredictable for small teams — right when they
can least afford surprises. The tools that exist today watch _dollars_, not _why_.
This would explain the bill in the language of the conversation itself.

## Current understanding

- The dominant cost driver is **redundant context**, not model selection.
- Prompt caching plus a cheap "context diff" could remove most of the waste.
- The real wedge is **explanation**, not just routing.

## Key decisions

- Reframe from "model router" → "context optimizer."
- Never trade correctness for cost: every optimization must be output-equivalent.
