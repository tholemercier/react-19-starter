import { createBrowserRouter, Outlet } from "react-router";

import { privateRoute, publicRoute } from "./router.helper";
import type { StrictRouteObject } from "./router.type";

export const routerConfig = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [publicRoute("/")],
  },
  {
    path: "/trades-history",
    element: <Outlet />,
    children: [publicRoute("/trades-history")],
  },
  {
    path: "/live-positions",
    element: <Outlet />,
    children: [publicRoute("/live-positions")],
  },
  {
    path: "/settings",
    element: <Outlet />,
    children: [privateRoute("/settings")],
  },
] satisfies StrictRouteObject[]);
