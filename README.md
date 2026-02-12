# React Starter Pack

A highly-opinionated, production-ready React starter pack built for modern front-end development with full TypeScript support, battle-tested libraries, and a powerful developer experience.

## Prerequisites & Development Environment
- Node.js v22+
- [pnpm](https://pnpm.io/installation)

### Dependency Management
This project uses [`pnpm`](https://pnpm.io/) for managing dependencies. Please ensure you have it installed globally:
```
npm install -g pnpm
```

### Installing Dependencies

To install all project dependencies (with a clean, locked state):
```
pnpm install --frozen-lockfile
```
> This is the preferred method to ensure consistency across environments.

### Checking for Outdated Dependencies
To see which dependencies have newer versions available:
```
pnpm outdated
```

### Updating Dependencies
- To update **minor** and **patch** versions according to `package.json` ranges:
```
pnpm update
```
- To upgrade to **major versions** (which may include breaking changes), update the version manually by runing:
```
pnpm install the-library-to-update@latest
```
> ⚠️ Always review changelogs and test thoroughly when upgrading versions.

## Host & Port
In the **.env** file, there is 2 ENV VARIABLES, VITE_HOST & VITE_PORT.
In Vite, the configuration for the development server is defined in the **vite.config.js** file, where you can specify various settings for the server, including the port and host.

### Port
If the project requires HTTPS on local development, the port can be set to **443**.
Note that MacOs will require you to run it using sudo
```
// In the .env file
VITE_PORT=443

// In your terminal
sudo pnpm dev
```

### Host file (double check accuracy of this information with latest VITE version alongside vite.config.ts)
If the project requires a specific host, regarding CORS limitations for example, the host can be changed.
```
// In the .env file
VITE_HOST=mydomain.com
```
#### MacOs
Update the file /etc/hosts with a new entry for 
```
127.0.0.1 mydomain.com
```
#### Windows
Update the file C:/Windows/System32/drivers/etc/hosts with a new entry for 
```
127.0.0.1 mydomain.com
```

## Developer Experience (DX)

The project leverages a variety of development dependencies to guarantee code consistency and provide a seamless developer experience by surfacing errors as early as possible.

It uses the latest versions of ESLint and Prettier to ensure consistent code formatting across JavaScript and CSS files—allowing some flexibility in CSS formatting with basic rules like tab indentation. The ESLint configuration includes filename consistency and other best practices via the Unicorn plugin, enforces spacing rules, mandates consistent use of clsx for class names, manages import ordering, detects circular dependencies, restricts certain imports (like lodash and react-use) to optimize bundle size, and incorporates various additional TypeScript-specific rules.

### PNPM Scripts

> Note: TypeScript CSS module typings generator (tcm) is a  tool that automatically generates TypeScript type definitions (.d.ts) for CSS modules to enable type-safe styling imports.

- dev: Runs TypeScript CSS module typings generator (tcm) in watch mode alongside the Vite development server concurrently.
- build: Generates CSS module typings, compiles TypeScript in build mode, then runs the Vite production build.
- build:analyze: Generates TypeScript typings for CSS modules, compiles the project with TypeScript, then runs the Vite build in analyze mode to produce a detailed bundle size report.
- lint: Runs ESLint to check code quality and enforce rules.
- test: Runs tests using Vitest.
- test:coverage: Runs tests with coverage reporting and exits.
- test:open: Opens the coverage report HTML file (macOS/Linux).
- test:open:windows: Opens the coverage report HTML file on Windows.
- preview: Serves the production build locally using Vite’s preview server.
- deps:check: Runs a custom node script that returns the list of outdated dependencies

### Vite Configuration Overview

This Vite configuration is tailored for a TypeScript React project using Tailwind CSS and includes several optimizations and developer conveniences for a smooth development and build process.

#### Plugins and Core Features
- React plugin (@vitejs/plugin-react)
    - Enables React support with JSX transformation and integrates a custom Babel plugin, babel-plugin-react-compiler, targeting React 19. This plugin optimizes React component compilation for better build performance and runtime efficiency.
- Tailwind CSS plugin (@tailwindcss/vite)
    - Integrates Tailwind CSS seamlessly into the build pipeline, allowing you to use utility-first CSS with automatic compilation and purging.
- TypeScript Path Alias Support (vite-tsconfig-paths)
    - Automatically resolves module imports based on the paths defined in your tsconfig.json, simplifying import statements and improving maintainability.
- Type Checking (vite-plugin-checker)
    - Runs TypeScript type checks in parallel with the development server, surfacing type errors instantly in your IDE or console, enhancing developer feedback loops without slowing down the build.
- Bundle Visualizer (rollup-plugin-visualizer)
    - Conditionally enabled when running Vite in analyze mode (vite build --mode analyze). It produces a detailed interactive HTML report (bundle-analyzer.html) that includes gzipped and Brotli-compressed sizes, source maps, and the bundle composition, helping identify and optimize large dependencies.

#### Development Server Configuration
- Dependency Optimization
    - The configuration explicitly pre-bundles some external libraries during dev server startup. This speeds up module resolution and avoids potential issues related to deep dependencies, improving hot module replacement and load times.
- Proxy Setup
    - Requests starting with /api can be proxied to for example https://fakestoreapi.com. The proxy also rewrites the path to strip the /api prefix before forwarding, allowing you to avoid CORS issues and work against backend APIs transparently during development.

#### Testing Configuration (Vitest)
- Environment
    - Uses the jsdom environment to simulate a browser-like environment for tests that involve DOM APIs.
- Globals
    - Enables global test APIs (e.g., describe, it, expect) for cleaner test files.
- Setup Files
    - Runs initialization code from ./src/_tests/setup-tests.ts before tests execute, useful for configuring testing utilities or mocking.
- Coverage
    - Uses V8’s built-in coverage provider for performance and accuracy.
    - Reports coverage in multiple formats: text (CLI), JSON, and HTML for browser viewing.
    - Includes coverage metrics for all source files except explicitly excluded paths (e.g., entry points, vendor code, type files).
    - Enforces strict coverage thresholds both globally (overall project) and on a per-file basis, requiring at least 75% coverage for statements, branches, functions, and lines. This promotes high test quality and prevents regressions.

#### Build Options
Generates source maps (sourcemap: true) outside of production builds to facilitate debugging of minified code and enable better error tracing.
This way you avoid shipping source maps in production builds, reducing bundle size and protecting source code, but keep them available when actively developing or analyzing.

#### Summary
This Vite setup ensures:
- Modern React and Tailwind CSS support with efficient compilation.
- Enhanced developer experience with instant type checking and optimized module resolution.
- Easy debugging through source maps and detailed bundle analysis.
- Robust testing setup enforcing strict code coverage standards.
- Proxying for backend API calls during development.

### TSCONFIG Configuration Summary
This configuration is optimized for:
- A React project using the React 17+ JSX transform
- A Vite-based build pipeline with module resolution aligned to bundlers
- Strict type safety
- Fast rebuilds via incremental
- Global types for Vitest and Node.js
- Simplified module imports using baseUrl and paths

### PRETTIER Configuration Overview (Runs alongside ESLint)
This project uses Prettier for consistent code formatting across the codebase. It enforces clean, readable, and uniform style rules for all contributors and integrates seamlessly with Tailwind CSS.
#### Tailwind CSS Formatting
- Enables automatic sorting of Tailwind CSS class names based on the recommended class order. Helps maintain a consistent utility-first style.
- Applies Tailwind sorting even when classes are composed using clsx(...), ensuring consistent ordering in dynamic classnames.

### ESLint Configuration Overview
This project uses an advanced ESLint setup to enforce code quality, consistency, and safety across the entire codebase. It integrates multiple community plugins and best practices for modern React + TypeScript projects.

**Key Features:**
- React & TypeScript support: Uses @typescript-eslint and eslint-plugin-react with recommended rules to handle static typing, JSX, and component patterns.
- Prettier integration: Automatically formats code according to Prettier rules (warns on non-compliance), ensuring style consistency.
- Security rules: Includes eslint-plugin-security to detect common security issues in code.
- Import rules & cycle detection
    - eslint-plugin-import enforces consistent and safe import statements:
    - Detects circular dependencies (import/no-cycle)
    - Orders imports consistently
    - Restricts direct imports of large or critical packages like lodash and react-use to improve bundle size control
- Filename & code style conventions, eslint-plugin-unicorn ensures:
    - Consistent file naming (kebab-case)
    - Avoids null values, abbreviations, and useless code patterns
- Enforces clsx() usage: Custom rules prevent using plain string literals in className, promoting clsx() for maintainable and dynamic Tailwind class handling.
-  Whitespace & formatting rules: Includes rules for spacing, line breaks, comment formatting, and object/array syntax.
- Context performance optimizations: Ensures context values and inline functions are memoized properly to avoid unnecessary re-renders in React.
- Testing-specific overrides: Relaxed max-lines rule in test files to allow flexibility for large test setups.

**Custom ESLint Rules Summary:**
- No console logs (except warn and error)
- No default import of react in React 17+ (auto JSX runtime)
- Prevent direct imports of lodash and react-use
- Enforces top-level type-only imports in TypeScript
- Enforces consistent type usage and disables any where possible
- Strong styling rules: spacing, bracket alignment, empty lines, etc.
- Limits on code complexity: max depth, max lines, and cyclomatic complexity
- Fully typed with support for project references (tsconfig.json)

**Technologies & Plugins Used:**
- @typescript-eslint for TS-specific linting
- eslint-plugin-react & react-hooks for React rules
- eslint-plugin-unicorn for high-level code quality
- eslint-plugin-import for import organization
- eslint-plugin-security for static security analysis
- eslint-plugin-prettier for Prettier integration

## Development Approach: Tailwind + Ark UI, Minimal CSS, Maximum Reusability

### Project Structure Overview
This project follows a modular, maintainable folder structure designed for scalability and clarity:
- **src/pages/**
    - Contains page-level components that represent route endpoints. Each page component is minimal and delegates rendering to a corresponding View component.
- **src/components/**
    - Houses stateless, reusable UI components. These are primarily focused on layout and styling, without holding business logic or state.
- **src/helpers/**
    - Includes TypeScript utility functions for working with arrays, records, dates, and other common data manipulation tasks.
- **src/providers/**
    - Hosts high-level React context providers that wrap the application and share global state or behavior.
- **src/routing/**
    - Centralized type-safe route definitions used by react-router. This ensures consistent navigation and route generation across the app.
- **src/theme/**
    - TailwindCSS configuration and global CSS variables. Controls the visual identity of the app.
- **src/vendors/**
    - Safe wrappers around third-party libraries like lodash or react-use, enabling better tree-shaking and bundle size control.
- **src/hooks/**
    - A collection of custom reusable hooks (e.g. useCookie) that encapsulate logic for common patterns and browser APIs.
- **src/libs/**
    - Self-contained "library-like" modules that encapsulate complex but complete features (e.g. sorting and filtering logic). These should be production-ready and reusable.

## Testing Stack
This project uses a modern testing setup designed for speed, reliability, and maintainability:
- **[`vitest`](https://vitest.dev)**: The testing framework. Built on top of Vite, it offers fast execution, watch mode, TypeScript support, and native ESM handling.
- **[`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro/)**: React-specific testing utilities. Encourages tests that reflect real user interactions by querying elements the way users would.
- **[`@testing-library/jest-dom`](https://github.com/testing-library/jest-dom)**: Provides custom Jest matchers for DOM assertions, making tests more readable and expressive (e.g., `toBeInTheDocument()`).
- **[`jsdom`](https://github.com/jsdom/jsdom)**: Required for simulating a browser-like environment. Allows components to be rendered and tested without a real browser.