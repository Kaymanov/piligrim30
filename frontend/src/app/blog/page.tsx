import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Новости и статьи о банкротстве",
  description:
    "Полезные материалы о банкротстве физических лиц, списании долгов, защите от коллекторов и приставов.",
};

// Mock — will be replaced with API
const POSTS = [
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
    reading_time: 8,
    published_at: "2025-11-20",
    cover:
      "/images/blog-img/imagen-4.0-generate-001_a_%D0%97%D0%B0%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%BD%D1%8B%D0%B9_%D0%B4%D0%BE%D0%BC._%D0%A4%D0%BE%D1%82%D0%BE.png",
  },
];

export default function BlogPage() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Новости и статьи
        </h1>
        <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
          Полезные материалы о банкротстве и долгах
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
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
                    {new Date(post.published_at).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span>·</span>
                  <span>{post.reading_time} мин</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
