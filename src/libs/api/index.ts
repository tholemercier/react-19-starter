import { useCallback, useMemo } from "react";

import type { QueryClient, UseQueryOptions } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { oneMinute } from "src/libs/time";

/**
 * A custom error type that extends the native `Error` object with additional metadata
 * commonly returned from failed HTTP requests.
 *
 * @typedef {Object} QueryError
 * @property {number} [status] - The HTTP status code of the response (e.g., 404, 500).
 * @property {string} [statusText] - The HTTP status text (e.g., "Not Found", "Internal Server Error").
 * @property {unknown} [body] - The raw response body, typically used for debugging or detailed error handling.
 */
export type QueryError = Error & {
  status?: number;
  statusText?: string;
  body?: unknown;
};

// API Data that can be updated
// type WithUpdatedAt = { updatedAt: Date };

// const structuralSharingSingle =
//   <T extends WithUpdatedAt>() =>
//   (oldData: T | undefined, newData: T) => {
//     if (!oldData) return newData;
//     return +oldData.updatedAt === +newData.updatedAt ? oldData : newData;
//   };

// const structuralSharingMultiple =
//   <T extends WithUpdatedAt>() =>
//   (oldData: T[] | undefined, newData: T[]) => {
//     if (!oldData) return newData;
//     if (oldData.length !== newData.length) return newData;
//     const oldDate = dateMax(...oldData.map((d) => d.updatedAt));
//     const newDate = dateMax(...newData.map((d) => d.updatedAt));
//     return +oldDate === +newDate ? oldData : newData;
//   };

type ApiOptions<B = never> = {
  body?: B;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";
} & Pick<RequestInit, "headers">;

/**
 * A custom React hook that returns a memoized function for making API requests with a configurable base URL.
 * Handles JSON and `FormData` request bodies, sets headers intelligently, and parses responses safely.
 *
 * @template B The type of the request body.
 *
 * @param {string} [baseUrl=""] - The base URL to prepend to all API request paths.
 *
 * @returns {(path: `/${string}`, options?: ApiOptions<B>) => Promise<unknown>}
 * A memoized async function that performs a fetch call to the specified path using the given options.
 *
 * - Automatically sets `Content-Type: application/json` unless the body is a `FormData` instance.
 * - Chooses `POST` as the default method if a body is provided and no method is specified; otherwise defaults to `GET`.
 * - Parses the response body using `JSON.parse` instead of `res.json()` for better fault tolerance.
 * - If the response is not OK (`!res.ok`), throws a `QueryError` enriched with status and body details.
 */
const useApiAdapter = <B = never>(
  baseUrl: string = "",
): ((path: `/${string}`, options?: ApiOptions<B>) => Promise<unknown>) => {
  return useCallback(
    async (path: `/${string}`, options?: ApiOptions<B>) => {
      const res = await fetch(`${baseUrl}${path}`, {
        body: options?.body && (options.body instanceof FormData ? options.body : JSON.stringify(options.body)),
        method: options?.method ?? (options?.body ? "POST" : "GET"),
        // credentials: "include",
        headers: {
          ...(!(options?.body instanceof FormData) && { "Content-Type": "application/json" }),
          ...options?.headers,
        },
      });

      /**
       * Why this over res.json() ?
       * Ignores the Content-Type header
       * Just reads the raw text and tries to parse it as JSON.
       * Will succeed even if the content type is wrong — but may fail if the body isn’t valid JSON.
       */
      const text = await res.text();

      if (!res.ok || res.status > 299) {
        let errorMessage = text || "Unknown error";
        try {
          const parsed = JSON.parse(text);
          errorMessage = parsed.message ?? JSON.stringify(parsed);
        } catch {
          /* empty */
        }

        const error: QueryError = new Error(errorMessage);

        error.status = res.status;
        error.statusText = res.statusText;
        error.body = text;

        throw error;
      }

      return JSON.parse(text);
    },
    [baseUrl],
  );
};

/**
 * A utility type used to indicate the absence of a body in API calls.
 *
 * This type is designed to be used as a default for generic parameters,
 * ensuring that TypeScript enforces the absence of a request body when needed.
 */
