"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Container } from "@/components/ui/Container";

const NAV_ITEMS = [
  { label: "Банкротство", href: "/bankrotstvo-fizicheskih-lic" },
  { label: "Услуги", href: "/services" },
  { label: "Кейсы", href: "/cases" },
  { label: "Отзывы", href: "/reviews" },
  { label: "Блог", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Контакты", href: "/contacts" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // Track scroll for morphing header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    // Wrapper: sticky positioning + spacing when scrolled
    <div
      className={clsx(
        "sticky top-0 z-50 transition-all duration-500 ease-out",
        scrolled && "pt-3",
      )}
    >
      <Container>
        <header
          className={clsx(
            // Base styles
            "transition-all duration-500 ease-out",
            // Glassmorphism — stronger when scrolled
            scrolled
              ? "rounded-full bg-white/60 shadow-lg shadow-slate-900/5 backdrop-blur-2xl backdrop-saturate-150 dark:bg-slate-900/60 dark:shadow-slate-900/30"
              : "bg-white/70 backdrop-blur-md dark:bg-slate-900/70",
          )}
        >
          <div
            className={clsx(
              "transition-all duration-500",
              scrolled ? "px-6" : "px-0",
            )}
          >
            <div
              className={clsx(
                "flex items-center justify-between gap-4 transition-all duration-500",
                scrolled ? "h-14" : "h-16 lg:h-20",
              )}
            >
              {/* Logo + Brand — preserve aspect ratio (700x1073 source) */}
              <Link href="/" className="flex items-center gap-3 shrink-0">
                <div
                  className={clsx(
                    "relative transition-all duration-500",
                    scrolled
                      ? "h-10 w-[26px]"
                      : "h-12 w-[31px] lg:h-14 lg:w-[37px]",
                  )}
                >
                  <Image
                    src="/images/logo.png"
                    alt="Правовой Пилигрим"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 26px, 37px"
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span
                    className={clsx(
                      "font-bold whitespace-nowrap text-blue-900 transition-all duration-500 dark:text-white",
                      scrolled ? "text-sm" : "text-base lg:text-lg",
                    )}
                  >
                    Правовой Пилигрим
                  </span>
                  <span
                    className={clsx(
                      "whitespace-nowrap text-slate-500 transition-all duration-500 dark:text-slate-400",
                      scrolled ? "text-[10px]" : "text-xs",
                    )}
                  >
                    юридический кабинет
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden items-center gap-1 xl:flex">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Right side */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Phone — nowrap, hidden on mobile */}
                <a
                  href="tel:+78512000000"
                  className="hidden whitespace-nowrap text-sm font-medium text-slate-700 transition-colors hover:text-blue-900 dark:text-slate-300 lg:block"
                >
                  +7&nbsp;(8512)&nbsp;00-00-00
                </a>

                {/* Theme toggle with rotation animation */}
                <motion.button
                  onClick={toggleTheme}
                  className="relative shrink-0 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label="Переключить тему"
                  whileTap={{ scale: 0.85 }}
                >
                  <AnimatePresence mode="wait">
                    {resolvedTheme === "dark" ? (
                      <motion.svg
                        key="sun"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </motion.svg>
                    ) : (
                      <motion.svg
                        key="moon"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* AI Lawyer CTA — glowing pulsing button (hidden on mobile) */}
                <Link
                  href="#chat"
                  className="ai-glow-button relative hidden items-center gap-2 overflow-visible whitespace-nowrap rounded-full bg-blue-900 px-5 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl md:inline-flex dark:bg-blue-600"
                >
                  <svg
                    className="h-4 w-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <span className="whitespace-nowrap">ИИ-Юрист</span>
                </Link>

                {/* Mobile menu button */}
                <motion.button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="rounded-lg p-2 text-slate-700 xl:hidden dark:text-slate-300"
                  aria-label="Меню"
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        mobileMenuOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h16M4 18h16"
                      }
                    />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.nav
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden xl:hidden"
                >
                  <motion.div
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    exit={{ y: -10 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="flex flex-col gap-1 py-4"
                  >
                    {NAV_ITEMS.map((item, i) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block rounded-lg px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}

                    {/* Mobile CTA buttons */}
                    <div className="mt-4 flex flex-col gap-3 px-4">
                      <Link
                        href="#chat"
                        onClick={() => setMobileMenuOpen(false)}
                        className="ai-glow-button relative flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-blue-900 px-6 py-3 text-base font-medium text-white shadow-md dark:bg-blue-600"
                      >
                        <svg
                          className="h-5 w-5 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        <span className="whitespace-nowrap">ИИ-Юрист</span>
                      </Link>

                      <a
                        href="tel:+78512000000"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 border-sky-600 px-6 py-3 text-base font-medium text-sky-600 transition-colors hover:bg-sky-50 dark:border-sky-400 dark:text-sky-400"
                      >
                        <svg
                          className="h-5 w-5 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="whitespace-nowrap">
                          Обратный звонок
                        </span>
                      </a>
                    </div>
                  </motion.div>
                </motion.nav>
              )}
            </AnimatePresence>
          </div>
        </header>
      </Container>
    </div>
  );
}
