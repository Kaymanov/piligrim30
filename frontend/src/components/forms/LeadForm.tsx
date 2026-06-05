"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getCSRFToken, submitLead } from "@/lib/api";

type FormState = "idle" | "submitting" | "success" | "error";

interface LeadFormProps {
  sourcePage?: string;
  className?: string;
}

export function LeadForm({ sourcePage, className }: LeadFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    consent_accepted: false,
  });

  // Anti-bot fields
  const timestampRef = useRef<number>(Date.now());
  const interactedRef = useRef(false);
  const honeypotRef = useRef("");

  // Get CSRF token on mount
  useEffect(() => {
    getCSRFToken().catch(() => {});
  }, []);

  // Track user interaction
  useEffect(() => {
    const handler = () => {
      interactedRef.current = true;
    };
    document.addEventListener("mousemove", handler, { once: true });
    document.addEventListener("touchstart", handler, { once: true });
    document.addEventListener("keydown", handler, { once: true });
    return () => {
      document.removeEventListener("mousemove", handler);
      document.removeEventListener("touchstart", handler);
      document.removeEventListener("keydown", handler);
    };
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.phone.trim()) {
      newErrors.phone = "Введите номер телефона";
    } else if (!/^\+?[\d\s\-()]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    if (!formData.consent_accepted) {
      newErrors.consent = "Необходимо согласие на обработку данных";
    }

    if (formData.name && formData.name.trim().length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setState("submitting");
    setErrors({});

    try {
      await submitLead({
        name: formData.name || undefined,
        phone: formData.phone,
        message: formData.message || undefined,
        consent_accepted: formData.consent_accepted,
        source_page: sourcePage || window.location.href,
        website: honeypotRef.current, // honeypot
        _ts: timestampRef.current, // timestamp trap
        _hid: interactedRef.current ? "1" : "", // behavioral trap
      });
      setState("success");
    } catch (err: unknown) {
      setState("error");
      if (err && typeof err === "object" && "data" in err) {
        const apiErr = err as { data: Record<string, string[]> };
        if (apiErr.data) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, messages] of Object.entries(apiErr.data)) {
            if (Array.isArray(messages)) {
              fieldErrors[key] = messages[0];
            }
          }
          setErrors(fieldErrors);
        }
      }
    }
  };

  if (state === "success") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-2xl bg-green-50 p-8 text-center dark:bg-green-900/20 ${className}`}
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
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
          <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
            Заявка отправлена
          </h3>
          <p className="mt-2 text-green-700 dark:text-green-300">
            Юрист свяжется с вами в ближайшее время
          </p>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {/* Honeypot — hidden from users */}
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

      <div className="space-y-4">
        <Input
          label="Имя"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />

        <Input
          label="Телефон *"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          error={errors.phone}
          required
        />

        <Input
          label="Сообщение"
          type="text"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
        />

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.consent_accepted}
            onChange={(e) =>
              setFormData({ ...formData, consent_accepted: e.target.checked })
            }
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-sky-500"
          />
          <span className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Отправляя формы на данном сайте, вы даете{" "}
            <a href="/personal-data-consent" className="text-sky-600 hover:underline">
              согласие на обработку персональных данных
            </a>{" "}
            в соответствии с ФЗ от 27.07.2006 № 152-ФЗ. Отправляя свои данные, Вы соглашаетесь с{" "}
            <a href="/privacy-policy" className="text-sky-600 hover:underline">
              политикой конфиденциальности
            </a>
            . Также представляете право на осуществление оператору исходящих звонков на указанный Вами номер телефона.
          </span>
        </label>
        {errors.consent && (
          <p className="text-sm text-red-500">{errors.consent}</p>
        )}

        {state === "error" && !Object.keys(errors).length && (
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
          {state === "submitting" ? "Отправка..." : "Получить консультацию"}
        </Button>
      </div>
    </form>
  );
}
