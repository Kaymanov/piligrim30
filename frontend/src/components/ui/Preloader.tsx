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
 * Hides on a short fixed timer after mount (NOT window.load) so it never
 * delays LCP — the page content is server-rendered and ready immediately.
 */
export function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    // Matches the CSS auto-hide (starts 0.4s, done ~0.8s). JS handles final
    // unmount + restoring scroll; the CSS fade is what the user sees.
    const timer = window.setTimeout(() => setHidden(true), 800);
    return () => window.clearTimeout(timer);
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
          {/* Plain img (not next/image) — tiny webp, must appear instantly */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.webp"
            alt="Правовой Пилигрим"
            width={48}
            height={73}
            className="preloader-logo-img"
          />
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
