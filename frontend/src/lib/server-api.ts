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
const REVALIDATE = 300;
const TIMEOUT_MS = 4000;

async function serverFetch<T>(endpoint: string, fallback: T): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${INTERNAL_API_BASE}${endpoint}`, {
      signal: controller.signal,
      next: { revalidate: REVALIDATE },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  } finally {
    clearTimeout(timer);
  }
}

export function getBlogPostsSSR(): Promise<BlogPost[]> {
  return serverFetch<BlogPost[]>("/blog/posts/", []);
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
  return serverFetch<BlogPost | null>(`/blog/posts/${slug}/`, null);
}

export function getCaseBySlugSSR(slug: string): Promise<Case | null> {
  return serverFetch<Case | null>(`/cases/${slug}/`, null);
}
