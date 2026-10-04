import { StaticSchema } from "@/components/seo/JsonLd";
import Content from "./content";
import { staticMetadata } from "@/lib/seo";
import { getBlogPostsSSR } from "@/lib/server-api";

export const generateMetadata = staticMetadata("/blog", { title: "Новости и статьи о банкротстве в Астрахани" });

export default async function Page() {
  const posts = await getBlogPostsSSR(true);
  return <><StaticSchema path="/blog" /><Content initialPosts={posts} /></>;
}
