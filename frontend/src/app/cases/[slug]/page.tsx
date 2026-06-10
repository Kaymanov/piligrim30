"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LeadForm } from "@/components/forms/LeadForm";
import { getCaseBySlug, type Case } from "@/lib/api";

export default function CaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [item, setItem] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    getCaseBySlug(slug)
      .then((c) => {
        if (active) setItem(c);
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <article className="py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl animate-pulse space-y-4">
            <div className="h-10 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-24 w-full rounded-2xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </Container>
      </article>
    );
  }

  if (notFound || !item) {
    return (
      <article className="py-20 text-center">
        <Container>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Кейс не найден
          </h1>
          <Link
            href="/cases"
            className="mt-6 inline-block rounded-full bg-blue-900 px-6 py-3 text-sm font-medium text-white dark:bg-blue-600"
          >
            Ко всем кейсам
          </Link>
        </Container>
      </article>
    );
  }

  return (
    <article className="py-12 md:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {item.title}
          </h1>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 p-5 text-center dark:from-slate-800 dark:to-slate-800">
              <p className="text-xs font-medium uppercase tracking-wider text-blue-400 dark:text-slate-400">
                Сумма долга
              </p>
              <p className="mt-1 text-2xl font-extrabold text-blue-900 dark:text-white">
                {item.debt_amount}
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 p-5 text-center dark:from-slate-800 dark:to-slate-800">
              <p className="text-xs font-medium uppercase tracking-wider text-blue-400 dark:text-slate-400">
                Срок процедуры
              </p>
              <p className="mt-1 text-2xl font-extrabold text-blue-900 dark:text-white">
                {item.case_duration}
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="mt-8 space-y-8">
            {item.client_problem && (
              <Section title="Ситуация клиента" html={item.client_problem} />
            )}
            {item.what_was_done && (
              <Section title="Что было сделано" html={item.what_was_done} />
            )}
            {item.result && <Section title="Результат" html={item.result} />}
            {item.lawyer_comment && (
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Комментарий юриста
                </p>
                <div
                  className="prose prose-slate mt-2 max-w-none italic dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: item.lawyer_comment }}
                />
              </div>
            )}
          </div>

          {item.disclaimer && (
            <p className="mt-8 text-xs text-slate-400 dark:text-slate-500">
              {item.disclaimer}
            </p>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-slate-50 p-6 dark:bg-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Похожая ситуация?
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Запишитесь на бесплатную консультацию
            </p>
            <div className="mt-4">
              <LeadForm />
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}

function Section({ title, html }: { title: string; html: string }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {title}
      </h2>
      <div
        className="prose prose-slate mt-2 max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
