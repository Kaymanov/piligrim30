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
      className="relative overflow-hidden bg-blue-900 py-16 md:py-20 lg:py-24 dark:bg-slate-950"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <Container className="relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Разберём вашу ситуацию и предложим законный путь решения
          </h2>
          <p className="mt-4 text-base text-blue-100 sm:text-lg dark:text-slate-400">
            Заполните форму — юрист свяжется с вами в ближайшее время для
            бесплатной консультации
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 max-w-md"
        >
          <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8 dark:bg-slate-800">
            <LeadForm sourcePage="homepage-final-cta" />
          </div>
        </motion.div>

        {/* Trust markers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-blue-200 dark:text-slate-500"
        >
          <span className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-green-400"
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
              className="h-4 w-4 text-green-400"
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
              className="h-4 w-4 text-green-400"
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
