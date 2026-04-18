// components/sections.jsx — All dashboard section cards

import { Card, SectionHeader, MomentumBadge, UrgencyBadge, StageBadge, SignalScore, RowArrow } from "./ui.jsx";

// ─── Startup Section ──────────────────────────────────────────────────────────
export function StartupSection({ data = [], onSelect }) {
  return (
    <Card>
      <SectionHeader icon="🚀" title="Startups" count={data.length} accent="text-violet-400" desc="Notable companies & launches" />
      <div className="space-y-4">
        {data.map((s, i) => (
          <div key={i} className="group cursor-pointer" onClick={() => onSelect({ type: "startup", data: s })}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500/25 transition-colors">
                <span className="font-mono text-violet-300 text-[11px] font-bold">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-display font-semibold text-white text-sm group-hover:text-violet-300 transition-colors">{s.name}</span>
                  {s.stage && <StageBadge stage={s.stage} />}
                  {s.raised && s.raised !== "Undisclosed" && (
                    <span className="tag border border-emerald-500/25 bg-emerald-500/10 text-emerald-300">{s.raised}</span>
                  )}
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{s.headline}</p>
                {s.insight && <p className="text-violet-400/70 text-xs mt-1 italic">💡 {s.insight}</p>}
                {s.signalScore && (
                  <div className="mt-2 w-24">
                    <SignalScore score={s.signalScore} />
                  </div>
                )}
              </div>
              <RowArrow color="violet" />
            </div>
            {i < data.length - 1 && <div className="mt-4 border-b border-slate-800/40" />}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Funding Section ──────────────────────────────────────────────────────────
export function FundingSection({ data = [], onSelect }) {
  return (
    <Card>
      <SectionHeader icon="💰" title="Funding Rounds" count={data.length} accent="text-emerald-400" desc="Capital raises & investors" />
      <div className="space-y-3">
        {data.map((f, i) => (
          <div key={i} className="group cursor-pointer rounded-xl p-3 -mx-1 hover:bg-emerald-500/4 transition-colors" onClick={() => onSelect({ type: "funding", data: f })}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-display font-semibold text-white text-sm group-hover:text-emerald-300 transition-colors">{f.company}</span>
                  {f.stage && <StageBadge stage={f.stage} />}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-emerald-400 text-base">{f.amount}</span>
                  {f.sector && <span className="text-slate-600 text-xs">· {f.sector}</span>}
                </div>
                {f.insight && <p className="text-slate-500 text-xs mt-1 italic">{f.insight}</p>}
                {f.signalScore && (
                  <div className="mt-2 w-24">
                    <SignalScore score={f.signalScore} />
                  </div>
                )}
              </div>
              <RowArrow color="emerald" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── AI Tools Section ─────────────────────────────────────────────────────────
export function AIToolsSection({ data = [], onSelect }) {
  return (
    <Card>
      <SectionHeader icon="🤖" title="AI Tools" count={data.length} accent="text-cyan-400" desc="Products & developer tools" />
      <div className="space-y-3">
        {data.map((t, i) => (
          <div key={i} className="group cursor-pointer bg-cyan-500/4 border border-cyan-500/15 rounded-xl p-3.5 hover:border-cyan-500/35 hover:bg-cyan-500/8 transition-all" onClick={() => onSelect({ type: "aiTool", data: t })}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-display font-semibold text-cyan-200 text-sm">{t.name}</span>
                  {t.category && <span className="tag border border-cyan-500/20 bg-cyan-500/8 text-cyan-400">{t.category}</span>}
                  {t.availability === "Generally Available" && (
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Live</span></span>
                  )}
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{t.description}</p>
                {t.useCase && <p className="text-cyan-400/60 text-xs mt-1">→ {t.useCase}</p>}
                {t.signalScore && (
                  <div className="mt-2 w-24">
                    <SignalScore score={t.signalScore} />
                  </div>
                )}
              </div>
              <RowArrow color="cyan" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── India Section ────────────────────────────────────────────────────────────
export function IndianAppsSection({ data = [], onSelect }) {
  return (
    <Card>
      <SectionHeader icon="🇮🇳" title="India Focus" count={data.length} accent="text-orange-400" desc="Indian startup ecosystem" />
      <div className="space-y-4">
        {data.map((a, i) => (
          <div key={i} className="group cursor-pointer flex items-start gap-2 rounded-xl p-2 -mx-1 hover:bg-orange-500/4 transition-colors" onClick={() => onSelect({ type: "indianApp", data: a })}>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-display font-semibold text-orange-300 text-sm group-hover:text-orange-200 transition-colors">{a.name}</span>
                {a.status && <span className="tag border border-orange-500/25 bg-orange-500/10 text-orange-400">{a.status}</span>}
              </div>
              <p className="text-slate-500 text-xs">{a.headline}</p>
              {a.context && <p className="text-orange-400/60 text-xs mt-1 italic">{a.context}</p>}
              {a.signalScore && (
                <div className="mt-2 w-24">
                  <SignalScore score={a.signalScore} />
                </div>
              )}
            </div>
            <RowArrow color="orange" />
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Trends Section ───────────────────────────────────────────────────────────
export function TrendsSection({ data = [], onSelect }) {
  return (
    <Card>
      <SectionHeader icon="📈" title="Trends" count={data.length} accent="text-pink-400" desc="Market signals & momentum" />
      <div className="space-y-3">
        {data.map((t, i) => (
          <div key={i} className="group cursor-pointer flex items-start gap-3 rounded-xl p-2 -mx-1 hover:bg-pink-500/4 transition-colors" onClick={() => onSelect({ type: "trend", data: t })}>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-display font-semibold text-white text-sm group-hover:text-pink-300 transition-colors">{t.trend}</span>
                <MomentumBadge momentum={t.momentum} />
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">{t.signal}</p>
              {t.signalScore && (
                <div className="mt-2 w-24">
                  <SignalScore score={t.signalScore} />
                </div>
              )}
            </div>
            <RowArrow color="pink" />
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Opportunities Section ────────────────────────────────────────────────────
export function OpportunitiesSection({ data = [], onSelect }) {
  return (
    <Card>
      <SectionHeader icon="⚡" title="Opportunities" count={data.length} accent="text-yellow-400" desc="Gaps worth building" />
      <div className="space-y-3">
        {data.map((o, i) => (
          <div key={i} className="group cursor-pointer bg-yellow-500/4 border border-yellow-500/15 rounded-xl p-3.5 hover:border-yellow-500/35 hover:bg-yellow-500/8 transition-all" onClick={() => onSelect({ type: "opportunity", data: o })}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-display font-semibold text-yellow-200 text-sm">{o.area}</span>
                  <UrgencyBadge urgency={o.urgency} />
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{o.why}</p>
                {o.signalScore && (
                  <div className="mt-2 w-24">
                    <SignalScore score={o.signalScore} />
                  </div>
                )}
              </div>
              <RowArrow color="yellow" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Ideas Section ────────────────────────────────────────────────────────────
export function IdeasSection({ data = [], onSelect }) {
  return (
    <div className="col-span-full">
      <Card>
        <SectionHeader icon="💡" title="AI-Generated Startup Ideas" count={data.length} accent="text-fuchsia-400" desc="Novel opportunities from today's signals" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((idea, i) => (
            <div key={i} className="group cursor-pointer border border-slate-800/80 rounded-xl p-4 hover:border-fuchsia-500/30 hover:bg-fuchsia-500/4 transition-all" onClick={() => onSelect({ type: "idea", data: idea })}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-fuchsia-500/15 border border-fuchsia-500/25 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-fuchsia-300 text-[10px] font-bold">#{i+1}</span>
                </div>
                <RowArrow color="fuchsia" />
              </div>
              <h3 className="font-display font-bold text-white text-sm leading-tight mb-2 group-hover:text-fuchsia-200 transition-colors">{idea.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{idea.problem}</p>
              {idea.mvpTimeline && (
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-[10px] text-fuchsia-500/60">⏱</span>
                  <span className="text-[10px] text-slate-600">{idea.mvpTimeline}</span>
                </div>
              )}
              {idea.signalScore && (
                <div className="mt-2 w-24">
                  <SignalScore score={idea.signalScore} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Underrated Opportunities ─────────────────────────────────────────────────
export function UnderratedSection({ data = [], onSelect }) {
  if (!data?.length) return null;
  return (
    <div className="col-span-full">
      <Card className="border-rose-500/20 bg-rose-500/4">
        <SectionHeader icon="🔍" title="Underrated Opportunities" count={data.length} accent="text-rose-400" desc="Contrarian signals most analysts are missing" />
        <div className="grid sm:grid-cols-2 gap-4">
          {data.map((o, i) => (
            <div key={i} className="group cursor-pointer bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 hover:border-rose-500/40 transition-all" onClick={() => onSelect({ type: "underrated", data: o })}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-display font-bold text-rose-200 text-sm">{o.area}</span>
                <RowArrow color="rose" />
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">{o.why}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Agentic Workflows ────────────────────────────────────────────────────────
export function AgenticSection({ data = [], onSelect }) {
  if (!data?.length) return null;
  return (
    <Card>
      <SectionHeader icon="⚙️" title="Agentic Workflows" count={data.length} accent="text-sky-400" desc="AI automation trends to track" />
      <div className="space-y-3">
        {data.map((w, i) => (
          <div key={i} className="group cursor-pointer bg-sky-500/4 border border-sky-500/15 rounded-xl p-3.5 hover:border-sky-500/35 transition-all" onClick={() => onSelect({ type: "agentic", data: w })}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-display font-semibold text-sky-200 text-sm">{w.workflow}</span>
                  <span className={`tag border ${
                    w.status === "Mainstream" ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300" :
                    w.status === "Growing"    ? "border-amber-500/25 bg-amber-500/10 text-amber-300" :
                                                "border-sky-500/25 bg-sky-500/10 text-sky-300"
                  }`}>{w.status}</span>
                </div>
                <p className="text-slate-500 text-xs">{w.who}</p>
              </div>
              <RowArrow color="sky" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
