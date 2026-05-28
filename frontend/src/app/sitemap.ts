import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://piligrim30.ru";

  // Static pages
  const staticPages = [
    "",
    "/bankrotstvo-fizicheskih-lic",
    "/spisanie-dolgov",
    "/bankrotstvo-pod-klyuch",
    "/bankrotstvo-cherez-mfc",
    "/blog",
    "/cases",
    "/reviews",
    "/faq",
    "/contacts",
    "/privacy-policy",
    "/personal-data-consent",
  ];

  return staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/bankrotstvo") ? 0.9 : 0.7,
  }));
}
