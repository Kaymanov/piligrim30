"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image, { ImageProps } from "next/image";
import clsx from "clsx";

/**
 * Image with smooth fade-in on load + shimmer placeholder.
 * Supports both fill and sized modes. Drop-in replacement for next/image.
 *
 * Robustly handles the cached-image case: if the image is already complete
 * before React attaches the `onLoad` handler, we detect it via the ref and
 * still trigger the fade-in (otherwise the image would stay invisible).
 */
export function LazyImage({ className, alt, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const markLoaded = useCallback(() => setLoaded(true), []);

  // Catch already-cached images whose `load` event fired before hydration.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <>
      {/* Shimmer placeholder — sits behind the image until it loads */}
      {!loaded && <div className="skeleton-shimmer absolute inset-0 z-0" />}
      <Image
        {...props}
        ref={imgRef}
        alt={alt}
        className={clsx(
          className,
          "transition-opacity duration-700 ease-out",
          loaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={(e) => {
          markLoaded();
          onLoad?.(e);
        }}
      />
    </>
  );
}
