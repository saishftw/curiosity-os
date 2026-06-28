// Entry point: boot the router and orchestrate views. Each route fetches its
// data, then swaps the main element with a subtle exit, a calm loading state,
// and a staggered enter.

import { startRouter } from "./router.js";
import { loadHome, loadIdea, loadConfig } from "./data.js";
import { homeView } from "./views/home.js";
import { ideaView } from "./views/idea.js";
import { captureView } from "./views/capture.js";
import { copyPublishPrompt } from "./views/publish.js";
import { browseView } from "./views/browse.js";
import { el, clear } from "./ui/dom.js";
import { uiIcon } from "./ui/icons.js";

const main = document.getElementById("main");
let renderToken = 0;
let pendingSearchFocus = false;

async function render(route) {
  const token = ++renderToken;
  setActiveNav(route.name);
  // Dismiss any open overlay (context-pack sheet, etc.) when navigating.
  document.querySelectorAll(".sheet").forEach((node) => node.remove());
  await leave(main);
  if (token !== renderToken) return;

  clear(main);
  main.appendChild(loadingState());

  try {
    const node = await build(route);
    if (token !== renderToken) return;
    clear(main);
    main.appendChild(node);
    document.title = titleFor(route);
    // The Home search icon asks the next view to focus the Library search; only
    // the render that actually mounts (past the token checks) consumes it.
    let focusTarget = main;
    if (pendingSearchFocus) {
      pendingSearchFocus = false;
      focusTarget = node.querySelector?.(".search__input") || main;
    }
    focusTarget.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  } catch (error) {
    if (token !== renderToken) return;
    clear(main);
    main.appendChild(errorState(error));
  }
}

async function build(route) {
  if (route.name === "idea") return ideaView(await loadIdea(route.slug));
  if (route.name === "capture") return captureView(await loadConfig());
  if (route.name === "browse") return browseView(await loadHome());
  return homeView(await loadHome());
}

function leave(node) {
  return new Promise((resolve) => {
    if (!node.firstChild) return resolve();
    node.classList.add("view--leaving");
    window.setTimeout(() => {
      node.classList.remove("view--leaving");
      resolve();
    }, 130);
  });
}

function loadingState() {
  const wrap = el("div", { class: "container loading" });
  for (let n = 0; n < 3; n++) wrap.appendChild(el("div", { class: "skeleton" }));
  return wrap;
}

function errorState(error) {
  console.warn("Curiosity OS:", error);
  return el("div", { class: "container empty enter" }, [
    el("div", { class: "empty__art", "aria-hidden": "true" }, [uiIcon("spark")]),
    el("h1", { class: "empty__title", text: "This shelf is quiet" }),
    el("p", {
      class: "empty__sub",
      text: "That idea could not be found. It may have been renamed, or the repository is still being served.",
    }),
    el("p", { style: { marginTop: "1.5rem" } }, [
      el("a", { class: "btn btn--accent", href: "#/" }, ["Back to all ideas"]),
    ]),
  ]);
}

function setActiveNav(name) {
  const active = name === "idea" ? "browse" : name;
  document.querySelectorAll(".sidenav__link[data-route]").forEach((link) => {
    if (link.dataset.route === active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function titleFor(route) {
  if (route.name === "capture") return "Capture · Curiosity OS";
  if (route.name === "browse") return "Browse · Curiosity OS";
  if (route.name === "idea") return "Idea · Curiosity OS";
  return "Curiosity OS";
}

// On phones the sticky bars (brand top bar / idea editorial bar) hide as you
// scroll down and return as you scroll up — reclaiming vertical space.
function setupAutoHideBars() {
  let lastY = window.scrollY || 0;
  let ticking = false;
  const update = () => {
    const y = window.scrollY || 0;
    const bars = document.querySelectorAll(".topbar, .idea__bar, .pagebar");
    if (y < 64) bars.forEach((b) => b.classList.remove("is-hidden"));
    else if (y > lastY + 6) bars.forEach((b) => b.classList.add("is-hidden"));
    else if (y < lastY - 6) bars.forEach((b) => b.classList.remove("is-hidden"));
    lastY = y;
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
}

setupAutoHideBars();

// Publish is a one-click action wherever it appears (nav, home): copy the prompt.
document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-action='publish']");
  if (!trigger) return;
  event.preventDefault();
  copyPublishPrompt();
});

// The Home top-bar search icon jumps to the Library with the search focused.
document.addEventListener("click", (event) => {
  if (event.target.closest("[data-action='search']")) pendingSearchFocus = true;
});

startRouter(render);
