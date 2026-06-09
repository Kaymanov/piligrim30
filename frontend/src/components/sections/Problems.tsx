"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const PROBLEMS = [
  { title: "Нечем платить кредиты", icon: "/images/new_icon/credit_card_block.svg" },
  { title: "Накопились микрозаймы", icon: "/images/new_icon/wallet.svg" },
  { title: "Звонят коллекторы", icon: "/images/new_icon/call.svg" },
  { title: "Приставы арестовали карту", icon: "/images/new_icon/graph.svg" },
  { title: "Есть просрочки", icon: "/images/new_icon/clock.svg" },
  { title: "Пришло письмо из суда", icon: "/images/new_icon/inbox.svg" },
  {
    title: "Удерживают деньги с зарплаты",
    icon: "/images/new_icon/money.svg",
  },
  { title: "Есть риск потери имущества", icon: "/images/new_icon/home.svg" },
];

export function Problems() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <SectionWrapper
      title="Когда стоит обратиться за консультацией"
      subtitle="Если вы узнали себя хотя бы в одном пункте — не откладывайте"
      bg="slate"
      id="problems"
    >
      <div
        ref={ref}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {PROBLEMS.map((problem, i) => (
          <motion.div
            key={problem.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ willChange: "transform, opacity" }}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md hover:shadow-sky-500/5 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-700"
          >
            {/* Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 transition-colors group-hover:bg-sky-100 dark:bg-sky-900/30 dark:group-hover:bg-sky-900/50 sm:h-12 sm:w-12">
              <Image
                src={problem.icon}
                alt=""
                width={28}
                height={28}
                className="h-6 w-6 sm:h-7 sm:w-7 [filter:invert(40%)_sepia(80%)_saturate(1500%)_hue-rotate(175deg)_brightness(95%)]"
              />
            </div>

            {/* Text */}
            <p className="text-sm font-medium leading-snug text-slate-700 dark:text-slate-200 sm:text-base">
              {problem.title}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
