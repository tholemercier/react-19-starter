import clsx from "clsx";

export const Spinner = ({ className }: { className?: string }) => (
  <div
    className={clsx(
      "h-6",
      "w-6",
      "animate-spin",
      "rounded-full",
      "border-b-2",
      "border-l-2",
      "border-green-500",
      className,
    )}
  />
);
