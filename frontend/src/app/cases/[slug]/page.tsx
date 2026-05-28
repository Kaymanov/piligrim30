import { Container } from "@/components/ui/Container";
import { LeadForm } from "@/components/forms/LeadForm";

// Mock — will use API + generateStaticParams
export default function CaseDetailPage() {
  return (
    <article className="py-12 md:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Детали кейса загружаются из API
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Здесь будет полная информация о кейсе: ситуация клиента, что было
            сделано, результат и комментарий юриста.
          </p>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-slate-50 p-6 dark:bg-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Похожая ситуация?
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Запишитесь на бесплатную консультацию
            </p>
            <div className="mt-4">
              <LeadForm sourcePage="case-detail" />
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}
