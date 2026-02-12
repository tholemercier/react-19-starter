import type { PropsWithChildren } from "react";

export const ModalTitle = ({ children }: PropsWithChildren) => (
  <h2 className="mb-6 text-2xl font-semibold">{children}</h2>
);
