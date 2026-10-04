import type { MetadataRoute } from "next";
import { fetchSEO, productionIndexingAllowed, PRODUCTION_ORIGIN } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!productionIndexingAllowed()) return [];
  const entries = await fetchSEO<{ path: string; last_modified: string | null }[]>("sitemap/");
  return entries.map((entry) => ({
    url: PRODUCTION_ORIGIN + entry.path,
    ...(entry.last_modified && { lastModified: entry.last_modified }),
  }));
}
