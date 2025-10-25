const SkeletonCard = () => (
  <div className="rounded-2xl border border-base-300/60 bg-neutral shadow-sm overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-base-300/40" />
    <div className="p-5 space-y-4">
      <div className="h-5 w-24 bg-base-300 rounded" />
      <div className="h-6 w-3/4 bg-base-300 rounded" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-base-300/80 rounded" />
        <div className="h-4 w-5/6 bg-base-300/80 rounded" />
      </div>
      <div className="h-8 w-full bg-base-300 rounded" />
    </div>
  </div>
);

/**
 * @param {{count?: number}} props
 */
export const ServiceProductSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

