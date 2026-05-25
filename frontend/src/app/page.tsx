import { Hero } from "@/components/sections/Hero";
import { Problems } from "@/components/sections/Problems";
import { DebtTypes } from "@/components/sections/DebtTypes";
import { Timeline } from "@/components/sections/Timeline";

export default function Home() {
  return (
    <>
      <Hero />
      <Problems />
      <DebtTypes />
      <Timeline />
    </>
  );
}
