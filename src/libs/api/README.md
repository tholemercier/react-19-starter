# API HELPERS

A lightweight React Query API utility to simplify creating strongly typed API hooks with built-in base URL support, query caching, and invalidation utilities.

## Features

    Easily create typed React hooks to call REST APIs with automatic base URL prepending.

    Seamlessly integrates with TanStack React Query.

    Utilities for generating query options, cache keys, and invalidation handlers.

    Supports mutation hooks with automatic cache invalidation.

## API Utilities Overview

**createUseApiFnHook(baseUrl: string)**

    Creates a custom React hook that returns a memoized function to call your API at a given path.
    Supports typing the request body and response.
    Automatically prepends the provided baseUrl to all requests.

**getQueryOptions(apiFn, options)**

    Generates React Query options for useQuery, including the query function and cache keys.

**useCacheConfigQueryKey()**

    Returns a stable array of cache config keys to help uniquely identify queries.

**useInvalidate(path, options)**

    Returns a callback to invalidate a query by its path key and optionally run a success callback.

## Usage Example

Here is an example demonstrating how to initialize the fetch hook with a specific URL.

```typescript
const useSameDomainApiFn = createUseApiFnHook();
const useRemoteApiFn = createUseApiFnHook("https://fakestoreapi.com");
const useOtherRemoteApiFn = createUseApiFnHook("https://another-api.com");

export const baseQueryClient = new QueryClient();
export { useSameDomainApiFn , useRemoteApiFn, useOtherRemoteApiFn };
```

Here is an example of how to use the ApiFn Hook

```typescript
export const useProducts = () => {
  const apiPath = "/products";
  const apiFn = useBaseApiFn<Product[]>(apiPath);
  const query = useQuery({
    ...getQueryOptions(apiFn, { queryKey: [apiPath, ...useCacheConfigQueryKey()] }),
  });
  return query;
};

export function useCreateProduct(onSuccess?: () => void) {
  const apiPath = "/products";
  const apiFn = useBaseApiFn<void, Partial<Product>>(apiPath, { method: "POST" });
  const mutationFn = useCallback(async (product: Partial<Product>) => apiFn(product), [apiFn]);
  const invalidate = useInvalidate(apiPath, {onSuccess});
  const { mutateAsync } = useMutation({ onSuccess: invalidate, mutationFn });
  return mutateAsync;
}
```



------------

"browserslist": [
  ">0.5%",
  "last 2 versions",
  "not dead",
  "not ie <= 11"
]