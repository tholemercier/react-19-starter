import { BoltIcon, Cog6ToothIcon, CurrencyDollarIcon, SparklesIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

import { MenuItem } from "./menu-item";

const appMenuClsx = clsx(
  "sticky",
  "top-0",
  "z-10",
  "flex",
  "items-center",
  "justify-between",
  "border-b",
  "border-solid",
  "border-primary-200",
  "pr-4",
  "backdrop-blur-sm",
);

export const AppMenu = ({ pageTitle }: { pageTitle?: string }) => {
  return (
    <aside className={appMenuClsx}>
      <MenuItem as={SparklesIcon} className="!cursor-default hover:!bg-transparent" to="/" />
      <MenuItem as={BoltIcon} to="/live-positions" />
      <MenuItem as={CurrencyDollarIcon} to="/trades-history" />
      <h1 className={clsx("text-lg", "leading-tight", "font-black", "tracking-[-0.033em]", "text-brand-700", "ml-3")}>
        {pageTitle}
      </h1>
      <div className="flex flex-1 items-center justify-end">
        <MenuItem as={Cog6ToothIcon} className="mt-auto" to="/settings" />
      </div>
    </aside>
  );
};
