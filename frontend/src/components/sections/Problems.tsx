"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const PROBLEMS = [
  {
    title: "Нечем платить кредиты",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8 sm:h-10 sm:w-10">
        <rect
          x="6"
          y="14"
          width="36"
          height="22"
          rx="4"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <circle cx="24" cy="25" r="5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M24 22v6M21 25h6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M14 10h20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    ),
  },
  {
    title: "Накопились микрозаймы",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8 sm:h-10 sm:w-10">
        <rect
          x="8"
          y="8"
          width="14"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="18"
          y="14"
          width="14"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="26"
          y="20"
          width="14"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M33 26v6M30 29h6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Звонят коллекторы",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8 sm:h-10 sm:w-10">
        <rect
          x="14"
          y="6"
          width="20"
          height="36"
          rx="4"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <circle cx="24" cy="36" r="2" fill="currentColor" />
        <path
          d="M20 12h8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Vibration lines */}
        <path
          d="M10 16c-2-2-2-6 0-8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M38 16c2-2 2-6 0-8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M7 18c-3-3-3-10 0-12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M41 18c3-3 3-10 0-12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    ),
  },
  {
    title: "Приставы арестовали карту",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8 sm:h-10 sm:w-10">
        <rect
          x="6"
          y="14"
          width="36"
          height="22"
          rx="4"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path d="M6 22h36" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 30h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Lock */}
        <rect
          x="30"
          y="26"
          width="10"
          height="8"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M33 26v-2a2 2 0 014 0v2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    title: "Есть просрочки",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8 sm:h-10 sm:w-10">
        <circle
          cx="24"
          cy="24"
          r="16"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M24 14v12l8 4"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Alert */}
        <circle cx="38" cy="10" r="6" fill="currentColor" opacity="0.2" />
        <path
          d="M38 7v4M38 13v1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Пришло письмо из суда",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8 sm:h-10 sm:w-10">
        <rect
          x="8"
          y="12"
          width="32"
          height="24"
          rx="3"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M8 15l16 10 16-10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Stamp/seal */}
        <circle
          cx="34"
          cy="30"
          r="4"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <path
          d="M32 30h4"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    ),
  },
  {
    title: "Удерживают деньги с зарплаты",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8 sm:h-10 sm:w-10">
        <path
          d="M12 38V18l12-8 12 8v20"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <rect
          x="20"
          y="26"
          width="8"
          height="12"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Arrow down from wallet */}
        <path
          d="M36 8v8M33 13l3 3 3-3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
      </svg>
    ),
  },
  {
    title: "Есть риск потери имущества",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8 sm:h-10 sm:w-10">
        <path
          d="M12 38V18l12-8 12 8v20"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M20 38v-10h8v10" stroke="currentColor" strokeWidth="2" />
        {/* Warning triangle */}
        <path
          d="M34 6l6 10H28l6-10z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M34 9v3M34 14v1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
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
            <div className="shrink-0 text-sky-600 transition-colors group-hover:text-blue-600 dark:text-sky-400 dark:group-hover:text-sky-300">
              {problem.icon}
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
