"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  { label: "Новости", href: "/blog" },
  { label: "Кейсы", href: "/cases" },
  { label: "Отзывы", href: "/reviews" },
  { label: "ЧАВО", href: "/faq" },
  { label: "Контакты", href: "/contacts" },
];

const LEGAL_LINKS = [
  { label: "Политика конфиденциальности", href: "/privacy-policy" },
  { label: "Согласие на обработку ПД", href: "/personal-data-consent" },
];

/** Accordion section for mobile/tablet (< 1024px) */
function FooterAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 text-sm font-semibold uppercase tracking-wider text-blue-200"
      >
        {title}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="h-4 w-4 text-blue-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Static section for desktop (>= 1024px) */
function FooterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="hidden lg:block">
      <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-200">
        {title}
      </h4>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function LinkList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="space-y-2">
      {links.map((link) => (
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
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-white dark:bg-slate-950">
      <Container>
        <div className="grid gap-8 py-12 lg:grid-cols-4 lg:py-16">
          {/* Brand + Logo */}
          <div>
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

          {/* Services — accordion on mobile, static on desktop */}
          <div>
            <FooterAccordion title="Услуги">
              <LinkList links={SERVICE_LINKS} />
            </FooterAccordion>
            <FooterSection title="Услуги">
              <LinkList links={SERVICE_LINKS} />
            </FooterSection>
          </div>

          {/* Info */}
          <div>
            <FooterAccordion title="Информация">
              <LinkList links={INFO_LINKS} />
            </FooterAccordion>
            <FooterSection title="Информация">
              <LinkList links={INFO_LINKS} />
            </FooterSection>
          </div>

          {/* Legal */}
          <div>
            <FooterAccordion title="Документы">
              <LinkList links={LEGAL_LINKS} />
            </FooterAccordion>
            <FooterSection title="Документы">
              <LinkList links={LEGAL_LINKS} />
            </FooterSection>
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
