# Templates

These are the skeletons the **Librarian** (GitHub Copilot) uses when performing
repository mutations. They are not read by the app at runtime.

- [`idea/`](idea/) — the full skeleton for a newly **Captured** Idea. Copy it to
  `ideas/<slug>/`, replace every `{{token}}`, then append the Idea to
  [`generated/index.json`](../generated/index.json).
- [`thinking-session.md`](thinking-session.md) — the immutable artifact written to
  `ideas/<slug>/sessions/` on every **Publish**. Never edited after it is written.

Tokens use `{{double-brace}}` syntax. Replace all of them. Never leave a token, and
never expose IDs or internal references inside Markdown — those live only in JSON.
