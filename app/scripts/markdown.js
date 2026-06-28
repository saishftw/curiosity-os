// A small, dependency-free Markdown renderer.
// It supports the subset Curiosity OS actually authors: headings, paragraphs,
// bold/italic/code, links, images, blockquotes (callouts), ordered/unordered
// lists, fenced code blocks, tables, and horizontal rules.
//
// All text is HTML-escaped before formatting, and URLs are sanitized, so it is
// safe to render repository content directly into the page.

import { escapeHtml } from "./ui/dom.js";

const BLOCK_START =
  /^(\s{0,3})(#{1,6}\s|>|\s*[-*+]\s|\s*\d+\.\s|```|\|)/;

export function renderMarkdown(source) {
  const lines = String(source ?? "")
    .replace(/\r\n?/g, "\n")
    .split("\n");
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    // Fenced code block
    const fence = line.match(/^```(\w+)?\s*$/);
    if (fence) {
      const lang = fence[1] || "";
      const buf = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) buf.push(lines[i++]);
      i++; // consume closing fence
      const cls = lang ? ` class="language-${escapeHtml(lang)}"` : "";
      out.push(`<pre><code${cls}>${escapeHtml(buf.join("\n"))}</code></pre>`);
      continue;
    }

    // Heading
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2].trim())}</h${level}>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^\s{0,3}([-*_])(\s*\1){2,}\s*$/.test(line)) {
      out.push("<hr>");
      i++;
      continue;
    }

    // Table (header row followed by a |---|---| separator)
    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      /^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(lines[i + 1])
    ) {
      const header = splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes("|") && !/^\s*$/.test(lines[i])) {
        rows.push(splitRow(lines[i++]));
      }
      const thead = `<thead><tr>${header
        .map((c) => `<th>${inline(c)}</th>`)
        .join("")}</tr></thead>`;
      const tbody = `<tbody>${rows
        .map(
          (r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`
        )
        .join("")}</tbody>`;
      out.push(`<div class="table-scroll"><table>${thead}${tbody}</table></div>`);
      continue;
    }

    // Blockquote (callout when the first content is bold)
    if (/^\s*>/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) {
        buf.push(lines[i++].replace(/^\s*>\s?/, ""));
      }
      out.push(`<blockquote>${renderMarkdown(buf.join("\n"))}</blockquote>`);
      continue;
    }

    // Unordered list
    if (/^\s*[-*+]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i++].replace(/^\s*[-*+]\s+/, ""));
      }
      out.push(`<ul>${items.map((it) => `<li>${inline(it)}</li>`).join("")}</ul>`);
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i++].replace(/^\s*\d+\.\s+/, ""));
      }
      out.push(`<ol>${items.map((it) => `<li>${inline(it)}</li>`).join("")}</ol>`);
      continue;
    }

    // Paragraph (gather until a blank line or the next block)
    const para = [];
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !BLOCK_START.test(lines[i])
    ) {
      para.push(lines[i++]);
    }
    out.push(`<p>${inline(para.join(" ").trim())}</p>`);
  }

  return out.join("\n");
}

/** Parse `timeline.md` into events: each `## YYYY-MM-DD — Title` plus its body. */
export function parseTimeline(source) {
  const text = String(source ?? "").replace(/\r\n?/g, "\n");
  const chunks = text.split(/\n(?=##\s+)/);
  const events = [];
  for (const chunk of chunks) {
    const match = chunk.match(
      /^##\s+(\d{4}-\d{2}-\d{2})\s*[—–-]\s*([^\n]+)\n?([\s\S]*)$/
    );
    if (!match) continue;
    events.push({
      date: match[1],
      title: match[2].trim(),
      body: match[3].trim(),
    });
  }
  return events;
}

/** Pull `- ` bullet items out of a Markdown list (ignores headings/prose). */
export function parseBullets(source) {
  return String(source ?? "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.match(/^\s*[-*+]\s+(.*)$/))
    .filter(Boolean)
    .map((m) => m[1].trim());
}

function splitRow(line) {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

function sanitizeUrl(url) {
  const value = String(url).trim();
  // Block script-bearing schemes; allow http(s), mailto, anchors, relative paths.
  if (/^(javascript|vbscript|data|file):/i.test(value)) return "#";
  return value;
}

function inline(text) {
  let s = escapeHtml(text);

  // Protect inline code spans from further formatting.
  const code = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => {
    code.push(`<code>${c}</code>`);
    return `\u0000${code.length - 1}\u0000`;
  });

  // Images, then links (before emphasis, so URLs are not mangled).
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, src) => {
    return `<img src="${sanitizeUrl(src)}" alt="${alt}" loading="lazy" />`;
  });
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
    const safe = sanitizeUrl(href);
    const external = /^https?:/i.test(safe);
    const rel = external ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${safe}"${rel}>${label}</a>`;
  });

  // Emphasis.
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  s = s.replace(/(^|[\s(])_([^_]+)_(?=[\s).,!?]|$)/g, "$1<em>$2</em>");

  // Restore protected code spans.
  s = s.replace(/\u0000(\d+)\u0000/g, (_, n) => code[Number(n)]);

  return s;
}
