"use client";

import clsx from "clsx";
import { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={clsx("relative", className)}>
      <input
        id={inputId}
        className={clsx(
          "peer w-full rounded-xl border bg-transparent px-4 pb-2 pt-6 text-base outline-none transition-all",
          "border-slate-200 dark:border-slate-700",
          "focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20",
          error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
        )}
        placeholder=" "
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          setHasValue(!!e.target.value);
        }}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={clsx(
          "absolute left-4 top-4 origin-top-left text-slate-500 transition-all duration-200",
          "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100",
          "peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-sky-600",
          (focused || hasValue) && "-translate-y-2.5 scale-75",
        )}
      >
        {label}
      </label>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
