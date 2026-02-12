import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo } from "react";

import type { DefaultSortFilterOptions } from "src/libs/sort-filter";
import { sortFilterContextFactory } from "src/libs/sort-filter";
import { typedAsserted } from "src/libs/type";

import type { DataGridConfigMap } from "./types";

export type DataGridContextFactoryType<K extends string, T extends object> = typeof dataGridContextFactory<K, T>;

export const dataGridContextFactory = <K extends string, T extends object>(
  dataGridConfigMap: DataGridConfigMap<K, T>,
  defaultSortFilterOptions: DefaultSortFilterOptions<K, T> = {},
) => {
  const { FilterSortContextProvider, useFilterSortContext } = sortFilterContextFactory(
    dataGridConfigMap,
    defaultSortFilterOptions,
  );

  const useLocalTableContext = () => {
    const filterSortContext = useFilterSortContext();

    return useMemo(
      () => ({
        ...filterSortContext,
        dataGridConfigMap,
      }),
      [filterSortContext],
    );
  };

  const TableContext = createContext<ReturnType<typeof useLocalTableContext> | null>(null);

  const useDataGridContext = () => typedAsserted(useContext(TableContext));

  const DataGridContextProvider = ({ children }: PropsWithChildren) => {
    const context = useLocalTableContext();
    return <TableContext.Provider value={context}>{children}</TableContext.Provider>;
  };

  const DataGridContextProviderWrapper = ({ children, data }: PropsWithChildren<{ data: T[] }>) => {
    return (
      <FilterSortContextProvider data={data}>
        <DataGridContextProvider>{children}</DataGridContextProvider>
      </FilterSortContextProvider>
    );
  };

  return { useDataGridContext, DataGridContextProvider: DataGridContextProviderWrapper };
};
