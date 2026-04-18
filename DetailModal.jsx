// components/DetailModal.jsx
import {
  MomentumBadge, UrgencyBadge, StageBadge, StatusDot,
  Pill, InfoBlock, SignalScore,
} from "./ui.jsx";

const ACCENT_MAP = {
  startup:     { border: "border-violet-500/30",  bg: "bg-violet-500/8",  text: "text-violet-300",  gradFrom: "from-violet-950/60",  icon: "🚀", label: "Startup Profile",      color: "violet" },
  funding:     { border: "border-emerald-500/30", bg: "bg-emerald-500/8", text: "text-emerald-300", gradFrom: "from-emerald-950/60", icon: "💰", label: "Funding Round",         color: "emerald" },
  aiTool:      { border: "border-cyan-500/30",    bg: "bg-cyan-500/8",    text: "text-cyan-300",    gradFrom: "from-cyan-950/60",    icon: "🤖", label: "AI Tool Deep-Dive",    color: "cyan" },
  indianApp:   { border: "border-orange-500/30",  bg: "bg-orange-500/8",  text: "text-orange-300",  gradFrom: "from-orange-950/60",  icon: "🇮🇳", label: "India Focus",          color: "orange" },
  trend:       { border: "border-pink-500/30",    bg: "bg-pink-500/8",    text: "text-pink-300",    gradFrom: "from-pink-950/60",    icon: "📈", label: "Trend Analysis",       color: "pink" },
  opportunity: { border: "border-yellow-500/30",  bg: "bg-yellow-500/8",  text: "text-yellow-300",  gradFrom: "from-yellow-950/60",  icon: "⚡", label: "Opportunity Breakdown", color: "yellow" },
  idea:        { border: "border-fuchsia-500/30", bg: "bg-fuchsia-500/8", text: "text-fuchsia-300", gradFrom: "from-fuchsia-950/60", icon: "💡", label: "Startup Idea",         color: "fuchsia" },
  underrated:  { border: "border-rose-500/30",    bg: "bg-rose-500/8",    text: "text-rose-300",    gradFrom: "from-rose-950/60",    icon: "🔍", label: "Underrated Signal",    color: "rose" },
  agentic:     { border: "border-sky-500/30",     bg: "bg-sky-500/8",     text: "text-sky-300",     gradFrom: "from-sky-950/60",     icon: "🤖", label: "Agentic Workflow",     color: "sky" },
};

function Grid2({ children }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function Section({ label, children, accent = "violet" }) {
  const colors = { violet:"text-violet-500", cyan:"text-cyan-500", emerald:"text-emerald-500", amber:"text-amber-500", orange:"text-orange-500", pink:"text-pink-500", yellow:"text-yellow-500", fuchsia:"text-fuchsia-500", rose:"text-rose-500", sky:"text-sky-500" };
  return (
    <div>
      <p className={`text-[9px] font-bold tracking-[0.15em] uppercase mb-2 ${colors[accent] || colors.violet}`}>
        {label}
      </p>
      {children}
    </div>
  );
}

function renderStartup(data, acc) {
  return (
    <div className="space-y-4">
      <Grid2>
        <Pill label="Stage"   value={data.stage}   accent="violet" />
        <Pill label="Raised"  value={data.raised}  accent="violet" />
        <Pill label="Sector"  value={data.sector}  accent="slate" />
        <Pill label="Founded" value={data.founded} accent="slate" />
      </Grid2>
      {data.hq && (
        <Section label="Headquarters" accent={acc.color}>
          <p className="text-slate-400 text-sm">📍 {data.hq}</p>
        </Section>
      )}
      <Section label="Latest News" accent={acc.color}>
        <InfoBlock value={data.headline} highlight accent={acc.color} />
      </Section>
      <Section label="Key Signal" accent={acc.color}>
        <InfoBlock value={data.insight} accent={acc.color} />
      </Section>
      <Section label="Why It Matters" accent={acc.color}>
        <InfoBlock value={data.whyItMatters} highlight accent={acc.color} />
      </Section>
      {data.founderNote && (
        <Section label="Traction / Founder Note" accent={acc.color}>
          <div className="rounded-xl p-4 border border-slate-800/60 bg-ink-800/40">
            <p className="text-slate-300 text-sm leading-relaxed italic">{data.founderNote}</p>
          </div>
        </Section>
      )}
      {data.signalScore && (
        <Section label="Signal Score" accent={acc.color}>
          <SignalScore score={data.signalScore} />
        </Section>
      )}
    </div>
  );
}

function renderFunding(data, acc) {
  return (
    <div className="space-y-4">
      <Grid2>
        <Pill label="Amount Raised" value={data.amount}  accent="emerald" />
        <Pill label="Stage"         value={data.stage}   accent="emerald" />
        <Pill label="Sector"        value={data.sector}  accent="slate" />
        <Pill label="HQ"            value={data.hq}      accent="slate" />
      </Grid2>
      {data.investors && (
        <Section label="Lead Investors" accent={acc.color}>
          <div className="rounded-xl p-3 border border-emerald-500/20 bg-emerald-500/5">
            <p className="text-emerald-200 text-sm font-semibold">{data.investors}</p>
          </div>
        </Section>
      )}
      <Section label="Use of Funds" accent={acc.color}>
        <InfoBlock value={data.use} highlight accent={acc.color} />
      </Section>
      <Section label="Analyst Insight" accent={acc.color}>
        <InfoBlock value={data.insight} accent={acc.color} />
      </Section>
      <Section label="Why Now?" accent={acc.color}>
        <InfoBlock value={data.whyNow} highlight accent={acc.color} />
      </Section>
      {data.signalScore && (
        <Section label="Signal Score" accent={acc.color}>
          <SignalScore score={data.signalScore} />
        </Section>
      )}
    </div>
  );
}

function renderAITool(data, acc) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <StatusDot available={data.availability === "Generally Available"} />
        {data.pricing && (
          <span className="tag border border-cyan-500/25 bg-cyan-500/10 text-cyan-300">{data.pricing}</span>
        )}
      </div>
      <Grid2>
        <Pill label="Category" value={data.category} accent="cyan" />
        <Pill label="Pricing"  value={data.pricing}  accent="slate" />
      </Grid2>
      <Section label="What It Does" accent={acc.color}>
        <InfoBlock value={data.description} highlight accent={acc.color} />
      </Section>
      <Section label="Best Founder Use Case" accent={acc.color}>
        <InfoBlock value={data.useCase} accent={acc.color} />
      </Section>
      <Section label="Deep Dive" accent={acc.color}>
        <InfoBlock value={data.deepDive} highlight accent={acc.color} />
      </Section>
      {data.bestFor && (
        <Section label="Best For" accent={acc.color}>
          <div className="rounded-xl p-3 border border-slate-800/60 bg-ink-800/40">
            <p className="text-slate-300 text-sm">{data.bestFor}</p>
          </div>
        </Section>
      )}
      {data.signalScore && (
        <Section label="Signal Score" accent={acc.color}>
          <SignalScore score={data.signalScore} />
        </Section>
      )}
    </div>
  );
}

