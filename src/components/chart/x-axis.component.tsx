import type { XAxisProps } from "recharts";
import { XAxis } from "recharts";

export const XAxisExtended = (props: XAxisProps) => {
  return (
    <XAxis
      dataKey="index"
      type="number"
      domain={["dataMin", "dataMax"]}
      stroke="#6b7280"
      tick={{ fontSize: 12 }}
      tickCount={8}
      angle={-45}
      textAnchor="end"
      fontWeight="bold"
      height={65}
      {...props}
    />
  );
};
