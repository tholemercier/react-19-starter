/**
 * Safely parses a JSON string into the specified type, returning `null` if parsing fails.
 *
 * This function attempts to parse a JSON string into the provided type `T`. If the string is invalid or `null`,
 * it returns `null` instead of throwing an error.
 *
 * @template T - The type of the object to parse from the JSON string.
 * @param {string | null} json - The JSON string to parse. If `null`, it will be treated as an empty object.
 * @returns {T | null} - The parsed object of type `T`, or `null` if parsing fails or if the input is invalid.
 *
 * @example
 * const user = safeParseJson<User>('{"name": "Alice", "age": 30}');
 * console.log(user?.name); // "Alice"
 *
 * @example
 * // Invalid JSON will return null
 * const invalidJson = safeParseJson<User>('{"name": "Alice", "age": }');
 * console.log(invalidJson); // null
 *
 * @example
 * // If the input is null, it returns null
 * const nullJson = safeParseJson<User>(null);
 * console.log(nullJson); // null
 */
export const safeParseJson = <T = Json>(json: string | null): T | null => {
  try {
    return JSON.parse(json ?? "null");
  } catch {
    return null;
  }
};

/**
 * Creates a function that safely parses JSON strings into objects of the specified type.
 *
 * This function is a factory that returns a new function which, when given a JSON string,
 * attempts to parse it and returns the result typed as `T`. If parsing fails, it returns `null` instead
 * of throwing an error.
 *
 * @template T - The type of the object to parse from the JSON string.
 * @returns {(json: string) => T | null} - A function that safely parses a JSON string into the specified type `T` or returns `null` on failure.
 *
 * @example
 * const parseUser = safeParseJsonFactory<User>();
 * const user = parseUser('{"name": "Alice", "age": 30}');
 * console.log(user?.name); // "Alice"
 *
 * @example
 * const parseProduct = safeParseJsonFactory<Product>();
 * const product = parseProduct('{"id": 1, "name": "Laptop"}');
 * console.log(product?.name); // "Laptop"
 *
 * @example
 * // If the JSON is invalid, it will return null
 * const invalidJson = parseProduct('{"id": 1, "name": "Laptop"');
 * console.log(invalidJson); // null
 */
export const safeParseJsonFactory = <T = Json>(): ((json: string) => T | null) => {
  return (json: string) => safeParseJson<T>(json);
};

/**
 * Revives JSON strings into `Date` objects for specific fields that match certain patterns.
 *
 * This function is designed to be used with `JSON.parse`'s `reviver` parameter to automatically convert
 * specific string fields (like those ending with `At`, or fields named `timestamp` or `isoDate`) into `Date` objects.
 * It checks for strings with the ISO 8601 date format (`YYYY-MM-DDTHH:mm:ss.SSSZ`) and converts them to `Date` instances.
 *
 * @param {string} k - The key of the current property being parsed.
 * @param {unknown} v - The value of the current property being parsed.
 * @returns {unknown | Date} - Returns the value as a `Date` if it matches the date format; otherwise, returns the original value.
 *
 * @example
 * const jsonString = '{"createdAt": "2025-03-28T12:34:56.789Z", "name": "Item"}';
 * const parsed = JSON.parse(jsonString, jsonDatesReviver);
 * console.log(parsed.createdAt instanceof Date); // true
 * console.log(parsed.name); // "Item"
 *
 * @example
 * // If the value does not match the date format, it is returned as is
 * const jsonString = '{"name": "Item", "createdAt": "not-a-date"}';
 * const parsed = JSON.parse(jsonString, jsonDatesReviver);
 * console.log(parsed.createdAt); // "not-a-date"
 */
export const jsonDatesReviver = (k: string, v: unknown): unknown | Date => {
  if (
    (k.endsWith("At") || k === "timestamp" || k === "isoDate") &&
    typeof v === "string" &&
    v.length === 24 &&
    /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ$/.test(v)
  )
    return new Date(v);
  return v;
};
