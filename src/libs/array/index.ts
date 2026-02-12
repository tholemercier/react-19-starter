import { first, last } from "src/vendors/lodash";

/**
 * Retrieves the first element of an array.
 *
 * This function has two overloads:
 * - If the array is non-empty, it returns the first element of the array.
 * - If the array is empty, it returns `undefined` (only for arrays of type `T[]`).
 * - If the array contains at least one element of type `T` at the beginning (i.e., `readonly [T, ...unknown[]]`), it returns that element.
 *
 * @template T - The type of elements in the array.
 * @param {readonly T[]} array - The array from which to retrieve the first element.
 * @returns {T | undefined} - The first element of the array, or `undefined` if the array is empty.
 *
 * @example
 * const numbers = [1, 2, 3];
 * const firstNumber = getFirst(numbers);
 * console.log(firstNumber); // 1
 *
 * @example
 * const emptyArray: number[] = [];
 * const firstOfEmpty = getFirst(emptyArray);
 * console.log(firstOfEmpty); // undefined
 *
 * @example
 * const mixedArray = [1, 2, "hello"];
 * const firstElement = getFirst(mixedArray);
 * console.log(firstElement); // 1
 */
export function getFirst<T>(array: readonly [T, ...unknown[]]): T;
export function getFirst<T>(array: readonly T[]): T | undefined;
export function getFirst<T>(array: readonly T[]): T {
  return first(array) as T;
}

/**
 * Retrieves the last element of an array.
 *
 * This function has two overloads:
 * - If the array is non-empty, it returns the last element of the array.
 * - If the array is empty, it returns `undefined` (only for arrays of type `T[]`).
 * - If the array contains at least one element of type `T` at the end (i.e., `readonly [...unknown[], T]`), it returns that element.
 *
 * @template T - The type of elements in the array.
 * @param {readonly T[]} array - The array from which to retrieve the last element.
 * @returns {T | undefined} - The last element of the array, or `undefined` if the array is empty.
 *
 * @example
 * const numbers = [1, 2, 3];
 * const lastNumber = getLast(numbers);
 * console.log(lastNumber); // 3
 *
 * @example
 * const emptyArray: number[] = [];
 * const lastOfEmpty = getLast(emptyArray);
 * console.log(lastOfEmpty); // undefined
 *
 * @example
 * const mixedArray = [1, 2, "hello"];
 * const lastElement = getLast(mixedArray);
 * console.log(lastElement); // "hello"
 */
export function getLast<T>(array: readonly [...unknown[], T]): T;
export function getLast<T>(array: readonly T[]): T | undefined;
export function getLast<T>(array: readonly T[]): T {
  return last(array) as T;
}

/**
 * Ensures that a value is returned as an array, wrapping non-array values in an array.
 *
 * This function takes a value of type `T` or an array of type `T[]` and ensures it is always returned as an array.
 * If the input is already an array, it returns the array. If the input is a single value, it returns an array containing that value.
 *
 * @template T - The type of the value or elements in the array.
 * @param {T | T[]} x - The value to be wrapped in an array. If it's already an array, it will be returned as-is.
 * @returns {T[]} - An array containing the value `x` or the original array if `x` is already an array.
 *
 * @example
 * const result = ensureArray(5);
 * console.log(result); // [5]
 *
 * @example
 * const result = ensureArray([1, 2, 3]);
 * console.log(result); // [1, 2, 3]
 *
 * @example
 * const result = ensureArray("hello");
 * console.log(result); // ["hello"]
 */
export const ensureArray = <T>(x: T | T[]): T[] => {
  // eslint-disable-next-line unicorn/prefer-spread
  return ([] as T[]).concat(x ?? []);
};

/**
 * Creates a function that filters out values of type `TT` from a collection of type `T`.
 *
 * This function generates a filter function that can be used to exclude values of type `TT` from an array
 * of type `T`. The returned function will return `true` for values that are not included in the `tt` array,
 * and `false` for values that are included. This allows you to exclude specific values from a larger set.
 *
 * @template T - The base type of the values to filter.
 * @template TT - A subtype of `T` that should be excluded.
 * @param {TT[]} tt - The array of values of type `TT` that should be excluded from the base type `T`.
 * @returns {(t: T) => t is Exclude<T, TT>} - A function that checks if a value `t` is not part of the excluded values `tt`.
 *
 * @example
 * const excludeNumbers = excludeFilter([1, 2, 3]);
 * const result = [1, 2, 3, 4, 5].filter(excludeNumbers);
 * console.log(result); // [4, 5]
 *
 * @example
 * const excludeStrings = excludeFilter(["apple", "banana"]);
 * const result = ["apple", "orange", "banana"].filter(excludeStrings);
 * console.log(result); // ["orange"]
 */
export const excludeFilter = <T, TT extends T>(tt: TT[]): ((t: T) => t is Exclude<T, TT>) => {
  return (t: T): t is Exclude<T, TT> => !tt.includes(t as TT);
};

/**
 * Type guard that excludes falsy values and narrows the type to exclude `Falsy` types.
 *
 * This function is a type guard that ensures the value passed is not falsy. It works as a filter,
 * returning `true` if the value is truthy, and `false` if the value is falsy. It also narrows the type
 * of the input to exclude `Falsy` types (such as `null`, `undefined`, `false`, `0`, `NaN`, and empty strings).
 *
 * @template T - The type of the input value, which could be a `Falsy` type.
 * @param {T | Falsy} x - The value to check for truthiness.
 * @returns {x is T} - Returns `true` if the value is truthy, and narrows the type to `T`.
 *
 * @example
 * const value: string | null = "Hello";
 * if (excludeFalsy(value)) {
 *   // `value` is now narrowed to `string` (excluding `null`)
 *   console.log(value.toUpperCase()); // "HELLO"
 * }
 *
 * @example
 * const value: string | null = null;
 * if (excludeFalsy(value)) {
 *   // This block won't execute, because `value` is falsy (null)
 * }
 */
export const excludeFalsy = <T>(x: T | Falsy): x is T => {
  return !!x;
};
