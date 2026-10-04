/**
 * Server-side API client (App Router Server Components).
 *
 * The frontend container reaches the backend over the internal Docker network
 * (`http://backend:8000`). Responses are cached with ISR (`revalidate`) so
 * pages render instantly from cache and refresh in the background.
 *
 * Every fetch is defensive: short timeout + try/catch returning [] / null on
 * failure, so a backend hiccup never breaks SSR — the client `useApiData`
 * hook then falls back to its own data.
 */

import type { BlogPost, Case, Review, FAQ } from "@/lib/api";

const INTERNAL_API_BASE =
  process.env.INTERNAL_API_URL || "http://backend:8000/api/v1";

// Revalidate server cache every 5 minutes
const REVALIDATE = 60;
const TIMEOUT_MS = 4000;

async function serverFetch<T>(endpoint: string, fallback: T, strict = false): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${INTERNAL_API_BASE}${endpoint}`, {
      signal: controller.signal,
      ...(strict ? { cache: "no-store" as const } : { next: { revalidate: REVALIDATE } }),
      headers: { Accept: "application/json" },
    });
    if (res.status === 404) return fallback;
    if (!res.ok) {
      if (strict) throw new Error(`Content API returned ${res.status}`);
      return fallback;
    }
    return (await res.json()) as T;
  } catch (error) {
    if (strict) throw error;
    return fallback;
  } finally {
    clearTimeout(timer);
  }
}

export function getBlogPostsSSR(strict = false): Promise<BlogPost[]> {
  return serverFetch<BlogPost[]>("/blog/posts/", [], strict);
}

export function getCasesSSR(): Promise<Case[]> {
  return serverFetch<Case[]>("/cases/", []);
}

export function getReviewsSSR(): Promise<Review[]> {
  return serverFetch<Review[]>("/reviews/", []);
}

export function getFAQSSR(): Promise<FAQ[]> {
  return serverFetch<FAQ[]>("/faq/", []);
}

export function getBlogPostBySlugSSR(slug: string): Promise<BlogPost | null> {
  return serverFetch<BlogPost | null>(`/blog/posts/${encodeURIComponent(slug)}/`, null, true);
}

export function getCaseBySlugSSR(slug: string): Promise<Case | null> {
  return serverFetch<Case | null>(`/cases/${encodeURIComponent(slug)}/`, null, true);
}
