import clsx from "clsx";

import { toCurrency } from "src/helpers/number";
import { useAccountInfo } from "src/hooks/api/use-account";

import { LivePositionsCardFragment } from "./fragments/live-positions-card.fragment";

const Badge = ({ title, value }: { title: string; value?: number }) => (
  <div className={clsx("bg-brand-500", "rounded-lg", "text-center")}>
    <div className={clsx("py-2", "px-4", "bg-brand-600", "rounded-t-lg", "font-semibold", "text-white")}>{title}</div>
    <div className={clsx("py-2", "px-4", "font-semibold", "text-white", "text-lg")}>{toCurrency(value)}</div>
  </div>
);

const PositionsPage = () => {
  const { data: accountInfo } = useAccountInfo();
  return (
    <div>
      <div className="mb-4 flex gap-3 pl-2">
        <Badge title="Account Balance" value={accountInfo?.current_capital}></Badge>
        <Badge title="Floating Balance" value={accountInfo?.floating_capital}></Badge>
      </div>
      <LivePositionsCardFragment />
    </div>
  );
};

export default PositionsPage;
