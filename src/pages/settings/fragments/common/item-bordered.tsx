import type { PropsWithChildren } from "react";

import clsx from "clsx";

const itemClsx = clsx(
  "flex",
  "items-center",
  "rounded-md",
  "border-2",
  "border-primary-500",
  "bg-primary-100",
  "p-2",
  "font-semibold",
  "text-primary-800",
);

export const ItemBordered = ({ className, children }: PropsWithChildren<{ className?: string }>) => (
  <div className={clsx(itemClsx, className)}>{children}</div>
);
