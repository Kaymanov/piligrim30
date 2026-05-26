"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

// Mock data — will be replaced with API call later
const MOCK_CASES = [
  {
    id: 1,
    title: "Списание долга 780 000 ₽",
    slug: "spisanie-dolga-780000",
    debt_amount: "780 000 ₽",
    case_duration: "8 месяцев",
    client_problem:
      "Клиент потерял работу, накопились долги по 3 кредитам в разных банках. Начались звонки коллекторов, угрозы судебным взысканием.",
    what_was_done:
      "Проведён анализ финансовой ситуации. Подготовлены документы для подачи заявления о банкротстве. Представлены интересы в арбитражном суде. Взаимодействие с финансовым управляющим.",
    result:
      "Долг полностью списан. Клиент освобождён от обязательств перед 3 кредиторами.",
    lawyer_comment:
      "Ситуация была типичной — потеря дохода при наличии нескольких кредитов. Важно было действовать быстро, пока не начались исполнительные производства.",
  },
  {
    id: 2,
    title: "Списание долга 1 200 000 ₽",
    slug: "spisanie-dolga-1200000",
    debt_amount: "1 200 000 ₽",
    case_duration: "10 месяцев",
    client_problem:
      "Ипотека + микрозаймы, арест счетов, удержания из зарплаты до 50%. Единственное жильё под угрозой.",
    what_was_done:
      "Разработана стратегия сохранения единственного жилья. Подано заявление о банкротстве. Оспорены незаконные действия коллекторов. Проведены переговоры с кредиторами.",
    result:
      "Все долги списаны. Единственное жильё сохранено. Аресты со счетов сняты.",
    lawyer_comment:
      "Ключевым было доказать, что квартира является единственным жильём и не подлежит реализации. Суд встал на сторону должника.",
  },
  {
    id: 3,
    title: "Списание долга 450 000 ₽",
    slug: "spisanie-dolga-450000",
    debt_amount: "450 000 ₽",
    case_duration: "6 месяцев",
    client_problem:
      "5 микрозаймов, 2 кредитные карты с просрочкой более года. Возбуждено исполнительное производство, приставы начали удержания.",
    what_was_done:
      "Собраны документы, подтверждающие неплатёжеспособность. Подано заявление в арбитражный суд. Приостановлены исполнительные производства. Завершена процедура реализации имущества.",
    result:
      "Долги по кредитным картам и микрозаймам полностью списаны. Исполнительные производства прекращены.",
    lawyer_comment:
      "Микрозаймы с высокими процентами — частая причина обращений. Суды, как правило, лояльны к таким должникам, особенно при отсутствии имущества.",
  },
  {
    id: 4,
    title: "Списание долга 2 100 000 ₽",
    slug: "spisanie-dolga-2100000",
    debt_amount: "2 100 000 ₽",
    case_duration: "12 месяцев",
    client_problem:
      "Автокредит + 3 потребительских кредита, долг по ЖКХ. Приставы арестовали автомобиль и банковские счета. Общий долг превысил 2 млн.",
    what_was_done:
      "Проведена оценка имущества. Разработана стратегия с выкупом залогового автомобиля через третье лицо. Подано заявление о банкротстве. Проведены торги, автомобиль выкуплен.",
    result:
      "Списаны все долги перед банками и по ЖКХ. Автомобиль сохранён через законную процедуру выкупа.",
    lawyer_comment:
      "Сложный кейс с залоговым имуществом. Удалось сохранить автомобиль благодаря своевременной стратегии выкупа на торгах через доверенное лицо.",
  },
];

export function Cases() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [expandedId, setExpandedId] = useState<number | null>(null);

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
                  Срок процедуры: {caseItem.case_duration}
                </p>
              </div>

              {/* Bottom: details on white bg */}
              <div className="flex flex-1 flex-col bg-white px-5 py-5 dark:bg-slate-900">
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
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
                    Результат
                  </p>
                  <div className="mt-1 flex items-start gap-2">
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

                {/* Expand button */}
                <button
                  onClick={() =>
                    setExpandedId(
                      expandedId === caseItem.id ? null : caseItem.id,
                    )
                  }
                  className="mt-4 text-left text-xs font-medium text-sky-600 transition-colors hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300"
                >
                  {expandedId === caseItem.id ? "Свернуть ↑" : "Подробнее ↓"}
                </button>

                {/* Expanded details */}
                <AnimatePresence>
                  {expandedId === caseItem.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                        {/* What was done */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Что было сделано
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            {caseItem.what_was_done}
                          </p>
                        </div>

                        {/* Lawyer comment */}
                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Комментарий юриста
                          </p>
                          <p className="mt-1 text-sm italic leading-relaxed text-slate-600 dark:text-slate-300">
                            «{caseItem.lawyer_comment}»
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
