"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LeadForm } from "@/components/forms/LeadForm";
import { getBlogPostBySlug, type BlogPost } from "@/lib/api";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    getBlogPostBySlug(slug)
      .then((p) => {
        if (active) setPost(p);
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
            <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="h-10 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-8 space-y-3">
              <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </Container>
      </article>
    );
  }

  if (notFound || !post) {
    return (
      <article className="py-20 text-center">
        <Container>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Статья не найдена
          </h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Возможно, она была перемещена или удалена.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-block rounded-full bg-blue-900 px-6 py-3 text-sm font-medium text-white dark:bg-blue-600"
          >
            Ко всем статьям
          </Link>
        </Container>
      </article>
    );
  }

  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <article className="py-12 md:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          {post.category_data && (
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
              {post.category_data.name}
            </span>
          )}
          <h1 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
            {post.h1 || post.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
            {dateStr && <span>{dateStr}</span>}
            {dateStr && <span>·</span>}
            <span>{post.reading_time} мин чтения</span>
            {post.author && (
              <>
                <span>·</span>
                <span>{post.author}</span>
              </>
            )}
          </div>

          {/* Content from CKEditor */}
          <div
            className="prose prose-slate mt-8 max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-sky-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-slate-50 p-6 dark:bg-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Нужна консультация?
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Оставьте заявку — юрист разберёт вашу ситуацию
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