type DummyType = { ___dummy: never };

/**
 * Factory function that creates a React hook for making API requests with a preset base URL.
 *
 * @param {string} [baseUrl=""] - The base URL prepended to all API request paths.
 *
 * @returns {(path: `/${string}`, options?: ApiOptions<B>) => DummyType extends B ? () => Promise<T> : (body: B) => Promise<T>}
 * A React hook that returns a memoized function to perform API requests:
 * - The returned function accepts a request body if needed, depending on the generic parameter `B`.
 * - `T` is the expected response type.
 *
 * @template T The expected response type from the API.
 * @template B The request body type. If `DummyType`, the returned function takes no argument.
 */
export const createUseApiFnHook = (baseUrl: string = "") => {
  /**
   * A custom React hook that returns a memoized function for making API requests to a given path.
   * The function signature adapts depending on whether a request body is expected.
   *
   * @template T The expected response type from the API.
   * @template B The type of the request body. If `DummyType`, the returned function takes no arguments.
   *
   * @param {`/${string}`} path - The relative API endpoint path (must start with a slash).
   * @param {ApiOptions<B>} [options] - Optional API configuration such as method, headers, etc.
   *
   * @returns {DummyType extends B ? () => Promise<T> : (body: B) => Promise<T>}
   * A memoized function that performs the API request:
   * - If `B` is `DummyType`, the returned function takes no parameters.
   * - Otherwise, it accepts a `body` argument of type `B`.
   */
  const useApiFn = <T = unknown, B = DummyType>(
    path: `/${string}`,
    options?: ApiOptions<B>,
  ): DummyType extends B ? () => Promise<T> : (body: B) => Promise<T> => {
    const apiAdapter = useApiAdapter<B>(baseUrl);
    return useCallback(
      (body?: B) => apiAdapter(path, { ...options, body }) as Promise<T>,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [apiAdapter, JSON.stringify(options), path],
    );
  };

  return useApiFn;
};

/**
 * A custom React hook that returns a function to invalidate a specific query in the TanStack Query cache.
 * This is typically used to trigger a refetch of data after a mutation or any state change.
 *
 * @param {`/${string}`} path - The query key path to invalidate (must start with a slash).
 * @param {{ onSuccess?: () => void; queryClient?: QueryClient }} [options] - Optional settings:
 *   - `onSuccess`: A callback function to be called after the query has been invalidated.
 *   - `queryClient`: A custom instance of `QueryClient`. If not provided, the default is used.
 *
 * @returns {() => void} A memoized function that invalidates the query and optionally triggers the `onSuccess` callback.
 */
export const useInvalidate = (
  path: `/${string}`,
  options?: { onSuccess?: () => void; queryClient?: QueryClient },
): (() => void) => {
  const queryClient = useQueryClient(options?.queryClient);
  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [path] });
    options?.onSuccess?.();
  }, [options, path, queryClient]);
};

/**
 * Enhances and returns query options for a React Query request.
 *
 * @template T - The expected response type of the query function.
 *
 * @param {() => Promise<T>} queryFn - The function that fetches data for the query.
 * @param {UseQueryOptions<T>} options - The initial options for the query.
 * @returns {UseQueryOptions<T>} - The modified query options with adjusted `staleTime`, `gcTime`, and `refetchInterval`.
 */
export const getQueryOptions = <T>(queryFn: () => Promise<T>, options: UseQueryOptions<T>): UseQueryOptions<T> => {
  const staleTime = (options.staleTime as number | undefined) ?? oneMinute;
  return {
    gcTime: staleTime + oneMinute,
    staleTime,
    refetchInterval: staleTime,
    placeholderData: (prev) => prev,
    ...options,
    queryFn: () => queryFn(),
  };
};

/**
 * Ensures that the query key includes
 * the current logged-in user details. This prevents stale or cached
 * data from being fetched after the user logs out or switches accounts.
 */
export const useCacheConfigQueryKey = () => {
  // customize the unique user cache ID, user ID, member ID, email etc. if needed
  return useMemo(() => ["user/cache-config"], []);
};
