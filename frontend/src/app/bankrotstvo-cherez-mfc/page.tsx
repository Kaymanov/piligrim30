import { Metadata } from "next";
import { ServicePage } from "@/components/templates/ServicePage";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Банкротство через МФЦ — внесудебное банкротство в Астрахани",
  description:
    "Бесплатная процедура внесудебного банкротства через МФЦ. Узнайте, подходит ли вам этот вариант и какие условия нужно соблюсти.",
};

export default function BankrotstvoMFCPage() {
  return (
    <ServicePage
      title="Банкротство через МФЦ"
      h1="Банкротство через МФЦ в Астрахани"
      description="Внесудебное банкротство — бесплатная процедура для должников с суммой долга от 25 000 до 1 000 000 ₽. Разберём, подходит ли вам этот вариант."
      whenNeeded={[
        "Сумма долгов от 25 000 до 1 000 000 ₽",
        "Исполнительное производство окончено по п.4 ч.1 ст.46",
        "Нет имущества для взыскания",
        "Нет официального дохода выше прожиточного минимума",
      ]}
      steps={[
        {
          title: "Проверка условий",
          description: "Убедимся, что вы подходите под критерии",
        },
        {
          title: "Подготовка списка",
          description: "Составим перечень кредиторов и сумм",
        },
        {
          title: "Подача в МФЦ",
          description: "Поможем подать заявление в МФЦ",
        },
        {
          title: "Ожидание (6 мес)",
          description: "Процедура длится 6 месяцев",
        },
        { title: "Списание", description: "Долги списываются автоматически" },
      ]}
    >
      {/* Additional info block */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-900/10">
            <h3 className="font-bold text-amber-900 dark:text-amber-400">
              Важно знать
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-amber-800 dark:text-amber-300">
              Внесудебное банкротство подходит не всем. Если ваша сумма долга
              превышает 1 000 000 ₽ или исполнительное производство не окончено
              — вам подойдёт судебная процедура банкротства. На консультации
              юрист определит оптимальный вариант для вашей ситуации.
            </p>
          </div>
        </Container>
      </section>
    </ServicePage>
  );
}
