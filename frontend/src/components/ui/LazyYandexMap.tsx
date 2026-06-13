"use client";

import { useState } from "react";

/**
 * Facade for the Yandex Maps widget.
 *
 * The real widget pulls ~400KB of third-party JS and blocks the main thread,
 * which was tanking LCP. We render a lightweight placeholder (static preview
 * image + button) and only mount the heavy iframe after the user clicks.
 * This is Google's recommended "facade" pattern for embeds.
 */
export function LazyYandexMap({
  constructorId,
  height = 300,
  title = "Карта",
}: {
  constructorId: string;
  height?: number;
  title?: string;
}) {
  const [active, setActive] = useState(false);

  const iframeSrc = `https://yandex.ru/map-widget/v1/?um=constructor%3A${constructorId}&source=constructor`;
  const staticSrc = `https://api-maps.yandex.ru/services/constructor/1.0/static/?um=constructor%3A${constructorId}&width=600&height=${height}&lang=ru_RU`;

  if (active) {
    return (
      <iframe
        src={iframeSrc}
        width="100%"
        height={height}
        frameBorder="0"
        className="w-full"
        title={title}
        loading="lazy"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className="group relative block w-full overflow-hidden"
      style={{ height }}
      aria-label="Загрузить интерактивную карту"
    >
      {/* Static map preview (single lightweight image, no JS) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={staticSrc}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* Overlay with play button */}
      <span className="absolute inset-0 flex items-center justify-center bg-slate-900/30 transition-colors group-hover:bg-slate-900/20">
        <span className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-slate-800 shadow-lg">
          <svg
            className="h-4 w-4 text-sky-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Показать карту
        </span>
      </span>
    </button>
  );
}
