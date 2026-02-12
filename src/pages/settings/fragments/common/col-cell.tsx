import type { PropsWithChildren } from "react";

import clsx from "clsx";

export const ColCell = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <td className={clsx(className)}>{children}</td>
);
