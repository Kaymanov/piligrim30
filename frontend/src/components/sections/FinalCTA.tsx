"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { LeadForm } from "@/components/forms/LeadForm";

export function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 py-16 md:py-20 lg:py-24 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-blue-300/15 blur-3xl dark:bg-violet-500/10" />
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl dark:text-white">
            Разберём вашу ситуацию и предложим законный путь решения
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg dark:text-slate-400">
            Заполните форму или приходите в офис — первая консультация
            бесплатная
          </p>
        </motion.div>

        {/* Two-column: Form + Contacts/Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2"
        >
          {/* Left: Form */}
          <div className="rounded-3xl bg-white p-6 shadow-xl sm:p-8 dark:bg-slate-800">
            <h3 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">
              Записаться на консультацию
            </h3>
            <LeadForm sourcePage="homepage-final-cta" />
          </div>

          {/* Right: Contacts + Map */}
          <div className="flex flex-col gap-6">
            {/* Contact cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Address */}
              <div className="rounded-2xl bg-white p-5 shadow-md dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      Адрес
                    </p>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      г. Астрахань, ул. Савушкина д. 43, офис 103, 1 эт.
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="rounded-2xl bg-white p-5 shadow-md dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      Телефон
                    </p>
                    <a
                      href="tel:+79965057050"
                      className="text-sm font-medium text-slate-800 hover:text-sky-600 dark:text-white dark:hover:text-sky-400"
                    >
                      +7 (996) 505-70-50
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="rounded-2xl bg-white p-5 shadow-md dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      Email
                    </p>
                    <a
                      href="mailto:info@piligrim30.ru"
                      className="text-sm font-medium text-slate-800 hover:text-sky-600 dark:text-white dark:hover:text-sky-400"
                    >
                      info@piligrim30.ru
                    </a>
                  </div>
                </div>
              </div>

              {/* Working hours */}
              <div className="rounded-2xl bg-white p-5 shadow-md dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      Режим работы
                    </p>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      Пн–Пт: 9:00–18:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Yandex Map — iframe works on production domain, fallback link for localhost */}
            <a
              href="https://yandex.ru/maps/-/CDaZfV~r"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-2xl shadow-lg"
            >
              <div className="flex h-[300px] items-center justify-center bg-slate-200 dark:bg-slate-700">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-slate-400 transition-colors group-hover:text-sky-500 dark:text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="mt-3 text-sm font-medium text-slate-500 transition-colors group-hover:text-sky-600 dark:text-slate-400">
                    Открыть на Яндекс Картах →
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    ул. Савушкина д. 43, офис 103
                  </p>
                </div>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Trust markers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-10 flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-500"
        >
          <span className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-green-500"
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
            Бесплатная консультация
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-green-500"
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
            Работаем по договору
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-green-500"
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
            Возможна рассрочка
          </span>
        </motion.div>
      </Container>
    </section>
  );
}
