import clsx from "clsx";
import { useAtomValue } from "jotai";

import { Spinner } from "src/components/spinner";
import { toCurrency } from "src/helpers/number";
import { useTradingHistory } from "src/hooks/api/use-positions";
import { useStrategyReturns } from "src/hooks/use-strategy-returns";
import { recordEntries, recordKeys } from "src/libs/record";
import { setTypeGuard } from "src/libs/type";

import { selectionDateRangeAtom } from "./date-range-picker.fragment";

const strategyLabelMap = {
  ALL: "Total",
  MANUAL: "Manual",
  DIVIDEND: "Dividend",
};

const isCustomStrategy = setTypeGuard(recordKeys(strategyLabelMap));

const cardClsx = clsx(
  "bg-white",
  "flex",
  "flex-col",
  "gap-2",
  "rounded-xl",
  "border",
  "border-primary-200",
  "p-4",
  "pb-2",
  "shadow-sm",
);

const labelClsx = clsx("text-lg", "font-semibold", "text-primary-600");
const valueClsx = clsx("tracking-light", "text-2xl", "font-bold", "leading-tight");

export const StrategiesSummaryFragment = () => {
  const selectionDateRange = useAtomValue(selectionDateRangeAtom);
  const { data: allPositions, isFetching } = useTradingHistory(selectionDateRange.from, selectionDateRange.to);

  const returnsByStrategy = useStrategyReturns(allPositions ?? []);

  return (
    <div className="relative mb-6">
      {isFetching && (
        <div className="absolute top-0 left-0 z-10 ml-[-5%] flex h-full w-[110%] items-center justify-center bg-white/30">
          <Spinner />
        </div>
      )}
      <div className={clsx("flex", "flex-nowrap", "gap-2", "overflow-auto", "whitespace-nowrap", "py-4")}>
        {recordEntries(returnsByStrategy).map(([s, v]) => (
          <div key={s} className={clsx(cardClsx, "p-4!", v.total > 0 ? "bg-green-200/10!" : "bg-red-200/10!")}>
            <h2 className={clsx(labelClsx, "text-sm", "text-brand-700!")}>
              {isCustomStrategy(s) ? strategyLabelMap[s] : s}
            </h2>
            <span className={clsx(valueClsx, "text-xl", v.total > 0 ? "text-green-600" : "text-red-600")}>
              {toCurrency(v.total)}
            </span>
            <span className={clsx("font-semibold", "text-xs", "text-right", "text-primary-600")}>
              w/l ratio: {v.r}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
