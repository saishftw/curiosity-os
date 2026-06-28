// Search — a quiet, ranked, multi-field lookup over the data already loaded in
// generated/index.json. Pure and dependency-free: it tokenises the query,
// requires every term to match somewhere (AND), and weights fields so the
// strongest hits surface first. No server, no prebuilt index — the index IS the
// searchable surface. (If the library ever grows large enough to want full-text
// over knowledge/timeline prose, the Librarian can emit a generated/search-index.json
// with the same shape of results.)

// How much a hit in each field counts toward an Idea's score.
const FIELD_WEIGHTS = {
  title: 10,
  topics: 6,
  activity: 6,
  summary: 4,
  lastInsight: 4,
  intent: 3,
  knowledge: 3,
  connections: 2,
};

// Human caption shown on a result when the match wasn't an obvious one (title /
// summary need no explanation). null = don't annotate.
const FIELD_LABELS = {
  title: null,
  summary: null,
  topics: "Topics",
  activity: "Activity",
  lastInsight: "Last insight",
  intent: "Intent",
  knowledge: "Knowledge",
  connections: "Connections",
};

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// The searchable text of an Idea, grouped by field. Topic/activity IDs are
// resolved to their human names so a search for "security" finds them.
function fieldsFor(entry, config) {
  const topicNames = (entry.topics || []).map(
    (id) => config.topics.get(id)?.name || id
  );
  const activityName = config.activities.get(entry.activity)?.name || entry.activity || "";
  const knowledge = (entry.knowledge || []).map((item) => item.title || "");
  const connections = (entry.connections || []).flatMap((connection) => [
    connection.relation || "",
    ...(connection.concepts || []),
  ]);
  return {
    title: entry.title || "",
    topics: topicNames.join(" · "),
    activity: activityName,
    summary: entry.summary || "",
    lastInsight: entry.lastInsight || "",
    intent: entry.intent || "",
    knowledge: knowledge.join(" · "),
    connections: connections.join(" · "),
  };
}

// Rank Ideas against a free-text query. Returns
// [{ entry, score, matchedLabel }] sorted by score, then by recency.
export function searchIdeas(ideas, query, config) {
  const terms = (query || "").toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  // Prefix/word-boundary matching: "secur" finds "Security" but "ai" does not
  // match the "ai" buried inside "training".
  const matchers = terms.map((term) => new RegExp("\\b" + escapeRegex(term)));

  const results = [];
  for (const entry of ideas) {
    const fields = fieldsFor(entry, config);
    const lowered = {};
    for (const key in fields) lowered[key] = fields[key].toLowerCase();

    let score = 0;
    let bestField = null;
    let bestWeight = -1;
    let everyTermMatched = true;

    for (const matcher of matchers) {
      let termBest = 0;
      let termBestField = null;
      for (const key in lowered) {
        if (matcher.test(lowered[key]) && FIELD_WEIGHTS[key] > termBest) {
          termBest = FIELD_WEIGHTS[key];
          termBestField = key;
        }
      }
      if (termBest === 0) {
        everyTermMatched = false;
        break;
      }
      score += termBest;
      if (termBest > bestWeight) {
        bestWeight = termBest;
        bestField = termBestField;
      }
    }

    if (!everyTermMatched) continue;
    results.push({ entry, score, matchedLabel: FIELD_LABELS[bestField] || null });
  }

  results.sort(
    (a, b) =>
      b.score - a.score ||
      (b.entry.updated || "").localeCompare(a.entry.updated || "")
  );
  return results;
}
