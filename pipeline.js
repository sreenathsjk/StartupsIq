/**
 * lib/pipeline.js
 * Master orchestrator: Fetch → Clean → AI Analyze → Store → Return
 */

import { fetchAllSources } from "./fetchers.js";
import { analyzeWithAI } from "./analyzer.js";
import { saveReport, getLatestReport } from "./db.js";

// ─── In-memory cache (survives Next.js hot reloads in dev) ────────────────────
let memoryCache = null;
let memoryCacheTime = 0;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

// ─── Run the full pipeline ────────────────────────────────────────────────────
export async function runPipeline({ force = false } = {}) {
  const now = Date.now();

  // 1. Check memory cache
  if (!force && memoryCache && now - memoryCacheTime < CACHE_TTL_MS) {
    console.log("[Pipeline] Serving from memory cache");
    return { ...memoryCache, fromCache: true, cacheAge: Math.round((now - memoryCacheTime) / 1000) };
  }

  // 2. Check DB for today's report
  if (!force) {
    try {
      const dbReport = await getLatestReport();
      if (dbReport) {
        const reportDate = new Date(dbReport.date).toDateString();
        const today = new Date().toDateString();
        if (reportDate === today) {
          console.log("[Pipeline] Serving today's report from DB");
          const result = {
            ...dbReport.report,
            generatedAt: dbReport.created_at,
            itemsCount: dbReport.items_count,
            fetchMs: dbReport.fetch_ms,
            aiMs: dbReport.ai_ms,
            fromCache: true,
          };
          memoryCache = result;
          memoryCacheTime = now;
          return result;
        }
      }
    } catch (err) {
      console.warn("[Pipeline] DB check failed, proceeding with fresh fetch:", err.message);
    }
  }

  // 3. Fresh pipeline run
  console.log("[Pipeline] Running fresh pipeline...");

  const fetchStart = Date.now();
  const rawItems = await fetchAllSources();
  const fetchMs = Date.now() - fetchStart;

  if (rawItems.length === 0) {
    throw new Error("No items fetched from any source — check network connectivity");
  }

  const aiStart = Date.now();
  const report = await analyzeWithAI(rawItems);
  const aiMs = Date.now() - aiStart;

  // Enrich report metadata
  const enriched = {
    ...report,
    generatedAt: new Date().toISOString(),
    itemsCount: rawItems.length,
    fetchMs,
    aiMs,
    totalMs: Date.now() - now,
    fromCache: false,
  };

  // 4. Persist to DB (non-blocking)
  saveReport({
    report: enriched,
    itemsCount: rawItems.length,
    fetchMs,
    aiMs,
  }).catch((err) => console.warn("[Pipeline] DB save failed:", err.message));

  // 5. Update memory cache
  memoryCache = enriched;
  memoryCacheTime = Date.now();

  return enriched;
}

// ─── Invalidate caches (called by cron) ──────────────────────────────────────
export function invalidateCache() {
  memoryCache = null;
  memoryCacheTime = 0;
  console.log("[Pipeline] Cache invalidated");
}
