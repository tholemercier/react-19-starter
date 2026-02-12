import type { ReactNode } from "react";

export type ConfigItemType<T> = {
  renderColHead: (d?: T) => ReactNode;
  renderColCell: (d: T) => ReactNode;
  renderInput: (
    k: keyof T,
    c: ConfigItemType<T>,
    d: T,
    isCreate: boolean,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
  ) => ReactNode;
  mobileHidden?: boolean;
  value: (d?: T) => unknown;
};
export type ConfigType<T> = Record<keyof Omit<T, "id">, ConfigItemType<T>>;
