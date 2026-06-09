"use client";

import { useEffect, useState } from "react";

/**
 * Full-screen branded preloader overlay.
 *
 * Rendered in the root layout, so its markup is part of the initial SSR
 * response — it appears INSTANTLY on a dark background (no flash), unlike
 * `loading.tsx` which only triggers for Suspense/dynamic route loading.
 *
 * Animations are pure CSS so the bar/logo move even before hydration.
 * After `window.load` (with a small minimum display time) it fades out and
 * unmounts, revealing the page.
 */
export function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const MIN_DISPLAY = 700; // ms — guarantee the animation is seen
    const start = performance.now();

    const finish = () => {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_DISPLAY - elapsed);
      window.setTimeout(() => setHidden(true), wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      // Safety fallback in case `load` is delayed/never fires
      const fallback = window.setTimeout(finish, 3500);
      return () => {
        window.removeEventListener("load", finish);
        window.clearTimeout(fallback);
      };
    }
  }, []);

  // Unmount after the fade-out transition completes
  useEffect(() => {
    if (!hidden) return;
    const t = window.setTimeout(() => setRemoved(true), 600);
    return () => window.clearTimeout(t);
  }, [hidden]);

  // Re-enable scroll once gone
  useEffect(() => {
    if (removed) {
      document.documentElement.style.overflow = "";
    } else {
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [removed]);

  if (removed) return null;

  return (
    <div
      className={`preloader-overlay ${hidden ? "preloader-hidden" : ""}`}
      aria-hidden="true"
    >
      {/* Top progress bar */}
      <div className="preloader-bar-track">
        <div className="preloader-bar" />
      </div>

      {/* Centered brand */}
      <div className="preloader-center">
        <div className="preloader-logo-ring">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="preloader-logo-icon"
          >
            {/* Scales of justice */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v18M5 7h14M7 7l-3 6a3 3 0 006 0L7 7zm10 0l-3 6a3 3 0 006 0l-3-6zM8 21h8"
            />
          </svg>
        </div>
        <p className="preloader-title">Правовой Пилигрим</p>
        <div className="preloader-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
