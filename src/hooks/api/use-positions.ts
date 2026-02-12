import { useEffect, useRef } from "react";

import { useQuery } from "@tanstack/react-query";

import { useBaseApiFn } from "src/helpers/api-factory";
import { getQueryOptions, useCacheConfigQueryKey } from "src/libs/api";

const API_PATH = "/positions";

export type StrategyType = "MANUAL" | "DIVIDEND" | string;

export type PositionsType = {
  position_id: string;
  type: string;
  open_time: string;
  close_time: string;
  strategy: StrategyType;
  open_at_price: string;
  close_at_price: string;
  profit: number;
  volume: number;
  swap: number;
  symbol: string;
  close_reason: "manual" | "broker" | "sl";
};

export type LivePositionType = {
  type: string;
  open_time: string;
  strategy: StrategyType;
  open_price: number;
  current_price: number;
  profit: number;
  volume: number;
  swap: number;
  symbol: string;
};

export type PendingPositionType = {
  strategy_key: string;
  volume: number;
  platform: string;
  broker_symbol: string;
  order_type: string;
  status: string;
  trace: string;
};

export const useTradingHistory = (from?: string, to?: string) => {
  const prev = useRef<PositionsType[]>([]);
  let path: `/${string}` = `${API_PATH}/history`;
  if (from && to) {
    path = `${API_PATH}/history?from=${from}&to=${to}`;
  }
  const apiFn = useBaseApiFn<PositionsType[]>(path);
  const query = useQuery({
    ...getQueryOptions(apiFn, { queryKey: [`${API_PATH}/history`, { from, to }, ...useCacheConfigQueryKey()] }),
    placeholderData: () => prev.current,
  });

  useEffect(() => {
    prev.current = !query.isFetching && query.isError ? [] : (query.data ?? []);
  }, [query]);
  return query;
};

export const useLivePositions = () => {
  const apiFn = useBaseApiFn<LivePositionType[]>(`${API_PATH}/live`);
  const query = useQuery({
    ...getQueryOptions(apiFn, { queryKey: [`${API_PATH}/live`, ...useCacheConfigQueryKey()] }),
    placeholderData: (prev) => prev,
  });
  return query;
};

export const usePendingPositions = () => {
  const apiFn = useBaseApiFn<PendingPositionType[]>(`${API_PATH}/pending`);
  const query = useQuery({
    ...getQueryOptions(apiFn, { queryKey: [`${API_PATH}/pending`, ...useCacheConfigQueryKey()] }),
    placeholderData: (prev) => prev,
  });
  return query;
};
