import clsx from "clsx";

/**
 * Base shimmer skeleton block.
 * Uses a moving sweep highlight (`.skeleton-shimmer`) that works in both
 * light and dark themes. Dark is the default theme.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("skeleton-shimmer rounded-xl", className)} />;
}

/** Hero skeleton — always dark to match real Hero */
export function HeroSkeleton() {
  return (
    <div className="bg-slate-950 py-16 md:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="space-y-6">
            <div className="skeleton-shimmer h-12 w-3/4 rounded-xl !bg-slate-800" />
            <div className="skeleton-shimmer h-12 w-1/2 rounded-xl !bg-slate-800" />
            <div className="skeleton-shimmer h-5 w-full rounded-xl !bg-slate-800/60" />
            <div className="skeleton-shimmer h-5 w-2/3 rounded-xl !bg-slate-800/60" />
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="skeleton-shimmer h-12 w-48 rounded-full !bg-slate-700" />
              <div className="skeleton-shimmer h-12 w-48 rounded-full !bg-slate-800" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="skeleton-shimmer h-80 w-80 rounded-3xl !bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Card grid skeleton (Problems, DebtTypes, Cases, etc.) */
export function CardGridSkeleton({
  count = 4,
  cols = 4,
}: {
  count?: number;
  cols?: number;
}) {
  const colsClass =
    {
      2: "sm:grid-cols-2",
      3: "sm:grid-cols-2 lg:grid-cols-3",
      4: "sm:grid-cols-2 lg:grid-cols-4",
    }[cols] || "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto h-8 w-64" />
          <Skeleton className="mx-auto mt-4 h-5 w-80" />
        </div>
        <div className={`grid grid-cols-1 gap-5 ${colsClass}`}>
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700/60"
            >
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="mt-4 h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Timeline skeleton */
export function TimelineSkeleton() {
  return (
    <div className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto h-8 w-48" />
          <Skeleton className="mx-auto mt-4 h-5 w-72" />
        </div>
        <div className="mx-auto max-w-3xl space-y-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-6">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="w-full rounded-2xl border border-slate-100 p-5 dark:border-slate-700/60">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="mt-2 h-6 w-48" />
                <Skeleton className="mt-2 h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Quiz skeleton */
export function QuizSkeleton() {
  return (
    <div className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto h-8 w-80" />
          <Skeleton className="mx-auto mt-4 h-5 w-64" />
        </div>
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 p-6 dark:border-slate-700/60 sm:p-8">
          <div className="flex justify-center gap-2 pb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full" />
            ))}
          </div>
          <Skeleton className="mx-auto mt-6 h-6 w-2/3" />
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Blog/Posts skeleton */
export function PostsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto h-8 w-48" />
          <Skeleton className="mx-auto mt-4 h-5 w-64" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/60"
            >
              <Skeleton className="h-44 w-full rounded-none" />
              <div className="p-5">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="mt-3 h-5 w-full" />
                <Skeleton className="mt-1 h-5 w-3/4" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
