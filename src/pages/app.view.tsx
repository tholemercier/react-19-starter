import type { PropsWithChildren } from "react";

import clsx from "clsx";

import { AppMenu } from "src/components/app-menu";

export const PageView = ({ children, pageTitle }: PropsWithChildren<{ pageTitle?: string }>) => (
  <div role="main">
    <AppMenu pageTitle={pageTitle} />
    <div className={clsx("mx-auto max-w-7xl p-[clamp(0.75rem,3vw,1.75rem)]")}>{children}</div>
  </div>
);
