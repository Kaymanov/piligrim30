"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";

const DEBT_TYPES = [
  { title: "Кредиты", icon: "/images/icon/Credit-card.svg" },
  { title: "Кредитные карты", icon: "/images/icon/Wallet%233.svg" },
  { title: "Микрозаймы", icon: "/images/icon/Money.svg" },
  { title: "Долги по ЖКХ", icon: "/images/icon/Home.svg" },
  { title: "Налоги", icon: "/images/icon/File.svg" },
  { title: "Долги по распискам", icon: "/images/icon/Selected-file.svg" },
  { title: "Задолженности перед банками", icon: "/images/icon/Building.svg" },
  {
    title: "Исполнительные производства",
    icon: "/images/icon/Shield-protected.svg",
  },
];

export function DebtTypes() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50 py-16 md:py-20 lg:py-24 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-white">
            Какие долги можно списать
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            Через процедуру банкротства физического лица
          </p>
        </div>

        {/* Chips grid */}
        <div
          ref={ref}
          className="mx-auto grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
        >
          {DEBT_TYPES.map((debt, i) => (
            <motion.div
              key={debt.title}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{
                duration: 0.5,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ willChange: "transform, opacity" }}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 px-5 py-4 backdrop-blur-sm transition-[border-color,background-color] duration-300 hover:border-sky-300 hover:shadow-md dark:hover:border-sky-400/40 dark:hover:bg-white/10"
            >
              {/* Checkmark circle */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-500/20 text-sky-600 transition-colors group-hover:bg-sky-100 dark:text-sky-400 dark:group-hover:bg-sky-500/30">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15">
                <Image
                  src={debt.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="h-5 w-5 [filter:invert(70%)_sepia(50%)_saturate(1000%)_hue-rotate(175deg)_brightness(110%)]"
                />
              </div>

              {/* Title */}
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 dark:text-slate-200 dark:group-hover:text-white sm:text-base">
                {debt.title}
              </span>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