function renderIndianApp(data, acc) {
  return (
    <div className="space-y-4">
      <Grid2>
        <Pill label="Type"   value={data.type}   accent="orange" />
        <Pill label="Status" value={data.status} accent="slate" />
      </Grid2>
      {data.org && (
        <Section label="Organisation" accent={acc.color}>
          <div className="rounded-xl p-3 border border-orange-500/20 bg-orange-500/5">
            <p className="text-orange-200 text-sm font-semibold">{data.org}</p>
          </div>
        </Section>
      )}
      <Section label="Latest News" accent={acc.color}>
        <InfoBlock value={data.headline} highlight accent={acc.color} />
      </Section>
      <Section label="India Market Context" accent={acc.color}>
        <InfoBlock value={data.context} accent={acc.color} />
      </Section>
      <Section label="Builder Opportunity" accent={acc.color}>
        <InfoBlock value={data.opportunity} highlight accent={acc.color} />
      </Section>
      {data.callToAction && (
        <Section label="Action for Indian Founders" accent={acc.color}>
          <div className="rounded-xl p-4 border border-orange-500/20 bg-orange-500/8">
            <p className="text-orange-200 text-sm leading-relaxed font-medium">→ {data.callToAction}</p>
          </div>
        </Section>
      )}
      {data.signalScore && (
        <Section label="Signal Score" accent={acc.color}>
          <SignalScore score={data.signalScore} />
        </Section>
      )}
    </div>
  );
}

function renderTrend(data, acc) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <MomentumBadge momentum={data.momentum} />
        {data.timeHorizon && (
          <span className="tag border border-pink-500/25 bg-pink-500/10 text-pink-300">{data.timeHorizon}</span>
        )}
      </div>
      <Section label="Market Signal" accent={acc.color}>
        <InfoBlock value={data.signal} highlight accent={acc.color} />
      </Section>
      <Section label="Full Context" accent={acc.color}>
        <InfoBlock value={data.detail} highlight accent={acc.color} />
      </Section>
      <Section label="Founder Implication" accent={acc.color}>
        <div className="rounded-xl p-4 border border-pink-500/20 bg-pink-500/8">
          <p className="text-pink-100 text-sm leading-relaxed font-medium">{data.implication}</p>
        </div>
      </Section>
      {data.signalScore && (
        <Section label="Signal Score" accent={acc.color}>
          <SignalScore score={data.signalScore} />
        </Section>
      )}
    </div>
  );
}

function renderOpportunity(data, acc) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <UrgencyBadge urgency={data.urgency} />
      </div>
      <Section label="Why This Gap Exists" accent={acc.color}>
        <InfoBlock value={data.why} highlight accent={acc.color} />
      </Section>
      <Grid2>
        <Pill label="Target Market"  value={data.market}       accent="yellow" />
        <Pill label="Revenue Model"  value={data.revenueModel} accent="slate" />
      </Grid2>
      <Section label="Competitive Landscape" accent={acc.color}>
        <InfoBlock value={data.competition} accent={acc.color} />
      </Section>
      <Section label="How to Build It" accent={acc.color}>
        <InfoBlock value={data.buildWith} highlight accent={acc.color} />
      </Section>
      {data.signalScore && (
        <Section label="Signal Score" accent={acc.color}>
          <SignalScore score={data.signalScore} />
        </Section>
      )}
    </div>
  );
}

