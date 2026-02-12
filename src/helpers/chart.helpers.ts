import { groupBy } from "src/vendors/lodash";

export type Timeserie = { date: string; [key: string]: string | number };
export type DateReducer<T, R> = (params: { date: string; items: T[]; prev: R | null }) => R;
export const createTimeSeries = <T, R>(data: T[], getTime: (p: T) => number, dateReducer: DateReducer<T, R>) => {
  const grouped = groupBy(data, getTime);
  const sortedDates = Object.keys(grouped);

  const result: Record<string, R> = {};
  let prev: R | null = null;

  for (const date of sortedDates) {
    const items = grouped[date];
    const value = dateReducer({ date, items, prev });
    result[date] = value;
    prev = value;
  }

  return result;
};
