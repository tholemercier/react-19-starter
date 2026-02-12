import type { PropsWithChildren } from "react";
import { useCallback } from "react";

import type { UseDataGridContext } from "src/libs/data-grid/types";

const DefaultTh = <K extends string, T extends object>(
  props: PropsWithChildren<{ tableKey: K; useHook: UseDataGridContext<K, T> }>,
) => {
  const { useHook, tableKey } = props;
  const { sortBy, sortedBy, sortFilterConfigMap } = useHook();
  const onColumnSort = useCallback(() => {
    if (sortFilterConfigMap[tableKey].sort)
      sortBy({
        key: tableKey,
        order: sortedBy?.key === tableKey ? (sortedBy.order === "asc" ? "desc" : "asc") : "asc",
        config: sortFilterConfigMap[tableKey],
      });
  }, [sortBy, sortedBy?.key, sortedBy?.order, sortFilterConfigMap, tableKey]);

  return <th onClick={onColumnSort}>{props.children}</th>;
};

type ThExtProps<K extends string> = {
  tableKey: K;
};

export const ThFactory = <K extends string, T extends object>(useHook: UseDataGridContext<K, T>) => {
  return function Th({ tableKey }: ThExtProps<K>) {
    const context = useHook();

    const rendered = context.dataGridConfigMap[tableKey].th.render(tableKey, useHook);

    return typeof rendered === "string" ? (
      <DefaultTh useHook={useHook} tableKey={tableKey}>
        {rendered}
      </DefaultTh>
    ) : (
      rendered
    );
  };
};
