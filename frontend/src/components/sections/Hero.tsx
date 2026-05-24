"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

// 4 floating glassmorphic feature cards
const FEATURES = [
  {
    title: "Списание долгов навсегда",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="h-full w-full">
        {/* Stack of coins/bills */}
        <ellipse cx="32" cy="48" rx="20" ry="6" fill="url(#g1)" opacity="0.3" />
        <rect
          x="14"
          y="32"
          width="36"
          height="14"
          rx="3"
          fill="url(#g1)"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        <rect
          x="18"
          y="22"
          width="36"
          height="14"
          rx="3"
          fill="url(#g1)"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        <rect
          x="14"
          y="14"
          width="36"
          height="14"
          rx="3"
          fill="url(#g2)"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        <circle
          cx="32"
          cy="21"
          r="4"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        <text
          x="32"
          y="24"
          textAnchor="middle"
          fill="#38bdf8"
          fontSize="6"
          fontWeight="bold"
        >
          $
        </text>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
          <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    title: "Полная защита от коллекторов",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="h-full w-full">
        {/* Gavel + shield */}
        <path
          d="M14 50 L50 14 L54 18 L18 54 Z"
          fill="url(#g3)"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        <rect
          x="42"
          y="10"
          width="14"
          height="14"
          rx="2"
          transform="rotate(45 49 17)"
          fill="url(#g3)"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        <path
          d="M40 32 L48 30 L48 42 L40 46 Z"
          fill="url(#g4)"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        <path
          d="M48 30 L56 32 L56 44 L48 42 Z"
          fill="url(#g4)"
          stroke="#38bdf8"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <defs>
          <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <linearGradient id="g4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    title: "Сохранение имущества и качества жизни",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="h-full w-full">
        {/* House isometric */}
        <path
          d="M32 12 L52 22 L52 44 L32 54 L12 44 L12 22 Z"
          fill="url(#g5)"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        <path
          d="M32 12 L52 22 L32 32 L12 22 Z"
          fill="url(#g6)"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        <path
          d="M32 32 L52 22 L52 44 L32 54 Z"
          fill="url(#g5)"
          stroke="#38bdf8"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <rect
          x="28"
          y="38"
          width="8"
          height="12"
          fill="#0ea5e9"
          opacity="0.5"
        />
        <defs>
          <linearGradient id="g5" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
          <linearGradient id="g6" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    title: "Скидка при оформлении заявки через сайт",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="h-full w-full">
        {/* Discount tag with percent */}
        <path
          d="M14 14 L36 14 L52 30 L30 52 L14 36 Z"
          fill="url(#g7)"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        <circle
          cx="22"
          cy="22"
          r="3"
          fill="#0c4a6e"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        <line
          x1="26"
          y1="38"
          x2="38"
          y2="26"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="28" cy="36" r="2" fill="#38bdf8" />
        <circle cx="36" cy="28" r="2" fill="#38bdf8" />
        <defs>
          <linearGradient id="g7" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
];

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-slate-950 text-white transition-colors duration-700 dark:bg-slate-950"
      style={{
        // Subtle dark→light gradient transition support via CSS variables
        background:
          "linear-gradient(135deg, var(--hero-bg-start, #0f172a) 0%, var(--hero-bg-mid, #1e1b4b) 50%, var(--hero-bg-end, #0c4a6e) 100%)",
      }}
    >
      {/* Animated background mesh */}
      <div className="pointer-events-none absolute inset-0">
        {/* Glowing orbs */}
        <motion.div
          className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-32 top-1/2 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          }}
        />

        {/* Bottom flowing waves */}
        <svg
          className="absolute inset-x-0 bottom-0 h-48 w-full opacity-30"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C320,180 720,40 1440,120 L1440,200 L0,200 Z"
            fill="url(#wave1)"
          />
          <path
            d="M0,140 C480,80 960,180 1440,100 L1440,200 L0,200 Z"
            fill="url(#wave2)"
            opacity="0.6"
          />
          <defs>
            <linearGradient id="wave1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="wave2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <Container className="relative z-10">
        <div className="grid items-center gap-12 py-16 md:py-20 lg:grid-cols-2 lg:gap-8 lg:py-28">
          {/* Left: text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl"
            >
              Банкротство физических лиц и иные юридические услуги в Астрахани
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base leading-relaxed text-slate-300 sm:text-lg"
            >
              Поможем законно разобраться с долгами, подготовить документы и
              пройти процедуру с юридическим сопровождением.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-base font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/50"
              >
                Получить консультацию
              </a>
              <a
                href="#quiz"
                className="inline-flex items-center justify-center rounded-full border-2 border-sky-400/60 bg-sky-400/5 px-8 py-4 text-base font-medium text-sky-300 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-400/10"
              >
                Проверить, подходит ли мне
              </a>
            </motion.div>
          </motion.div>

          {/* Right: floating glass cards */}
          <div className="relative h-[500px] lg:h-[600px]">
            {FEATURES.map((feature, i) => (
              <FloatingCard key={feature.title} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </Container>

      {/* Light mode override */}
      <style jsx>{`
        :global(html:not(.dark)) section {
          --hero-bg-start: #1e3a8a;
          --hero-bg-mid: #2563eb;
          --hero-bg-end: #0284c7;
        }
      `}</style>
    </section>
  );
}

interface FloatingCardProps {
  feature: { title: string; icon: React.ReactNode };
  index: number;
}

/** Glass card with floating wave animation */
function FloatingCard({ feature, index }: FloatingCardProps) {
  // 4 cards in 2x2 grid with staggered offsets
  const positions = [
    { top: "0%", left: "10%" }, // top-left
    { top: "10%", right: "0%" }, // top-right
    { bottom: "10%", left: "0%" }, // bottom-left
    { bottom: "0%", right: "10%" }, // bottom-right
  ];

  const position = positions[index];

  return (
    <motion.div
      className="absolute w-[60%] max-w-[280px]"
      style={position}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
    >
      <motion.div
        animate={{
          y: [0, -10, 0, 8, 0],
        }}
        transition={{
          duration: 4 + index * 0.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.5,
        }}
        whileHover={{ scale: 1.05 }}
      >
        <div className="group relative rounded-3xl border border-white/20 bg-white/5 p-5 backdrop-blur-md shadow-xl shadow-blue-900/30 transition-all hover:border-sky-400/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-sky-500/30">
          {/* Glow on hover */}
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-sky-400/0 via-blue-500/0 to-violet-500/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:from-sky-400/30 group-hover:via-blue-500/30 group-hover:to-violet-500/30 group-hover:opacity-100" />

          <div className="mx-auto h-20 w-20">{feature.icon}</div>
          <p className="mt-3 text-center text-sm font-semibold uppercase tracking-wide text-white">
            {feature.title}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
