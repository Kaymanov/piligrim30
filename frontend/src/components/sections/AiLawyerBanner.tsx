"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { openChat } from "@/lib/modal-events";

export function AiLawyerBanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-12 md:py-16">
      <Container>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-sky-900 p-8 text-white shadow-xl sm:p-10 md:p-12 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
        >
          {/* Background glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            {/* Icon */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm md:h-20 md:w-20">
              <svg
                className="h-8 w-8 md:h-10 md:w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>

            {/* Text */}
            <div className="flex-1">
              <h3 className="text-xl font-bold sm:text-2xl">
                Остались вопросы? Спросите ИИ-Юриста
              </h3>
              <p className="mt-2 text-sm text-blue-100 sm:text-base dark:text-slate-400">
                Получите мгновенный ответ на вопросы о банкротстве, долгах и
                списании кредитов. Бесплатно и без регистрации.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={openChat}
              className="ai-glow-button shrink-0 whitespace-nowrap rounded-full bg-white px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl dark:bg-sky-500 dark:text-white"
            >
              Задать вопрос
            </button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
