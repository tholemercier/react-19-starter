import type { PropsWithChildren, ReactNode } from "react";

import clsx from "clsx";

export const Card = ({ children, header }: PropsWithChildren<{ header?: ReactNode }>) => {
  return (
    <article
      className={clsx(
        "relative",
        "flex",
        "flex-col",
        "rounded-xl",
        "border",
        "border-primary-200",
        "group",
        "bg-white shadow-sm",
        "mb-4",
      )}
    >
      {header && (
        <header
          className={clsx(
            "flex",
            "items-center",
            "justify-between",
            "gap-6",
            "p-4 sm:p-6",
            "rounded-t-xl",
            "bg-[linear-gradient(120deg,#164774_0%,#296d98_100%)]",
            "border-b",
            "border-primary-100",
            "text-white",
          )}
        >
          <div className="flex-1">{header}</div>
        </header>
      )}
      {children}
    </article>
  );
};
