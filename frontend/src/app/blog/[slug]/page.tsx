import { Container } from "@/components/ui/Container";
import { LeadForm } from "@/components/forms/LeadForm";

// Mock — will be replaced with API + generateStaticParams
export default function BlogPostPage() {
  return (
    <article className="py-12 md:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
            Банкротство
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
            Статья загружается из API
          </h1>
          <div className="mt-4 flex gap-3 text-sm text-slate-400">
            <span>10 дек 2025</span>
            <span>·</span>
            <span>7 мин чтения</span>
          </div>

          {/* Content placeholder */}
          <div className="prose prose-slate mt-8 max-w-none dark:prose-invert">
            <p>
              Содержимое статьи будет загружаться из Django API через CKEditor.
              Здесь будет отображаться HTML-контент из поля content модели
              BlogPost.
            </p>
            <p>
              После подключения к API эта страница будет динамически
              генерироваться для каждого slug из базы данных.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-slate-50 p-6 dark:bg-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Нужна консультация?
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Оставьте заявку — юрист разберёт вашу ситуацию
            </p>
            <div className="mt-4">
              <LeadForm sourcePage="blog-article" />
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}
