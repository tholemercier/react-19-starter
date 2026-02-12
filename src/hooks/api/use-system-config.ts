import { useCallback } from "react";

import { useQuery, useMutation } from "@tanstack/react-query";

import { useBaseApiFn } from "src/helpers/api-factory";
import { getQueryOptions, useCacheConfigQueryKey, useInvalidate } from "src/libs/api";

const API_PATH = "/system-config";

export type SystemConfigType = {
  id: number;
  key: string;
  value: string;
};

export const useSystemConfig = () => {
  const apiFn = useBaseApiFn<SystemConfigType[]>(API_PATH);
  const query = useQuery({
    ...getQueryOptions(apiFn, { queryKey: [API_PATH, ...useCacheConfigQueryKey()] }),
  });
  return query;
};

export function useCreateSystemConfig(onSuccess?: () => void) {
  const apiFn = useBaseApiFn<void, Partial<SystemConfigType>>(API_PATH, { method: "POST" });
  const mutationFn = useCallback(async (systemConfig: Partial<SystemConfigType>) => apiFn(systemConfig), [apiFn]);
  const invalidate = useInvalidate(API_PATH, { onSuccess });
  return useMutation({ onSuccess: invalidate, mutationFn });
}

export function useUpdateSystemConfig(d: SystemConfigType, onSuccess?: () => void) {
  const apiFn = useBaseApiFn<void, Partial<SystemConfigType>>(`${API_PATH}/${d.key}`, { method: "PUT" });
  const mutationFn = useCallback(async (systemConfig: Partial<SystemConfigType>) => apiFn(systemConfig), [apiFn]);
  const invalidate = useInvalidate(API_PATH, { onSuccess });
  return useMutation({ onSuccess: invalidate, mutationFn });
}

export function useDeleteSystemConfig(d: SystemConfigType, onSuccess?: () => void) {
  const apiFn = useBaseApiFn<void>(`${API_PATH}/${d.key}`, { method: "DELETE" });
  const mutationFn = useCallback(async () => apiFn(), [apiFn]);
  const invalidate = useInvalidate(API_PATH, { onSuccess });
  return useMutation({ onSuccess: invalidate, mutationFn });
}
