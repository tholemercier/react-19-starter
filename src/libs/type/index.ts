/**
 * Creates a type guard function that checks if a value is included in a given set of values.
 *
 * This function is useful when you want to narrow down the type of a value based on whether it exists in a predefined set.
 * It returns a type guard function that can be used with TypeScript's control flow analysis to refine the type of the value.
 *
 * @template T - The type of the values in the set.
 * @param {readonly T[]} set - A readonly array representing the set of valid values.
 * @returns {(s: unknown) => s is T} - A function that checks if the value `s` is in the set.
 *
 * @example
 * // Create a type guard for specific string values
 * const isValidColor = setTypeGuard(["red", "green", "blue"]);
 *
 * const color: unknown = "green";
 * if (isValidColor(color)) {
 *   // TypeScript knows `color` is a string, and one of the valid values
 *   console.log(color.toUpperCase()); // "GREEN"
 * }
 *
 * @example
 * // If the value is not in the set, the type guard returns false
 * const isValidColor = setTypeGuard([1, 2, 3]);
 * const number = 4;
 * console.log(isValidColor(number)); // false
 */
export const setTypeGuard = <T>(set: readonly T[]): ((s: unknown) => s is T) => {
  return (s: unknown): s is T => set.includes(s as T);
};

type Assert = (condition: unknown, message?: string) => asserts condition;

/**
 * Asserts that a given value is truthy. If the value is falsy, it throws a `TypeError`.
 *
 * This function is a type assertion, meaning that after calling it, TypeScript will treat `x` as a truthy value.
 *
 * @param {unknown} x - The value to assert.
 * @throws {TypeError} If `x` is falsy.
 *
 * @example
 * // Ensure a value is not null or undefined
 * function processValue(value: string | null) {
 *   typedAssert(value);
 *   // At this point, TypeScript knows `value` is a string
 *   console.log(value.toUpperCase());
 * }
 *
 * @example
 * // Throws an error if the assertion fails
 * typedAssert(0); // Throws: "Assertion failed: x is falsy"
 */
export const typedAssert: Assert = (x: unknown): asserts x => {
  if (x) {
    return;
  }

  throw new TypeError("Assertion failed: x is falsy");
};

/**
 * Asserts that a value is truthy and returns it as the specified type `T`.
 *
 * This function is a combination of an assertion and a type assertion. It throws an error if the value is falsy,
 * and TypeScript will treat the returned value as type `T`, ensuring that it is not falsy.
 *
 * @template T - The expected type of the value, which must be truthy.
 * @param {T | Falsy} x - The value to assert as truthy.
 * @returns {T} - The input value, asserted as type `T`.
 *
 * @throws {TypeError} If `x` is falsy, the function throws a `TypeError`.
 *
 * @example
 * // Assert that a value is a non-falsy string
 * const name = typedAsserted("John"); // `name` is treated as a string (not null, undefined, or falsy)
 *
 * @example
 * // Throws an error if the value is falsy
 * typedAsserted(""); // Throws: "Assertion failed: x is falsy"
 */
export const typedAsserted = <T>(x: T | Falsy): T => {
  typedAssert(x);
  return x;
};

/**
 * Type guard that checks if a value is truthy.
 *
 * This function is used to assert that a value is truthy, and TypeScript will narrow the type to exclude falsy values
 * when `isTruthy` returns `true`. It returns a boolean indicating whether the value is truthy.
 *
 * @template T - The type of the value being checked.
 * @param {T | Falsy} val - The value to check for truthiness.
 * @returns {val is T} - A boolean indicating whether the value is truthy.
 *
 * @example
 * // Narrowing a type based on truthiness
 * const value: string | null = "Hello";
 * if (isTruthy(value)) {
 *   // `value` is treated as a string here, not null
 *   console.log(value.toUpperCase());
 * }
 *
 * @example
 * // Check if the value is truthy
 * const isValid = isTruthy(42); // true
 * const isInvalid = isTruthy(""); // false
 */
export const isTruthy = <T>(val: T | Falsy): val is T => !!val;

/**
 * Returns the given value if it is truthy, otherwise returns the provided default value.
 *
 * This function is useful for handling potentially falsy values and ensuring that a fallback default is used
 * when the value is falsy. It uses the `isTruthy` type guard to check if the value is truthy.
 *
 * @template T - The type of the value being checked and the default value.
 * @param {T | Falsy} val - The value to check for truthiness.
 * @param {T} def - The default value to return if `val` is falsy.
 * @returns {T} - Returns `val` if it is truthy, otherwise returns the default value `def`.
 *
 * @example
 * // Return the value if it is truthy, otherwise use the default
 * const result = isTruthyOrDefault(null, "default"); // "default"
 *
 * @example
 * // Return the truthy value
 * const result = isTruthyOrDefault("Hello", "default"); // "Hello"
 */
export const isTruthyOrDefault = <T>(val: T | Falsy, def: T): T => {
  return isTruthy(val) ? val : def;
};

export const recordKeyTypeGuard = <T extends string | number>(record: Record<T, unknown>) => {
  return (s: unknown): s is T => {
    return record[s as T] !== undefined;
  };
};
