import type { UseDataGridContext } from "src/libs/data-grid/types";

import { TdFactory } from "./td.factory";
import { ThFactory } from "./th.factory";

export const dataGridComponentsFactory = <K extends string, T extends object>(useHook: UseDataGridContext<K, T>) => {
  return {
    Th: ThFactory(useHook),
    Td: TdFactory(useHook),
  };
};
