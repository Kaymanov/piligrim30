"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendChatMessage, resetChat, type ChatResponse } from "@/lib/api";
import { MODAL_EVENTS } from "@/lib/modal-events";

interface Message {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Здравствуйте! Я ИИ-Юрист проекта «Правовой Пилигрим». Задайте вопрос о банкротстве, долгах или списании кредитов — постараюсь помочь.",
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for global open-chat events
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener(MODAL_EVENTS.OPEN_CHAT, handler);
    return () => window.removeEventListener(MODAL_EVENTS.OPEN_CHAT, handler);
  }, []);

  // Get quiz context from sessionStorage
  const getQuizContext = (): Record<string, string> | undefined => {
    try {
      const ctx = sessionStorage.getItem("quiz_context");
      return ctx ? JSON.parse(ctx) : undefined;
    } catch {
      return undefined;
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsTyping(true);

    try {
      const response: ChatResponse = await sendChatMessage(
        text,
        getQuizContext(),
      );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Извините, произошла ошибка. Попробуйте позже или оставьте заявку на сайте.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = async () => {
    try {
      await resetChat();
    } catch {
      /* ignore */
    }
    setMessages([WELCOME_MESSAGE]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setIsOpen(true)}
            className="ai-glow-button fixed bottom-6 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-900 text-white shadow-xl transition-transform hover:scale-105 md:hidden dark:bg-blue-600"
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
          </motion.button>
        )}
      </AnimatePresence>

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
                  <ChatBubble key={i} message={msg} />
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
                  onClick={handleSend}
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

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-blue-900 text-white dark:bg-blue-600"
            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
