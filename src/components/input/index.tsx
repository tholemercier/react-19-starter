import clsx from "clsx";

const inputClsx = (className?: string) =>
  clsx(
    "flex",
    "items-center",
    "rounded-md",
    "border-2",
    "border-primary-500",
    "bg-primary-100",
    "p-2",
    "font-semibold",
    "text-primary-800",
    "disabled:text-primary-200",
    "disabled:border-primary-200",
    className,
  );

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => {
  const { className, label, ...rest } = props;
  return (
    <div className="relative flex w-full flex-col">
      <label
        className={clsx(
          "absolute",
          "text-sm",
          "duration-300",
          "transform",
          "-translate-y-4",
          "scale-75",
          "top-2",
          "z-10",
          "origin-[0]",
          "bg-primary-100",
          "font-semibold",
          "px-2",
          "px-2",
          "peer-placeholder-shown:scale-100",
          "peer-placeholder-shown:-translate-y-1/2",
          "peer-placeholder-shown:top-1/2",
          "top-2",
          "scale-75",
          "-translate-y-4",
          "rtl:translate-x-1/4",
          "rtl:left-auto",
          "start-1",
        )}
      >
        {label}
      </label>
      <input className={inputClsx(className)} {...rest} />
    </div>
  );
};

export const Select = (
  props: React.InputHTMLAttributes<HTMLSelectElement> & { label: string; options: { label: string; value: string }[] },
) => {
  const { className, label, options, ...rest } = props;
  return (
    <div className={clsx("relative flex w-full flex-col")}>
      <label
        className={clsx(
          "absolute",
          "text-sm",
          "duration-300",
          "transform",
          "-translate-y-4",
          "scale-75",
          "top-2",
          "z-10",
          "origin-[0]",
          "bg-primary-100",
          "font-semibold",
          "px-2",
          "px-2",
          "peer-placeholder-shown:scale-100",
          "peer-placeholder-shown:-translate-y-1/2",
          "peer-placeholder-shown:top-1/2",
          "top-2",
          "scale-75",
          "-translate-y-4",
          "rtl:translate-x-1/4",
          "rtl:left-auto",
          "start-1",
        )}
      >
        {label}
      </label>
      <select className={inputClsx(className)} {...rest}>
        <option value="" disabled selected>
          Select your option
        </option>
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};
