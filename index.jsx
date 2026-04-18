// pages/index.jsx — Main Dashboard

import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import DetailModal from "../components/DetailModal.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import {
  StartupSection, FundingSection, AIToolsSection,
  IndianAppsSection, TrendsSection, OpportunitiesSection,
  IdeasSection, UnderratedSection, AgenticSection,
} from "../components/sections.jsx";

// ─── Time helpers ──────────────────────────────────────────────────────────────
function formatTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: true, timeZone: "Asia/Kolkata",
  }) + " IST";
}
function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    timeZone: "Asia/Kolkata",
  });
}
function timeAgo(d) {
  if (!d) return "";
  const secs = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (secs < 60)  return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs/60)}m ago`;
  return `${Math.floor(secs/3600)}h ago`;
}

// ─── Stats bar data ────────────────────────────────────────────────────────────
function buildStats(report) {
  return [
    { label: "Startups",  value: report.startups?.length      || 0, icon: "🚀", color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/20" },
    { label: "Funding",   value: report.funding?.length       || 0, icon: "💰", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "AI Tools",  value: report.aiTools?.length       || 0, icon: "🤖", color: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "border-cyan-500/20" },
    { label: "India",     value: report.indianApps?.length    || 0, icon: "🇮🇳", color: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/20" },
    { label: "Trends",    value: report.trends?.length        || 0, icon: "📈", color: "text-pink-400",    bg: "bg-pink-500/10",    border: "border-pink-500/20" },
    { label: "Signals",   value: report.opportunities?.length || 0, icon: "⚡", color: "text-yellow-400",  bg: "bg-yellow-500/10",  border: "border-yellow-500/20" },
    { label: "Ideas",     value: report.ideas?.length         || 0, icon: "💡", color: "text-fuchsia-400", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20" },
    { label: "Sources",   value: report.itemsCount            || 0, icon: "📡", color: "text-slate-400",   bg: "bg-slate-500/10",   border: "border-slate-700/50" },
  ];
}

const TABS = [
  { id: "all",      label: "All" },
  { id: "startups", label: "Startups" },
  { id: "funding",  label: "Funding" },
  { id: "ai",       label: "AI Tools" },
  { id: "india",    label: "India" },
  { id: "trends",   label: "Trends" },
  { id: "ideas",    label: "Ideas" },
];

// ─── Summary Banner ────────────────────────────────────────────────────────────
function SummaryBanner({ summary, metadata }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-900/90 via-ink-900 to-slate-900/90 p-6 mb-6 noise">
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="relative w-2 h-2 rounded-full bg-emerald-400 live-dot text-emerald-400" />
            <span className="font-display text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400">
              Live Intelligence Brief
            </span>
          </div>
          {metadata?.dominantTheme && (
            <span className="tag border border-violet-500/30 bg-violet-500/10 text-violet-300">
              {metadata.dominantTheme}
            </span>
          )}
          {metadata?.indiaSignalStrength && (
            <span className="tag border border-orange-500/25 bg-orange-500/10 text-orange-300">
              🇮🇳 India Signal: {metadata.indiaSignalStrength}/10
            </span>
          )}
          <span className="ml-auto text-xs text-slate-600 font-mono">
            {formatDate(new Date())}
          </span>
        </div>
        <p className="text-slate-200 text-sm leading-relaxed font-medium max-w-3xl">{summary}</p>
      </div>
    </div>
  );
}

// ─── Stats Bar ─────────────────────────────────────────────────────────────────
function StatsBar({ report }) {
  const stats = buildStats(report);
  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 mb-6 stagger">
      {stats.map((s) => (
        <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-3 text-center card-lift`}>
          <div className="text-lg mb-1">{s.icon}</div>
          <div className={`font-display font-bold text-xl ${s.color}`}>{s.value}</div>
          <div className="text-slate-600 text-[9px] font-bold tracking-widest uppercase mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Performance Badge ─────────────────────────────────────────────────────────
