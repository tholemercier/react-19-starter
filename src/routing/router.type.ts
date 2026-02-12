import type { FC, PropsWithChildren } from "react";

import type { RouteObject } from "react-router";

import type { ValidHref, ValidParentHref } from "src/routing/pages-config";

export type AccessLevel = "" | "member" | "admin";

export type PageConfig = {
  accessLevel: AccessLevel;
  title?: string;
  Component: FC<Record<string, never>>;
  Container?: FC<PropsWithChildren>;
};

export type StrictRouteObject = RouteObject & {
  path: ValidHref | "*" | ValidParentHref;
  children?: StrictRouteObject[];
};
