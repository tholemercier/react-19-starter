import { memo, useEffect, useMemo, useState } from "react";

import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

import { Card } from "src/components/card";
import { Spinner } from "src/components/spinner";
import type { TableConfigType } from "src/components/table";
import { Table } from "src/components/table";
import { toCurrency } from "src/helpers/number";
import { toLocalDateAndTime } from "src/helpers/time";
import { useAccountInfo } from "src/hooks/api/use-account";
import { useLivePositions, usePendingPositions } from "src/hooks/api/use-positions";
import type { LivePositionType, PendingPositionType } from "src/hooks/api/use-positions";
import type { ReturnsType } from "src/hooks/use-strategy-returns";

const StrategyColumn = ({ type, strategy, symbol }: { type: string; strategy: string; symbol: string }) => {
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
        {type === "long" ? (
          <ArrowTrendingUpIcon className="size-4 text-green-500" />
        ) : (
          <ArrowTrendingDownIcon className="size-4 text-red-500" />
        )}
        <span className="text-xs font-semibold md:text-sm">{strategy}</span>
      </div>
      <div>
        <span className={clsx("text-xs", "pl-2 md:pl-0")}>{symbol}</span>
      </div>
    </div>
  );
};

const configTable: TableConfigType<LivePositionType> = [
  {
    td: (d) => <StrategyColumn strategy={d.strategy} symbol={d.symbol} type={d.type} />,
    th: <div className="text-left">Strategy</div>,
  },
  {
    td: (d) => <div className="text-right text-sm">{d.volume}</div>,
    th: <div className="text-right">Vol.</div>,
  },
  {
    td: (d) => {
      const [closedThe, closedAt] = toLocalDateAndTime(d.open_time);
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

const configPendingPositionsTable: TableConfigType<PendingPositionType> = [
  {
    td: (d) => <StrategyColumn strategy={d.strategy_key} symbol={d.broker_symbol} type={d.order_type} />,
    th: "Strategy",
    thProps: { className: "text-left" },
  },
  {
    td: (d) => <div className="text-right text-sm">{d.volume}</div>,
    th: "Vol.",
    thProps: { className: "text-right" },
    tdProps: { className: () => "text-right text-sm" },
  },
  {
    td: (d) => d.status,
    tdProps: { className: () => "text-left" },
    thProps: { className: "text-left" },
    th: "Status",
  },
  {
    td: (d) => <div>{d.trace}</div>,
    th: <div>Reason</div>,
  },
];

const Header = ({ positions }: { positions: LivePositionType[]; returns?: ReturnsType }) => {
  const total = useMemo(() => positions.reduce((acc, curr) => acc + curr.profit + curr.swap, 0), [positions]);
  return (
    <div className={clsx("grid", "grid-cols-[min-content_1fr_max-content]", "gap-4", "items-center")}>
      <span className={clsx("row-1", "text-lg", "font-black")}>Positions</span>
      {total > 0 && (
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
            total === 0 && "text-shadow-primary-950",
            total > 0 && "bg-green-300/10 text-green-300",
            total < 0 && "bg-red-300/10 text-red-300",
          )}
        >
          <span className="md:text-md text-sm">{total === 0 ? "-" : toCurrency(total)}</span>
        </div>
      )}
    </div>
  );
};

const RefreshTimer = () => {
  const { refetch: refetchAccountInfo } = useAccountInfo();
  const { refetch: refetchLivePositions } = useLivePositions();
  const { refetch: refetchPendingPositions } = usePendingPositions();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => (p === 100 ? 0 : p + 1));
    }, 80);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (progress == 100) {
      refetchAccountInfo();
      refetchLivePositions();
      refetchPendingPositions();
    }
  }, [progress, refetchAccountInfo, refetchLivePositions, refetchPendingPositions]);

  return (
    <div
      className={clsx("w-full", "h-2", "bg-primary-900", "mt-[-2px]", "transition-all", "ease-out")}
      style={{ width: `${progress}%` }}
    />
  );
};

const RefreshTimerMeomoized = memo(RefreshTimer);

export const LivePositionsCardFragment = () => {
  const { data: livePositions, isPending, isFetching } = useLivePositions();
  const { data: pendingPositions } = usePendingPositions();

  if (isPending) return <Spinner className="mx-auto my-4" />;

  return (
    <section>
      <Card header={<Header positions={livePositions ?? []} />}>
        {isFetching && (
          <div className="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-white/50">
            <Spinner />
          </div>
        )}
        <RefreshTimerMeomoized />
        <Table
          data={livePositions ?? []}
          config={configTable}
          wrapperClassName="max-h-[500px] overflow-auto"
          paginate
        />
        {!isFetching && livePositions?.length === 0 && (
          <div className="p-2 text-center text-lg font-semibold text-red-600">No data</div>
        )}
      </Card>
      <div className="my-4" />
      {(pendingPositions?.length ?? 0) > 0 && (
        <Card header={<span className={clsx("row-1", "text-lg", "font-black")}>Pending Positions</span>}>
          {isFetching && (
            <div className="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-white/50">
              <Spinner />
            </div>
          )}
          <Table
            data={pendingPositions ?? []}
            config={configPendingPositionsTable}
            wrapperClassName="max-h-[500px] overflow-auto"
            paginate
          />
        </Card>
      )}
    </section>
  );
};
