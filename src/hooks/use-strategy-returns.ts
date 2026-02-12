import { useMemo } from "react";

import { recordKeys } from "src/libs/record";
import { round } from "src/vendors/lodash";

import type { PositionsType } from "./api/use-positions";

export type ReturnsType = { total: number; w: number; l: number; r: number };
export const useStrategyReturns = (allPositions: PositionsType[]) => {
  return useMemo(() => {
    // eslint-disable-next-line unicorn/no-array-reduce
    return allPositions.reduce<Record<string, ReturnsType>>(
      (acc, curr) => {
        if (curr.strategy === "DIVIDEND") return acc;
        const profit = curr.profit + curr.swap;
        if (recordKeys(acc).includes(curr.strategy)) {
          acc[curr.strategy].total += profit;
          acc[curr.strategy].w += profit > 0 ? 1 : 0;
          acc[curr.strategy].l += profit < 0 ? 1 : 0;
          acc[curr.strategy].r = round((acc[curr.strategy].w / (acc[curr.strategy].w + acc[curr.strategy].l)) * 100, 0);
        } else {
          acc[curr.strategy] = { total: profit, w: profit > 0 ? 1 : 0, l: profit < 0 ? 1 : 0, r: 0 };
        }

        acc["ALL"].total += profit;
        acc["ALL"].w += profit > 0 ? 1 : 0;
        acc["ALL"].l += profit < 0 ? 1 : 0;
        acc["ALL"].r = round((acc["ALL"].w / (acc["ALL"].w + acc["ALL"].l)) * 100, 0);
        return acc;
      },
      { ALL: { total: 0, w: 0, l: 0, r: 0 } },
    );
  }, [allPositions]);
};
