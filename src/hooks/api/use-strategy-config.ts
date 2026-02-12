import { useCallback } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useBaseApiFn } from "src/helpers/api-factory";
import { getQueryOptions, useCacheConfigQueryKey, useInvalidate } from "src/libs/api";

const API_PATH = "/strategy-config";

export type StrategyConfigType = {
  strategy_key: string;
  platform: string;
  positioning: string;
  broker_symbol: string;
  volume: number;
  enabled: boolean;
  email_subject: string;
};

export type PositionCloseReason = "manual" | "broker" | "sl" | "tp" | "strategy";

export type StrategyConfigPositionsType = {
  id: number;
  position_id: string;
  type: string;
  open_time: string;
  close_time: string;
  strategy: string;
  open_at_price: string;
  close_at_price: string;
  profit: number;
  volume: number;
  swap: number;
  symbol: string;
  close_reason: PositionCloseReason;
};

export const useStrategyConfig = () => {
  const apiFn = useBaseApiFn<StrategyConfigType[]>(API_PATH);
  const query = useQuery({
    ...getQueryOptions(apiFn, { queryKey: [API_PATH, ...useCacheConfigQueryKey()] }),
  });
  return query;
};

export function useCreateStrategyConfig(onSuccess?: () => void) {
  const apiFn = useBaseApiFn<void, Partial<StrategyConfigType>>(API_PATH, { method: "POST" });
  const mutationFn = useCallback(async (product: Partial<StrategyConfigType>) => apiFn(product), [apiFn]);
  const invalidate = useInvalidate(API_PATH, { onSuccess });
  return useMutation({ onSuccess: invalidate, mutationFn });
}

export function useUpdateStrategyConfig(d: StrategyConfigType, onSuccess?: () => void) {
  const apiFn = useBaseApiFn<void, Partial<StrategyConfigType>>(`${API_PATH}/${d.strategy_key}`, { method: "PUT" });
  const mutationFn = useCallback(async (product: Partial<StrategyConfigType>) => apiFn(product), [apiFn]);
  const invalidate = useInvalidate(API_PATH, { onSuccess });
  return useMutation({ onSuccess: invalidate, mutationFn });
}

export function useDeleteStrategyConfig(d: StrategyConfigType, onSuccess?: () => void) {
  const apiFn = useBaseApiFn<void>(`${API_PATH}/${d.strategy_key}`, { method: "DELETE" });
  const mutationFn = useCallback(async () => apiFn(), [apiFn]);
  const invalidate = useInvalidate(API_PATH, { onSuccess });
  return useMutation({ onSuccess: invalidate, mutationFn });
}

export const useStrategyConfigPositions = () => {
  const apiFn = useBaseApiFn<Record<string, StrategyConfigPositionsType[]>>(`${API_PATH}/positions/history`);
  const query = useQuery({
    ...getQueryOptions(apiFn, { queryKey: [`${API_PATH}/positions/history`, ...useCacheConfigQueryKey()] }),
  });
  return query;
};
