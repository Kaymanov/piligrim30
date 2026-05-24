import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-white shadow-sm dark:bg-slate-800",
        hover &&
          "transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:shadow-blue-900/5",
        className,
      )}
    >
      {children}
    </div>
  );
}
