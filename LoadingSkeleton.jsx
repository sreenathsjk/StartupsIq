// components/LoadingSkeleton.jsx

function SkeletonCard({ rows = 3 }) {
  return (
    <div className="bg-[#0a0a14]/80 border border-slate-800/80 rounded-2xl p-5">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="shimmer w-5 h-5 rounded-full" />
        <div className="shimmer w-24 h-3 rounded" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2 mb-4">
          <div className="shimmer h-3.5 rounded" style={{ width: `${70 + Math.random() * 20}%` }} />
          <div className="shimmer h-2.5 rounded" style={{ width: `${50 + Math.random() * 30}%` }} />
          <div className="shimmer h-2.5 rounded w-4/5" />
        </div>
      ))}
    </div>
  );
}

function SkeletonStats() {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-[#0a0a14]/80 border border-slate-800 rounded-xl p-3 text-center">
          <div className="shimmer w-5 h-5 rounded-full mx-auto mb-2" />
          <div className="shimmer h-6 w-8 rounded mx-auto mb-1" />
          <div className="shimmer h-2 w-10 rounded mx-auto" />
        </div>
      ))}
    </div>
  );
}

function SkeletonSummary() {
  return (
    <div className="rounded-2xl border border-slate-800/60 bg-[#0a0a14]/80 p-6 mb-6 space-y-2">
      <div className="flex items-center gap-2 mb-4">
        <div className="shimmer w-2 h-2 rounded-full" />
        <div className="shimmer w-28 h-2.5 rounded" />
      </div>
      <div className="shimmer h-3 rounded w-full" />
      <div className="shimmer h-3 rounded w-11/12" />
      <div className="shimmer h-3 rounded w-4/5" />
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <div>
      <SkeletonSummary />
      <SkeletonStats />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} rows={3 + (i % 2)} />
        ))}
      </div>
    </div>
  );
}
