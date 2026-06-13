"use client";

import { useEffect, useState } from "react";

/**
 * Generic client-side fetch hook with graceful fallback + SSR hydration.
 *
 * - If `initial` data is provided (from a Server Component) and is non-empty,
 *   it's used immediately and NO client fetch happens — no flicker, no
 *   waterfall.
 * - Otherwise it fetches on mount, falling back to `fallback` if the request
 *   fails or returns an empty array.
 */
export function useApiData<T>(
  fetcher: () => Promise<T[]>,
  fallback: T[],
  initial?: T[],
): { data: T[]; loading: boolean; usedFallback: boolean } {
  const hasInitial = Array.isArray(initial) && initial.length > 0;

  const [data, setData] = useState<T[]>(hasInitial ? initial! : fallback);
  const [loading, setLoading] = useState(!hasInitial);
  const [usedFallback, setUsedFallback] = useState(!hasInitial);

  useEffect(() => {
    // SSR already provided data — skip the client request entirely
    if (hasInitial) return;

    let active = true;
    fetcher()
      .then((res) => {
        if (!active) return;
        if (Array.isArray(res) && res.length > 0) {
          setData(res);
          setUsedFallback(false);
        } else {
          setData(fallback);
          setUsedFallback(true);
        }
      })
      .catch(() => {
        if (!active) return;
        setData(fallback);
        setUsedFallback(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, usedFallback };
}
