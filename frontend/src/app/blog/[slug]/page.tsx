import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LeadForm } from "@/components/forms/LeadForm";
import { getBlogPostBySlugSSR } from "@/lib/server-api";

// Revalidate this page periodically (ISR)
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlugSSR(slug);
  if (!post) return { title: "Статья не найдена" };
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlugSSR(slug);

  if (!post) {
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
