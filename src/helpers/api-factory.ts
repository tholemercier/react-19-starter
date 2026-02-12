import { QueryClient } from "@tanstack/react-query";

import { createUseApiFnHook } from "src/libs/api";

const useBaseApiFn = createUseApiFnHook(`${import.meta.env.VITE_API_BASE}/api`);
const useOtherApiFn = createUseApiFnHook("https://fakestoreapi.com");

export const baseQueryClient = new QueryClient();
export { useBaseApiFn, useOtherApiFn };
