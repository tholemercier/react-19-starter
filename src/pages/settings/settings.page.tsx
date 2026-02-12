import clsx from "clsx";

import { StrategyConfigFragment } from "./fragments/strategy-config.fragment";
import { SystemConfigFragment } from "./fragments/system-config.fragment";

const SettingsPage = () => {
  return (
    <div className={clsx("py-8")}>
      <SystemConfigFragment />
      <StrategyConfigFragment />
    </div>
  );
};

export default SettingsPage;
