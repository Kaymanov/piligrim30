"use client";

import { Container } from "@/components/ui/Container";
import { LeadForm } from "@/components/forms/LeadForm";
import { Faq } from "@/components/sections/Faq";

interface ServicePageProps {
  title: string;
  h1: string;
  description: string;
  whenNeeded?: string[];
  steps?: { title: string; description: string }[];
  children?: React.ReactNode;
}

export function ServicePage({
  title,
  h1,
  description,
  whenNeeded,
  steps,
  children,
}: ServicePageProps) {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-sky-50 to-white py-16 md:py-20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 sm:text-4xl lg:text-5xl dark:text-white">
              {h1}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              {description}
            </p>
          </div>
        </Container>
      </section>

      {/* When needed */}
      {whenNeeded && whenNeeded.length > 0 && (
        <section className="py-12 md:py-16">
          <Container>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Когда это нужно
            </h2>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {whenNeeded.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    className="mt-1 h-5 w-5 shrink-0 text-sky-500"
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
                  <span className="text-slate-700 dark:text-slate-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Steps */}
      {steps && steps.length > 0 && (
        <section className="bg-slate-50 py-12 md:py-16 dark:bg-slate-800/50">
          <Container>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Порядок работы
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
                >
                  <span className="text-sm font-bold text-sky-600 dark:text-sky-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Custom content */}
      {children}

      {/* FAQ */}
      <Faq />

      {/* CTA Form */}
      <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 py-12 md:py-16 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Container>
          <div className="mx-auto max-w-md">
            <h2 className="mb-6 text-center text-2xl font-bold text-slate-900 dark:text-white">
              Получить консультацию
            </h2>
            <div className="rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
              <LeadForm sourcePage={title} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
