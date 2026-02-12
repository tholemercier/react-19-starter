import { useQuery } from "@tanstack/react-query";

import { useBaseApiFn } from "src/helpers/api-factory";
import { getQueryOptions, useCacheConfigQueryKey } from "src/libs/api";

const API_PATH = "/account/info";

export type AccountInfoType = {
  current_capital: number;
  principal: number;
  floating_capital: number;
  pnl: number;
};

export const useAccountInfo = () => {
  const apiFn = useBaseApiFn<AccountInfoType>(`${API_PATH}`);
  const query = useQuery({
    ...getQueryOptions(apiFn, { queryKey: [`${API_PATH}`, ...useCacheConfigQueryKey()] }),
  });
  return query;
};
