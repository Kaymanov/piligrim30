"use client";

import { useRef } from "react";
import { LazyImage } from "@/components/ui/LazyImage";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { openLeadModal } from "@/lib/modal-events";

const ADDITIONAL_SERVICES = [
  {
    title: "Жилищные споры",
    description:
      "Защита прав в жилищных правоотношениях, споры с управляющими компаниями, выселение, вселение.",
    image: "/images/service-img/housing.webp",
  },
  {
    title: "Наследственные споры",
    description:
      "Оспаривание завещаний, восстановление сроков, раздел наследственного имущества.",
    image: "/images/service-img/inheritance.webp",
  },
  {
    title: "Защита прав потребителей",
    description:
      "Возврат товаров, компенсация за некачественные услуги, претензии и суды.",
    image: "/images/service-img/consumers.webp",
  },
  {
    title: "Семейные споры",
    description:
      "Расторжение брака, раздел имущества, алименты, определение места жительства детей.",
    image: "/images/service-img/family.webp",
  },
  {
    title: "Трудовые споры",
    description:
      "Незаконное увольнение, невыплата зарплаты, восстановление на работе.",
    image: "/images/service-img/labor.webp",
  },
  {
    title: "Защита интересов участников СВО",
    description:
      "Юридическая помощь участникам СВО и членам их семей по любым правовым вопросам.",
    image: "/images/service-img/svo.webp",
  },
  {
    title: "Споры в ЖКХ",
    description:
      "Перерасчёт коммунальных платежей, споры с ресурсоснабжающими организациями.",
    image: "/images/service-img/zhkh.webp",
  },
  {
    title: "Прочие юридические вопросы",
    description:
      "Любые правовые ситуации — проконсультируем и поможем найти решение.",
    image: "/images/service-img/other.webp",
  },
];

const SERVICE_LIST = [
  "Составление писем, запросов, актов и иных документов",
  "Составление документов правового характера (претензии, жалобы, заявления, возражения, ходатайства)",
  "Подготовка исковых заявлений, апелляционных и кассационных жалоб",
  "Составление проектов договоров, контрактов, соглашений, в том числе мировых",
  "Юридическое сопровождение сделок",
  "Юридическое сопровождение деятельности организаций и ИП",
  "Представительство в суде",
  "Работа по исполнительным производствам (с приставами)",
];

export default function ServicesPage() {
  const cardsRef = useRef(null);
  const listRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-80px" });
  const listInView = useInView(listRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-sky-50 to-white py-16 md:py-20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 sm:text-4xl lg:text-5xl dark:text-white">
              Юридические услуги в Астрахани
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Помимо банкротства физических лиц, наш кабинет оказывает
              юридические услуги в любых видах правоотношений
            </p>
          </div>
        </Container>
      </section>

      {/* Additional Services Grid */}
      <section className="py-16 md:py-20">
        <Container>
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
            Дополнительные услуги
          </h2>
          <p className="mt-3 text-center text-slate-500 dark:text-slate-400">
            Юридическая помощь по широкому спектру правовых вопросов
          </p>

          <div
            ref={cardsRef}
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {ADDITIONAL_SERVICES.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ willChange: "transform, opacity" }}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-500/5 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-700"
              >
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden">
                  <LazyImage
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Text */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Service List */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50 py-16 md:py-20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Container>
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
            Перечень услуг
          </h2>
          <p className="mt-3 text-center text-slate-500 dark:text-slate-400">
            Полный список юридических услуг, которые мы оказываем
          </p>

          <div ref={listRef} className="mx-auto mt-10 max-w-2xl space-y-3">
            {SERVICE_LIST.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={listInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.4,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ willChange: "transform, opacity" }}
                className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 sm:text-base">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Notice + CTA */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-900/10">
              <h3 className="font-bold text-amber-900 dark:text-amber-400">
                Обратите внимание
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-amber-800 dark:text-amber-300">
                Консультация по вопросам, не связанным с прохождением процедуры
                банкротства граждан — платная, стоимость составляет 1 000 рублей
                за 1 час.
              </p>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={openLeadModal}
                className="inline-flex items-center justify-center rounded-full bg-blue-900 px-8 py-4 text-base font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-xl dark:bg-blue-600"
              >
                Получить консультацию
              </button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
