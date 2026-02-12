import { useCallback } from "react";

import { atom, useAtom } from "jotai";

const hiddenSeriesAtom = atom<string[]>([]);

export const useChartHiddenSeries = () => {
  const [hiddenSeries, setHiddenSeries] = useAtom(hiddenSeriesAtom);

  const toggleDataKey = useCallback(
    (dataKey: string) => {
      setHiddenSeries((prev) => {
        if (prev.includes(dataKey)) {
          return prev.filter((d) => d !== dataKey);
        }
        return [...prev, dataKey];
      });
    },
    [setHiddenSeries],
  );

  return [hiddenSeries, toggleDataKey] as const;
};
