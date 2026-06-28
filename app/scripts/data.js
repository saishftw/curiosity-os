// The read layer. Fetches the canonical Markdown + JSON from the repository and
// caches it. Paths are relative so this works on localhost and under the
// GitHub Pages base path alike. The app never writes — the Librarian does.

const cache = { config: null, index: null, ideas: new Map() };

async function getJSON(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${res.status} while loading ${path}`);
  return res.json();
}

async function getText(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${res.status} while loading ${path}`);
  return res.text();
}

function byId(list) {
  const map = new Map();
  for (const item of list) map.set(item.id, item);
  return map;
}

export async function loadConfig() {
  if (cache.config) return cache.config;
  const [portals, topics, activities, views, metadata] = await Promise.all([
    getJSON("./config/portals.json"),
    getJSON("./config/topics.json"),
    getJSON("./config/activities.json"),
    getJSON("./config/views.json"),
    getJSON("./config/metadata-types.json"),
  ]);
  cache.config = {
    portals: byId(portals.portals),
    topics: byId(topics.topics),
    activities: byId(activities.activities),
    views: views.views,
    metadataTypes: metadata.metadataTypes,
  };
  return cache.config;
}

export async function loadIndex() {
  if (!cache.index) cache.index = await getJSON("./generated/index.json");
  return cache.index;
}

export async function loadHome() {
  const [config, index] = await Promise.all([loadConfig(), loadIndex()]);
  return { config, index };
}

export async function loadIdea(slug) {
  if (cache.ideas.has(slug)) return cache.ideas.get(slug);

  const [config, index] = await Promise.all([loadConfig(), loadIndex()]);
  const entry = index.ideas.find((idea) => idea.slug === slug);
  if (!entry) throw new Error(`Unknown idea: ${slug}`);

  const base = `./ideas/${slug}`;
  const [readme, timeline, openLoops] = await Promise.all([
    getText(`${base}/README.md`).catch(() => ""),
    getText(`${base}/timeline.md`).catch(() => ""),
    getText(`${base}/open-loops.md`).catch(() => ""),
  ]);

  const knowledge = await Promise.all(
    (entry.knowledge || []).map(async (doc) => ({
      title: doc.title,
      md: await getText(`${base}/knowledge/${doc.file}`).catch(() => ""),
    }))
  );

  const sessions = await Promise.all(
    (entry.sessions || []).map(async (session) => ({
      date: session.date,
      portalId: session.portalId,
      md: await getText(`${base}/sessions/${session.file}`).catch(() => ""),
    }))
  );

  const portalsConfig = await getJSON(`${base}/portals.json`).catch(() => ({
    links: [],
  }));
  const connectionsData = await getJSON(`${base}/connections.json`).catch(() => ({
    connections: [],
  }));
  const connections = (connectionsData.connections || []).map((connection) => ({
    ...connection,
    title:
      index.ideas.find((idea) => idea.slug === connection.to)?.title ||
      connection.to,
  }));

  const data = {
    config,
    entry,
    readme,
    timeline,
    openLoops,
    knowledge,
    sessions,
    portalLinks: portalsConfig.links || [],
    connections,
  };
  cache.ideas.set(slug, data);
  return data;
}
