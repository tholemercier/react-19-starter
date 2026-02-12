import { useCallback } from "react";

import clsx from "clsx";

import localStyles from "./product.module.css";
import { SearchProductInputText, useProductFilterSortContext } from "./products.sorting.filtering.config";

export const ProductListView = () => {
  const { filteredSortedData, sortFilterConfigMap, sortBy, sortedBy } = useProductFilterSortContext();

  const onTitleSort = useCallback(() => {
    sortBy({
      key: "title",
      order: sortedBy?.key === "title" ? (sortedBy.order === "asc" ? "desc" : "asc") : "asc",
      config: sortFilterConfigMap.title,
    });
  }, [sortBy, sortedBy, sortFilterConfigMap]);

  const onCategorySort = useCallback(() => {
    sortBy({
      key: "category",
      order: sortedBy?.key === "category" ? (sortedBy.order === "asc" ? "desc" : "asc") : "asc",
      config: sortFilterConfigMap.category,
    });
  }, [sortBy, sortedBy, sortFilterConfigMap]);

  return (
    <div
      className={clsx(
        localStyles["products-l"],
        "rounded-md bg-primary-100 p-3 dark:bg-primary-800 dark:text-primary-100",
      )}
    >
      <h4 className={clsx("m-1 w-full bg-brand-700 p-4 text-primary-100 dark:bg-brand-400")}>test</h4>
      <div style={{ marginBottom: "5px" }}>
        <SearchProductInputText dataKey="category" />
        <button onClick={onCategorySort}>sort</button>
      </div>

      <div style={{ marginBottom: "5px" }}>
        <SearchProductInputText dataKey="title" />
        <button onClick={onTitleSort}>sort</button>
      </div>
      {filteredSortedData?.map((p) => (
        <div key={p.id}>
          {p.title} - {p.category}
        </div>
      ))}
    </div>
  );
};
