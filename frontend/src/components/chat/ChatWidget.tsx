"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { streamChatMessage, resetChat } from "@/lib/api";
import { MODAL_EVENTS, openCallback, openLeadModal } from "@/lib/modal-events";

interface Message {
  role: "user" | "assistant";
  content: string;
  showCta?: boolean;
  isStreaming?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "Можно ли списать микрозаймы?",
  "Что будет с квартирой при банкротстве?",
  "Сколько стоит банкротство?",
  "Какие последствия после банкротства?",
];

function getQuizContext(): Record<string, string> | undefined {
  try {
    const ctx = sessionStorage.getItem("quiz_context");
    return ctx ? JSON.parse(ctx) : undefined;
  } catch {
    return undefined;
  }
}

function getPersonalizedWelcome(): Message {
  const quiz = getQuizContext();
  if (quiz) {
    return {
      role: "assistant",
      content: `Здравствуйте! Вижу, что вы прошли квиз — сумма долга: ${quiz.debt_amount || "не указана"}, просрочки: ${quiz.has_overdue || "не указано"}. Могу подробнее разобрать вашу ситуацию. Задайте вопрос!`,
    };
  }
  return {
    role: "assistant",
    content:
      "Здравствуйте! Я ИИ-Юрист проекта «Правовой Пилигрим». Задайте вопрос о банкротстве, долгах или списании кредитов — постараюсь помочь.",
  };
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userMessageCount = useRef(0);

  // Initialize welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([getPersonalizedWelcome()]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for global open-chat events
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener(MODAL_EVENTS.OPEN_CHAT, handler);
    return () => window.removeEventListener(MODAL_EVENTS.OPEN_CHAT, handler);
  }, []);

  const handleSend = useCallback(
    async (text?: string) => {
      const msg = (text || input).trim();
      if (!msg || isTyping) return;

      setMessages((prev) => [...prev, { role: "user", content: msg }]);
      setInput("");
      setIsTyping(true);
      setShowSuggestions(false);
      userMessageCount.current += 1;

      const showCta =
        userMessageCount.current >= 3 && userMessageCount.current % 3 === 0;

      // Add empty streaming message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", showCta, isStreaming: true },
      ]);

      let accumulated = "";

      streamChatMessage(
        msg,
        getQuizContext(),
        (chunk) => {
          accumulated += chunk;
          setIsTyping(false);
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
              role: "assistant",
              content: accumulated,
              showCta,
              isStreaming: true,
            };
            return next;
          });
        },
        () => {
          setIsTyping(false);
          // Mark streaming complete
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
              ...next[next.length - 1],
              isStreaming: false,
            };
            return next;
          });
        },
        () => {
          setIsTyping(false);
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
              role: "assistant",
              content:
                "Извините, произошла ошибка. Попробуйте позже или оставьте заявку на сайте.",
              isStreaming: false,
            };
            return next;
          });
        },
      );
    },
    [input, isTyping],
  );

  const handleReset = async () => {
    try {
      await resetChat();
    } catch {
      /* */
    }
    setMessages([getPersonalizedWelcome()]);
    userMessageCount.current = 0;
    setShowSuggestions(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFeedback = (msgIndex: number, positive: boolean) => {
    // TODO: send feedback to backend (ChatLog update)
    setMessages((prev) => {
      const next = [...prev];
      next[msgIndex] = {
        ...next[msgIndex],
        content: next[msgIndex].content + (positive ? " ✓" : ""),
      };
      return next;
    });
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="ai-glow-button fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-900 text-white shadow-xl transition-transform hover:scale-105 md:hidden dark:bg-blue-600"
          aria-label="Открыть ИИ-Юрист"
        >
          <svg
            className="h-7 w-7"
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
        </button>
      )}

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 right-0 z-50 flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:bottom-6 sm:right-6 sm:h-[600px] sm:w-[400px] sm:rounded-3xl sm:border sm:border-slate-200 dark:bg-slate-900 dark:sm:border-slate-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-blue-900 px-4 py-3 text-white dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
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
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">ИИ-Юрист</p>
                  <p className="text-xs text-blue-200">Правовой Пилигрим</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="rounded-lg p-1.5 text-blue-200 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Сбросить чат"
                  title="Начать заново"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-blue-200 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Закрыть чат"
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
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <ChatBubble
                    key={i}
                    message={msg}
                    index={i}
                    onFeedback={handleFeedback}
                  />
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400 [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400 [animation-delay:300ms]" />
                    </span>
                    <span>Печатает...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Suggested questions */}
            {showSuggestions && messages.length <= 1 && (
              <div className="border-t border-slate-100 px-4 py-3 dark:border-slate-700">
                <p className="mb-2 text-xs text-slate-400">Частые вопросы:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-sky-100 hover:text-sky-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-sky-900/30 dark:hover:text-sky-400"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-center text-[10px] text-slate-400">
                ⚖️ Информация носит ознакомительный характер и не является
                юридической консультацией
              </p>
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Задайте вопрос..."
                  rows={1}
                  className="max-h-24 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-900 text-white transition-all hover:bg-blue-800 disabled:opacity-40 dark:bg-blue-600"
                  aria-label="Отправить"
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
                      d="M12 19V5m0 0l-7 7m7-7l7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface ChatBubbleProps {
  message: Message;
  index: number;
  onFeedback: (index: number, positive: boolean) => void;
}

function ChatBubble({ message, index, onFeedback }: ChatBubbleProps) {
  const isUser = message.role === "user";
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-blue-900 text-white dark:bg-blue-600"
            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
        }`}
      >
        {isUser ? (
          message.content
        ) : (
          <div className="prose prose-sm prose-slate max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}

      </div>

      {/* Feedback buttons — only for completed assistant messages */}
      {!isUser &&
        !message.isStreaming &&
        message.content &&
        !feedbackGiven &&
        index > 0 && (
          <div className="mt-1 flex gap-1">
            <button
              onClick={() => {
                onFeedback(index, true);
                setFeedbackGiven(true);
              }}
              className="rounded px-1.5 py-0.5 text-xs text-slate-400 transition-colors hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20"
              title="Полезно"
            >
              👍
            </button>
            <button
              onClick={() => {
                onFeedback(index, false);
                setFeedbackGiven(true);
              }}
              className="rounded px-1.5 py-0.5 text-xs text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
              title="Не полезно"
            >
              👎
            </button>
          </div>
        )}
      {feedbackGiven && !isUser && (
        <p className="mt-0.5 text-[10px] text-slate-300 dark:text-slate-600">
          Спасибо за отзыв
        </p>
      )}

      {/* CTA after 3 messages — call or form */}
      {message.showCta && !message.isStreaming && (
        <div className="mt-2 max-w-[85%] space-y-2 rounded-xl border border-sky-200 bg-sky-50 p-3 dark:border-sky-800 dark:bg-sky-900/20">
          <p className="text-xs font-medium text-sky-800 dark:text-sky-300">
            💡 Для детального разбора рекомендую связаться с юристом:
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="tel:+79965057050"
              className="inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-sky-700"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Позвонить
            </a>
            <button
              onClick={() => openLeadModal()}
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-300 bg-white px-3 py-1.5 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-50 dark:border-sky-700 dark:bg-slate-800 dark:text-sky-400"
            >
              Оставить заявку
            </button>
            <button
              onClick={() => openCallback()}
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-300 bg-white px-3 py-1.5 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-50 dark:border-sky-700 dark:bg-slate-800 dark:text-sky-400"
            >
              Обратный звонок
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
