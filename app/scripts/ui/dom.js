// Small DOM + formatting helpers. No framework, no dependencies.

/**
 * Create an element. `attrs.class`, `attrs.text`, `attrs.html`, `attrs.dataset`,
 * `onClick`-style listeners, and a `style` object are all supported.
 */
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key === "html") node.innerHTML = value;
    else if (key === "dataset") Object.assign(node.dataset, value);
    else if (key === "style" && typeof value === "object") {
      for (const [prop, val] of Object.entries(value)) {
        if (prop.startsWith("--")) node.style.setProperty(prop, String(val));
        else node.style[prop] = val;
      }
    } else if (key.startsWith("on") && typeof value === "function")
      node.addEventListener(key.slice(2).toLowerCase(), value);
    else node.setAttribute(key, value === true ? "" : String(value));
  }
  append(node, children);
  return node;
}

function append(node, children) {
  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    if (child == null || child === false) continue;
    node.appendChild(
      child instanceof Node ? child : document.createTextNode(String(child))
    );
  }
  return node;
}

export function frag(children) {
  return append(document.createDocumentFragment(), children);
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
}

/** Escape text for safe interpolation into HTML strings. */
export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Format an ISO date (YYYY-MM-DD) into warm, human prose. */
export function formatDate(iso, style = "long") {
  if (!iso) return "";
  const date = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(date.getTime())) return iso;
  const options =
    style === "short"
      ? { month: "short", day: "numeric" }
      : { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

/** Whole days between two ISO dates (a is later than b → positive). */
export function daysBetween(aIso, bIso) {
  const a = new Date(`${aIso}T00:00:00`);
  const b = new Date(`${bIso}T00:00:00`);
  return Math.round((a - b) / 86_400_000);
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
