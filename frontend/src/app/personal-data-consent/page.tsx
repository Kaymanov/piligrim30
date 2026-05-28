import { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
};

export default function PersonalDataConsentPage() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="prose prose-slate mx-auto max-w-3xl dark:prose-invert">
          <h1>Согласие на обработку персональных данных</h1>

          <p>
            Заполняя формы на сайте piligrim30.ru и нажимая кнопку отправки, вы
            даёте своё согласие ИП Бурлуцкий Олег Алексеевич (ИНН 301725946606)
            на обработку ваших персональных данных в соответствии с Федеральным
            законом №152-ФЗ «О персональных данных».
          </p>

          <h2>Перечень данных</h2>
          <ul>
            <li>Фамилия, имя</li>
            <li>Номер телефона</li>
            <li>Адрес электронной почты</li>
            <li>Содержание обращения</li>
          </ul>

          <h2>Цели обработки</h2>
          <ul>
            <li>Связь с вами для предоставления консультации</li>
            <li>Информирование об услугах</li>
          </ul>

          <h2>Срок действия согласия</h2>
          <p>
            Согласие действует до момента его отзыва. Вы можете отозвать
            согласие, направив письменное уведомление на email:
            info@piligrim30.ru
          </p>

          <h2>Контакты</h2>
          <p>
            ИП Бурлуцкий Олег Алексеевич
            <br />
            г. Астрахань
            <br />
            Email: info@piligrim30.ru
            <br />
            Телефон: +7 (996) 505-70-50
          </p>
        </div>
      </Container>
    </section>
  );
}
