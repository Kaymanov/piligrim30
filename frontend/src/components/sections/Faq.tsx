"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { getFAQ, type FAQ } from "@/lib/api";
import { useApiData } from "@/lib/useApiData";
import { sanitizeHtml } from "@/lib/sanitize";

interface FaqCard {
  id: number;
  question: string;
  answer: string;
}

// Fallback data — used if API is unavailable or DB is empty
const MOCK_FAQ: FaqCard[] = [
  {
    id: 1,
    question: "Можно ли списать все долги через банкротство?",
    answer:
      "Через процедуру банкротства можно списать большинство долгов: кредиты, микрозаймы, долги по кредитным картам, задолженности по ЖКХ, налоги, долги по распискам. Не списываются: алименты, возмещение вреда здоровью, субсидиарная ответственность и некоторые другие обязательства, установленные законом.",
  },
  {
    id: 2,
    question: "Что будет с моей квартирой при банкротстве?",
    answer:
      "Единственное жильё защищено законом и не подлежит реализации при банкротстве (за исключением ипотечного жилья). Если у вас одна квартира и она не в ипотеке — она останется за вами. Каждый случай индивидуален, поэтому рекомендуем обсудить ситуацию на консультации.",
  },
  {
    id: 3,
    question: "Сколько длится процедура банкротства?",
    answer:
      "Процедура банкротства физического лица обычно занимает от 6 до 12 месяцев. Сроки зависят от сложности дела, количества кредиторов, наличия имущества и загруженности суда. На консультации юрист сможет дать более точный прогноз для вашей ситуации.",
  },
  {
    id: 4,
    question: "Какие последствия банкротства?",
    answer:
      "После завершения процедуры: в течение 5 лет нужно сообщать банкам о банкротстве при получении кредита; 3 года нельзя занимать руководящие должности в юрлицах; 5 лет нельзя повторно банкротиться. В большинстве случаев это незначительные ограничения по сравнению с освобождением от долгов.",
  },
  {
    id: 5,
    question: "Можно ли банкротиться, если нет имущества?",
    answer:
      "Да, отсутствие имущества не является препятствием для банкротства. Наоборот, в таких случаях процедура проходит быстрее, так как этап реализации имущества завершается без торгов.",
  },
  {
    id: 6,
    question: "Что делать, если звонят коллекторы?",
    answer:
      "Коллекторы не имеют права звонить чаще 1 раза в сутки, угрожать или оказывать психологическое давление. После подачи заявления о банкротстве все звонки и требования кредиторов прекращаются по закону. Если коллекторы нарушают ваши права — это повод для жалобы в ФССП.",
  },
  {
    id: 7,
    question: "Сколько стоит процедура банкротства?",
    answer:
      "Стоимость зависит от сложности дела. Мы предлагаем прозрачное ценообразование и работу по договору. На бесплатной консультации юрист оценит вашу ситуацию и назовёт точную стоимость сопровождения.",
  },
  {
    id: 8,
    question: "Можно ли взять кредит после банкротства?",
    answer:
      "Да, после завершения процедуры банкротства вы можете получать кредиты. Единственное ограничение — в течение 5 лет нужно уведомлять банк о факте банкротства. На практике многие банки выдают кредиты уже через 1-2 года после завершения процедуры.",
  },
];

export function Faq({ initial }: { initial?: FAQ[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const { data } = useApiData<FaqCard>(
    async () =>
      (await getFAQ()).map((f: FAQ) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
      })),
    MOCK_FAQ,
    initial
      ? initial.map((f) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
        }))
      : undefined,
  );

  return (
    <SectionWrapper
      title="Часто задаваемые вопросы"
      subtitle="Ответы на популярные вопросы о банкротстве"
      bg="white"
      id="faq"
    >
      <div ref={ref} className="mx-auto max-w-3xl">
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {data.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ willChange: "transform, opacity" }}
            >
              <FaqItem question={item.question} answer={item.answer} />
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <span className="text-base font-semibold text-slate-800 transition-colors hover:text-blue-900 dark:text-slate-100 dark:hover:text-sky-400 sm:text-lg">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12M6 12h12"
            />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className="prose prose-sm prose-slate max-w-none pb-2 pt-3 leading-relaxed text-slate-600 dark:prose-invert dark:text-slate-400 sm:text-base"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(answer) }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
