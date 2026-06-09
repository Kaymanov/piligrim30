"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import clsx from "clsx";

interface LazyImageProps extends Omit<ImageProps, "onLoad"> {
  wrapperClassName?: string;
}

/**
 * Image with smooth fade-in on load + shimmer placeholder.
 * Prevents "loading in chunks" visual glitch.
 */
export function LazyImage({
  wrapperClassName,
  className,
  alt,
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={clsx("relative overflow-hidden", wrapperClassName)}>
      {/* Shimmer placeholder */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700" />
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
    </div>
  );
}
