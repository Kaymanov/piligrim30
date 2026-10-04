import type { MetadataRoute } from "next";
import { PRODUCTION_ORIGIN, productionIndexingAllowed } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (!productionIndexingAllowed()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  // Keep noindex pages crawlable so robots can read the directive.
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/ckeditor5/"] },
    sitemap: `${PRODUCTION_ORIGIN}/sitemap.xml`,
  };
}
