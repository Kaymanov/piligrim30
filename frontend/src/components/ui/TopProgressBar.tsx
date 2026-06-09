"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Top progress bar — shows during page transitions.
 * Animates from 0 → 90% quickly, then completes. Bright gradient + glow
 * so it stays visible on both light and dark backgrounds.
 */
export function TopProgressBar() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed left-0 top-0 z-[100] h-1 w-full"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="h-full rounded-r-full bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 shadow-[0_0_12px_2px_rgba(56,189,248,0.7)]"
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "70%", "100%"] }}
            transition={{
              duration: 0.85,
              times: [0, 0.6, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
