import { lazyLazy } from "src/helpers/lazy-lazy";
import { PageView } from "src/pages/app.view";
import type { StrictRouteObject } from "src/routing/router.type";

import type { ValidHref } from "./pages-config";
import { appRoutes } from "./pages-config";
import { SimpleRouteWrapper } from "./simple-route-wrapper";

const AuthenticationProvider = lazyLazy(() => import("src/providers/authentication-provider"));

export const publicRoute = (path: ValidHref): StrictRouteObject => {
  // const Container = appRoutes[path].Container ?? DefaultContainer;
  return {
    path,
    element: (
      <PageView pageTitle={appRoutes[path].title}>
        <SimpleRouteWrapper href={path} />
      </PageView>
    ),
  };
};

export const privateRoute = (path: ValidHref): StrictRouteObject => {
  return {
    path,
    element: (
      <PageView pageTitle={appRoutes[path].title}>
        <AuthenticationProvider accessLevel={appRoutes[path].accessLevel}>
          <SimpleRouteWrapper href={path} />
        </AuthenticationProvider>
      </PageView>
    ),
  };
};
