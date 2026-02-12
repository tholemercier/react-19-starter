import { useCallback } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useBaseApiFn } from "src/helpers/api-factory";
import { getQueryOptions, useInvalidate, useCacheConfigQueryKey } from "src/libs/api";

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export type KeysOfProduct = keyof Omit<Product, "id" | "price" | "description" | "image">;
export type ProductSubType = { title: string; category: string };

export const useProducts = () => {
  const apiPath = "/products";
  const apiFn = useBaseApiFn<Product[]>(apiPath);
  const query = useQuery({
    ...getQueryOptions(apiFn, { queryKey: [apiPath, ...useCacheConfigQueryKey()] }),
  });
  return query;
};

export function useCreateProduct(onSuccess?: () => void) {
  const apiPath = "/products";
  const apiFn = useBaseApiFn<void, Partial<Product>>(apiPath, { method: "POST" });
  const mutationFn = useCallback(async (product: Partial<Product>) => apiFn(product), [apiFn]);
  const invalidate = useInvalidate(apiPath, { onSuccess });
  const { mutateAsync } = useMutation({ onSuccess: invalidate, mutationFn });
  return mutateAsync;
}
