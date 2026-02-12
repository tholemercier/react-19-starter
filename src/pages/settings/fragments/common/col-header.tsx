import type { DetailedHTMLProps, PropsWithChildren } from "react";

import clsx from "clsx";

type thType = DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>;

export const ColHeader = ({
  children,
  className,
  thProps,
}: PropsWithChildren<{ className?: string; thProps?: thType }>) => (
  <th
    {...thProps}
    className={clsx("rounded-xs", "bg-primary-700", "py-1", "pl-2", "font-semibold", "text-white", className)}
  >
    {children}
  </th>
);
