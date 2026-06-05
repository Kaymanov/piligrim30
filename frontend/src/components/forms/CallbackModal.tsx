"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { getCSRFToken, submitCallback } from "@/lib/api";
import { MODAL_EVENTS } from "@/lib/modal-events";

type State = "idle" | "submitting" | "success" | "error";

export function CallbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [data, setData] = useState({ name: "", phone: "", preferredTime: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const timestampRef = useRef(Date.now());
  const interactedRef = useRef(false);
  const honeypotRef = useRef("");

  // Listen for open events
  useEffect(() => {
    const handler = () => {
      setIsOpen(true);
      timestampRef.current = Date.now();
      setState("idle");
      setErrors({});
    };
    window.addEventListener(MODAL_EVENTS.OPEN_CALLBACK, handler);
    return () =>
      window.removeEventListener(MODAL_EVENTS.OPEN_CALLBACK, handler);
  }, []);

  // Get CSRF + track interaction
  useEffect(() => {
    if (!isOpen) return;
    getCSRFToken().catch(() => {});
    const handler = () => {
      interactedRef.current = true;
    };
    document.addEventListener("mousemove", handler, { once: true });
    document.addEventListener("touchstart", handler, { once: true });
    document.addEventListener("click", handler, { once: true });
    return () => {
      document.removeEventListener("mousemove", handler);
      document.removeEventListener("touchstart", handler);
      document.removeEventListener("click", handler);
    };
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!data.phone.trim()) newErrors.phone = "Введите номер телефона";
    else if (!/^\+?[\d\s\-()]{7,20}$/.test(data.phone.trim()))
      newErrors.phone = "Введите корректный номер";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setState("submitting");
    try {
      await submitCallback({
        name: data.name || undefined,
        phone: data.phone,
        message: data.preferredTime
          ? `Удобное время: ${data.preferredTime}`
          : undefined,
        consent_accepted: true,
        source_page: window.location.href,
        website: honeypotRef.current,
        _ts: timestampRef.current,
        _hid: interactedRef.current ? "1" : "",
      });
      setState("success");
    } catch {
      setState("error");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setData({ name: "", phone: "", preferredTime: "" });
      setState("idle");
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-blue-900 px-6 py-4 text-white dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-lg font-bold">Заказать обратный звонок</h3>
              <button
                onClick={handleClose}
                className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
                aria-label="Закрыть"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {state === "success" ? (
                <div className="py-4 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h4 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                    Спасибо!
                  </h4>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Юрист перезвонит в указанное время или в ближайшее свободное
                    окно.
                  </p>
                  <Button
                    variant="secondary"
                    className="mt-6"
                    onClick={handleClose}
                  >
                    Закрыть
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Оставьте номер — юрист перезвонит для бесплатной
                    консультации.
                  </p>

                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    className="absolute -left-[9999px] opacity-0"
                    onChange={(e) => {
                      honeypotRef.current = e.target.value;
                    }}
                  />

                  <div>
                    <input
                      type="text"
                      placeholder="Имя"
                      value={data.name}
                      onChange={(e) =>
                        setData({ ...data, name: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Телефон *"
                      value={data.phone}
                      onChange={(e) =>
                        setData({ ...data, phone: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600"
                      required
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Удобное время (необязательно)"
                      value={data.preferredTime}
                      onChange={(e) =>
                        setData({ ...data, preferredTime: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600"
                    />
                  </div>

                  {state === "error" && (
                    <p className="text-sm text-red-500">
                      Произошла ошибка. Попробуйте ещё раз.
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={state === "submitting"}
                  >
                    Заказать звонок
                  </Button>

                  <p className="text-center text-xs leading-relaxed text-slate-400">
                    Отправляя формы на данном сайте, вы даете{" "}
                    <a href="/personal-data-consent" className="text-sky-600 hover:underline">согласие на обработку персональных данных</a>{" "}
                    в соответствии с ФЗ от 27.07.2006 № 152-ФЗ. Отправляя свои данные, Вы соглашаетесь с{" "}
                    <a href="/privacy-policy" className="text-sky-600 hover:underline">политикой конфиденциальности</a>.
                    Также представляете право на осуществление оператору исходящих звонков на указанный Вами номер телефона.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
