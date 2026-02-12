import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo, useState } from "react";

import { typedAsserted } from "src/libs/type";

const useProvideFeatureContext = () => {
  const [data, setData] = useState(false);

  return useMemo(
    () => ({
      data,
      setData,
    }),
    [data, setData],
  );
};

const FeatureContext = createContext<ReturnType<typeof useProvideFeatureContext> | null>(null);

// typedAsserted to ensure useFeatureContext is used inside a <FeatureContextProvider>
export const useFeatureContext = () => typedAsserted(useContext(FeatureContext));

export const FeatureContextProvider = ({ children }: PropsWithChildren) => {
  const context = useProvideFeatureContext();
  return <FeatureContext.Provider value={context}>{children}</FeatureContext.Provider>;
};
