import { useCallback, useMemo } from "react";

import { arrayToRecord } from "src/libs/record";
import { inSomeTime } from "src/libs/time";
import { useCookie } from "src/vendors/react-use";

/**
 * Custom React hook that reads selected key-value pairs from a cookie on initial render
 * and provides a function to update those values in the cookie.
 *
 * @template K - A string literal type representing the allowed keys to sync.
 *
 * @param {string | undefined} cookieKey - The name of the cookie to sync with.
 *        If undefined, the hook returns `[undefined, undefined]`.
 * @param {readonly K[]} keys - An array of string keys to extract from the cookie and manage.
 *
 * @returns {[Record<K, string | undefined>, (r: Record<string, string | undefined>) => void] | [undefined, undefined]}
 *          A tuple where:
 *          - The first element is a record of the values read from the cookie on initial render.
 *            This value does not update if the cookie changes later.
 *          - The second is a function to update specified keys in the cookie.
 *          If `cookieKey` is undefined, both are returned as `undefined`.
 *
 * @example
 * const [initialCookieValues, updateCookieValues] = useCookieSync("user_prefs", ["theme", "language"]);
 *
 * // Read initial values
 * console.log(initialCookieValues.theme); // e.g., "dark"
 *
 * // Update cookie values
 * updateCookieValues({ theme: "light" });
 */
export const useCookieSync = <K extends string>(
  cookieKey: string | undefined,
  keys: readonly K[],
): [Record<K, string | undefined>, (r: Record<string, string | undefined>) => void] | [undefined, undefined] => {
  const [cookie, setCookie] = useCookie(cookieKey ?? "invalid_cookie_name");

  const cookieValueAsSearchParam = useMemo(() => new URLSearchParams(decodeURIComponent(cookie ?? "")), [cookie]);

  const updateCookie = useCallback(
    (r: Record<string, string | undefined>) => {
      for (const k of keys)
        if ((cookieValueAsSearchParam.get(k) ?? "") !== (r[k] ?? "")) {
          if (r[k]) cookieValueAsSearchParam.set(k, r[k]);
          else cookieValueAsSearchParam.delete(k);
        }
      setCookie(encodeURIComponent(cookieValueAsSearchParam.toString()), { expires: inSomeTime("30d") });
    },
    [cookieValueAsSearchParam, keys, setCookie],
  );

  const storedValuesOnLoad = useMemo(() => {
    return arrayToRecord(
      keys,
      (k) => k,
      (k) => cookieValueAsSearchParam.get(k),
    ) as Record<K, string | undefined>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(
    () => (cookieKey ? ([storedValuesOnLoad, updateCookie] as const) : [undefined, undefined]),
    [cookieKey, storedValuesOnLoad, updateCookie],
  );
};
