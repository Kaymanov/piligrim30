"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { getCSRFToken, submitQuizLead } from "@/lib/api";

// Quiz questions with answer options
const QUESTIONS = [
  {
    id: "debt_amount",
    question: "Какая общая сумма ваших долгов?",
    options: [
      { label: "До 300 000 ₽", value: "до 300 000" },
      { label: "300 000 — 500 000 ₽", value: "300 000 — 500 000" },
      { label: "500 000 — 1 000 000 ₽", value: "500 000 — 1 000 000" },
      { label: "Более 1 000 000 ₽", value: "более 1 000 000" },
    ],
  },
  {
    id: "has_overdue",
    question: "Есть ли у вас просрочки по платежам?",
    options: [
      { label: "Да, более 3 месяцев", value: "да, более 3 мес" },
      { label: "Да, менее 3 месяцев", value: "да, менее 3 мес" },
      { label: "Нет просрочек", value: "нет" },
    ],
  },
  {
    id: "has_enforcement",
    question: "Есть ли исполнительные производства?",
    options: [
      { label: "Да, есть", value: "да" },
      { label: "Нет", value: "нет" },
      { label: "Не знаю", value: "не знаю" },
    ],
  },
  {
    id: "has_property",
    question: "Есть ли у вас имущество?",
    options: [
      { label: "Единственное жильё", value: "единственное жильё" },
      { label: "Несколько объектов", value: "несколько объектов" },
      { label: "Автомобиль", value: "автомобиль" },
      { label: "Нет имущества", value: "нет" },
    ],
  },
  {
    id: "has_mortgage",
    question: "Есть ли ипотека?",
    options: [
      { label: "Да", value: "да" },
      { label: "Нет", value: "нет" },
    ],
  },
  {
    id: "income_type",
    question: "Какой у вас доход?",
    options: [
      { label: "Официальная зарплата", value: "официальная зарплата" },
      { label: "Неофициальный доход", value: "неофициальный" },
      { label: "Пенсия / пособие", value: "пенсия/пособие" },
      { label: "Нет дохода", value: "нет дохода" },
    ],
  },
];

type QuizState = "quiz" | "contact" | "submitting" | "success" | "error";

export function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [state, setState] = useState<QuizState>("quiz");
  const [contactData, setContactData] = useState({ name: "", phone: "" });
  const [error, setError] = useState("");

  // Anti-bot
  const timestampRef = useRef(Date.now());
  const interactedRef = useRef(false);

  useEffect(() => {
    getCSRFToken().catch(() => {});
    const handler = () => {
      interactedRef.current = true;
    };
    document.addEventListener("mousemove", handler, { once: true });
    document.addEventListener("touchstart", handler, { once: true });
    return () => {
      document.removeEventListener("mousemove", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  const totalSteps = QUESTIONS.length + 1; // +1 for contact form
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleAnswer = (questionId: string, value: string) => {
    interactedRef.current = true; // Mark as interacted on any click
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Auto-advance to next question
    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep((s) => s + 1), 300);
    } else {
      setTimeout(() => setState("contact"), 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.phone.trim()) {
      setError("Введите номер телефона");
      return;
    }
    if (!/^\+?[\d\s\-()]{7,20}$/.test(contactData.phone.trim())) {
      setError("Введите корректный номер телефона");
      return;
    }

    setState("submitting");
    setError("");

    try {
      await submitQuizLead({
        name: contactData.name || undefined,
        phone: contactData.phone,
        debt_amount: answers.debt_amount || "",
        consent_accepted: true,
        source_page: window.location.href,
        _ts: timestampRef.current,
        _hid: interactedRef.current ? "1" : "",
      });
      setState("success");
    } catch {
      setState("error");
      setError("Произошла ошибка. Попробуйте ещё раз.");
    }
  };

  // Store quiz context for AI chat
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
        {/* Card container */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-400 to-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {state === "quiz" && (
                <QuizQuestion
                  key={currentStep}
                  question={QUESTIONS[currentStep]}
                  selectedValue={answers[QUESTIONS[currentStep].id]}
                  onAnswer={handleAnswer}
                  stepNumber={currentStep + 1}
                  totalSteps={QUESTIONS.length}
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
                    Оставьте телефон — юрист оценит вашу ситуацию и подскажет
                    возможные варианты
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Имя"
                      value={contactData.name}
                      onChange={(e) =>
                        setContactData({ ...contactData, name: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600"
                    />
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
                      className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600"
                      required
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
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
                  className="flex flex-col items-center py-8"
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
                  className="flex flex-col items-center py-8 text-center"
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

              {state === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center py-8 text-center"
                >
                  <p className="text-red-500">{error}</p>
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
    options: { label: string; value: string }[];
  };
  selectedValue?: string;
  onAnswer: (questionId: string, value: string) => void;
  stepNumber: number;
  totalSteps: number;
}

function QuizQuestion({
  question,
  selectedValue,
  onAnswer,
  stepNumber,
  totalSteps,
}: QuizQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Step counter */}
      <p className="mb-2 text-sm font-medium text-sky-600 dark:text-sky-400">
        Вопрос {stepNumber} из {totalSteps}
      </p>

      {/* Question */}
      <h3 className="mb-6 text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
        {question.question}
      </h3>

      {/* Options as tiles */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswer(question.id, option.value)}
            className={`rounded-xl border-2 px-4 py-4 text-left text-sm font-medium transition-all duration-200 sm:text-base ${
              selectedValue === option.value
                ? "border-sky-500 bg-sky-50 text-sky-700 dark:border-sky-400 dark:bg-sky-900/30 dark:text-sky-300"
                : "border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50/50 dark:border-slate-600 dark:text-slate-300 dark:hover:border-sky-500/50 dark:hover:bg-sky-500/10"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
