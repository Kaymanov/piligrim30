import type { Metadata } from "next";
import { cache } from "react";

export const PRODUCTION_ORIGIN = "https://piligrim30.ru";

// SITE_URL is read at runtime; NEXT_PUBLIC_* is frozen during the build.
export function productionIndexingAllowed(): boolean {
  return process.env.SITE_URL === PRODUCTION_ORIGIN;
}

export interface SEOFields {
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string | null;
  is_indexable?: boolean;
  is_followable?: boolean;
  schema_type?: string;
  updated_at?: string;
}

export interface SEOConfiguration {
  indexing_enabled: boolean;
  site_name: string;
  default_description: string;
  default_og_image: string | null;
  google_verification: string;
  yandex_verification: string;
  organization_name: string;
  address: string;
  phone: string;
  area_served: string;
}

export async function fetchSEO<T>(endpoint: string): Promise<T> {
  const base = process.env.INTERNAL_API_URL || "http://127.0.0.1:8001/api/v1";
  const response = await fetch(`${base}/seo/${endpoint}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(4000),
  });
  // An API outage must not become indexable fallback pages or an empty sitemap.
  if (!response.ok) throw new Error(`SEO API returned ${response.status}`);
  return response.json() as Promise<T>;
}

export const getSEOConfiguration = cache(() => fetchSEO<SEOConfiguration>("configuration/"));
export const getStaticSEO = cache((path: string) =>
  fetchSEO<SEOFields>(`page/?path=${encodeURIComponent(path)}`),
);

export function publicImageURL(path?: string | null): string | undefined {
  if (!path) return undefined;
  const mediaIndex = path.indexOf("/media/");
  if (mediaIndex >= 0) return PRODUCTION_ORIGIN + path.slice(mediaIndex);
  const url = new URL(path, PRODUCTION_ORIGIN);
  return ["http:", "https:"].includes(url.protocol) ? url.href : undefined;
}

export async function buildMetadata(
  path: string,
  fallback: { title: string; description?: string },
  seo: SEOFields,
): Promise<Metadata> {
  const config = await getSEOConfiguration();
  const title = seo.seo_title || fallback.title;
  const description = seo.seo_description || fallback.description || config.default_description;
  const canonical = seo.canonical_url || `${PRODUCTION_ORIGIN}${path}`;
  const image = publicImageURL(seo.og_image || config.default_og_image);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: {
      index: productionIndexingAllowed() && config.indexing_enabled && seo.is_indexable !== false,
      follow: productionIndexingAllowed() && seo.is_followable !== false,
    },
    openGraph: {
      title: seo.og_title || title,
      description: seo.og_description || description,
      url: canonical, type: "website", locale: "ru_RU", siteName: config.site_name,
      ...(image && { images: [image] }),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: seo.og_title || title,
      description: seo.og_description || description,
      ...(image && { images: [image] }),
    },
  };
}

export function staticMetadata(path: string, fallback: { title: string; description?: string }) {
  return async (): Promise<Metadata> => buildMetadata(path, fallback, await getStaticSEO(path));
}
