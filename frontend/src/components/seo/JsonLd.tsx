import Link from "next/link";
import { getSEOConfiguration, getStaticSEO, PRODUCTION_ORIGIN, publicImageURL } from "@/lib/seo";
import type { BlogPost, Case } from "@/lib/api";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  }} />;
}

export async function OrganizationSchema() {
  const config = await getSEOConfiguration();
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite",
      "@id": `${PRODUCTION_ORIGIN}/#website`, name: config.site_name, url: PRODUCTION_ORIGIN }} />
    {config.organization_name && config.address && config.phone && <JsonLd data={{
      "@context": "https://schema.org", "@type": "LegalService",
      "@id": `${PRODUCTION_ORIGIN}/#organization`, name: config.organization_name,
      url: PRODUCTION_ORIGIN, telephone: config.phone, address: config.address,
      areaServed: config.area_served,
    }} />}
  </>;
}

export function ArticleSchema({ post }: { post: BlogPost }) {
  const type = ["Article", "BlogPosting", "NewsArticle"].includes(post.schema_type || "")
    ? post.schema_type : "Article";
  return <JsonLd data={{
    "@context": "https://schema.org", "@type": type, headline: post.h1 || post.title,
    description: post.seo_description || post.excerpt,
    mainEntityOfPage: post.canonical_url || `${PRODUCTION_ORIGIN}/blog/${post.slug}`,
    ...(post.author && { author: { "@type": "Person", name: post.author } }),
    ...(post.published_at && { datePublished: post.published_at }),
    ...(post.updated_at && { dateModified: post.updated_at }),
    ...(publicImageURL(post.cover_image) && { image: publicImageURL(post.cover_image) }),
  }} />;
}

export async function StaticSchema({ path }: { path: string }) {
  const seo = await getStaticSEO(path);
  // Only render types whose required data is available; never invent FAQ or ratings.
  if (!seo.schema_type || !["WebPage", "CollectionPage", "ContactPage", "Service"].includes(seo.schema_type)) {
    return null;
  }
  return <JsonLd data={{ "@context": "https://schema.org", "@type": seo.schema_type,
    name: seo.seo_title || undefined,
    description: seo.seo_description || undefined,
    url: seo.canonical_url || PRODUCTION_ORIGIN + path,
  }} />;
}

export function CaseSchema({ item }: { item: Case }) {
  return <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage",
    name: item.title, url: item.canonical_url || `${PRODUCTION_ORIGIN}/cases/${item.slug}`,
    ...(item.updated_at && { dateModified: item.updated_at }),
  }} />;
}

export function Breadcrumbs({ section, href, title, path }: {
  section: string; href: string; title: string; path: string;
}) {
  const crumbs = [{ name: "Главная", path: "/" }, { name: section, path: href }, { name: title, path }];
  return <>
    <nav aria-label="Хлебные крошки" className="mb-6 flex flex-wrap gap-2 text-sm text-slate-500">
      <Link href="/">Главная</Link><span aria-hidden="true">/</span>
      <Link href={href}>{section}</Link><span aria-hidden="true">/</span>
      <span aria-current="page">{title}</span>
    </nav>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: crumbs.map((item, index) => ({ "@type": "ListItem", position: index + 1,
        name: item.name, item: PRODUCTION_ORIGIN + item.path })),
    }} />
  </>;
}
