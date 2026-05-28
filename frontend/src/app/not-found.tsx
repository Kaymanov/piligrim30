import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center py-20">
      <Container>
        <div className="mx-auto max-w-md text-center">
          <p className="text-6xl font-extrabold text-blue-900 dark:text-sky-400">
            404
          </p>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            Страница не найдена
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Возможно, страница была перемещена или удалена
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="primary" href="/">
              На главную
            </Button>
            <Button variant="secondary" href="/contacts">
              Контакты
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
