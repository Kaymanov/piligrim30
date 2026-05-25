"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const PROBLEMS = [
  { title: "Нечем платить кредиты", icon: "/images/block2/Credit-card.svg" },
  { title: "Накопились микрозаймы", icon: "/images/block2/Wallet.svg" },
  { title: "Звонят коллекторы", icon: "/images/block2/Active-call.svg" },
  { title: "Приставы арестовали карту", icon: "/images/block2/Wallet%233.svg" },
  { title: "Есть просрочки", icon: "/images/block2/Clock.svg" },
  { title: "Пришло письмо из суда", icon: "/images/block2/Incoming-mail.svg" },
  {
    title: "Удерживают деньги с зарплаты",
    icon: "/images/block2/Chart-line%231.svg",
  },
  { title: "Есть риск потери имущества", icon: "/images/block2/Home.svg" },
];

// Staggered animation for cards
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function Problems() {
  return (
    <SectionWrapper
      title="Когда стоит обратиться за консультацией"
      subtitle="Если вы узнали себя хотя бы в одном пункте — не откладывайте"
      bg="slate"
      id="problems"
    >
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {PROBLEMS.map((problem) => (
          <motion.div
            key={problem.title}
            variants={cardVariants}
            className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md hover:shadow-sky-500/5 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-700"
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
      </motion.div>
    </SectionWrapper>
  );
}
