import type { UseDataGridContext } from "src/libs/data-grid/types";

export const TdFactory = <K extends string, T extends object>(useHook: UseDataGridContext<K, T>) => {
  return function Td({ tableKey, data }: { data: T; tableKey: K }) {
    const context = useHook();

    const valueAsString = context.dataGridConfigMap[tableKey].valueAsString(data);
    const valueAs = context.dataGridConfigMap[tableKey].valueAs?.(tableKey, data, useHook);

    return valueAs ?? <td>{valueAsString}</td>;
  };
};
