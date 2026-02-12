import { useCallback, useState } from "react";

import { recordKeyTypeGuard, setTypeGuard } from "src/libs/type";

import type { SortedByType, SortFilterConfigMap } from "./types";

const isAscDesc = setTypeGuard(["asc", "desc"] as const);

export const sortedByHookFactory = <K extends string, T extends object>(
  sortFilterConfigMap: SortFilterConfigMap<K, T>,
  defaulSort?: SortedByType<K, T>,
) => {
  const useSortedBy = (init: { sortkey?: string; sortorder?: string }) => {
    // Simple type guard to ensure filtering and sorting by valid key based on the options provided
    const isValidKey = recordKeyTypeGuard(sortFilterConfigMap);
    const [sortedBy, setSortedBy] = useState<SortedByType<K, T> | undefined>(
      isValidKey(init.sortkey) && isAscDesc(init.sortorder)
        ? {
            key: init.sortkey,
            config: sortFilterConfigMap[init.sortkey],
            order: init.sortorder,
          }
        : defaulSort,
    );

    const clearSortedBy = useCallback(() => setSortedBy(undefined), [setSortedBy]);

    return { sortedBy, sortBy: setSortedBy, clearSortedBy };
  };

  return useSortedBy;
};
