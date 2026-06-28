# Architecture

The optimizer sits as a transparent proxy between the app and the model API. It
never changes meaning — it only removes waste.

> **Principle:** Never trade correctness for cost. Every optimization must be
> provably equivalent in output intent.

## The pipeline

1. **Capture** — log each request and response with token counts.
2. **Diff** — detect context re-sent unchanged across turns.
3. **Cache** — reuse stable context via prompt caching.
4. **Report** — show where the money actually goes.

```js
// Cheap context fingerprint — hash the stable prefixes of a conversation
const fingerprint = (messages) =>
  messages
    .filter((m) => m.role === "system" || m.pinned)
    .map((m) => hash(m.content))
    .join(":");
```

## Where the spend goes

| Cause                        | Share of spend | Fixable?              |
| ---------------------------- | -------------- | --------------------- |
| Context re-sent every turn   | ~70%           | Yes — prompt caching  |
| Oversized model for the task | ~18%           | Yes — routing         |
| Retries & timeouts           | ~12%           | Partly                |