function PerfBadge({ label, value, color = "slate" }) {
  const colors = { slate: "text-slate-500", cyan: "text-cyan-400", emerald: "text-emerald-400", violet: "text-violet-400" };
  return (
    <div className="flex items-center gap-1.5 bg-ink-800/80 border border-slate-800/80 rounded-full px-3 py-1">
      <span className={`font-mono text-[10px] font-bold ${colors[color]}`}>{value}</span>
      <span className="text-slate-700 text-[10px]">{label}</span>
    </div>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] animate-fade-up">
      <div className="bg-ink-800 border border-slate-700 text-white text-xs font-semibold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        {message}
      </div>
    </div>
  );
}

// ─── History Drawer ────────────────────────────────────────────────────────────
function HistoryDrawer({ open, onClose, onSelectDate }) {
  const [dates, setDates] = useState([]);
  useEffect(() => {
    if (!open) return;
    fetch("/api/history").then(r => r.json()).then(d => setDates(d.data || [])).catch(() => {});
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[150] flex justify-end" onClick={onClose}>
      <div className="w-72 bg-ink-900 border-l border-slate-800 h-full overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-white text-sm">Report History</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-lg">✕</button>
        </div>
        {dates.length === 0 && <p className="text-slate-600 text-xs">No history yet</p>}
        {dates.map(d => (
          <button
            key={d.date}
            onClick={() => { onSelectDate(d.date); onClose(); }}
            className="w-full text-left p-3 rounded-xl border border-slate-800/60 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all mb-2 group"
          >
            <p className="font-mono text-slate-300 text-xs group-hover:text-white transition-colors">{d.date}</p>
            {d.items_count && <p className="text-slate-600 text-[10px] mt-0.5">{d.items_count} items analyzed</p>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard Component ──────────────────────────────────────────────────
export default function Dashboard() {
  const [report, setReport]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState(null);
  const [activeTab, setActiveTab]   = useState("all");
  const [selectedItem, setSelected] = useState(null);
  const [toast, setToast]           = useState(null);
  const [historyOpen, setHistory]   = useState(false);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ── Fetch report ────────────────────────────────────────────────────────────
  const fetchReport = useCallback(async (force = false) => {
    try {
      force ? setRefreshing(true) : setLoading(true);
      setError(null);

      const res = await fetch("/api/report", {
        method: force ? "POST" : "GET",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.error || "Unknown error");

      setReport(json.data);
      if (force) {
        showToast(`✓ Refreshed — ${json.data.itemsCount} items in ${((json.data.totalMs||0)/1000).toFixed(1)}s`);
      }
    } catch (err) {
      setError(err.message);
      showToast(`✗ ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  // ── Load historical report ──────────────────────────────────────────────────
  const loadHistoricalReport = useCallback(async (date) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/history?date=${date}`);
      const json = await res.json();
      if (json.success) {
        setReport(json.data.report);
        showToast(`Loaded report for ${date}`);
      }
    } catch (err) {
      showToast("Failed to load historical report");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchReport(false); }, [fetchReport]);

  // ── Mobile tab bar ──────────────────────────────────────────────────────────
  const MobileNav = () => (
    <div className="md:hidden flex gap-1 overflow-x-auto pb-1 mb-4 scrollbar-hide">
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => setActiveTab(t.id)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === t.id
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );

  const show = (tab) => activeTab === "all" || activeTab === tab;

  return (
    <>
      <Head>
        <title>Startup Intelligence Engine</title>
        <meta name="description" content="Daily AI-curated startup intelligence for founders and investors" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>" />
      </Head>

      <div className="min-h-screen bg-ink-950 grid-bg">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-ink-950/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-display font-black text-sm shadow-lg">
                S
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-white text-sm tracking-tight">
                  Startup Intelligence
                </span>
                <span className="text-slate-600 text-xs ml-1.5">Engine</span>
              </div>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === t.id
                      ? "bg-slate-800/80 text-white border border-slate-700/50"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-auto flex-shrink-0">
              {report && !loading && (
                <div className="hidden lg:flex items-center gap-2">
                  <PerfBadge label="items" value={report.itemsCount} color="cyan" />
                  {report.aiMs && <PerfBadge label="ai" value={`${(report.aiMs/1000).toFixed(1)}s`} color="violet" />}
                  <PerfBadge label={report.fromCache ? "cached" : "live"} value={timeAgo(report.generatedAt)} color={report.fromCache ? "slate" : "emerald"} />
                </div>
              )}

              <button
                onClick={() => setHistory(true)}
                className="w-8 h-8 rounded-lg bg-ink-800 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all flex items-center justify-center text-sm"
                title="View history"
              >
                🕐
              </button>

              <button
                onClick={() => fetchReport(true)}
                disabled={refreshing || loading}
                className="flex items-center gap-2 bg-violet-600/90 hover:bg-violet-600 disabled:opacity-50 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all border border-violet-500/50"
              >
                <span className={refreshing ? "animate-spin" : ""} style={{ display: "inline-block" }}>↻</span>
                <span className="hidden sm:inline">{refreshing ? "Fetching…" : "Refresh"}</span>
              </button>
            </div>
          </div>
        </header>

        {/* ── Main ────────────────────────────────────────────────────────── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

          {/* Page title */}
          <div className="mb-6">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Daily Intelligence Brief
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-slate-500 text-sm">
                AI-curated insights for founders & investors
              </span>
              {report?.generatedAt && (
                <>
                  <span className="text-slate-700">·</span>
                  <span className="text-slate-600 text-xs font-mono">
                    {formatTime(report.generatedAt)}
                  </span>
                </>
              )}
              {report?.fetchMs && (
                <>
                  <span className="text-slate-700">·</span>
                  <span className="text-slate-600 text-xs">
                    fetched in <span className="text-violet-500 font-mono">{(report.fetchMs/1000).toFixed(1)}s</span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Loading state */}
          {loading && <LoadingSkeleton />}

          {/* Error state */}
          {!loading && error && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-8 text-center">
              <p className="text-rose-400 font-display font-bold text-lg mb-2">Pipeline Error</p>
              <p className="text-slate-500 text-sm mb-4">{error}</p>
              <button
                onClick={() => fetchReport(true)}
                className="bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
              >
                Retry
              </button>
            </div>
          )}

          {/* Report content */}
          {!loading && !error && report && (
            <div className="stagger">
              {/* Summary */}
              {report.summary && (
                <SummaryBanner summary={report.summary} metadata={report.metadata} />
              )}

              {/* Stats */}
              <StatsBar report={report} />

              {/* Mobile nav */}
              <MobileNav />

              {/* Cards grid */}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {show("startups") && report.startups?.length > 0 && (
                  <StartupSection data={report.startups} onSelect={setSelected} />
                )}
                {show("funding") && report.funding?.length > 0 && (
                  <FundingSection data={report.funding} onSelect={setSelected} />
                )}
                {show("ai") && report.aiTools?.length > 0 && (
                  <AIToolsSection data={report.aiTools} onSelect={setSelected} />
                )}
                {show("india") && report.indianApps?.length > 0 && (
                  <IndianAppsSection data={report.indianApps} onSelect={setSelected} />
                )}
                {show("trends") && report.trends?.length > 0 && (
                  <TrendsSection data={report.trends} onSelect={setSelected} />
                )}
                {show("trends") && report.opportunities?.length > 0 && (
                  <OpportunitiesSection data={report.opportunities} onSelect={setSelected} />
                )}
                {(show("startups") || show("ai")) && report.agenticWorkflows?.length > 0 && (
                  <AgenticSection data={report.agenticWorkflows} onSelect={setSelected} />
                )}

                {/* Full-width sections */}
                {show("ideas") && report.ideas?.length > 0 && (
                  <IdeasSection data={report.ideas} onSelect={setSelected} />
                )}
                {activeTab === "all" && report.underratedOpportunities?.length > 0 && (
                  <UnderratedSection data={report.underratedOpportunities} onSelect={setSelected} />
                )}
              </div>

              {/* Footer */}
              <div className="mt-10 pt-6 border-t border-slate-800/50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
                <span className="font-display font-semibold">Startup Intelligence Engine · Built with Claude AI</span>
                <span className="font-mono">
                  Sources: TechCrunch · VentureBeat · Product Hunt · HN · Inc42 · YourStory · Entrackr · GitHub
                </span>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals & overlays */}
      <DetailModal item={selectedItem} onClose={() => setSelected(null)} />
      <HistoryDrawer open={historyOpen} onClose={() => setHistory(false)} onSelectDate={loadHistoricalReport} />
      <Toast message={toast} />
    </>
  );
}
