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

export default function Home() {
  return (
    <>
      <Hero />
      <Problems />
      <DebtTypes />
      <Timeline />
      <Quiz />
      <AiLawyerBanner />
      <Cases />
      <Reviews />
      <Faq />
      <LatestPosts />
      <FinalCTA />
    </>
  );
}
