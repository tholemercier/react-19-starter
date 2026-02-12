import { StrategiesSummaryFragment } from "./fragments/strategies-summary.fragment";
import { TradeHistoryChart } from "./fragments/trade-history-chart";
import { TradeHistoryCardFragment } from "./fragments/trades-history-card.fragment";

const PositionsPage = () => {
  return (
    <div>
      <StrategiesSummaryFragment />
      <TradeHistoryCardFragment />
      <TradeHistoryChart />
    </div>
  );
};

export default PositionsPage;
