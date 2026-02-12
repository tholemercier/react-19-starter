import { round } from "src/vendors/lodash";

export const toCurrency = (v: number = 0) =>
  Intl.NumberFormat("en-EN", { style: "currency", currency: "USD" }).format(round(v, 2));
