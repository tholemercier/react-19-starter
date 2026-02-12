import type { FC } from "react";

import clsx from "clsx";
import { NavLink } from "react-router";

import type { ValidHref } from "src/routing/pages-config";

const menuItemClsx = (className?: string) =>
  clsx(
    "flex",
    "justify-center",
    "p-3",
    "cursor-pointer",
    "hover:bg-brand-100",
    "text-brand-700",
    "transition duration-300 ease-in-out",
    className,
  );
export const MenuItem = ({
  as,
  className,
  to,
}: {
  as: FC<React.SVGProps<SVGSVGElement>>;
  className?: string;
  to: ValidHref;
}) => {
  const T = as;
  return (
    <NavLink to={to} className={menuItemClsx(className)}>
      <T className={clsx("size-6")} />
    </NavLink>
  );
};