function renderIdea(data, acc) {
  return (
    <div className="space-y-4">
      <Section label="The Problem" accent={acc.color}>
        <InfoBlock value={data.problem} highlight accent={acc.color} />
      </Section>
      <Section label="The Solution" accent={acc.color}>
        <InfoBlock value={data.solution} accent={acc.color} />
      </Section>
      <Grid2>
        <Pill label="MVP Timeline"  value={data.mvpTimeline} accent="fuchsia" />
        <Pill label="Tech Stack"    value={data.techStack}   accent="slate" />
      </Grid2>
      <Section label="Business Model" accent={acc.color}>
        <InfoBlock value={data.businessModel} highlight accent={acc.color} />
      </Section>
      <Section label="Target Market" accent={acc.color}>
        <InfoBlock value={data.targetMarket} accent={acc.color} />
      </Section>
      {data.inspiration && (
        <Section label="Inspired By" accent={acc.color}>
          <div className="rounded-xl p-3 border border-fuchsia-500/20 bg-fuchsia-500/8">
            <p className="text-fuchsia-200 text-sm italic">{data.inspiration}</p>
          </div>
        </Section>
      )}
      {data.signalScore && (
        <Section label="Signal Score" accent={acc.color}>
          <SignalScore score={data.signalScore} />
        </Section>
      )}
    </div>
  );
}

function renderUnderrated(data, acc) {
  return (
    <div className="space-y-4">
      <Section label="Why Most People Miss This" accent={acc.color}>
        <InfoBlock value={data.why} highlight accent={acc.color} />
      </Section>
      <Section label="The Contrarian Insight" accent={acc.color}>
        <InfoBlock value={data.insight} highlight accent={acc.color} />
      </Section>
      <Section label="What to Do in 30 Days" accent={acc.color}>
        <div className="rounded-xl p-4 border border-rose-500/20 bg-rose-500/8">
          <p className="text-rose-100 text-sm leading-relaxed font-medium">→ {data.actionable}</p>
        </div>
      </Section>
    </div>
  );
}

function renderAgentic(data, acc) {
  return (
    <div className="space-y-4">
      <Section label="Being Built By" accent={acc.color}>
        <InfoBlock value={data.who} highlight accent={acc.color} />
      </Section>
      <Pill label="Adoption Status" value={data.status} accent="sky" />
      <Section label="Adjacent Opportunity" accent={acc.color}>
        <InfoBlock value={data.opportunity} highlight accent={acc.color} />
      </Section>
    </div>
  );
}

const RENDERERS = {
  startup:     renderStartup,
  funding:     renderFunding,
  aiTool:      renderAITool,
  indianApp:   renderIndianApp,
  trend:       renderTrend,
  opportunity: renderOpportunity,
  idea:        renderIdea,
  underrated:  renderUnderrated,
  agentic:     renderAgentic,
};

export default function DetailModal({ item, onClose }) {
  if (!item) return null;
  const { type, data } = item;
  const acc = ACCENT_MAP[type] || ACCENT_MAP.startup;
  const renderer = RENDERERS[type];
  const title = data.name || data.company || data.trend || data.area || data.title || data.workflow || "Details";
  const subtitle = data.sector || data.category || data.type || data.status || null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      style={{ backdropFilter: "blur(8px)", background: "rgba(5,5,10,0.75)" }}
      onClick={onClose}
    >
      <div
        className={`relative w-full sm:max-w-lg bg-gradient-to-b ${acc.gradFrom} to-ink-950 border ${acc.border} rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-in`}
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-8 h-1 rounded-full bg-slate-700" />
        </div>

        {/* Header */}
        <div className={`px-6 pt-5 pb-5 border-b ${acc.border}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl ${acc.bg} border ${acc.border} flex items-center justify-center text-2xl flex-shrink-0`}>
                {acc.icon}
              </div>
              <div>
                <p className={`text-[9px] font-bold tracking-[0.15em] uppercase mb-1 ${acc.text}`}>
                  {acc.label}
                </p>
                <h2 className="font-display text-white font-bold text-xl leading-tight">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-all flex-shrink-0"
            >
              ✕
            </button>
          </div>
          {/* URL link */}
          {data.url && data.url !== "#" && (
            <a
              href={data.url}
              target="_blank"
              rel="noreferrer"
              className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold ${acc.text} hover:opacity-80 transition-opacity`}
            >
              View Source ↗
            </a>
          )}
        </div>

        {/* Scrollable body */}
        <div className="modal-body px-6 py-5 space-y-4">
          {renderer ? renderer(data, acc) : <p className="text-slate-400 text-sm">No details available.</p>}
        </div>
      </div>
    </div>
  );
}
