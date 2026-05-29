"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";

// Mock data — will be replaced with API
const POSTS = [
  {
    id: 1,
    title:
      "Банкротство физических лиц в Астрахани: условия, этапы и последствия",
    slug: "bankrotstvo-fizicheskih-lic-astrakhan",
    excerpt:
      "Разбираем основные условия для подачи на банкротство, этапы процедуры и последствия для должника.",
    category: "Банкротство",
    is_news: false,
    reading_time: 7,
    published_at: "2025-12-10",
    cover:
      "/images/blog-img/imagen-4.0-generate-001_a_%D0%AE%D1%80%D0%B8%D1%81%D1%82_%D0%B2%D0%B5%D0%B4%D0%B5%D1%82_%D0%BA%D0%BE%D0%BD%D1%81%D1%83%D0%BB%D1%8C%D1%82.png",
  },
  {
    id: 2,
    title: "Что делать, если нечем платить кредит",
    slug: "chto-delat-esli-nechem-platit-kredit",
    excerpt:
      "Рассказываем о законных способах решения проблемы, когда платить по кредитам стало невозможно.",
    category: "Кредиты",
    is_news: false,
    reading_time: 5,
    published_at: "2025-12-05",
    cover:
      "/images/blog-img/imagen-4.0-generate-001_a_%D0%A7%D0%B5%D0%BB%D0%BE%D0%B2%D0%B5%D0%BA_%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%BC%D1%83_%D0%BD%D0%B5%D1%87%D0%B5.png",
  },
  {
    id: 3,
    title: "Какие долги можно списать через банкротство",
    slug: "kakie-dolgi-mozhno-spisat",
    excerpt:
      "Полный список долгов, которые подлежат списанию, и исключения, о которых важно знать.",
    category: "Списание долгов",
    is_news: false,
    reading_time: 6,
    published_at: "2025-11-28",
    cover:
      "/images/blog-img/imagen-4.0-generate-001_a_%D0%AE%D1%80%D0%B8%D1%81%D1%82_%D1%81%D1%82%D0%BE%D0%B8%D1%82_%D0%B2%D0%BE%D0%B7%D0%BB%D0%B5_%D0%B4%D0%BE.png",
  },
  {
    id: 4,
    title: "Что будет с имуществом при банкротстве",
    slug: "chto-budet-s-imushchestvom",
    excerpt:
      "Объясняем, какое имущество защищено законом и что может быть включено в конкурсную массу.",
    category: "Имущество",
    is_news: false,
    reading_time: 8,
    published_at: "2025-11-20",
    cover:
      "/images/blog-img/imagen-4.0-generate-001_a_%D0%97%D0%B0%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%BD%D1%8B%D0%B9_%D0%B4%D0%BE%D0%BC._%D0%A4%D0%BE%D1%82%D0%BE.png",
  },
  {
    id: 5,
    title: "Изменения в законе о банкротстве в 2025 году",
    slug: "izmeneniya-zakon-bankrotstvo-2025",
    excerpt:
      "Обзор ключевых изменений в законодательстве о банкротстве физических лиц.",
    category: "Банкротство",
    is_news: true,
    reading_time: 4,
    published_at: "2025-12-15",
    cover:
      "/images/blog-img/imagen-4.0-generate-001_a_%D0%AE%D1%80%D0%B8%D1%81%D1%82_%D1%81%D1%82%D0%BE%D0%B8%D1%82_%D0%B2%D0%BE%D0%B7%D0%BB%D0%B5_%D0%B4%D0%BE.png",
  },
  {
    id: 6,
    title: "Как защититься от коллекторов: права должника",
    slug: "kak-zashchititsya-ot-kollektorov",
    excerpt:
      "Подробная инструкция о том, что делать если коллекторы нарушают ваши права.",
    category: "Кредиты",
    is_news: false,
    reading_time: 6,
    published_at: "2025-11-10",
    cover:
      "/images/blog-img/imagen-4.0-generate-001_a_%D0%A7%D0%B5%D0%BB%D0%BE%D0%B2%D0%B5%D0%BA_%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%BC%D1%83_%D0%BD%D0%B5%D1%87%D0%B5.png",
  },
];

const CATEGORIES = [
  "Все",
  "Банкротство",
  "Кредиты",
  "Списание долгов",
  "Имущество",
];
const TYPES = ["Все", "Статьи", "Новости"] as const;

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [activeType, setActiveType] = useState<(typeof TYPES)[number]>("Все");
  const [sortNewest, setSortNewest] = useState(true);

  const filtered = useMemo(() => {
    let result = [...POSTS];

    // Category filter
    if (activeCategory !== "Все") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Type filter
    if (activeType === "Статьи") {
      result = result.filter((p) => !p.is_news);
    } else if (activeType === "Новости") {
      result = result.filter((p) => p.is_news);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q),
      );
    }

    // Sort
    result.sort((a, b) => {
      const da = new Date(a.published_at).getTime();
      const db = new Date(b.published_at).getTime();
      return sortNewest ? db - da : da - db;
    });

    return result;
  }, [search, activeCategory, activeType, sortNewest]);

  return (
    <section className="py-12 md:py-16">
      <Container>
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Новости и статьи
        </h1>
        <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
          Полезные материалы о банкротстве и долгах
        </p>

        {/* Filters bar */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90 lg:top-20">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Поиск по статьям..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Category pills + type + sort */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {/* Categories */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-blue-900 text-white shadow-sm dark:bg-sky-600"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Spacer */}
            <div className="hidden flex-1 sm:block" />

            {/* Type toggle */}
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-700">
              {TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                    activeType === type
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-600 dark:text-white"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Sort */}
            <button
              onClick={() => setSortNewest(!sortNewest)}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              {sortNewest ? "Новые" : "Старые"}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map((post) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={post.cover}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {post.is_news && (
                          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
                            Новость
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <span className="inline-block self-start rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                          {post.category}
                        </span>
                        <h2 className="mt-3 text-lg font-bold text-slate-800 group-hover:text-blue-900 dark:text-white dark:group-hover:text-sky-400">
                          {post.title}
                        </h2>
                        <p className="mt-2 flex-1 text-sm text-slate-500 dark:text-slate-400">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 flex gap-3 text-xs text-slate-400">
                          <span>
                            {new Date(post.published_at).toLocaleDateString(
                              "ru-RU",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <span>·</span>
                          <span>{post.reading_time} мин</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center"
              >
                <svg
                  className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mt-4 text-lg font-medium text-slate-500 dark:text-slate-400">
                  Ничего не найдено
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("Все");
                    setActiveType("Все");
                  }}
                  className="mt-3 text-sm font-medium text-sky-600 hover:text-sky-800 dark:text-sky-400"
                >
                  Сбросить фильтры
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
