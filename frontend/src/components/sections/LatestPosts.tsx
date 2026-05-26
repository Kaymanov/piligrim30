"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

// Mock data — will be replaced with API call later
const MOCK_POSTS = [
  {
    id: 1,
    title:
      "Банкротство физических лиц в Астрахани: условия, этапы и последствия",
    slug: "bankrotstvo-fizicheskih-lic-astrakhan",
    excerpt:
      "Разбираем основные условия для подачи на банкротство, этапы процедуры и последствия для должника.",
    category: "Банкротство",
    reading_time: 7,
    published_at: "2025-12-10",
    gradient: "from-blue-600 to-sky-500",
    icon: "⚖️",
  },
  {
    id: 2,
    title: "Что делать, если нечем платить кредит",
    slug: "chto-delat-esli-nechem-platit-kredit",
    excerpt:
      "Рассказываем о законных способах решения проблемы, когда платить по кредитам стало невозможно.",
    category: "Кредиты",
    reading_time: 5,
    published_at: "2025-12-05",
    gradient: "from-violet-600 to-blue-500",
    icon: "💳",
  },
  {
    id: 3,
    title: "Какие долги можно списать через банкротство",
    slug: "kakie-dolgi-mozhno-spisat",
    excerpt:
      "Полный список долгов, которые подлежат списанию, и исключения, о которых важно знать.",
    category: "Списание долгов",
    reading_time: 6,
    published_at: "2025-11-28",
    gradient: "from-sky-600 to-teal-500",
    icon: "📋",
  },
  {
    id: 4,
    title: "Что будет с имуществом при банкротстве",
    slug: "chto-budet-s-imushchestvom",
    excerpt:
      "Объясняем, какое имущество защищено законом и что может быть включено в конкурсную массу.",
    category: "Имущество",
    reading_time: 8,
    published_at: "2025-11-20",
    gradient: "from-blue-800 to-violet-600",
    icon: "🏠",
  },
];

export function LatestPosts() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <SectionWrapper
      title="Полезные материалы"
      subtitle="Статьи и новости"
      bg="slate"
      id="blog"
    >
      <div
        ref={ref}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {MOCK_POSTS.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ willChange: "transform, opacity" }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-700"
            >
              {/* Cover image — gradient with icon */}
              <div
                className={`flex h-36 items-center justify-center bg-gradient-to-br ${post.gradient}`}
              >
                <span className="text-4xl opacity-80">{post.icon}</span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                {/* Category badge */}
                <span className="inline-block self-start rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                  {post.category}
                </span>

                {/* Title */}
                <h3 className="mt-3 text-base font-bold leading-snug text-slate-800 transition-colors group-hover:text-blue-900 dark:text-white dark:group-hover:text-sky-400">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="mt-4 flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                  <span>
                    {new Date(post.published_at).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span>·</span>
                  <span>{post.reading_time} мин чтения</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Link to all posts */}
      <div className="mt-10 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500"
        >
          Все материалы
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </SectionWrapper>
  );
}
