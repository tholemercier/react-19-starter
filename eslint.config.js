import pluginJs from "@eslint/js";
import json from "@eslint/json";
import pluginImport from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier/recommended";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginSecurity from "eslint-plugin-security";
import pluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import { configs as pluginTypescriptEslint } from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // other configuration objects, inherit global ignores. Every other file will be included
  {
    ignores: [
      ".env",
      ".github/",
      ".husky/",
      "node_modules/",
      "dist/",
      "build/",
      "coverage/",
      ".vscode",
      ".husky",
      "**/*.d.ts",
      "scripts/",
      "*.js",
    ],
  },
  {
    linterOptions: {
      // Warn for unused //eslint-disable lines
      reportUnusedDisableDirectives: "error",
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      sourceType: "module",
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: true,
      },
      react: {
        version: "detect",
      },
    },
  },
  pluginJs.configs.recommended,
  // pluginTypescriptEslint.recommended is an array and needs to be spread here.
  ...pluginTypescriptEslint.recommended,
  pluginReact.configs.flat.recommended,
  // Add this if you are using React 17+
  pluginReact.configs.flat["jsx-runtime"],
  // For ESLint 9.0.0 and above users, add the recommended-latest config.
  pluginReactHooks.configs.flat.recommended,
  pluginImport.flatConfigs.recommended,
  pluginSecurity.configs.recommended,
  pluginPrettier,
  pluginUnicorn.configs.recommended,
  {
    rules: {
      "security/detect-object-injection": "off",
      // Prettier integration rules
      "prettier/prettier": "warn",

      // File Naming
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: [String.raw`^.*\.config\.(js|ts|mjs)$`, String.raw`^.*\.d\.ts$`],
        },
      ],
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",

      // Custom Rules (Not covered by plugins)
      "spaced-comment": ["error", "always", { exceptions: ["-", "+"] }],
      "key-spacing": ["error", { beforeColon: false, afterColon: true }],
      "no-useless-rename": "error",
      "no-console": ["error", { allow: ["warn", "error"] }],

      // Import/Export Rules
      "import/no-cycle": ["error", { allowUnsafeDynamicCyclicDependency: true }],
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/prefer-default-export": "off",
      "import/no-mutable-exports": "error",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: [],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/newline-after-import": "error",
      "import/no-unresolved": [
        "error",
        {
          caseSensitive: true,
        },
      ],
      "import/no-duplicates": ["error"],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              importNames: ["default"],
              message: "Do not import React in React 17+ projects where it's not needed.",
            },
          ],
        },
      ],

      // Whitespace and Punctuation (Style Rules)
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
      "space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],
      "space-in-parens": ["error", "never"],
      "array-bracket-spacing": ["error", "never"],
      "object-curly-spacing": ["error", "always"],
      "func-call-spacing": ["error", "never"],
      "computed-property-spacing": ["error", "never"],

      // Naming Conventions
      "no-underscore-dangle": ["error", { allow: ["_id", "__dirname"] }],

      // Complexity
      complexity: ["error", { max: 20 }],
      "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
      "max-depth": ["error", 4],

      // TypeScript-Specific Rules (customized)
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unnecessary-condition": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/array-type": "error",

      // React unnecessary import rules
      "react/jsx-no-useless-fragment": ["warn", { allowExpressions: true }],

      // React JSX Pascal Case Rule
      "react/jsx-pascal-case": [
        "error",
        {
          allowAllCaps: false,
          ignore: [],
        },
      ],

      // React: Prevent nesting component definitions inside another component
      "react/no-unstable-nested-components": ["error", { allowAsProps: true }],

      // React: Prevent re-renders by ensuring context values are memoized
      "react/jsx-no-constructed-context-values": "error",

      // React: Prevent inline function in components properties. Prefer useCallback usage
      "react/jsx-no-bind": [
        "error",
        {
          allowArrowFunctions: false, // disallow () => {}
          allowFunctions: true, // allow passing named functions
          ignoreRefs: true,
          allowBind: false,
        },
      ],
    },
  },
  {
    files: ["**/*.json"],
    ignores: ["package-lock.json"],
    ...json.configs.recommended,
  },
  {
    files: ["**/*.json"],
    ignores: ["package-lock.json"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
      "max-lines": "off",
    },
  },
  {
    files: ["**/*.test.{js,mjs,cjs,ts,jsx,tsx}"],
    rules: {
      "max-lines": "off",
    },
  },
];
