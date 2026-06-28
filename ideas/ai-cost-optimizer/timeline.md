# Timeline

## 2026-04-02 — Captured

Our Claude bill tripled in a month and nobody could say why. That question wouldn't
leave me alone.

## 2026-04-20 — First suspicion

Skimmed the request logs and noticed the same context appearing again and again.

## 2026-05-10 — Reframed the product

Stopped thinking "model router," started thinking "context diff." The waste isn't
_which_ model — it's what we keep re-sending.

## 2026-06-18 — Found the real cost driver

Traced ~70% of spend to context re-sent unchanged every turn. The model choice
barely mattered.

## 2026-06-24 — Ready to prototype

Sketched the proxy and fingerprint approach. It feels buildable in a weekend.
