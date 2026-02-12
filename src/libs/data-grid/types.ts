import type { ReactNode } from "react";

import type { DataGridContextFactoryType } from "./context.factory";

export type DataGridConfig<K extends string, T extends object> = {
  th: { render: (tableKey: K, useHook: UseDataGridContext<K, T>) => ReactNode };
  valueAs?: (tableKey: K, data: T, useHook: UseDataGridContext<K, T>) => ReactNode;
  valueAsString: (data: T) => string;
  sort?: (e: T) => number | string;
  filter?: (selectedValue: string[]) => (p: T) => boolean;
};

export type DataGridConfigMap<K extends string, T extends object> = Record<K, DataGridConfig<K, T>>;

export type UseDataGridContext<K extends string, T extends object> = ReturnType<
  DataGridContextFactoryType<K, T>
>["useDataGridContext"];
