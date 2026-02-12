import { useCallback } from "react";

import type { UseDataGridContext } from "src/libs/data-grid/types";

import type { KeysOfProduct, ProductSubType } from "./products.api";
// for testing purpose, ignore the dependency cycle
// eslint-disable-next-line import/no-cycle
import { SearchProductInputText } from "./products.table.config";

export const CustomTh = (tableKey: KeysOfProduct, useHook: UseDataGridContext<KeysOfProduct, ProductSubType>) => {
  const { sortFilterConfigMap, sortedBy, sortBy } = useHook();
  const onColumnSort = useCallback(() => {
    if (sortFilterConfigMap[tableKey].sort)
      sortBy({
        key: tableKey,
        order: sortedBy?.key === tableKey ? (sortedBy.order === "asc" ? "desc" : "asc") : "asc",
        config: sortFilterConfigMap[tableKey],
      });
  }, [sortBy, sortedBy?.key, sortedBy?.order, sortFilterConfigMap, tableKey]);
  return (
    <th onClick={onColumnSort} style={{ color: "red", border: "1px solid black", padding: "4px" }}>
      <div>Category</div>
      <SearchProductInputText dataKey="category" />
    </th>
  );
};
