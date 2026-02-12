import type { ChangeEvent } from "react";
import { useCallback, useMemo } from "react";

import type { SortingFilteringFactoryLikeProps, UseFilterSortContext } from "src/libs/sort-filter/types";

const DefaultInputText = <K extends string, T extends object>(props: SortingFilteringFactoryLikeProps<K, T>) => {
  const { filteredBy, filterBy, clearFilteredBy, sortFilterConfigMap, dataKey } = props;

  const value = useMemo(() => filteredBy.find((e) => e.key === dataKey)?.value[0] ?? "", [filteredBy, dataKey]);

  const onChange = useCallback(
    (e: ChangeEvent<{ value: string }>) => {
      if (e.target.value.length === 0) clearFilteredBy(dataKey);
      else
        filterBy({
          key: dataKey,
          config: sortFilterConfigMap[dataKey],
          value: [e.target.value],
        });
    },
    [clearFilteredBy, dataKey, filterBy, sortFilterConfigMap],
  );

  return (
    <div style={{ marginBottom: "5px" }}>
      <label>{sortFilterConfigMap[dataKey].label?.()} :</label>
      <input type="text" value={value} onChange={onChange} />
    </div>
  );
};

export const InputTextFactory = <K extends string, T extends object>(useHook: UseFilterSortContext<K, T>) => {
  return function InputText({ dataKey }: { dataKey: K }) {
    const context = useHook();

    return <DefaultInputText {...context} dataKey={dataKey} />;
  };
};
