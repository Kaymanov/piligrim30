"use client";

import { useEffect, useState } from "react";

/**
 * Generic client-side fetch hook with graceful fallback.
 *
 * Fetches data via `fetcher` on mount. If the request fails or returns an
 * empty array, falls back to `fallback` so the UI is never broken when the
 * backend is unavailable or the database has not been seeded yet.
 */
export function useApiData<T>(
  fetcher: () => Promise<T[]>,
  fallback: T[],
): { data: T[]; loading: boolean; usedFallback: boolean } {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(true);

  useEffect(() => {
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
