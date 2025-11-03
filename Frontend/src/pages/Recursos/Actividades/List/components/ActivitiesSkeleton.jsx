export const ActivitiesSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="rounded-2xl border border-base-300/60 bg-neutral shadow-sm animate-pulse overflow-hidden"
      >
        <div className="aspect-[4/3] bg-base-200/70" />
        <div className="p-5 space-y-3">
          <div className="h-4 w-24 bg-base-200 rounded" />
          <div className="h-5 w-3/4 bg-base-200 rounded" />
          <div className="h-4 w-full bg-base-200 rounded" />
          <div className="h-4 w-2/3 bg-base-200 rounded" />
          <div className="flex gap-2 pt-2">
            <div className="h-10 flex-1 bg-base-200 rounded" />
            <div className="h-10 w-16 bg-base-200 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);


