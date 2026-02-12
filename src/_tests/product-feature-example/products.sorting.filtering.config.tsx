import type { SortFilterConfigMap } from "src/libs/sort-filter";
import { sortFilterComponentsFactory, sortFilterContextFactory } from "src/libs/sort-filter";

import type { Product } from "./products.api";

type KeysOfProduct = keyof Omit<Product, "id" | "price" | "description" | "image">;

export const filterConfig: SortFilterConfigMap<KeysOfProduct, Product> = {
  category: {
    label: () => "Search Category",
    filter: (v) => (e) => e.category.toLowerCase().includes(v[0].toLowerCase()),
    sort: (v) => v.category,
  },
  title: {
    label: () => "Search Title",
    filter: (v) => (e) => e.title.toLowerCase().includes(v[0].toLowerCase()),
    sort: (v) => v.title,
  },
};

const {
  useFilterSortContext: useProductFilterSortContext,
  FilterSortContextProvider: ProductFilterSortContextProvider,
} = sortFilterContextFactory<KeysOfProduct, Product>(filterConfig, {
  sync: { cookieKey: "test", searchParams: true },
});
export { ProductFilterSortContextProvider, useProductFilterSortContext };

const { InputText: SearchProductInputText } = sortFilterComponentsFactory(useProductFilterSortContext);
export { SearchProductInputText };
