import type { PropsWithChildren } from "react";

import clsx from "clsx";

export const Alert = ({ children }: PropsWithChildren) => (
  <div className={clsx("p-2", "bg-primary-400", "text-white", "mb-4", "w-max", "rounded-xs", "font-semibold")}>
    {children}
  </div>
);
