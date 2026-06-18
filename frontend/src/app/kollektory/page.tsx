import { Metadata } from "next";
import { ServicePage } from "@/components/templates/ServicePage";

export const metadata: Metadata = {
  title: "Защита от коллекторов в Астрахани — прекратим звонки",
  description:
    "Защищаем права должников от незаконных действий коллекторов. Прекращаем звонки, угрозы и давление по ФЗ №230. Жалобы в ФССП и прокуратуру. Бесплатная консультация.",
};

export default function KollektoryPage() {
  return (
    <ServicePage
      title="Защита от коллекторов"
      h1="Защита от коллекторов в Астрахани"
      description="Остановим незаконные звонки, угрозы и давление коллекторов. Защищаем ваши права по Федеральному закону №230-ФЗ. Первая консультация — бесплатно."
      whenNeeded={[
        "Коллекторы звонят больше допустимого числа раз",
        "Звонки поступают в ночное время",
        "Коллекторы угрожают или оскорбляют",
        "Сообщают о долге вашим родственникам или работодателю",
        "Приходят домой или на работу без приглашения",
        "Оказывают психологическое давление",
      ]}
      steps={[
        {
          title: "Бесплатная консультация",
          description: "Оцениваем ситуацию и объясняем ваши права",
        },
        {
          title: "Фиксация нарушений",
          description:
            "Помогаем собрать доказательства: записи звонков, скриншоты, свидетельства",
        },
        {
          title: "Подача жалоб",
          description: "Направляем жалобы в ФССП, Роскомнадзор и прокуратуру",
        },
        {
          title: "Уведомление коллектора",
          description:
            "Направляем официальный отказ от взаимодействия через нотариуса или почту",
        },
        {
          title: "Банкротство при необходимости",
          description:
            "Если долги непосильны — запускаем процедуру банкротства, которая останавливает все требования кредиторов по закону",
        },
      ]}
    >
      {/* Extra informational block */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50 py-12 md:py-16 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Что запрещено коллекторам по закону
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Деятельность коллекторов строго регулируется Федеральным законом
            №230-ФЗ «О защите прав и законных интересов физических лиц при
            осуществлении деятельности по возврату просроченной задолженности».
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Звонить чаще 1 раза в сутки, 2 раз в неделю, 8 раз в месяц",
              "Беспокоить с 22:00 до 8:00 в будни и с 20:00 до 9:00 в выходные",
              "Угрожать, оскорблять или применять психологическое давление",
              "Сообщать о долге третьим лицам без согласия должника",
              "Скрывать своё имя и организацию при звонке",
              "Вводить в заблуждение о размере долга или последствиях",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="text-slate-700 dark:text-slate-300">
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-900/10">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-400">
              💡 Важно знать
            </p>
            <p className="mt-1 text-sm leading-relaxed text-amber-800 dark:text-amber-300">
              Если у вас нет имущества и нет возможности платить — банкротство
              полностью прекращает все требования кредиторов и коллекторов по
              закону. Позвоните нам для бесплатной оценки ситуации.
            </p>
          </div>
        </div>
      </section>
    </ServicePage>
  );
}
