import type { UseFilterSortContext } from "src/libs/sort-filter/types";

import { InputTextFactory } from "./input-text.factory";

export const sortFilterComponentsFactory = <K extends string, T extends object>(
  useHook: UseFilterSortContext<K, T>,
) => {
  return {
    InputText: InputTextFactory(useHook),
  };
};
