import type { PropsWithChildren } from "react";

import clsx from "clsx";

const buttonClsx = (variant: "success" | "error" | "brand", disabled?: boolean, className?: string) =>
  clsx(
    "cursor-pointer",
    "rounded-sm",
    "border-1",
    "p-0",
    "px-[0.8em]",
    "py-[8px]",
    "align-middle",
    "leading-[1.15385]",
    variant === "error" && "border-red-800",
    variant === "error" && "bg-red-400",
    variant === "error" && "text-red-800",
    variant === "error" && "hover:bg-red-500",
    variant === "error" && "hover:text-red-950",
    variant === "success" && "border-green-800",
    variant === "success" && "bg-green-400",
    variant === "success" && "text-green-800",
    variant === "success" && "hover:bg-green-500",
    variant === "success" && "hover:text-green-950",
    variant === "brand" && "border-brand-800",
    variant === "brand" && "bg-brand-400",
    variant === "brand" && "text-brand-800",
    variant === "brand" && "hover:bg-brand-500",
    variant === "brand" && "hover:text-brand-950",
    disabled && "opacity-15",
    className,
  );

export const Button = ({
  variant,
  disabled,
  children,
  onClick,
  className,
}: PropsWithChildren<{
  variant: "success" | "error" | "brand";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
}>) => {
  return (
    <button onClick={onClick} className={buttonClsx(variant, disabled, className)}>
      {children}
    </button>
  );
};
