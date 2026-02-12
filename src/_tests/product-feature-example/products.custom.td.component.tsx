import { useMemo } from "react";

import type { UseDataGridContext } from "src/libs/data-grid/types";

import type { KeysOfProduct, ProductSubType } from "./products.api";

export const CustomTd = (
  tableKey: KeysOfProduct,
  data: ProductSubType,
  useHook: UseDataGridContext<KeysOfProduct, ProductSubType>,
) => {
  const { dataGridConfigMap } = useHook();
  const value = useMemo(() => {
    return dataGridConfigMap[tableKey].valueAsString(data);
  }, [data, dataGridConfigMap, tableKey]);
  return (
    <td>
      {"<= "}
      {value}
      {" =>"}
    </td>
  );
};
