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

  // Scroll progress for the vertical line fill
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.6"],
  });

  // Line height grows from 0% to 100% as user scrolls through section
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

  // Alternate sides on desktop
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-6 pl-14 sm:pl-20 lg:pl-0 ${
        isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
    >
      {/* Dot on the line */}
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

      {/* Content card */}
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
          {/* Step number */}
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
            Этап {step.number}
          </span>

          {/* Title */}
          <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {step.title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {step.description}
          </p>
        </div>
      </motion.div>

      {/* Spacer for the other side on desktop */}
      <div className="hidden w-[calc(50%-2rem)] lg:block" />
    </div>
  );
}
