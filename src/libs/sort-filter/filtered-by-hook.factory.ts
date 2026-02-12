import { useCallback, useMemo, useState } from "react";

import { excludeFalsy } from "src/libs/array";
import { recordEntries } from "src/libs/record";
import { recordKeyTypeGuard } from "src/libs/type";
import { uniqBy } from "src/vendors/lodash";

import type { FilteredByState, SortFilterConfigMap } from "./types";

export const filteredByHookFactory = <K extends string, T extends object>(
  sortFilterConfigMap: SortFilterConfigMap<K, T>,
  defaultFilters?: FilteredByState<K, T>[],
) => {
  const useFilteredBy = (init: Record<string, string | undefined>) => {
    // Simple type guard to ensure filtering and sorting by valid key based on the options provided
    const isValidKey = recordKeyTypeGuard(sortFilterConfigMap);
    // Initial State coming from either a cookie or URL search params
    const initialState = useMemo(
      () =>
        recordEntries(init)
          .map(
            ([key, value]): false | FilteredByState<K, T> =>
              !!value &&
              isValidKey(key) && {
                key,
                config: sortFilterConfigMap[key],
                value: value.split(","),
              },
          )
          .filter((element) => excludeFalsy(element)),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [init],
    );

    const [filteredBy, setFilteredBy] = useState<FilteredByState<K, T>[]>(
      initialState.length > 0 ? initialState : (defaultFilters ?? []),
    );

    const filterBy = useCallback((newEntry: FilteredByState<K, T>) => {
      setFilteredBy((filtersToUpt) => uniqBy([newEntry, ...filtersToUpt], (f) => f.key));
    }, []);

    /**
     * If a key is provided, remove the key + value from the search params and the state
     * If no key is provided, only remove the key + value from the state.
     * The search params is emptied in the calling fuction
     */
    const clearFilteredBy = useCallback((key?: K) => {
      setFilteredBy(key ? (filtersToRm) => filtersToRm.filter((filterEntry) => filterEntry.key !== key) : []);
    }, []);

    return {
      filteredBy,
      filterBy,
      clearFilteredBy,
    };
  };

  return useFilteredBy;
};
