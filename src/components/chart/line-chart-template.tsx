import type { PropsWithChildren } from "react";
import { memo } from "react";

import type { LineProps, ResponsiveContainerProps, XAxisProps, YAxisProps } from "recharts";
import { CartesianGrid, Line, LineChart, ResponsiveContainer } from "recharts";
import type { CartesianChartProps } from "recharts/types/util/types";

import type { ChartTooltipTemplate } from "./chart-tooltip-template";
import { useChartHiddenSeries } from "./chart.store";
import { LegendExtended } from "./legend.component";
import { XAxisExtended } from "./x-axis.component";
import { YAxisExtended } from "./y-axis.component";

export const SERIES_COLOR = [
  "#990099",
  "#3366CC",
  "#DC3912",
  "#FF9900",
  "#109618",
  "#0099C6",
  "#DD4477",
  "#66AA00",
  "#B82E2E",
  "#316395",
];

const visibilityProps = (visibleKeys: string[], key: string) => {
  if (visibleKeys.includes(key)) return { visibility: "hidden", activeDot: false };
  return { visibility: "visible", activeDot: { r: 6 } };
};

const LinExtended = (props: LineProps) => {
  const [hiddenDataKeys] = useChartHiddenSeries();

  return <Line {...props} {...visibilityProps(hiddenDataKeys, `${props.dataKey}`)} />;
};

type LineChartInputProps<T> = PropsWithChildren<{
  containerProps?: Omit<ResponsiveContainerProps, "children">;
  data: T[];
  xaxisProps?: XAxisProps;
  yaxisProps?: YAxisProps;
  lineChartProps?: CartesianChartProps;
  seriesKeys: string[];
  renderTooltip: ReturnType<typeof ChartTooltipTemplate>;
}>;
export const LineChartTemplate = memo(function memoized<T>(props: LineChartInputProps<T>) {
  const { style, ...rest } = props.containerProps ?? {};
  return (
    <ResponsiveContainer width="100%" style={{ ...style }} {...rest}>
      <LineChart data={props.data} {...props.lineChartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxisExtended {...props.xaxisProps} />
        <YAxisExtended {...props.yaxisProps} />
        <LegendExtended />
        {props.renderTooltip}
        {props.seriesKeys.map((dataKey, i) => (
          <LinExtended
            key={dataKey}
            type="monotone"
            dataKey={dataKey}
            strokeWidth={2}
            dot={false}
            name={dataKey}
            stroke={SERIES_COLOR[i % SERIES_COLOR.length]}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
});

// flex flex-1 gap-4 rounded-xl border border-[#222f49]/60 bg-gradient-to-br from-[#101622] to-[#0A0E1A] p-6 flex-col
