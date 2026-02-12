import { lazyLazy } from "src/helpers/lazy-lazy";
import { arrayToRecord, isFullRecord, recordKeys } from "src/libs/record";
import { typedAssert } from "src/libs/type";

import type { PageConfig } from "./router.type";

// Routes Paths source of truth. All pages should be define here and only here.
const routePageDefinition = {
  "/": {
    accessLevel: "",
    title: "Home Page",
    Component: () => <>home</>,
  },
  "/trades-history": {
    accessLevel: "",
    title: "Trades History",
    Component: lazyLazy(() => import("src/pages/trading/trades-history.page")),
  },
  "/live-positions": {
    accessLevel: "",
    title: "Live Positions",
    Component: lazyLazy(() => import("src/pages/trading/live-positions.page")),
  },
  "/settings": {
    accessLevel: "admin",
    title: "Settings Page",
    Component: lazyLazy(() => import("src/pages/settings/settings.page")),
  },
} satisfies Record<`/${string}`, PageConfig>;

const allHrefs = recordKeys(routePageDefinition);

export type ValidHref = (typeof allHrefs)[number];
// ValidParentHref allows a parent path that is not a ValidHref in the routingConfig
export type ValidParentHref = "/" | "/member";

export const appRoutes: Record<ValidHref, PageConfig & { href: ValidHref }> = (() => {
  const allRoutes = arrayToRecord(
    allHrefs,
    (route) => route,
    (v) => ({ ...routePageDefinition[v], href: v }),
  );
  typedAssert(isFullRecord(allRoutes, allHrefs));
  return allRoutes;
})();
