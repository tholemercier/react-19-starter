import type { ValidHref } from "src/routing/pages-config";
import { appRoutes } from "src/routing/pages-config";

export const SimpleRouteWrapper = ({ href }: { href: ValidHref }) => {
  const { Component } = appRoutes[href];
  return <Component />;
};
