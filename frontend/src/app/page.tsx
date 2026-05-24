import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function Home() {
  return (
    <>
      {/* Hero placeholder — will be replaced in Wave 2 */}
      <section className="py-20 md:py-28 lg:py-36">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 sm:text-4xl lg:text-5xl dark:text-white">
              Банкротство физических лиц в Астрахани
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-500 dark:text-slate-400">
              Поможем законно разобраться с долгами, подготовить документы и
              пройти процедуру с юридическим сопровождением.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button variant="primary" size="lg" href="#contact">
                Получить консультацию
              </Button>
              <Button variant="secondary" size="lg" href="#quiz">
                Проверить, подходит ли мне
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
