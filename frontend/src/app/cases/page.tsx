import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Cases } from "@/components/sections/Cases";
import { getCasesSSR } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "Кейсы — реальные результаты работы",
  description:
    "Обезличенные результаты работы юристов по банкротству физических лиц в Астрахани. Реальные суммы, сроки и результаты.",
};

export default async function CasesPage() {
  const cases = await getCasesSSR();
  return (
    <section className="py-12 md:py-16">
      <Container>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Реальные кейсы
        </h1>
        <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
          Обезличенные результаты работы наших юристов
        </p>
      </Container>
      <div className="mt-8">
        <Cases initial={cases} />
      </div>
    </section>
  );
}
