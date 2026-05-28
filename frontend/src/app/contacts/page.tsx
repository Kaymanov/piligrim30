import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LeadForm } from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Контакты юридического кабинета Правовой Пилигрим в Астрахани. Адрес, телефон, режим работы.",
};

export default function ContactsPage() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Контакты
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Адрес
              </h2>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                г. Астрахань
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Телефон
              </h2>
              <a
                href="tel:+79965057050"
                className="mt-1 block text-lg font-medium text-sky-600 hover:text-sky-800 dark:text-sky-400"
              >
                +7 (996) 505-70-50
              </a>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Email
              </h2>
              <a
                href="mailto:info@piligrim30.ru"
                className="mt-1 block text-sky-600 hover:text-sky-800 dark:text-sky-400"
              >
                info@piligrim30.ru
              </a>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Режим работы
              </h2>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                Пн–Пт: 9:00–18:00
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Сб: по записи
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Реквизиты
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                ИП Бурлуцкий Олег Алексеевич
                <br />
                ИНН 301725946606
                <br />
                ОГРНИП 323300000044992
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                Записаться на консультацию
              </h2>
              <LeadForm sourcePage="contacts" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
