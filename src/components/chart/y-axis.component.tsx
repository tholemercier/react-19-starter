import type { YAxisProps } from "recharts";
import { YAxis } from "recharts";

export const YAxisExtended = (props: YAxisProps) => {
  return <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} fontWeight="bold" {...props} />;
};
