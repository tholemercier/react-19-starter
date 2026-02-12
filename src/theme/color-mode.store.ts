import { useCallback, useMemo } from "react";

import { atom, useAtom } from "jotai";

const colorModeStorageKey = "color-mode";
const systemPrefersDark = globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
const stored = localStorage.getItem(colorModeStorageKey) as "dark" | "light" | null;

const initialMode = stored ?? (systemPrefersDark ? "dark" : "light");

const colorMode = atom<"dark" | "light">(initialMode);

export const initializeColorMode = () => {
  document.documentElement.classList.toggle("dark", !(initialMode === "light"));
};

export const useColorMode = () => {
  const [cm, set] = useAtom(colorMode);

  const toggleColorMode = useCallback(() => {
    const newMode = cm === "dark" ? "light" : "dark";
    set(newMode);
    localStorage.setItem(colorModeStorageKey, newMode);
    document.documentElement.classList.toggle("dark", !(newMode === "light"));
  }, [cm, set]);

  return useMemo(
    () => ({
      colorMode: cm,
      isDarkMode: cm === "dark",
      isLightMode: cm !== "dark",
      toggleColorMode,
    }),
    [cm, toggleColorMode],
  );
};

export const toggleDocumentColorMode = () => {
  document.documentElement.classList.toggle("dark");
};
