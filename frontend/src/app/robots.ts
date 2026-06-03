import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProduction =
    process.env.NEXT_PUBLIC_SITE_URL === "https://piligrim30.ru";

  // Block indexing on test/staging domains
  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  // Production — allow indexing
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: "https://piligrim30.ru/sitemap.xml",
  };
}
