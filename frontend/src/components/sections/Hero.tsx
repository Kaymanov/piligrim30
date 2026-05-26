"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { openLeadModal } from "@/lib/modal-events";

// Feature cards with image icons
const FEATURES = [
  { title: "Списание долгов навсегда", icon: "/images/icon/Money.svg" },
  {
    title: "Полная защита от коллекторов",
    icon: "/images/icon/Shield-protected.svg",
  },
  {
    title: "Сохранение имущества",
    icon: "/images/icon/Home-heart.svg",
  },
  {
    title: "Скидка при оформлении заявки через сайт",
    icon: "/images/icon/Sale%232.svg",
  },
];

export function Hero() {
  return (
    <section className="hero-section relative overflow-hidden text-white transition-colors duration-700">
      {/* Animated background mesh */}
      <div className="pointer-events-none absolute inset-0">
        {/* Glowing orbs */}
        <motion.div
          className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-32 top-1/2 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
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
        <div className="grid items-center gap-10 py-12 md:py-16 lg:grid-cols-2 lg:gap-8 lg:py-24">
          {/* Left: text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl"
            >
              Банкротство граждан и иные юридические услуги в Астрахани
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
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
            >
              <button
                onClick={openLeadModal}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-base font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/50"
              >
                Получить консультацию
              </button>
              <a
                href="#quiz"
                className="inline-flex items-center justify-center rounded-full border-2 border-sky-400/60 bg-sky-400/5 px-8 py-4 text-base font-medium text-sky-300 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-400/10"
              >
                Проверить, подходит ли мне
              </a>
            </motion.div>
          </motion.div>

          {/* Right: orbital cards around lotus man */}
          <OrbitalShowcase />
        </div>
      </Container>
    </section>
  );
}

/**
 * Lotus man centered with 4 cards orbiting around him.
 * Fully responsive: relative units, container-based sizing.
 */
function OrbitalShowcase() {
  return (
    <div className="orbital-stage relative mx-auto aspect-square w-full max-w-[28rem] sm:max-w-[32rem] lg:max-w-[36rem]">
      {/* Subtle radial glow behind man */}
      <div className="absolute inset-[15%] rounded-full bg-gradient-to-br from-sky-500/20 via-blue-500/20 to-violet-500/20 blur-2xl" />

      {/* Lotus man — centered */}
      <motion.div
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-[16rem] w-[16rem] sm:h-[18rem] sm:w-[18rem] lg:h-[22rem] lg:w-[22rem]"
        >
          <Image
            src="/images/man.png"
            alt="Юрист в позе медитации"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 352px"
          />
        </motion.div>
      </motion.div>

      {/* Orbital cards — 4 corners */}
      {FEATURES.map((feature, i) => (
        <OrbitalCard key={feature.title} feature={feature} index={i} />
      ))}
    </div>
  );
}

interface OrbitalCardProps {
  feature: { title: string; icon: string };
  index: number;
}

/**
 * Card positioned in a corner with floating orbital motion.
 * Uses % positioning for full responsiveness.
 */
function OrbitalCard({ feature, index }: OrbitalCardProps) {
  // 4 corner positions (clockwise from top-left)
  const positions = [
    { top: "0%", left: "0%" }, // top-left: Money
    { top: "0%", right: "0%" }, // top-right: Shield
    { bottom: "5%", left: "0%" }, // bottom-left: Home
    { bottom: "5%", right: "0%" }, // bottom-right: Sale
  ];

  // Different floating offsets per card
  const floatOffsets = [
    { y: [0, -10, 0, 8, 0], x: [0, 5, 0, -3, 0] },
    { y: [0, 8, 0, -10, 0], x: [0, -5, 0, 3, 0] },
    { y: [0, -8, 0, 10, 0], x: [0, -3, 0, 5, 0] },
    { y: [0, 10, 0, -8, 0], x: [0, 3, 0, -5, 0] },
  ];

  const position = positions[index];
  const offset = floatOffsets[index];
  const duration = 5 + index * 0.7;

  return (
    <motion.div
      className="absolute z-20 w-[42%] max-w-[12rem] sm:w-[40%] sm:max-w-[13rem]"
      style={position}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6 + index * 0.15 }}
    >
      <motion.div
        animate={{ y: offset.y, x: offset.x }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.4,
        }}
        whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
      >
        <div className="group relative rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-md shadow-xl shadow-blue-900/30 transition-all hover:border-sky-400/60 hover:bg-white/15 hover:shadow-2xl hover:shadow-sky-500/30 sm:rounded-3xl sm:p-4">
          {/* Glow on hover */}
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-sky-400/0 via-blue-500/0 to-violet-500/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:from-sky-400/40 group-hover:via-blue-500/40 group-hover:to-violet-500/40 group-hover:opacity-100 sm:rounded-3xl" />

          {/* Icon */}
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/20 sm:h-14 sm:w-14 sm:rounded-2xl">
            <Image
              src={feature.icon}
              alt=""
              width={32}
              height={32}
              className="h-6 w-6 sm:h-8 sm:w-8 [filter:invert(85%)_sepia(40%)_saturate(2000%)_hue-rotate(170deg)_brightness(105%)]"
            />
          </div>

          {/* Title */}
          <p className="text-center text-[0.65rem] font-semibold uppercase leading-tight tracking-wide text-white sm:text-xs">
            {feature.title}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
