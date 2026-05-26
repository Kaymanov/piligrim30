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
        {/* Vertical line (background — gray) */}
        <div className="absolute left-6 top-0 h-full w-0.5 bg-slate-200 sm:left-8 lg:left-1/2 lg:-translate-x-px dark:bg-slate-700" />

        {/* Vertical line (fill — animated blue) */}
        <motion.div
          className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-sky-400 to-blue-600 sm:left-8 lg:left-1/2 lg:-translate-x-px"
          style={{ height: lineHeight }}
        />

        {/* Steps */}
        <div className="space-y-12 lg:space-y-16">
          {STEPS.map((step, i) => (
            <TimelineStep key={step.number} step={step} index={i} />
          ))}
        </div>

        {/* Finale celebration */}
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
        transition={{
          duration: 0.6,
          delay: 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ willChange: "transform, opacity" }}
        className={`w-full lg:w-[calc(50%-2rem)] ${
          isLeft ? "lg:text-right" : "lg:text-left"
        }`}
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
 * Celebration finale after the 8th step.
 * Pulsing checkmark + radial confetti burst + glowing message.
 */
function Finale() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // 12 confetti particles in a radial burst
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const distance = 100 + (i % 3) * 30;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      colors: [
        "bg-sky-400",
        "bg-blue-500",
        "bg-violet-500",
        "bg-amber-400",
        "bg-green-500",
        "bg-pink-500",
      ],
      color: [
        "bg-sky-400",
        "bg-blue-500",
        "bg-violet-500",
        "bg-amber-400",
        "bg-green-500",
        "bg-pink-500",
      ][i % 6],
    };
  });

  return (
    <div
      ref={ref}
      className="relative mt-16 flex flex-col items-center pl-14 sm:pl-20 lg:pl-0"
    >
      {/* Confetti particles */}
      <div className="pointer-events-none absolute left-1/2 top-12 -translate-x-1/2">
        {particles.map((p, i) => (
          <motion.div
            key={p.id}
            className={`absolute h-2 w-2 rounded-full ${p.color}`}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={
              isInView
                ? {
                    x: p.x,
                    y: p.y,
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1, 1, 0.5],
                  }
                : {}
            }
            transition={{
              duration: 1.5,
              delay: 0.4 + i * 0.03,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </div>

      {/* Final checkmark badge */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={isInView ? { scale: 1, rotate: 0 } : {}}
        transition={{
          duration: 0.8,
          delay: 0.2,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="relative z-10"
      >
        {/* Pulsing rings behind */}
        <motion.div
          className="absolute inset-0 rounded-full bg-green-400"
          animate={
            isInView ? { scale: [1, 1.8, 1.8], opacity: [0.6, 0, 0] } : {}
          }
          transition={{
            duration: 2,
            delay: 0.5,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-sky-400"
          animate={
            isInView ? { scale: [1, 2.2, 2.2], opacity: [0.4, 0, 0] } : {}
          }
          transition={{
            duration: 2.5,
            delay: 0.7,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />

        {/* Main badge */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-2xl shadow-green-500/40 sm:h-28 sm:w-28">
          <motion.svg
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="h-12 w-12 text-white sm:h-14 sm:w-14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </div>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 text-center"
      >
        <h3 className="bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl lg:text-4xl">
          Долги списаны!
        </h3>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300 sm:text-lg">
          Финансовая свобода и новая жизнь без долгового груза
        </p>

        {/* Sparkles */}
        <div className="mt-4 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={
                isInView
                  ? {
                      scale: [1, 1.3, 1],
                      opacity: [0.6, 1, 0.6],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                delay: 1 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-amber-400"
            >
              ✨
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
