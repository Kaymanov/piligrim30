import {
  HeroSkeleton,
  CardGridSkeleton,
  TimelineSkeleton,
  QuizSkeleton,
  PostsSkeleton,
} from "@/components/ui/Skeleton";
import { TopProgressBar } from "@/components/ui/TopProgressBar";

/**
 * Homepage loading state. Keep it out of the root route boundary so article
 * and case existence checks can return a real HTTP 404 before streaming.
 * Wrapped in a solid themed background so the skeleton never floats on
 * bare white (dark is the default theme).
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <TopProgressBar />
      <HeroSkeleton />
      <CardGridSkeleton count={8} cols={4} />
      <CardGridSkeleton count={8} cols={2} />
      <TimelineSkeleton />
      <QuizSkeleton />
      <PostsSkeleton count={4} />
    </div>
  );
}
