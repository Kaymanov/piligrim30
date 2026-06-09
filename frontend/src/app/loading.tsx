import {
  HeroSkeleton,
  CardGridSkeleton,
  TimelineSkeleton,
  QuizSkeleton,
  PostsSkeleton,
} from "@/components/ui/Skeleton";
import { TopProgressBar } from "@/components/ui/TopProgressBar";

/**
 * Root loading state — shown during page transitions.
 * Renders skeleton versions of main page sections.
 */
export default function Loading() {
  return (
    <>
      <TopProgressBar />
      <HeroSkeleton />
      <CardGridSkeleton count={8} cols={4} />
      <CardGridSkeleton count={8} cols={2} />
      <TimelineSkeleton />
      <QuizSkeleton />
      <PostsSkeleton count={4} />
    </>
  );
}
