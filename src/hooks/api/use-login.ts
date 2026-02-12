import { useCallback } from "react";

import { useMutation } from "@tanstack/react-query";

import { useBaseApiFn } from "src/helpers/api-factory";
import { useInvalidate } from "src/libs/api";

const API_PATH = "/login";

export function useLogin(onSuccess?: () => void) {
  const apiFn = useBaseApiFn<void, { pwd: string }>(API_PATH, { method: "POST" });
  const mutationFn = useCallback(async (p: { pwd: string }) => apiFn(p), [apiFn]);
  const invalidate = useInvalidate(API_PATH, { onSuccess });
  return useMutation({ onSuccess: invalidate, mutationFn });
}
