import type { PropsWithChildren } from "react";

import clsx from "clsx";

export const Modal = ({ children, isOpen, className }: PropsWithChildren<{ isOpen: boolean; className?: string }>) => {
  if (!isOpen) return null;
  return (
    <div
      className={clsx(
        "fixed",
        "top-[50%]",
        "left-[50%]",
        "z-50",
        "h-screen",
        "w-full",
        "translate-x-[-50%]",
        "translate-y-[-50%]",
        "bg-[rgba(0,0,0,0.4)]",
      )}
    >
      <div
        className={clsx(
          "absolute",
          "top-[20%]",
          "left-[50%]",
          "w-max",
          "max-w-[1200px]",
          "translate-x-[-50%]",
          "translate-y-[-20%]",
          "rounded-md",
          "bg-primary-100",
          "px-6",
          "py-4",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};
