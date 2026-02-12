import { ProductTd, ProductTh, useDataGridContext } from "./products.table.config";

export const ProductTableView = () => {
  const { filteredSortedData } = useDataGridContext();

  return (
    <table>
      <tr>
        <ProductTh tableKey="title" />
        <ProductTh tableKey="category" />
      </tr>
      {filteredSortedData?.map((r) => (
        <tr key={r.title}>
          <ProductTd tableKey="title" data={r} />
          <ProductTd tableKey="category" data={r} />
        </tr>
      ))}
    </table>
  );
};
