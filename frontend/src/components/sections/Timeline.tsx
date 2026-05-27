"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const STEPS = [
  {
    number: "01",
    title: "Первичная консультация",
    description:
      "Разберём вашу ситуацию, оценим возможности и расскажем о вариантах решения.",
  },
  {
    number: "02",
    title: "Анализ долгов и имущества",
    description:
      "Изучим все обязательства, проверим имущество и определим стратегию.",
  },
  {
    number: "03",
    title: "Подготовка стратегии",
    description:
      "Составим индивидуальный план действий с учётом ваших обстоятельств.",
  },
  {
    number: "04",
    title: "Заключение договора",
    description:
      "Оформим сотрудничество. Прозрачные условия, фиксированная стоимость.",
  },
  {
    number: "05",
    title: "Сбор документов",
    description:
      "Поможем собрать все необходимые справки и документы для суда.",
  },
  {
    number: "06",
    title: "Подача заявления",
    description:
      "Подготовим и подадим заявление о банкротстве в арбитражный суд.",
  },
  {
    number: "07",
    title: "Сопровождение процедуры",
    description:
      "Ведём дело от начала до конца: суды, кредиторы, финансовый управляющий.",
  },
  {
    number: "08",
    title: "Завершение дела",
    description:
      "Получение определения суда о списании долгов. Новая финансовая жизнь.",
  },
];

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.6"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <SectionWrapper
      title="Как проходит работа"
      subtitle="8 понятных этапов от консультации до списания долгов"
      bg="white"
      id="timeline"
    >
      <div ref={containerRef} className="relative mx-auto max-w-3xl">
        <div className="absolute left-6 top-0 h-full w-0.5 bg-slate-200 sm:left-8 lg:left-1/2 lg:-translate-x-px dark:bg-slate-700" />
        <motion.div
          className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-sky-400 to-blue-600 sm:left-8 lg:left-1/2 lg:-translate-x-px"
          style={{ height: lineHeight }}
        />

        <div className="space-y-12 lg:space-y-16">
          {STEPS.map((step, i) => (
            <TimelineStep key={step.number} step={step} index={i} />
          ))}
        </div>

        <Finale />
      </div>
    </SectionWrapper>
  );
}

interface TimelineStepProps {
  step: { number: string; title: string; description: string };
  index: number;
}

function TimelineStep({ step, index }: TimelineStepProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-6 pl-14 sm:pl-20 lg:pl-0 ${
        isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-4 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-sky-500 bg-white sm:left-6 lg:left-1/2 lg:-translate-x-1/2 dark:bg-slate-900"
      >
        <motion.div
          animate={isInView ? { scale: [1, 1.8, 1] } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="h-2 w-2 rounded-full bg-sky-500"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform, opacity" }}
        className={`w-full lg:w-[calc(50%-2rem)] ${isLeft ? "lg:text-right" : "lg:text-left"}`}
      >
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:border-sky-200 hover:shadow-md hover:shadow-sky-500/5 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-700 sm:p-6">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
            Этап {step.number}
          </span>
          <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {step.description}
          </p>
        </div>
      </motion.div>

      <div className="hidden w-[calc(50%-2rem)] lg:block" />
    </div>
  );
}

/**
 * Premium finale: animated SVG ring draws around a gradient circle,
 * checkmark path animates inside, text fades in below.
 * Clean, minimal, fintech-style.
 */
function Finale() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div
      ref={ref}
      className="relative mt-20 flex flex-col items-center pl-14 sm:pl-20 lg:pl-0"
    >
      {/* Soft ambient glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute top-6 h-44 w-44 rounded-full bg-gradient-to-br from-sky-400/15 via-blue-500/10 to-transparent blur-3xl"
      />

      {/* Ring + checkmark container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3 }}
        className="relative z-10 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32"
      >
        {/* Background ring (static) */}
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-slate-200 dark:text-slate-700"
          />
          {/* Animated progress ring */}
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="url(#finaleRingGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
          <defs>
            <linearGradient
              id="finaleRingGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="60%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner circle with checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{
            duration: 0.5,
            delay: 1.6,
            type: "spring",
            stiffness: 180,
            damping: 18,
          }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 shadow-xl shadow-blue-500/25 sm:h-20 sm:w-20"
        >
          <svg
            className="h-8 w-8 text-white sm:h-10 sm:w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.6, delay: 2, ease: "easeOut" }}
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 2.3, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 text-center"
      >
        <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Долги списаны
        </h3>
        <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
          Новая финансовая жизнь начинается здесь
        </p>
      </motion.div>
    </div>
  );
}
