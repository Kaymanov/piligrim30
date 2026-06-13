import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/sections/Faq";
import { getFAQSSR } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "Часто задаваемые вопросы (ЧАВО)",
  description:
    "Ответы на популярные вопросы о банкротстве физических лиц, списании долгов, последствиях и стоимости процедуры.",
};

export default async function FaqPage() {
  const faq = await getFAQSSR();
  return (
    <section className="py-12 md:py-16">
      <Container>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Часто задаваемые вопросы
        </h1>
        <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
          Ответы на популярные вопросы о банкротстве
        </p>
      </Container>
      <div className="mt-8">
        <Faq initial={faq} />
      </div>
    </section>
  );
}
