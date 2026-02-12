import type { FC } from "react";
import { useCallback, useMemo } from "react";

import clsx from "clsx";
import { useAtomValue } from "jotai";

import { Card } from "src/components/card";
import type { TooltipTemplateType } from "src/components/chart/chart-tooltip-template";
import { ChartTooltipTemplate } from "src/components/chart/chart-tooltip-template";
import { useChartHiddenSeries } from "src/components/chart/chart.store";
import { LineChartTemplate } from "src/components/chart/line-chart-template";
import { Spinner } from "src/components/spinner";
import type { DateReducer, Timeserie } from "src/helpers/chart.helpers";
import { createTimeSeries } from "src/helpers/chart.helpers";
import { toCurrency } from "src/helpers/number";
import { toLocalDateAndTime } from "src/helpers/time";
import type { PositionsType, StrategyType } from "src/hooks/api/use-positions";
import { useTradingHistory } from "src/hooks/api/use-positions";
import { round, uniq } from "src/vendors/lodash";

import { selectionDateRangeAtom } from "./date-range-picker.fragment";

const getSeriesTime = (position: PositionsType) => {
  const [date] = toLocalDateAndTime(position.close_time, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const [m, d, y] = date.split("/").map(Number);
  return new Date(y, m - 1, d).getTime();
};

const useStrategiesTimeseries = () => {
  const selectionDateRange = useAtomValue(selectionDateRangeAtom);
  const { data: allPositions, isFetching } = useTradingHistory(selectionDateRange.from, selectionDateRange.to);

  const allStrategies = uniq((allPositions ?? []).map((p) => p.strategy));

  const dateReducer: DateReducer<PositionsType, Timeserie> = useCallback(
    ({ items, prev }) => {
      const dateCumulByStrat: { [key: StrategyType]: number } = {};
      for (const strategy of allStrategies) {
        const strategyDailyReturns = items
          .filter((p) => p.strategy === strategy)
          // eslint-disable-next-line unicorn/no-array-reduce
          .reduce((acc, curr) => round(acc + curr.profit + curr.swap), 0);
        const prevValue = typeof prev?.[strategy] === "number" ? prev[strategy] : 0;
        dateCumulByStrat[strategy] = strategyDailyReturns + prevValue;
      }

      return { ...dateCumulByStrat, date: toLocalDateAndTime(items[0].close_time)[0] };
    },
    [allStrategies],
  );

  const returns = useMemo(() => {
    if (!allPositions) return [];

    const timeSeries = createTimeSeries(allPositions, getSeriesTime, dateReducer);
    const timeSeriesDates = Object.keys(timeSeries);

    return timeSeriesDates
      .toSorted((a, b) => Number.parseInt(a) - Number.parseInt(b))
      .map((k, i) => ({ index: i, ...timeSeries[k] }));
  }, [allPositions, dateReducer]);

  return { returns, allStrategies, isFetching };
};

const TooltipBody: FC<TooltipTemplateType<Timeserie>> = ({ payload }) => {
  const [hiddenDataKeys] = useChartHiddenSeries();
  const series = useMemo(
    () => payload.filter((pld) => !hiddenDataKeys.includes(pld.dataKey)),
    [hiddenDataKeys, payload],
  );
  return (
    <div className={clsx("grid", "grid-cols-1", "md:grid-cols-2", "px-4", "py-2", "gap-1")}>
      {series.map((pld) => (
        <div
          key={pld.dataKey}
          className={clsx(pld.value > 0 ? "text-green-600" : "text-red-600", "flex", "items-center", "gap-1")}
        >
          <div className={clsx("w-2", "h-2")} style={{ background: pld.color }}></div>
          {pld.dataKey}: {toCurrency(pld.value)}
        </div>
      ))}
    </div>
  );
};
const TooltipHeader: FC<TooltipTemplateType<Timeserie>> = ({ payload }) => <>{payload[0].payload.date}</>;

export const TradeHistoryChart = () => {
  const { allStrategies, returns, isFetching } = useStrategiesTimeseries();

  return (
    <Card>
      {isFetching && (
        <div
          className={clsx(
            "absolute",
            "top-0",
            "left-0",
            "z-10",
            "ml-[-5%]",
            "flex",
            "h-full",
            "w-[110%]",
            "items-center",
            "justify-center",
            "bg-white/30",
          )}
        >
          <Spinner />
        </div>
      )}
      <div className={clsx("p-3")}>
        <LineChartTemplate
          data={returns}
          containerProps={{ height: 500 }}
          xaxisProps={{
            tickFormatter: (index: number) => `${returns[index].date}`,
          }}
          yaxisProps={{ tickFormatter: (v) => `${toCurrency(v)}`, width: 80 }}
          seriesKeys={allStrategies}
          renderTooltip={<ChartTooltipTemplate header={TooltipHeader} body={TooltipBody} />}
        />
      </div>
    </Card>
  );
};
