import { useCallback, useMemo, useState } from "react";

import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

import { Card } from "src/components/card";
import { Select } from "src/components/input";
import { Spinner } from "src/components/spinner";
import type { TableConfigType } from "src/components/table";
import { Table } from "src/components/table";
import { toCurrency } from "src/helpers/number";
import { toLocalDateAndTime } from "src/helpers/time";
import type { StrategyConfigType } from "src/hooks/api";
import { useStrategyConfig } from "src/hooks/api";
import type { PositionsType } from "src/hooks/api/use-positions";
import { useTradingHistory } from "src/hooks/api/use-positions";
import type { ReturnsType } from "src/hooks/use-strategy-returns";
import { useStrategyReturns } from "src/hooks/use-strategy-returns";

import DateSelection, { useDateRange } from "./date-range-picker.fragment";

const closeReasonMap = (d: PositionsType) => {
  const m = {
    manual: d.strategy === "Manual" ? "" : "(m)",
    sl: "(sl)",
    tp: "(tp)",
    broker: "(b)",
    strategy: "",
  };
  return m[d.close_reason];
};

const StrategyColumn = ({ position }: { position: PositionsType }) => {
  return (
    <div
      className={clsx(
        "flex",
        "flex-col-reverse",
        "md:flex-row",
        "md:justify-between",
        "md:pr-4",
        "text-sm",
        "md:items-center",
      )}
    >
      <div className="flex items-center gap-1">
        {position.type === "long" ? (
          <ArrowTrendingUpIcon className="size-4 text-green-500" />
        ) : (
          <ArrowTrendingDownIcon className="size-4 text-red-500" />
        )}
        <span className="text-xs font-semibold md:text-sm">{position.strategy}</span>
        <span className="hidden text-xs font-semibold md:inline">{closeReasonMap(position)}</span>
      </div>
      <div>
        <span className={clsx("text-xs", "pl-2 md:pl-0")}>{position.symbol}</span>
        <span className="text-xs font-semibold md:hidden">{closeReasonMap(position)}</span>
      </div>
    </div>
  );
};

const configTable: TableConfigType<PositionsType> = [
  {
    td: (d) => <StrategyColumn position={d} />,
    th: <div className="text-left">Strategy</div>,
  },
  {
    td: (d) => <div className="text-right text-sm">{d.volume}</div>,
    th: <div className="text-right">Vol.</div>,
  },
  {
    td: (d) => {
      const [closedThe, closedAt] = toLocalDateAndTime(d.close_time);
      return (
        <div className="text-left text-sm">
          {closedThe} {closedAt}
        </div>
      );
    },
    th: <div className="text-left">Date</div>,
  },
  {
    td: (d) => <div className="text-right">{toCurrency(d.profit + d.swap)}</div>,
    th: <div className="text-right">Profit</div>,
    tdProps: {
      className: (d) => clsx(d.profit + d.swap > 0 ? "text-green-600" : "text-red-700", "font-semibold", "text-sm"),
    },
  },
];

const HeaderWithDropdownFilter = ({
  strategies,
  setSelectedStrategy,
  selectedStrategy,
  returns,
}: {
  strategies?: StrategyConfigType[];
  selectedStrategy: string;
  setSelectedStrategy: (v: string) => void;
  returns?: ReturnsType;
}) => {
  const options = useMemo(
    () => [
      { label: "All", value: "ALL" },
      { label: "Manual", value: "MANUAL" },
      { label: "Dividend", value: "DIVIDEND" },
      ...(strategies?.map((s) => ({ label: s.strategy_key.toUpperCase(), value: s.strategy_key })) ?? []),
    ],
    [strategies],
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedStrategy(e.currentTarget.value);
    },
    [setSelectedStrategy],
  );

  return (
    <div className={clsx("grid", "grid-cols-[min-content_1fr_max-content]", "gap-4", "items-center")}>
      <span className="row-1 text-lg font-black">History</span>
      <div className={clsx("col-span-2", "row-2", "md:col-2", "md:row-1")}>
        <Select
          name="strategy-select"
          onChange={onChange}
          value={selectedStrategy}
          label=""
          options={options}
          className="md:text-md max-w-[200px] text-sm"
        />
      </div>
      {returns && (
        <div
          className={clsx(
            "flex",
            "flex-row-reverse md:flex-col",
            "w-max",
            "items-center",
            "gap-3 md:gap-1",
            "font-semibold",
            "py-1",
            "px-1 md:px-4",
            returns.total === 0 && "text-shadow-primary-950",
            returns.total > 0 && "bg-green-300/10 text-green-300",
            returns.total < 0 && "bg-red-300/10 text-red-300",
          )}
        >
          <span className="text-xs">{returns.r === 0 ? "-" : `w/l ratio: ${returns.r}%`}</span>
          <span className="md:text-md text-sm">{returns.total === 0 ? "-" : toCurrency(returns.total)}</span>
        </div>
      )}
    </div>
  );
};

export const TradeHistoryCardFragment = () => {
  const debSelectionDateRange = useDateRange();

  const {
    data: allPositions,
    isPending,
    isFetching,
  } = useTradingHistory(debSelectionDateRange.from, debSelectionDateRange.to);
  const { data: strategies } = useStrategyConfig();
  const returnsByStrategy = useStrategyReturns(allPositions ?? []);

  const [selectedStrategy, setSelectedStrategy] = useState("ALL");

  const positions = useMemo(() => {
    return (
      allPositions?.filter((s) => selectedStrategy === "ALL" || s.strategy === selectedStrategy).toReversed() ?? []
    );
  }, [allPositions, selectedStrategy]);

  if (isPending) return <Spinner className="mx-auto my-4" />;

  return (
    <section>
      <DateSelection />
      <Card
        header={
          <HeaderWithDropdownFilter
            selectedStrategy={selectedStrategy}
            setSelectedStrategy={setSelectedStrategy}
            strategies={strategies}
            returns={returnsByStrategy[selectedStrategy]}
          />
        }
      >
        {isFetching && (
          <div className="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-white/50">
            <Spinner />
          </div>
        )}
        <Table data={positions} config={configTable} wrapperClassName="max-h-[500px] overflow-auto" paginate />
        {!isFetching && positions.length === 0 && (
          <div className="p-2 text-center text-lg font-semibold text-red-600">No data</div>
        )}
      </Card>
    </section>
  );
};
