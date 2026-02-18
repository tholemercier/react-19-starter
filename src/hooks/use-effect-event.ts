/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line no-restricted-imports
import React, { createContext, use, useInsertionEffect, useRef } from "react";

const context = createContext(1);

function forbiddenInRender() {
  throw new Error("A function wrapped in useEffectEvent can't be called during rendering.");
}

// We can only check if we're in a render phase, beyond initial render, in React 19, with use` hook.
const isInvalidExecutionContextForEventFunction =
  "use" in React
    ? () => {
        // There's no way to check if we're in a render phase from outside of React, the API used by useEffectEvent is private:
        // https://github.com/facebook/react/blob/a00ca6f6b51e46a0ccec54a2231bfe7a1ed9ae1d/packages/react-reconciler/src/ReactFiberWorkLoop.js#L1785-L1788
        // So to emulate the same behavior, we call the use hook and if it doesn't throw, we're in a render phase.
        try {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          return use(context);
        } catch {
          return false;
        }
      }
    : () => false;

/**
 * @deprecated Prefer React.useEffectEvent if using React 19+
 *
 * It is only meant to be used inside a useEffect.
 * It cannot be passed to other components, used in event handlers (like onClick), or called during rendering.
 *
 * Usage Example:
 * @example
    const onClick = useEffectEvent(() => { // ❌ Wrong! Don't use in event handlers doSomething(); });
    // You should prefer useCallback

    const onSearch = useEffectEvent(() => {
        performSearch(query, filters, sortBy);
    });

    useEffect(() => {
        const timeoutId = setTimeout(onSearch, 500);
        return () => clearTimeout(timeoutId);
    }, [query]); // Debounce query, but use latest filters/sortBy

    const onMessage = useEffectEvent((msg) => {
        showToast(msg, { variant: userPreference });
    });

    useEffect(() => {
        const unsubscribe = messageService.subscribe(onMessage);
        return unsubscribe;
    }, []); // Subscribe once, callback uses latest userPreference
 *
 */
export const useEffectEvent = <T extends FunctionLike>(fn: T): T => {
  /**
   * For both React 18 and 19 we set the ref to the forbiddenInRender function, to catch illegal calls to the function during render.
   * Once the insertion effect runs, we set the ref to the actual function.
   */
  const ref = useRef<T>(null);

  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);

  return ((...args: any) => {
    // Performs a similar check to what React does for `useEffectEvent`:
    // 1. https://github.com/facebook/react/blob/b7e2de632b2a160bc09edda1fbb9b8f85a6914e8/packages/react-reconciler/src/ReactFiberHooks.js#L2729-L2733
    // 2. https://github.com/facebook/react/blob/b7e2de632b2a160bc09edda1fbb9b8f85a6914e8/packages/react-reconciler/src/ReactFiberHooks.js#L2746C9-L2750
    if (isInvalidExecutionContextForEventFunction()) {
      forbiddenInRender();
    }

    const latestFn = ref.current!;
    return latestFn(...args);
  }) as T;
};
