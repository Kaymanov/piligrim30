"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { getCSRFToken, submitQuizLead } from "@/lib/api";

// Questions with icon for each option
const QUESTIONS = [
  {
    id: "debt_amount",
    question: "Какая общая сумма ваших долгов?",
    options: [
      { label: "До 300 000 ₽", value: "до 300 000", icon: "💳" },
      { label: "300 000 — 500 000 ₽", value: "300 000 — 500 000", icon: "💰" },
      {
        label: "500 000 — 1 000 000 ₽",
        value: "500 000 — 1 000 000",
        icon: "📊",
      },
      { label: "Более 1 000 000 ₽", value: "более 1 000 000", icon: "🏦" },
    ],
  },
  {
    id: "has_overdue",
    question: "Есть ли у вас просрочки по платежам?",
    options: [
      { label: "Да, более 3 месяцев", value: "да, более 3 мес", icon: "🔴" },
      { label: "Да, менее 3 месяцев", value: "да, менее 3 мес", icon: "🟡" },
      { label: "Нет просрочек", value: "нет", icon: "✅" },
    ],
  },
  {
    id: "has_enforcement",
    question: "Есть ли исполнительные производства?",
    options: [
      { label: "Да, есть", value: "да", icon: "⚖️" },
      { label: "Нет", value: "нет", icon: "🙌" },
      { label: "Не знаю", value: "не знаю", icon: "❓" },
    ],
  },
  {
    id: "has_property",
    question: "Есть ли у вас имущество?",
    options: [
      { label: "Единственное жильё", value: "единственное жильё", icon: "🏠" },
      { label: "Несколько объектов", value: "несколько объектов", icon: "🏘️" },
      { label: "Автомобиль", value: "автомобиль", icon: "🚗" },
      { label: "Нет имущества", value: "нет", icon: "📦" },
    ],
  },
  {
    id: "has_mortgage",
    question: "Есть ли ипотека?",
    options: [
      { label: "Да", value: "да", icon: "🔑" },
      { label: "Нет", value: "нет", icon: "🆓" },
    ],
  },
  {
    id: "income_type",
    question: "Какой у вас доход?",
    options: [
      {
        label: "Официальная зарплата",
        value: "официальная зарплата",
        icon: "💼",
      },
      { label: "Неофициальный доход", value: "неофициальный", icon: "🤝" },
      { label: "Пенсия / пособие", value: "пенсия/пособие", icon: "🏛️" },
      { label: "Нет дохода", value: "нет дохода", icon: "🚫" },
    ],
  },
];

type QuizState = "quiz" | "contact" | "submitting" | "success" | "error";

