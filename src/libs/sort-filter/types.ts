import type { SortFilterContextFactoryType } from "./context.factory";

export type FilteredByState<K extends string, T extends object> = {
  key: K;
  config: SortFilterConfig<T>;
  value: string[];
};

export type SortedByType<K extends string, T extends object> = {
  key: K;
  config: SortFilterConfig<T>;
  order: "asc" | "desc";
};

export type SortingFilteringFactoryLikeProps<K extends string, T extends object> = ReturnType<
  UseFilterSortContext<K, T>
> & {
  dataKey: K;
};

export type UseFilterSortContext<K extends string, T extends object> = ReturnType<
  SortFilterContextFactoryType<K, T>
>["useFilterSortContext"];

export type SortFilterConfig<T extends object> = {
  label?: () => string;
  sort?: (e: T) => number | string;
  filter?: (selectedValue: string[]) => (p: T) => boolean;
  options?: (ee: T[]) => (string | Falsy)[];
  renderStringValue?: (selectedValue: string) => string;
};

export type SortFilterConfigMap<K extends string, T extends object> = Record<K, SortFilterConfig<T>>;

export type DefaultSortFilterOptions<K extends string, T extends object> = {
  defaultFilters?: FilteredByState<K, T>[];
  defaultSort?: SortedByType<K, T>;
  sync?: {
    cookieKey?: string;
    searchParams?: boolean;
  };
};
