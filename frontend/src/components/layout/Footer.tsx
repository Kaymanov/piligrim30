import Link from "next/link";
import { Container } from "@/components/ui/Container";

const SERVICE_LINKS = [
  { label: "Банкротство физлиц", href: "/bankrotstvo-fizicheskih-lic" },
  { label: "Списание долгов", href: "/spisanie-dolgov" },
  { label: "Банкротство под ключ", href: "/bankrotstvo-pod-klyuch" },
  { label: "Банкротство через МФЦ", href: "/bankrotstvo-cherez-mfc" },
  { label: "Защита от коллекторов", href: "/kollektory" },
];

const INFO_LINKS = [
  { label: "Блог", href: "/blog" },
  { label: "Кейсы", href: "/cases" },
  { label: "Отзывы", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
  { label: "Контакты", href: "/contacts" },
];

const LEGAL_LINKS = [
  { label: "Политика конфиденциальности", href: "/privacy-policy" },
  { label: "Согласие на обработку ПД", href: "/personal-data-consent" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-white dark:bg-slate-950">
      <Container>
        <div className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold">Правовой Пилигрим</h3>
            <p className="mt-3 text-sm leading-relaxed text-blue-100">
              Юридическое сопровождение банкротства физических лиц в Астрахани.
              Поможем законно разобраться с долгами.
            </p>
            <div className="mt-4 space-y-2 text-sm text-blue-100">
              <a href="tel:+78512000000" className="block hover:text-white">
                +7 (8512) 00-00-00
              </a>
              <a
                href="mailto:info@piligrim30.ru"
                className="block hover:text-white"
              >
                info@piligrim30.ru
              </a>
              <p>г. Астрахань</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-200">
              Услуги
            </h4>
            <ul className="mt-4 space-y-2">
              {SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-100 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-200">
              Информация
            </h4>
            <ul className="mt-4 space-y-2">
              {INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-100 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-200">
              Документы
            </h4>
            <ul className="mt-4 space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-100 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-blue-800/50 py-6">
          <p className="text-center text-sm text-blue-200">
            © {currentYear} Правовой Пилигрим. Все права защищены.
          </p>
        </div>
      </Container>
    </footer>
  );
}