export function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [state, setState] = useState<QuizState>("quiz");
  const [contactData, setContactData] = useState({ name: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const timestampRef = useRef(Date.now());
  const interactedRef = useRef(false);
  const honeypotRef = useRef("");

  useEffect(() => {
    getCSRFToken().catch(() => {});
    const handler = () => {
      interactedRef.current = true;
    };
    document.addEventListener("mousemove", handler, { once: true });
    document.addEventListener("touchstart", handler, { once: true });
    document.addEventListener("click", handler, { once: true });
    document.addEventListener("keydown", handler, { once: true });
    return () => {
      document.removeEventListener("mousemove", handler);
      document.removeEventListener("touchstart", handler);
      document.removeEventListener("click", handler);
      document.removeEventListener("keydown", handler);
    };
  }, []);

  const totalSteps = QUESTIONS.length;
  const progressPercent = (currentStep / totalSteps) * 100;

  const handleAnswer = (questionId: string, value: string) => {
    interactedRef.current = true;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep((s) => s + 1), 300);
    } else {
      setTimeout(() => setState("contact"), 300);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!contactData.phone.trim()) {
      newErrors.phone = "Введите номер телефона";
    } else if (!/^\+?[\d\s\-()]{7,20}$/.test(contactData.phone.trim())) {
      newErrors.phone = "Введите корректный номер телефона";
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
      await submitQuizLead({
        name: contactData.name || undefined,
        phone: contactData.phone,
        debt_amount: answers.debt_amount || "",
        consent_accepted: true,
        source_page: window.location.href,
        website: honeypotRef.current,
        _ts: timestampRef.current,
        _hid: interactedRef.current ? "1" : "",
      });
      setState("success");
    } catch (err: unknown) {
      setState("error");
      if (err && typeof err === "object" && "data" in err) {
        const apiErr = err as { data: Record<string, string[]> };
        const messages: string[] = [];
        if (apiErr.data) {
          for (const [key, val] of Object.entries(apiErr.data)) {
            const msg = Array.isArray(val) ? val[0] : String(val);
            messages.push(`${key}: ${msg}`);
          }
        }
        setErrors({
          server:
            messages.join("; ") || "Произошла ошибка. Попробуйте ещё раз.",
        });
      } else {
        setErrors({ server: "Произошла ошибка. Попробуйте ещё раз." });
      }
    }
  };

  useEffect(() => {
    if (state === "success") {
      try {
        sessionStorage.setItem("quiz_context", JSON.stringify(answers));
      } catch {
        /* ignore */
      }
    }
  }, [state, answers]);

  return (
    <SectionWrapper
      title="Проверьте, подходит ли вам банкротство"
      subtitle="Ответьте на 6 вопросов — это займёт 1 минуту"
      bg="slate"
      id="quiz"
    >
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          {/* Step indicator */}
          {state === "quiz" && (
            <div className="border-b border-slate-100 px-6 pt-6 pb-4 dark:border-slate-700">
              <div className="flex items-center justify-between">
                {QUESTIONS.map((_, i) => (
                  <div key={i} className="flex flex-1 items-center">
                    {/* Step circle */}
                    <motion.div
                      className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                        i < currentStep
                          ? "bg-sky-500 text-white"
                          : i === currentStep
                            ? "bg-blue-900 text-white shadow-lg shadow-blue-900/30 dark:bg-blue-500"
                            : "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500"
                      }`}
                      animate={
                        i === currentStep
                          ? { scale: [1, 1.15, 1] }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.3 }}
                    >
                      {i < currentStep ? (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span>{i + 1}</span>
                      )}
                    </motion.div>
                    {/* Connector line */}
                    {i < QUESTIONS.length - 1 && (
                      <div className="mx-1 flex-1">
                        <div className="h-0.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                          <motion.div
                            className="h-full bg-sky-500"
                            initial={{ width: "0%" }}
                            animate={{ width: i < currentStep ? "100%" : "0%" }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {state === "quiz" && (
                <QuizQuestion
                  key={currentStep}
                  question={QUESTIONS[currentStep]}
                  stepNumber={currentStep + 1}
                  selectedValue={answers[QUESTIONS[currentStep].id]}
                  onAnswer={handleAnswer}
                />
              )}

              {state === "contact" && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="mb-6 text-center text-lg font-medium text-slate-700 dark:text-slate-200">
                    Оставьте телефон — юрист оценит вашу ситуацию
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                    <input
                      type="text"
                      placeholder="Имя"
                      value={contactData.name}
                      onChange={(e) =>
                        setContactData({ ...contactData, name: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600"
                    />
                    <div>
                      <input
                        type="tel"
                        placeholder="Телефон *"
                        value={contactData.phone}
                        onChange={(e) =>
                          setContactData({
                            ...contactData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600"
                        required
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    {(errors.server !== undefined) && (
                      <p className="text-sm text-red-500">
                        {errors.server || "Произошла ошибка"}
                      </p>
                    )}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      Получить оценку ситуации
                    </Button>
                    <p className="text-center text-xs text-slate-400">
                      Нажимая кнопку, вы соглашаетесь на обработку персональных
                      данных
                    </p>
                  </form>
                </motion.div>
              )}

              {state === "submitting" && (
                <motion.div
                  key="submitting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center py-10"
                >
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500" />
                  <p className="mt-4 text-slate-500">Отправляем...</p>
                </motion.div>
              )}

              {state === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center py-10 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
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
                  <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                    Заявка отправлена!
                  </h3>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Юрист свяжется с вами в ближайшее время
                  </p>
                </motion.div>
              )}

              {state === "error" && !errors.server && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center py-10 text-center"
                >
                  <p className="text-red-500">
                    Произошла ошибка. Попробуйте ещё раз.
                  </p>
                  <Button
                    variant="secondary"
                    className="mt-4"
                    onClick={() => setState("contact")}
                  >
                    Попробовать снова
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

interface QuizQuestionProps {
  question: {
    id: string;
    question: string;
    options: { label: string; value: string; icon: string }[];
  };
  selectedValue?: string;
  onAnswer: (questionId: string, value: string) => void;
  stepNumber: number;
}

function QuizQuestion({
  question,
  selectedValue,
  onAnswer,
  stepNumber,
}: QuizQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Decorative step number */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-5xl font-extrabold leading-none text-slate-100 dark:text-slate-700">
          {String(stepNumber).padStart(2, "0")}
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-sky-500">
          Вопрос {stepNumber} из {QUESTIONS.length}
        </span>
      </div>

      {/* Question */}
      <h3 className="mb-6 text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
        {question.question}
      </h3>

      {/* Option cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onAnswer(question.id, option.value)}
              className={`group relative flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200 sm:flex-col sm:items-start sm:gap-2 sm:py-5 ${
                isSelected
                  ? "border-sky-500 bg-sky-50 shadow-md shadow-sky-500/10 dark:border-sky-400 dark:bg-sky-900/30"
                  : "border-slate-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50/50 hover:shadow-md dark:border-slate-600 dark:hover:border-sky-700 dark:hover:bg-sky-900/10"
              }`}
            >
              {/* Icon */}
              <span className="text-2xl sm:text-3xl">{option.icon}</span>

              {/* Label */}
              <span
                className={`text-sm font-semibold sm:text-base ${
                  isSelected
                    ? "text-sky-700 dark:text-sky-300"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {option.label}
              </span>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 sm:right-3 sm:top-3"
                >
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
