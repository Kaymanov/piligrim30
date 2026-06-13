/**
 * Wraps page content with a subtle fade + slide-up entrance.
 *
 * Uses a pure-CSS animation (not framer-motion) so it runs at first paint
 * without waiting for hydration. A JS/opacity-0 gate here would hide the LCP
 * element until hydration and add seconds of render delay to LCP.
 *
 * Server Component — no "use client" needed.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
