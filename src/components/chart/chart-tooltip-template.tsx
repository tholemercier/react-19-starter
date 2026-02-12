import { useCallback, useEffect, useState } from "react";
import type { FC } from "react";

import { XMarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { Tooltip } from "recharts";
import type { TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

type Payload<T> = readonly {
  color: string;
  fill: string;
  dataKey: string;
  hide: boolean;
  name: string;
  stroke: string;
  strokeWidth: number;
  value: number;
  visible?: "visible" | "hidden";
  readonly payload: T;
}[];
export type TooltipTemplateType<T> = Omit<TooltipContentProps<ValueType, NameType>, "payload"> & {
  payload: Payload<T>;
};

const createTooltipContent = <T,>(header: FC<TooltipTemplateType<T>>, body: FC<TooltipTemplateType<T>>) => {
  return function TooltipContent(props: TooltipTemplateType<T>) {
    const [open, setOpen] = useState(false);
    const closeTooltip = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    }, []);

    useEffect(() => {
      if (props.activeIndex) {
        setOpen(true);
      }
    }, [props.activeIndex]);

    if (open && props.active && props.payload.length > 0) {
      const H = header;
      const B = body;
      return (
        <div className={clsx("text-white", "font-semibold", "rounded-2xl", "bg-brand-100", "shadow-app-shadow")}>
          <div
            className={clsx("font-semibold", "border-b-2", "rounded-t-2xl", "bg-brand-900", "px-4", "py-2", "relative")}
          >
            <div
              className={clsx("block", "md:hidden", "absolute", "top-[50%]", "translate-[-50%]", "right-1")}
              onClick={closeTooltip}
            >
              <XMarkIcon className={clsx("size-4", "stroke-2", "stroke-current")} />
            </div>
            <H {...props} />
          </div>
          <B {...props} />
        </div>
      );
    }

    return null;
  };
};

export const ChartTooltipTemplate = <T,>({
  header,
  body,
}: {
  header: FC<TooltipTemplateType<T>>;
  body: FC<TooltipTemplateType<T>>;
}) => {
  return <Tooltip content={createTooltipContent(header, body)} wrapperStyle={{ pointerEvents: "auto" }} />;
};
