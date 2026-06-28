// A tiny hash router. Curiosity OS has three screens; that is enough.

export function parseHash(hash = location.hash) {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "capture") return { name: "capture" };
  if (parts[0] === "browse") return { name: "browse" };
  if (parts[0] === "idea" && parts[1]) {
    return { name: "idea", slug: decodeURIComponent(parts[1]) };
  }
  return { name: "home" };
}

export function startRouter(onRoute) {
  const handle = () => onRoute(parseHash());
  window.addEventListener("hashchange", handle);
  handle();
}

export function navigate(hash) {
  if (location.hash !== hash) location.hash = hash;
}
