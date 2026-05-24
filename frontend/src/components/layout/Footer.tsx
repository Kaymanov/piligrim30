import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

const SERVICE_LINKS = [
  { label: "Банкротство физлиц", href: "/bankrotstvo-fizicheskih-lic" },
  { label: "Списание долгов", href: "/spisanie-dolgov" },
  { label: "Банкротство под ключ", href: "/bankrotstvo-pod-klyuch" },
  { label: "Банкротство через МФЦ", href: "/bankrotstvo-cherez-mfc" },
  { label: "Защита от коллекторов", href: "/kollektory" },
  { label: "Иные юридические услуги", href: "/services" },
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
          {/* Brand + Logo */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-[37px] shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Правовой Пилигрим"
                  fill
                  className="object-contain brightness-110"
                  sizes="37px"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">Правовой Пилигрим</h3>
                <p className="text-xs text-blue-200">юридический кабинет</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-blue-100">
              Юридическое сопровождение банкротства физических лиц в Астрахани.
              Поможем законно разобраться с долгами.
            </p>
            <div className="mt-4 space-y-2 text-sm text-blue-100">
              <a href="tel:+79965057050" className="block hover:text-white">
                +7 (996) 505-70-50
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

        {/* Bottom bar: requisites + copyright */}
        <div className="border-t border-blue-800/50 py-6">
          <div className="flex flex-col items-center gap-3 text-center text-sm text-blue-200">
            <p>
              ИП Бурлуцкий Олег Алексеевич &middot; ИНН&nbsp;301725946606
              &middot; ОГРНИП&nbsp;323300000044992
            </p>
            <p>© {currentYear} Правовой Пилигрим. Все права защищены.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
