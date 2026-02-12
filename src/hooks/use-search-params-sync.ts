import { useCallback, useMemo } from "react";

import { useSearchParams } from "react-router";

import { arrayToRecord } from "src/libs/record";

/**
 * A custom React hook that synchronizes specified query string parameters with component state.
 *
 * This hook reads the initial values of specified keys from the URL's search parameters on first render
 * and returns a function to update those parameters. The initially returned values do **not** update
 * if the URL changes afterward—this hook is intentionally not reactive to external changes in the search params.
 *
 * @template K - A string literal union type representing the keys to sync from the search params.
 *
 * @param {readonly K[]} keys - An array of query parameter keys to read from and sync with the URL.
 *
 * @returns {[Record<K, string | undefined>, (r: Record<string, string | undefined>) => void]}
 * A tuple:
 *   - A record of the initial values of the specified keys from the URL's search parameters (captured once on mount).
 *   - A function to update the URL search parameters with new values for the given keys.
 *
 * @example
 * const [params, setParams] = useSearchParamsSync(['filter', 'sort']);
 *
 * useEffect(() => {
 *   console.log(params.filter); // Will always log the value of 'filter' from initial page load
 * }, []);
 *
 * const update = () => {
 *   setParams({ filter: 'new', sort: 'asc' });
 * };
 */
export const useSearchParamsSync = <K extends string>(
  keys: readonly K[],
): [Record<K, string | undefined>, (r: Record<string, string | undefined>) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();

  const storedValuesOnLoad = useMemo(() => {
    return arrayToRecord(
      keys,
      (k) => k,
      (k) => searchParams.get(k),
    ) as Record<K, string | undefined>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSearchParams = useCallback(
    (r: Record<string, string | undefined>) => {
      for (const k of keys)
        if ((searchParams.get(k) ?? "") !== (r[k] ?? "")) {
          if (r[k]) searchParams.set(k, r[k]);
          else searchParams.delete(k);
        }
      setSearchParams(searchParams);
    },
    [keys, searchParams, setSearchParams],
  );

  return useMemo(() => [storedValuesOnLoad, updateSearchParams] as const, [storedValuesOnLoad, updateSearchParams]);
};
