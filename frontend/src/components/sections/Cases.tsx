"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

// Mock data — will be replaced with API call later
const MOCK_CASES = [
  {
    id: 1,
    title: "Списание долга 780 000 ₽",
    slug: "spisanie-dolga-780000",
    debt_amount: "780 000 ₽",
    case_duration: "8 месяцев",
    result:
      "Долг полностью списан. Клиент освобождён от обязательств перед 3 кредиторами.",
    client_problem:
      "Потеря работы, 3 кредита в разных банках, звонки коллекторов.",
  },
  {
    id: 2,
    title: "Списание долга 1 200 000 ₽",
    slug: "spisanie-dolga-1200000",
    debt_amount: "1 200 000 ₽",
    case_duration: "10 месяцев",
    result: "Все долги списаны. Единственное жильё сохранено.",
    client_problem:
      "Ипотека + микрозаймы, арест счетов, удержания из зарплаты.",
  },
  {
    id: 3,
    title: "Списание долга 450 000 ₽",
    slug: "spisanie-dolga-450000",
    debt_amount: "450 000 ₽",
    case_duration: "6 месяцев",
    result: "Долги по кредитным картам и микрозаймам полностью списаны.",
    client_problem:
      "5 микрозаймов, 2 кредитные карты, исполнительное производство.",
  },
  {
    id: 4,
    title: "Списание долга 2 100 000 ₽",
    slug: "spisanie-dolga-2100000",
    debt_amount: "2 100 000 ₽",
    case_duration: "12 месяцев",
    result:
      "Списаны все долги перед банками. Автомобиль сохранён (залоговое имущество выкуплено).",
    client_problem:
      "Автокредит + потребительские кредиты, долг по ЖКХ, приставы.",
  },
];

export function Cases() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <SectionWrapper
      title="Реальные кейсы"
      subtitle="Обезличенные результаты работы наших юристов"
      bg="white"
      id="cases"
    >
      <div
        ref={ref}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {MOCK_CASES.map((caseItem, i) => (
          <motion.div
            key={caseItem.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ willChange: "transform, opacity" }}
          >
            <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-500/5 dark:border-slate-700 dark:hover:border-sky-700">
              {/* Top: debt amount on dark bg */}
              <div className="bg-slate-900 px-5 py-6 text-center dark:bg-slate-800">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Сумма долга
                </p>
                <p className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
                  {caseItem.debt_amount}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Срок: {caseItem.case_duration}
                </p>
              </div>

              {/* Bottom: result on white bg */}
              <div className="flex flex-1 flex-col justify-between bg-white px-5 py-5 dark:bg-slate-900">
                {/* Problem */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Ситуация
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {caseItem.client_problem}
                  </p>
                </div>

                {/* Result */}
                <div className="mt-4">
                  <div className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-green-500"
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
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      {caseItem.result}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
        Результат зависит от обстоятельств конкретного дела. Все данные
        обезличены.
      </p>
    </SectionWrapper>
  );
}
