import clsx from "clsx";
import { Legend } from "recharts";
import type { Props as LegendProps } from "recharts/types/component/DefaultLegendContent";

import { useChartHiddenSeries } from "./chart.store";

const LegendContainer = (props: LegendProps) => {
  const { payload } = props;
  const [hiddenDataKeys, toggleDataKey] = useChartHiddenSeries();

  return (
    <div
      className={clsx(
        "flex",
        "flex-nowrap",
        "overflow-auto",
        "py-3",
        "w-min",
        "max-w-full",
        "pl-6",
        "m-auto",
        "mb-6",
        "items-center",
        "justify-start",
      )}
    >
      {payload?.map((entry, index) => (
        <div
          key={`item-${index}`}
          title="Hide Serie"
          className={clsx(
            "min-w-max",
            "font-black",
            "text-sm",
            "px-2",
            "py-1",
            "rounded-2xl",
            "cursor-pointer",
            hiddenDataKeys.length > 0 && hiddenDataKeys.includes(`${entry.dataKey}`) && clsx("opacity-30"),
            "hover:bg-primary-300",
          )}
          style={{ color: entry.color }}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => toggleDataKey(`${entry.dataKey}`)}
        >
          {entry.value}
        </div>
      ))}
    </div>
  );
};

export const LegendExtended = () => {
  return <Legend content={LegendContainer} verticalAlign="top" />;
};
