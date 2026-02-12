import type { FC } from "react";
import { lazy, Suspense } from "react";

/**
 * Creates a lazy-loaded React component that suspends rendering until the component is loaded.
 *
 * This function wraps the `React.lazy` function and adds the ability to provide a custom fallback component
 * while the lazy-loaded component is being fetched. It also ensures that the props passed to the lazy-loaded
 * component are properly forwarded.
 *
 * @template T - The type of props expected by the lazy-loaded component.
 * @param {() => Promise<{ default: FC<T> }>} factory - A function that returns a promise resolving to the lazy-loaded component.
 * @param {React.ReactNode} [fallback=null] - The React node to render while the component is being loaded (defaults to `null`).
 * @returns {FC<T>} - A React functional component that lazily loads the specified component.
 *
 * @example
 * // Lazy-load a component with a custom fallback while it's loading
 * const LazyComponent = lazyLazy(() => import("./SomeComponent"));
 *
 * const MyComponent = () => (
 *   <LazyComponent someProp={value} />
 * );
 *
 * @example
 * // Lazy-load a component with a custom loading spinner as fallback
 * const LazyComponentWithSpinner = lazyLazy(
 *   () => import("./SomeComponent"),
 *   <div>Loading...</div>
 * );
 */
export const lazyLazy = <T extends object>(
  factory: () => Promise<{ default: FC<T> }>,
  fallback: React.ReactNode = null,
): FC<T> => {
  const InnerComponent = lazy(factory);
  const Component: FC<T> = (props) => (
    <Suspense fallback={fallback}>
      <InnerComponent {...props} />
    </Suspense>
  );
  return Component;
};

/**
 * Creates a lazy-loaded React component that suspends rendering until the component is loaded,
 * and automatically passes the provided props to the lazy-loaded component.
 *
 * This function wraps `React.lazy` and adds the ability to provide a custom fallback component
 * while the lazy-loaded component is being fetched. It ensures that the specified props are automatically
 * forwarded to the lazy-loaded component when it is rendered.
 *
 * @template T - The type of props expected by the lazy-loaded component.
 * @param {() => Promise<{ default: FC<T> }>} factory - A function that returns a promise resolving to the lazy-loaded component.
 * @param {T} props - The props to be passed to the lazy-loaded component.
 * @param {React.ReactNode} [fallback=null] - The React node to render while the component is being loaded (defaults to `null`).
 * @returns {FC} - A React functional component that lazily loads the specified component with the provided props.
 *
 * @example
 * // Lazy-load a component with specified props and a default fallback
 * const LazyComponent = lazyLazyWithProps(() => import("./SomeComponent"), { someProp: value });
 *
 * const MyComponent = () => (
 *   <LazyComponent />
 * );
 *
 * @example
 * // Lazy-load a component with a custom loading spinner as fallback
 * const LazyComponentWithSpinner = lazyLazyWithProps(
 *   () => import("./SomeComponent"),
 *   { someProp: value },
 *   <div>Loading...</div>
 * );
 */
export const lazyLazyWithProps = <T extends object>(
  factory: () => Promise<{ default: FC<T> }>,
  props: T,
  fallback: React.ReactNode = null,
): FC => {
  const InnerComponent = lazy(factory);
  const Component: FC = () => (
    <Suspense fallback={fallback}>
      <InnerComponent {...props} />
    </Suspense>
  );
  return Component;
};
