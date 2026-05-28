import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reviews } from "@/components/sections/Reviews";

export const metadata: Metadata = {
  title: "Отзывы клиентов",
  description:
    "Реальные отзывы клиентов о работе юристов Правовой Пилигрим по банкротству физических лиц в Астрахани.",
};

export default function ReviewsPage() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Отзывы клиентов
        </h1>
        <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
          Реальные отзывы с внешних площадок
        </p>
      </Container>
      <div className="mt-8">
        <Reviews />
      </div>
    </section>
  );
}
