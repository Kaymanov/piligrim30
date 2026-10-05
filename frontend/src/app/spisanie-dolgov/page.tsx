import { StaticSchema } from "@/components/seo/JsonLd";
import { staticMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/templates/ServicePage";

export const generateMetadata = staticMetadata("/spisanie-dolgov", {
  title: "Законное освобождение от долгов в Астрахани",
  description:
    "Поможем разобраться с кредитами, микрозаймами, просрочками и исполнительными производствами. Консультация юриста по освобождению от долгов.",
});

export default function SpisanieDolgovPage() {
  return (
    <>
    <StaticSchema path="/spisanie-dolgov" />
    <ServicePage
      title="Освобождение от долгов"
      h1="Освобождение от долгов в Астрахани"
      description="Законные способы избавиться от непосильной долговой нагрузки. Разберём вашу ситуацию и предложим оптимальный путь решения."
      whenNeeded={[
        "Кредиты и микрозаймы стали непосильными",
        "Долги растут из-за процентов и штрафов",
        "Нет возможности договориться с банками",
        "Хотите начать жизнь без долгов",
      ]}
      steps={[
        {
          title: "Анализ долгов",
          description: "Составим полную картину ваших обязательств",
        },
        {
          title: "Выбор стратегии",
          description: "Определим оптимальный способ освобождения от долгов",
        },
        {
          title: "Подготовка",
          description: "Соберём документы и подготовим заявление",
        },
        {
          title: "Освобождение от долгов",
          description: "Проведём процедуру до полного освобождения от долгов",
        },
      ]}
    />
    </>
  );
}
