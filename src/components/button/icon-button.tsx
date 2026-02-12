import type { FC } from "react";

import clsx from "clsx";

const iconClsx = (variant: "error" | "success" | "brand", className?: string) =>
  clsx(
    "size-8",
    "md:size-10",
    "cursor-pointer",
    "p-1",
    "md:p-2",
    variant === "success" && "hover:bg-green-200",
    variant === "error" && "hover:bg-red-200",
    variant === "brand" && "hover:bg-brand-200",
    className,
  );

const fillByVariant = {
  error: "var(--color-red-700)",
  success: "var(--color-green-700)",
  brand: "var(--color-brand-700)",
};

export const IconButton = ({
  as,
  onClick,
  className,
  variant,
}: {
  as: FC<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
  className?: string;
  variant: "error" | "success" | "brand";
}) => {
  const T = as;

  return <T className={iconClsx(variant, className)} fill={fillByVariant[variant]} onClick={onClick} />;
};
