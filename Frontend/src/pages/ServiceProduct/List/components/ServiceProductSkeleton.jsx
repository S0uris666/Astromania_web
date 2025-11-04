const SkeletonCard = () => (
  <div className="animate-pulse overflow-hidden rounded-3xl border border-base-300/50 bg-base-100/90 shadow-sm">
    <div className="relative aspect-[4/3] bg-base-300/40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.25),transparent_60%)]" />
    </div>
    <div className="space-y-4 p-6">
      <div className="h-5 w-24 rounded bg-base-300/80" />
      <div className="h-6 w-3/4 rounded bg-base-300/70" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-base-300/70" />
        <div className="h-4 w-5/6 rounded bg-base-300/60" />
      </div>
      <div className="h-9 w-full rounded bg-base-300/80" />
    </div>
  </div>
);

/**
 * @param {{count?: number}} props
 */
export const ServiceProductSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);
