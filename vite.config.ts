import tailwindcss from "@tailwindcss/vite";
import pluginReact from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import type { ConfigEnv, UserConfig } from "vite";
import vitePluginChecker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults } from "vitest/config";

const chunkedEntriesBundleConfig = (config: ConfigEnv, bundleName = "index", outDir = "dist"): UserConfig => {
  const { mode } = config;
  const visualizerPlugin =
    mode === "analyze"
      ? [
          visualizer({
            open: true,
            emitFile: true,
            sourcemap: true,
            brotliSize: true,
            gzipSize: true,
            filename: "bundle-analyzer.html",
          }),
        ]
      : [];

  const checkerPlugin =
    mode === "development"
      ? [
          vitePluginChecker({
            // Runs `tsc --noEmit` under the hood
            // Displays type errors in both the terminal and the browser overlay
            typescript: {
              tsconfigPath: "./tsconfig.json",
            },
          }),
        ]
      : [];

  return {
    optimizeDeps: {
      // Explicitly pre-bundle `xxxxx` to improve dev server performance and avoid module resolution issues.
      include: ["recharts", "@tanstack/react-query"],
    },
    plugins: [
      pluginReact({
        // inject custom Babel config into the React transform step
        // customize how JSX is compiled, or enable new syntax/features
        // Babel with React converts JSX into regular JavaScript
        babel: {
          // hooks into Babel and uses the React Compiler, which analyzes and optimizes React components at build time.
          // explicitly enable React 19-specific optimizations
          plugins: [["babel-plugin-react-compiler", { target: "19" }]],
        },
      }),
      // reads your tsconfig.json and automatically applies the path aliases to Vite’s module resolution
      // Make sure your tsconfig.json has proper "baseUrl" and "paths"
      tsconfigPaths(),
      ...checkerPlugin,
      ...visualizerPlugin,
    ],
    build: {
      outDir,
      cssCodeSplit: true,
      target: "es2017",
      sourcemap: mode === "development" || mode === "analyze",
      emptyOutDir: true,
      minify: mode === "development" ? false : "esbuild",
      rollupOptions: {
        output: {
          entryFileNames: `js/${bundleName}.js`,
          chunkFileNames: "js/chunks/[name]-[hash].js",
          assetFileNames: "assets/[name].[ext]",
          manualChunks(id: string) {
            if (id.includes("node_modules/react/")) return "react";
            if (id.includes("node_modules/react-dom/")) return "react-dom";
            if (id.includes("node_modules/lodash/")) return "lodash";
            if (id.includes("node_modules/react-use/")) return "react-use";
            if (id.includes("node_modules/@tanstack/react-query/")) return "react-query";
            if (id.includes("node_modules/@heroicons/react/")) return "heroicons";
            if (id.includes("node_modules/recharts/")) return "recharts";
          },
        },
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "src/_tests/setup-tests.ts",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        include: ["src/**/*.{ts,tsx,js,jsx}"],
        // Excludes main entry point from the coverage
        // Excludes vendors folder, usually used as re-export tree-shaking optimization
        // Excludes type.ts files such as product.type.ts only containing constants and types
        exclude: [...configDefaults.exclude, "src/main.tsx", "src/vendors/**/*", "**/*.type.ts"],
        thresholds: {
          // Ensures the entire project meets coverage requirements
          global: {
            statements: 75,
            branches: 75,
            functions: 75,
            lines: 75,
          },
          // Ensures every file meets coverage requirements.
          each: {
            statements: 75,
            branches: 75,
            functions: 75,
            lines: 75,
          },
        },
      },
    },
  };
};

export default defineConfig((env) => {
  const baseConfig = chunkedEntriesBundleConfig(env);
  return {
    optimizeDeps: baseConfig.optimizeDeps,
    plugins: [...(baseConfig.plugins ?? []), tailwindcss()],
    build: baseConfig.build,
    test: baseConfig.test,
    server: {
      // proxy: {
      //   "/api": {
      //     target: "https://fakestoreapi.com", // Change to your API
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ""), // Remove "/api" prefix before forwarding
      //   },
      // },
      // port: 443, serves your local dev environment as HTTPS
      // host: custom.domain.localhost, serves your local dev environment through http(s)://custom.domain.localhost
      // Check Host file section in the readme for more info. Double check current way of implementing it as
      // the information can be outdated. Find the latest.
    },
  };
});
