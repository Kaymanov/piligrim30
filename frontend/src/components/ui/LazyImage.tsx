"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import clsx from "clsx";

/**
 * Image with smooth fade-in on load + shimmer placeholder.
 * Supports both fill and sized modes. Drop-in replacement for next/image.
 */
export function LazyImage({ className, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Shimmer placeholder — absolute positioned behind image */}
      {!loaded && (
        <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700" />
      )}
      <Image
        {...props}
        alt={alt}
        className={clsx(
          className,
          "transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}
