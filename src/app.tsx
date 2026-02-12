import { StrictMode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";

import { routerConfig } from "src/routing/router-config";

import "src/theme/global.css";

const queryClient = new QueryClient();
export default function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routerConfig} />
      </QueryClientProvider>
    </StrictMode>
  );
}
