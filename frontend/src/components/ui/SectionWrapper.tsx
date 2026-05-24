import clsx from "clsx";
import { Container } from "./Container";

interface SectionWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  bg?: "white" | "slate" | "blue";
  id?: string;
}

export function SectionWrapper({
  children,
  title,
  subtitle,
  className,
  bg = "white",
  id,
}: SectionWrapperProps) {
  const bgClasses = {
    white: "bg-white dark:bg-slate-900",
    slate: "bg-slate-50 dark:bg-slate-800/50",
    blue: "bg-blue-900 dark:bg-slate-950",
  };

  return (
    <section
      id={id}
      className={clsx("py-16 md:py-20 lg:py-24", bgClasses[bg], className)}
    >
      <Container>
        {(title || subtitle) && (
          <div className="mb-12 text-center md:mb-16">
            {title && (
              <h2
                className={clsx(
                  "text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl",
                  bg === "blue"
                    ? "text-white"
                    : "text-blue-900 dark:text-slate-100",
                )}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={clsx(
                  "mt-4 text-lg",
                  bg === "blue"
                    ? "text-blue-100"
                    : "text-slate-500 dark:text-slate-400",
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
