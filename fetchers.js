/**
 * lib/fetchers.js
 * Fetches raw items from all sources: RSS feeds, HN API, PH API, GitHub Trending
 * Returns a unified RawItem[] array for the AI pipeline.
 */

import axios from "axios";
import Parser from "rss-parser";

const parser = new Parser({ timeout: 10000 });

// ─── Source Definitions ────────────────────────────────────────────────────────
const RSS_SOURCES = [
  // Global
  { name: "TechCrunch",    url: "https://techcrunch.com/feed/",                   category: "global" },
  { name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/", category: "ai" },
  { name: "VentureBeat",   url: "https://venturebeat.com/feed/",                  category: "global" },
  { name: "VentureBeat AI",url: "https://venturebeat.com/category/ai/feed/",      category: "ai" },
  { name: "The Information",url: "https://www.theinformation.com/feed",           category: "global" },
  // Indian ecosystem
  { name: "YourStory",     url: "https://yourstory.com/feed",                     category: "india" },
  { name: "Inc42",         url: "https://inc42.com/feed/",                        category: "india" },
  { name: "Entrackr",      url: "https://entrackr.com/feed/",                     category: "india" },
  { name: "The Ken",       url: "https://the-ken.com/feed/",                      category: "india" },
  // AI / Dev tools
  { name: "Hacker News Blog", url: "https://ycombinator.com/blog.rss",            category: "yc" },
  { name: "Benedict Evans", url: "https://www.ben-evans.com/benedictevans?format=rss", category: "analysis" },
  { name: "Stratechery",   url: "https://stratechery.com/feed/",                  category: "analysis" },
];

// ─── Fetch RSS feeds ───────────────────────────────────────────────────────────
async function fetchRSS(source) {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items || []).slice(0, 15).map((item) => ({
      id: item.guid || item.link || item.title,
      title: item.title || "",
      description: item.contentSnippet || item.content || item.summary || "",
      url: item.link || "",
      publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
      source: source.name,
      category: source.category,
    }));
  } catch (err) {
    console.warn(`[RSS] Failed ${source.name}:`, err.message);
    return [];
  }
}

// ─── Hacker News: Top startup/AI stories ──────────────────────────────────────
async function fetchHackerNews() {
  try {
    const { data: topIds } = await axios.get(
      "https://hacker-news.firebaseio.com/v0/topstories.json",
      { timeout: 8000 }
    );

    const ids = topIds.slice(0, 60);
    const stories = await Promise.allSettled(
      ids.map((id) =>
        axios
          .get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { timeout: 5000 })
          .then((r) => r.data)
      )
    );

    const keywords = [
      "startup", "funding", "raises", "series", "seed", "venture",
      "ai", "llm", "agent", "launch", "yc", "product hunt",
      "saas", "india", "fintech", "health", "automation",
    ];

    return stories
      .filter((r) => r.status === "fulfilled" && r.value?.title)
      .map((r) => r.value)
      .filter((s) =>
        keywords.some((k) => (s.title || "").toLowerCase().includes(k))
      )
      .slice(0, 20)
      .map((s) => ({
        id: String(s.id),
        title: s.title,
        description: s.text || "",
        url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
        publishedAt: new Date(s.time * 1000).toISOString(),
        source: "Hacker News",
        category: "global",
        score: s.score,
        comments: s.descendants,
      }));
  } catch (err) {
    console.warn("[HN] Failed:", err.message);
    return [];
  }
}

