import type { PropsWithChildren } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo } from "react";

import { useCookieSync } from "src/hooks/use-cookie-sync";
import { useSearchParamsSync } from "src/hooks/use-search-params-sync";
import { excludeFalsy } from "src/libs/array";
import { arrayToRecord, recordKeys } from "src/libs/record";
import { typedAsserted } from "src/libs/type";
import { sortBy as lodashSortBy } from "src/vendors/lodash";

import { filteredByHookFactory } from "./filtered-by-hook.factory";
import { sortedByHookFactory } from "./sorted-by-hook.factory";
import type { DefaultSortFilterOptions, SortFilterConfigMap } from "./types";

export type SortFilterContextFactoryType<K extends string, T extends object> = typeof sortFilterContextFactory<K, T>;

export const sortFilterContextFactory = <K extends string, T extends object>(
  sortFilterConfigMap: SortFilterConfigMap<K, T>,
  defaultSortingFilteringOptions: DefaultSortFilterOptions<K, T> = {},
) => {
  const optionsKeys = [...recordKeys(sortFilterConfigMap), "sortkey", "sortorder"];

  // Creation of the hooks from the factory based on the options provided
  const useFilteredBy = filteredByHookFactory(sortFilterConfigMap, defaultSortingFilteringOptions.defaultFilters);
  const useSortedBy = sortedByHookFactory(sortFilterConfigMap, defaultSortingFilteringOptions.defaultSort);

  const useLocalFilterSortContext = (unfilteredData?: T[]) => {
    const [cookieInit, cookieSync] = useCookieSync(defaultSortingFilteringOptions.sync?.cookieKey, optionsKeys);
    const [searchParamsInit, searchParamSync] = useSearchParamsSync(optionsKeys);

    const { filteredBy, filterBy, clearFilteredBy } = useFilteredBy(cookieInit ?? searchParamsInit);
    const { sortedBy, sortBy, clearSortedBy } = useSortedBy(cookieInit ?? searchParamsInit);

    // Sync changes to Cookie(optional) and URL search params
    useEffect(() => {
      if (defaultSortingFilteringOptions.sync) {
        const record = {
          ...arrayToRecord(
            filteredBy,
            (e) => e.key,
            (e) => e.value.join(","),
          ),
          sortkey: sortedBy?.key,
          sortorder: sortedBy?.order,
        };
        if (defaultSortingFilteringOptions.sync.cookieKey) cookieSync?.(record);
        if (defaultSortingFilteringOptions.sync.searchParams) searchParamSync(record);
      }
    }, [cookieSync, filteredBy, searchParamSync, sortedBy?.key, sortedBy?.order]);

    const resetSortingFiltering = useCallback(() => {
      clearFilteredBy();
      clearSortedBy();
    }, [clearFilteredBy, clearSortedBy]);

    //
    // Filtering of the data
    //
    const filterFunctions = useMemo(
      () => filteredBy.map((filter) => filter.config.filter?.(filter.value)).filter((element) => excludeFalsy(element)),
      [filteredBy],
    );

    // DEV - WARNING
    // Rapidly updating a filter can trigger successive computations.
    // consider using npm library use-debounce and use it as
    // const filterFunctionsDebounce = useDebounce(filterFunctions, 250, {trailing: true})
    // use-debounce accept arrays as props hence this library.
    // replace filterFunction.every by filterFunctionsDebounce.every

    const filtered = useMemo(
      () => unfilteredData?.filter((p) => filterFunctions.every((fv) => fv(p))),
      [unfilteredData, filterFunctions],
    );

    const filteredSorted = useMemo(() => {
      if (!sortedBy) return filtered;

      const sortConfig = sortFilterConfigMap[sortedBy.key];
      const sortFn = sortConfig.sort;
      if (!sortFn) {
        console.warn(
          `The filtering & sorting config does not contain the sorting function. check key <${sortedBy.key}>`,
        );
        return filtered;
      }

      return sortedBy.order === "asc" ? lodashSortBy(filtered, sortFn) : lodashSortBy(filtered, sortFn).toReversed();
    }, [filtered, sortedBy]);

    return useMemo(
      () => ({
        unfilteredData,
        filteredSortedData: filteredSorted,
        resetSortingFiltering,
        sortBy,
        filterBy,
        sortedBy,
        filteredBy,
        sortFilterConfigMap,
        clearFilteredBy,
      }),
      [unfilteredData, filteredSorted, resetSortingFiltering, sortBy, filterBy, sortedBy, filteredBy, clearFilteredBy],
    );
  };

  const FilterSortContext = createContext<ReturnType<typeof useLocalFilterSortContext> | null>(null);

  // Ensure useFilterContext is wrapped inside a FilterSortContextProvider component
  const useFilterSortContext = () => typedAsserted(useContext(FilterSortContext));

  const FilterSortContextProvider = ({ children, data }: PropsWithChildren<{ data: T[] }>) => {
    const context = useLocalFilterSortContext(data);
    return <FilterSortContext.Provider value={context}>{children}</FilterSortContext.Provider>;
  };

  return { useFilterSortContext, FilterSortContextProvider };
};
