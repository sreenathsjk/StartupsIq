// components/ui.jsx — Shared design system primitives

export function SignalScore({ score = 5 }) {
  const pct = (score / 10) * 100;
  const color =
    score >= 8 ? "bg-emerald-400" : score >= 6 ? "bg-amber-400" : "bg-slate-500";
  return (
    <div className="flex items-center gap-2">
      <div className="score-bar flex-1" style={{ minWidth: 40 }}>
        <div className={`score-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[10px] text-slate-500">{score}/10</span>
    </div>
  );
}

export function MomentumBadge({ momentum }) {
  const cfg = {
    rising:  { cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25", label: "↑ Rising" },
    peaking: { cls: "bg-amber-500/15 text-amber-300 border-amber-500/25",       label: "◆ Peaking" },
    stable:  { cls: "bg-sky-500/15 text-sky-300 border-sky-500/25",             label: "→ Stable" },
    fading:  { cls: "bg-slate-500/15 text-slate-400 border-slate-500/25",       label: "↓ Fading" },
  };
  const c = cfg[momentum] || cfg.stable;
  return (
    <span className={`tag border ${c.cls}`}>{c.label}</span>
  );
}

export function UrgencyBadge({ urgency }) {
  const cfg = {
    high:   { cls: "bg-rose-500/15 text-rose-300 border-rose-500/30",     label: "HIGH" },
    medium: { cls: "bg-amber-500/15 text-amber-300 border-amber-500/30",  label: "MED" },
    low:    { cls: "bg-slate-600/30 text-slate-400 border-slate-500/20",  label: "LOW" },
  };
  const c = cfg[urgency] || cfg.low;
  return <span className={`tag border ${c.cls}`}>{c.label}</span>;
}

export function StageBadge({ stage }) {
  const colors = {
    "Pre-seed":       "bg-slate-600/30 text-slate-300 border-slate-500/20",
    "Seed":           "bg-violet-500/15 text-violet-300 border-violet-500/25",
    "Series A":       "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
    "Series B":       "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
    "Series C":       "bg-amber-500/15 text-amber-300 border-amber-500/25",
    "Series D":       "bg-orange-500/15 text-orange-300 border-orange-500/25",
    "Growth":         "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/25",
    "Pre-IPO":        "bg-rose-500/15 text-rose-300 border-rose-500/25",
    "Public":         "bg-yellow-500/15 text-yellow-300 border-yellow-500/25",
    "Seed Extension": "bg-purple-500/15 text-purple-300 border-purple-500/25",
  };
  const cls = colors[stage] || "bg-slate-600/30 text-slate-300 border-slate-500/20";
  return <span className={`tag border ${cls}`}>{stage}</span>;
}

export function StatusDot({ available }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={`relative w-1.5 h-1.5 rounded-full live-dot ${
          available ? "bg-emerald-400 text-emerald-400" : "bg-amber-400 text-amber-400"
        }`}
      />
      <span className={`text-[10px] font-bold uppercase tracking-wider ${available ? "text-emerald-400" : "text-amber-400"}`}>
        {available ? "Live" : "Beta"}
      </span>
    </span>
  );
}

export function SectionHeader({ icon, title, count, accent, desc }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{icon}</span>
          <h2 className={`font-display text-xs font-bold tracking-[0.15em] uppercase ${accent}`}>
            {title}
          </h2>
        </div>
        {desc && <p className="text-slate-600 text-[11px] mt-0.5 ml-7">{desc}</p>}
      </div>
      {count != null && (
        <span className="font-mono text-[10px] text-slate-600 bg-ink-800 border border-slate-800 px-2 py-0.5 rounded">
          {count}
        </span>
      )}
    </div>
  );
}

export function Card({ children, className = "", onClick, accent }) {
  const border = accent
    ? `border-${accent}-500/20 hover:border-${accent}-500/40`
    : "border-slate-800/80 hover:border-slate-700/80";

  return (
    <div
      className={`bg-ink-900/80 border rounded-2xl p-5 card-lift backdrop-blur-sm ${border} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function Pill({ label, value, accent = "slate" }) {
  const accentMap = {
    slate:   "border-slate-700/50 bg-ink-800/80",
    violet:  "border-violet-500/20 bg-violet-500/5",
    cyan:    "border-cyan-500/20 bg-cyan-500/5",
    emerald: "border-emerald-500/20 bg-emerald-500/5",
    amber:   "border-amber-500/20 bg-amber-500/5",
  };
  return (
    <div className={`rounded-xl p-3 border ${accentMap[accent] || accentMap.slate}`}>
      <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-slate-600 mb-1">{label}</p>
      <p className="text-xs font-semibold text-slate-200 leading-tight">{value || "—"}</p>
    </div>
  );
}

export function InfoBlock({ label, value, highlight, accent = "violet" }) {
  const accentCls = {
    violet:  "border-violet-500/25 bg-violet-500/6",
    cyan:    "border-cyan-500/25 bg-cyan-500/6",
    emerald: "border-emerald-500/25 bg-emerald-500/6",
    amber:   "border-amber-500/25 bg-amber-500/6",
    orange:  "border-orange-500/25 bg-orange-500/6",
    pink:    "border-pink-500/25 bg-pink-500/6",
    yellow:  "border-yellow-500/25 bg-yellow-500/6",
  };
  const labelCls = {
    violet:  "text-violet-400",
    cyan:    "text-cyan-400",
    emerald: "text-emerald-400",
    amber:   "text-amber-400",
    orange:  "text-orange-400",
    pink:    "text-pink-400",
    yellow:  "text-yellow-400",
  };
  return (
    <div className={`rounded-xl p-4 border ${highlight ? accentCls[accent] : "border-slate-800/60 bg-ink-800/40"}`}>
      {label && (
        <p className={`text-[9px] font-bold tracking-[0.12em] uppercase mb-2 ${highlight ? labelCls[accent] : "text-slate-600"}`}>
          {label}
        </p>
      )}
      <p className={`text-sm leading-relaxed ${highlight ? "text-white font-medium" : "text-slate-300"}`}>
        {value || "—"}
      </p>
    </div>
  );
}

export function RowArrow({ color = "slate" }) {
  return (
    <span className={`text-slate-700 group-hover:text-${color}-400 transition-colors text-xl leading-none flex-shrink-0`}>
      ›
    </span>
  );
}

export function Skeleton({ className = "" }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}