// ─── Product Hunt: Today's top launches ───────────────────────────────────────
async function fetchProductHunt() {
  try {
    // Product Hunt GraphQL API (public, no auth for basic queries)
    const query = `{
      posts(first: 20, order: VOTES) {
        edges {
          node {
            id
            name
            tagline
            description
            votesCount
            website
            createdAt
            topics { edges { node { name } } }
          }
        }
      }
    }`;

    const { data } = await axios.post(
      "https://api.producthunt.com/v2/api/graphql",
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          // Public token — works for basic reads; replace with OAuth token for higher limits
          Authorization: `Bearer ${process.env.PRODUCT_HUNT_TOKEN || ""}`,
        },
        timeout: 10000,
      }
    );

    const posts = data?.data?.posts?.edges || [];
    return posts.map(({ node: p }) => ({
      id: p.id,
      title: p.name,
      description: `${p.tagline}. ${p.description || ""}`.trim(),
      url: p.website || `https://producthunt.com`,
      publishedAt: p.createdAt,
      source: "Product Hunt",
      category: "ai",
      votes: p.votesCount,
      topics: (p.topics?.edges || []).map((e) => e.node.name),
    }));
  } catch (err) {
    console.warn("[PH] Failed:", err.message);
    // Fallback: PH RSS
    try {
      return await fetchRSS({ name: "Product Hunt", url: "https://www.producthunt.com/feed", category: "ai" });
    } catch {
      return [];
    }
  }
}

// ─── GitHub Trending: AI/startup repos ────────────────────────────────────────
async function fetchGitHubTrending() {
  try {
    // GitHub Search API (no key for 60 req/hr)
    const queries = [
      "topic:ai-agent stars:>100",
      "topic:llm stars:>50",
      "topic:startup-tools stars:>30",
    ];

    const results = await Promise.allSettled(
      queries.map((q) =>
        axios.get("https://api.github.com/search/repositories", {
          params: { q, sort: "stars", order: "desc", per_page: 5 },
          headers: { Accept: "application/vnd.github.v3+json" },
          timeout: 8000,
        })
      )
    );

    const repos = results
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => r.value.data.items || []);

    return repos.map((repo) => ({
      id: String(repo.id),
      title: repo.full_name,
      description: repo.description || "",
      url: repo.html_url,
      publishedAt: repo.updated_at,
      source: "GitHub Trending",
      category: "ai",
      stars: repo.stargazers_count,
    }));
  } catch (err) {
    console.warn("[GitHub] Failed:", err.message);
    return [];
  }
}

// ─── YC Company Directory (latest batch) ──────────────────────────────────────
async function fetchYCStartups() {
  try {
    const { data } = await axios.get(
      "https://hacker-news.firebaseio.com/v0/jobstories.json",
      { timeout: 8000 }
    );
    const ids = (data || []).slice(0, 20);
    const jobs = await Promise.allSettled(
      ids.map((id) =>
        axios
          .get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { timeout: 5000 })
          .then((r) => r.data)
      )
    );
    return jobs
      .filter((r) => r.status === "fulfilled" && r.value)
      .map((r) => r.value)
      .map((j) => ({
        id: String(j.id),
        title: j.title,
        description: j.text || "",
        url: j.url || `https://news.ycombinator.com/item?id=${j.id}`,
        publishedAt: new Date(j.time * 1000).toISOString(),
        source: "YC Jobs",
        category: "yc",
      }));
  } catch (err) {
    console.warn("[YC] Failed:", err.message);
    return [];
  }
}

// ─── Master fetch orchestrator ────────────────────────────────────────────────
export async function fetchAllSources() {
  console.log("[Fetcher] Starting parallel fetch from all sources...");
  const start = Date.now();

  const [rssResults, hn, ph, gh, yc] = await Promise.allSettled([
    Promise.all(RSS_SOURCES.map(fetchRSS)),
    fetchHackerNews(),
    fetchProductHunt(),
    fetchGitHubTrending(),
    fetchYCStartups(),
  ]);

  const rssItems = rssResults.status === "fulfilled"
    ? rssResults.value.flat()
    : [];

  const allItems = [
    ...rssItems,
    ...(hn.status === "fulfilled" ? hn.value : []),
    ...(ph.status === "fulfilled" ? ph.value : []),
    ...(gh.status === "fulfilled" ? gh.value : []),
    ...(yc.status === "fulfilled" ? yc.value : []),
  ];

  // Deduplicate by URL
  const seen = new Set();
  const unique = allItems.filter((item) => {
    if (!item.url || seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  console.log(
    `[Fetcher] Done. ${unique.length} unique items from ${allItems.length} total in ${Date.now() - start}ms`
  );

  return unique;
}
