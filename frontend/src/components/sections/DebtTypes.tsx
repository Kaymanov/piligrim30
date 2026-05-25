"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const DEBT_TYPES = [
  {
    title: "Кредиты",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
        <rect
          x="4"
          y="10"
          width="32"
          height="20"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M20 17v6M17 20h6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    ),
  },
  {
    title: "Кредитные карты",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
        <rect
          x="4"
          y="10"
          width="32"
          height="20"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M4 16h32" stroke="currentColor" strokeWidth="2" />
        <path
          d="M10 24h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M10 28h10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    ),
  },
  {
    title: "Микрозаймы",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
        <path
          d="M20 12v16M14 18c0-3 2.5-5 6-5s6 2 6 5-2.5 4-6 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M14 26c0 2 2.5 3 6 3s6-1 6-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    ),
  },
  {
    title: "Долги по ЖКХ",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
        <path
          d="M8 36V16l12-10 12 10v20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M16 36v-10h8v10" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M18 20h4M20 18v4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    ),
  },
  {
    title: "Налоги",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
        <rect
          x="8"
          y="6"
          width="24"
          height="30"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M14 14h12M14 20h12M14 26h8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M28 28l4 4M28 32l4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    ),
  },
  {
    title: "Долги по распискам",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
        <path
          d="M10 6h16l6 6v22a2 2 0 01-2 2H10a2 2 0 01-2-2V8a2 2 0 012-2z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M26 6v6h6" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M14 18h12M14 24h8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M14 30l3 2 5-6"
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
    title: "Задолженности перед банками",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
        <path
          d="M6 14l14-8 14 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M8 14v16h24V14" stroke="currentColor" strokeWidth="2" />
        <path d="M8 30h24" stroke="currentColor" strokeWidth="2.5" />
        <path
          d="M14 14v16M20 14v16M26 14v16"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    title: "Исполнительные производства",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
        <path
          d="M14 20h12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M20 14v12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Gavel */}
        <path
          d="M28 8l4 4M26 10l4 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const tileVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function DebtTypes() {
  return (
    <SectionWrapper
      title="Какие долги можно списать"
      subtitle="Через процедуру банкротства физического лица"
      bg="white"
      id="debts"
    >
      <motion.div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {DEBT_TYPES.map((debt) => (
          <motion.div
            key={debt.title}
            variants={tileVariants}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-md hover:shadow-blue-500/5 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-700 dark:hover:bg-slate-800 sm:p-6"
          >
            {/* Icon container */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-900 transition-all group-hover:bg-blue-100 group-hover:text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:group-hover:bg-blue-900/50 sm:h-16 sm:w-16">
              {debt.icon}
            </div>

            {/* Title */}
            <p className="text-xs font-semibold leading-tight text-slate-700 dark:text-slate-200 sm:text-sm">
              {debt.title}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
