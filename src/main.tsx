// import { registerSW } from "virtual:pwa-register";

import { initializeColorMode } from "src/theme/color-mode.store";

initializeColorMode();

/**
 * Lazy Loading: Reduces initial bundle size by loading react-dom/client and ./app only when needed.
 * Parallel Loading: Promise.all ensures both modules load concurrently.
 * Better Tree-Shaking: Dynamic imports allow bundlers to exclude unused code more effectively.
 */

// eslint-disable-next-line unicorn/prefer-top-level-await
Promise.all([import("react-dom/client"), import("src/app")]).then(async ([ReactDOM, AppModule]) => {
  const rootNode = document.querySelector("#root");
  if (!rootNode) throw new Error("rootNode not found");
  const root = ReactDOM.createRoot(rootNode);
  const App = AppModule.default;
  root.render(<App />);
});
