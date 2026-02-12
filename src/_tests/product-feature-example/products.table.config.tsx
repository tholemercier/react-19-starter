import type { DataGridConfigMap } from "src/libs/data-grid";
import { dataGridComponentsFactory, dataGridContextFactory } from "src/libs/data-grid";
import { sortFilterComponentsFactory } from "src/libs/sort-filter";

import type { KeysOfProduct, ProductSubType } from "./products.api";
import { CustomTd } from "./products.custom.td.component";
// for testing purpose, ignore the dependency cycle
// eslint-disable-next-line import/no-cycle
import { CustomTh } from "./products.custom.th.component";

const cols: DataGridConfigMap<KeysOfProduct, ProductSubType> = {
  title: {
    th: {
      render: () => "title",
    },
    valueAsString: (d) => d.title,
    sort: (e) => e.title,
  },
  category: {
    th: {
      render: CustomTh,
    },
    valueAs: CustomTd,
    valueAsString: (d) => d.category,
    sort: (e) => e.category,
    filter: (searchValue) => (product) => product.category.toLowerCase().includes(searchValue[0].toLowerCase()),
  },
};

// Table Context related to the Products
const { DataGridContextProvider, useDataGridContext } = dataGridContextFactory(cols, { sync: { searchParams: true } });
const { Th: ProductTh, Td: ProductTd } = dataGridComponentsFactory(useDataGridContext);

// Use the product table context hook to initialize the Input related to the filtering & sorting context
const { InputText: SearchProductInputText } = sortFilterComponentsFactory(useDataGridContext);

export { ProductTd, ProductTh, SearchProductInputText, DataGridContextProvider, useDataGridContext };
