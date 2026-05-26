"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

// Mock data — will be replaced with API call later
const MOCK_REVIEWS = [
  {
    id: 1,
    author_name: "Алексей М.",
    rating: 5,
    text: "Обратился с долгом более 900 тысяч. Юристы всё объяснили на первой консультации, помогли собрать документы. Через 8 месяцев все долги списали. Очень благодарен за профессиональный подход.",
    source: "Яндекс Карты",
    created_at: "2025-11-15",
  },
  {
    id: 2,
    author_name: "Елена К.",
    rating: 5,
    text: "Долго боялась обращаться, думала что банкротство — это что-то страшное. Оказалось, что процедура понятная и предсказуемая. Спасибо команде за поддержку на каждом этапе!",
    source: "2ГИС",
    created_at: "2025-10-22",
  },
  {
    id: 3,
    author_name: "Дмитрий В.",
    rating: 5,
    text: "Приставы арестовали все счета, удерживали 50% зарплаты. После обращения в Правовой Пилигрим аресты сняли, а через полгода списали все долги. Рекомендую!",
    source: "Яндекс Карты",
    created_at: "2025-09-08",
  },
  {
    id: 4,
    author_name: "Ирина С.",
    rating: 5,
    text: "У меня было 7 микрозаймов и 2 кредитные карты. Коллекторы звонили каждый день. Юристы быстро подали на банкротство, звонки прекратились сразу. Через 6 месяцев — свобода от долгов.",
    source: "Zoon",
    created_at: "2025-08-30",
  },
  {
    id: 5,
    author_name: "Сергей Н.",
    rating: 4,
    text: "Хороший сервис, всё прозрачно. Единственное — процедура заняла чуть дольше, чем ожидал (10 месяцев вместо 8). Но результат отличный — 1.5 млн списано.",
    source: "2ГИС",
    created_at: "2025-07-14",
  },
  {
    id: 6,
    author_name: "Наталья Г.",
    rating: 5,
    text: "Переживала за квартиру — единственное жильё. Юристы сразу успокоили, объяснили что она защищена. Так и вышло. Долги списаны, квартира на месте. Спасибо огромное!",
    source: "Яндекс Карты",
    created_at: "2025-06-20",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-amber-400" : "text-slate-200 dark:text-slate-600"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function Reviews() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <SectionWrapper
      title="Отзывы клиентов"
      subtitle="Реальные отзывы с внешних площадок"
      bg="slate"
      id="reviews"
    >
      <div
        ref={ref}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {MOCK_REVIEWS.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ willChange: "transform, opacity" }}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            {/* Header: name + rating */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">
                  {review.author_name}
                </p>
                <StarRating rating={review.rating} />
              </div>
              {/* Source badge */}
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                {review.source}
              </span>
            </div>

            {/* Text */}
            <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {review.text}
            </p>

            {/* Date */}
            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
              {new Date(review.created_at).toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
