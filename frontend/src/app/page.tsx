import { PageTransition } from "@/components/ui/PageTransition";
import { Hero } from "@/components/sections/Hero";
import { Problems } from "@/components/sections/Problems";
import { DebtTypes } from "@/components/sections/DebtTypes";
import { Timeline } from "@/components/sections/Timeline";
import { Quiz } from "@/components/sections/Quiz";
import { AiLawyerBanner } from "@/components/sections/AiLawyerBanner";
import { Cases } from "@/components/sections/Cases";
import { Reviews } from "@/components/sections/Reviews";
import { Faq } from "@/components/sections/Faq";
import { LatestPosts } from "@/components/sections/LatestPosts";
import { FinalCTA } from "@/components/sections/FinalCTA";
import {
  getBlogPostsSSR,
  getCasesSSR,
  getReviewsSSR,
  getFAQSSR,
} from "@/lib/server-api";

export default async function Home() {
  // Server-side data fetch (ISR-cached). Falls back to [] on failure, in which
  // case the client components fetch/fallback on their own.
  const [posts, cases, reviews, faq] = await Promise.all([
    getBlogPostsSSR(),
    getCasesSSR(),
    getReviewsSSR(),
    getFAQSSR(),
  ]);

  return (
    <PageTransition>
      <Hero />
      <Problems />
      <DebtTypes />
      <Timeline />
      <Quiz />
      <AiLawyerBanner />
      <Cases initial={cases} limit={4} />
      <Reviews initial={reviews} />
      <Faq initial={faq} />
      <LatestPosts initial={posts} />
      <FinalCTA />
    </PageTransition>
  );
}
