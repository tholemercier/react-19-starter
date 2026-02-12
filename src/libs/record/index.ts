import { safeParseJson } from "src/libs/json";
import { omit, pick, pickBy } from "src/vendors/lodash";

type SmallNaturalNumber =
  // eslint-disable-next-line prettier/prettier
  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
  // eslint-disable-next-line prettier/prettier
  11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
  // eslint-disable-next-line prettier/prettier
  21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
  // eslint-disable-next-line prettier/prettier
  31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40;

/**
 * Converts a record of string values into a record of parsed JSON values.
 *
 * @template T - The expected type of parsed JSON values (defaults to `Json`).
 * @param {Record<string, string> | null | undefined} record - The input record with string values.
 * @returns {Record<string, T>} A new record where each value is parsed from JSON.
 *
 * @example
 * const record = { key1: '{"a":1}', key2: 'true' };
 * const jsonRecord = stringRecordToJsonRecord(record);
 * console.log(jsonRecord); // { key1: { a: 1 }, key2: true }
 */
export const stringRecordToJsonRecord = <T = Json>(
  record: Record<string, string> | null | undefined,
): Record<string, T> => {
  const jsonRecord: Record<string, T> = {};
  const r = ensureRecord(record);
  for (const cur in r) {
    const json = safeParseJson<T>(r[cur]);
    if (json) jsonRecord[cur] = json;
  }
  return jsonRecord;
};

/**
 * Converts a string containing numbers and special characters into a numeric value.
 * Removes all non-numeric characters except for `.` and `,`, then converts the result to a number.
 * Assumes that `,` should be replaced with `.` for decimal conversion.
 *
 * Important: does not cover strings like $1,234.59 mixing commas and periods
 *
 * @param {string} str - The input string containing numeric characters.
 * @returns {number} The converted number.
 *
 * @example
 * forceStringToNumber("$1234.56"); // 1234.56
 * forceStringToNumber("99,99€"); // 99.99
 * forceStringToNumber("abc123xyz"); // 123
 */
export const forceStringToNumber = (str: string): number => +str.replaceAll(/[^0-9.,]/g, "").replaceAll(",", ".");

/**
 * Ensures that the provided record is a valid object. If the input is `null` or `undefined`,
 * an empty object is returned.
 *
 * @template T - The type of the values in the record.
 * @param {Record<string, T> | null | undefined} record - The input record, which can be `null` or `undefined`.
 * @returns {Record<string, T>} An empty object if the input is `null` or `undefined`, otherwise returns the input record.
 *
 * @example
 * const validRecord = ensureRecord({ key: "value" }); // { key: "value" }
 * const emptyRecord = ensureRecord(null); // {}
 * const anotherEmptyRecord = ensureRecord(undefined); // {}
 */
export const ensureRecord = <T>(record: Record<string, T> | null | undefined): Record<string, T> => record ?? {};

/**
 * Converts a record of JSON values into a record of string values by serializing each value to a JSON string.
 *
 * @param {Record<string, Json>} record - The input record containing JSON values (objects, arrays, etc.).
 * @returns {Record<string, string>} A new record where each value is converted to a string (JSON serialized).
 *
 * @example
 * const record = { key1: { a: 1 }, key2: [1, 2, 3] };
 * const stringRecord = jsonRecordToStringRecord(record);
 * console.log(stringRecord);
 * // Output: { key1: '{"a":1}', key2: '[1,2,3]' }
 */
export const jsonRecordToStringRecord = (record: Record<string, Json>): Record<string, string> => {
  const stringRecord: Record<string, string> = {};
  for (const cur in ensureRecord(record)) stringRecord[cur] = JSON.stringify(record[cur]);
  return stringRecord;
};

/**
 * Converts a record of number values into a record of string values by converting each number to a string.
 *
 * @param {Record<string, number>} record - The input record containing number values.
 * @returns {Record<string, string>} A new record where each number is converted to a string.
 *
 * @example
 * const record = { key1: 123, key2: 456.78 };
 * const stringRecord = numberRecordToStringRecord(record);
 * console.log(stringRecord);
 * // Output: { key1: '123', key2: '456.78' }
 */
export const numberRecordToStringRecord = (record: Record<string, number>): Record<string, string> => {
  const stringRecord: Record<string, string> = {};
  for (const cur in ensureRecord(record)) stringRecord[cur] = `${record[cur]}`;
  return stringRecord;
};

type RecordKeys<T> = T extends Primitive ? never : StringKeyOf<T>[];

/**
 * Returns the keys of the given record as a type-safe `RecordKeys` type.
 * This function ensures the return type is the exact set of keys of the provided record.
 *
 * @template T - The type of the record.
 * @param {T} record - The input object whose keys are to be extracted.
 * @returns {RecordKeys<T>} A list of keys from the given record, with type safety.
 *
 * @example
 * const person = { name: "John", age: 30 };
 * const keys = recordKeys(person);
 * console.log(keys); // Output: ['name', 'age']
 */
export const recordKeys = <T extends object>(record: T): RecordKeys<T> => {
  return Object.keys(record) as RecordKeys<T>;
};

type RecordEntries<T> = T extends Primitive
  ? never
  : NonNullable<
      {
        [K in StringKeyOf<T>]: [K, T[K]];
      }[StringKeyOf<T>]
    >[];

/**
 * Returns the entries of the given record as a type-safe `RecordEntries` type.
 * This function ensures the return type is the exact set of entries (key-value pairs) of the provided record.
 *
 * @template T - The type of the record.
 * @param {T} record - The input object whose entries (key-value pairs) are to be extracted.
 * @returns {RecordEntries<T>} An array of entries (key-value pairs) from the given record, with type safety.
 *
 * @example
 * const person = { name: "John", age: 30 };
 * const entries = recordEntries(person);
 * console.log(entries);
 * // Output: [['name', 'John'], ['age', 30]]
 */
export const recordEntries = <T extends object>(record: T): RecordEntries<T> => {
  return Object.entries(record) as RecordEntries<T>;
};

/**
 * Converts an array into a record (object) by mapping each item to a key and value.
 *
 * Overload 1: Works with tuples (fixed-length arrays) and ensures all keys exist in the resulting record.
 *
 * @template T - The type of elements in the array.
 * @template K - The type of the key, must be a string.
 * @template V - The type of the value.
 * @template N - The length of the tuple.
 * @param {Tuple<T, N>} array - A fixed-length tuple to convert into a record.
 * @param {(t: T, i: number, array: readonly T[]) => K} keyFun - Function to generate keys.
 * @param {(t: T, i: number, array: readonly T[]) => V} valueFun - Function to generate values.
 * @returns {Record<K, V>} A record with all keys guaranteed to exist.
 */
export function arrayToRecord<T, K extends string, V, N extends SmallNaturalNumber>(
  array: Tuple<T, N>,
  keyFun: (t: T, i: number, array: readonly T[]) => K,
  valueFun: (t: T, i: number, array: readonly T[]) => V,
): Record<K, V>;

/**
 * Converts an array into a record (object), but the result may not contain all possible keys.
 *
 * Overload 2: Works with general arrays (variable length) and returns a `Partial<Record<K, V>>`
 * unless `K` extends `string`, in which case it returns `Record<string, V>`.
 *
 * @template T - The type of elements in the array.
 * @template K - The type of the key, must be a string.
 * @template V - The type of the value.
 * @param {readonly T[]} array - An array to convert into a record.
 * @param {(t: T, i: number, array: readonly T[]) => K} keyFun - Function to generate keys.
 * @param {(t: T, i: number, array: readonly T[]) => V} valueFun - Function to generate values.
 * @returns {string extends K ? Record<string, V> : Partial<Record<K, V>>}
 *   A record where some keys may be missing, unless `K` is `string`, in which case all keys are included.
 */
export function arrayToRecord<T, K extends string, V>(
  array: readonly T[],
  keyFun: (t: T, i: number, array: readonly T[]) => K,
  valueFun: (t: T, i: number, array: readonly T[]) => V,
): string extends K ? Record<string, V> : Partial<Record<K, V>>;

/**
 * Implementation of `arrayToRecord`, transforming an array into an object based on key/value functions.
 *
 * This function applies `Object.fromEntries()` over a mapped version of the input array.
 *
 * @template T - The type of elements in the array.
 * @template K - The type of the key, must be a string.
 * @template V - The type of the value.
 * @param {readonly T[]} array - An array to convert into a record.
 * @param {(t: T, i: number, array: readonly T[]) => K} keyFun - Function to generate keys.
 * @param {(t: T, i: number, array: readonly T[]) => V} valueFun - Function to generate values.
 * @returns {string extends K ? Record<string, V> : Partial<Record<K, V>>}
 *   The resulting object with computed keys and values.
 */
export function arrayToRecord<T, K extends string, V>(
  array: readonly T[],
  keyFun: (t: T, i: number, array: readonly T[]) => K,
  valueFun: (t: T, i: number, array: readonly T[]) => V,
): string extends K ? Record<string, V> : Partial<Record<K, V>> {
  return Object.fromEntries(array.map((...args) => [keyFun(...args), valueFun(...args)])) as string extends K
    ? Record<string, V>
    : Partial<Record<K, V>>;
}

/**
 * Type guard to check if a given key exists in the record.
 * This function narrows the type of the key to a valid key of the record.
 *
 * @template T - The type of keys in the record.
 * @param {string} k - The key to check.
 * @param {Record<T, unknown>} r - The record to check against.
 * @returns {boolean} - Returns `true` if the key exists in the record, otherwise `false`.
 *
 * @example
 * const person = { name: "John", age: 30 };
 * const isValidKey = isKey("name", person); // true
 * const isInvalidKey = isKey("gender", person); // false
 */
export const isKey = <T extends string>(k: string, r: Record<T, unknown>): k is T => {
  return k in r;
};

/**
 * Checks if a given key exists in an object.
 *
 * @template T - The type of the object.
 * @param {string | symbol | number} k - The key to check.
 * @param {T} r - The object to check the key against.
 * @returns {k is keyof T} - Returns `true` if the key exists in the object, otherwise `false`.
 *
 * @example
 * const obj = { name: "Alice", age: 30 };
 * console.log(isKeyOf("name", obj)); // true
 * console.log(isKeyOf("height", obj)); // false
 *
 * @example
 * const symKey = Symbol("key");
 * const obj = { [symKey]: "value" };
 * console.log(isKeyOf(symKey, obj)); // true
 */
export const isKeyOf = <T extends object>(k: string | symbol | number, r: T): k is keyof T => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return !!r && k in r;
};

/**
 * Checks if a given key in an object is defined (not `undefined`).
 *
 * @template T - The type of the object.
 * @template K - The key of the object to check.
 * @param {T} r - The object to check.
 * @param {K} k - The key to check in the object.
 * @returns {r is T & Required<Pick<T, K>>} - Returns `true` if the key is defined, otherwise `false`.
 *
 * @example
 * const obj = { name: "Alice", age: undefined };
 * console.log(keyIsDefined(obj, "name")); // true
 * console.log(keyIsDefined(obj, "age")); // false
 *
 * @example
 * type Person = { name?: string; age?: number };
 * const person: Person = { name: "Bob" };
 * if (keyIsDefined(person, "name")) {
 *   console.log(person.name.toUpperCase()); // Safe access, TypeScript knows 'name' is defined.
 * }
 */
export const keyIsDefined = <T, K extends keyof T>(r: T, k: K): r is T & Required<Pick<T, K>> => {
  return !!r && r[k] !== undefined;
};

/**
 * Retrieves the value of a given key from an object if the key exists.
 *
 * @template T - The type of the object.
 * @template K - The key type (must be a string).
 * @param {T} r - The object from which to retrieve the value.
 * @param {K} k - The key to look up in the object.
 * @returns {NeverFallback<T[K & keyof T], unknown> | undefined} - The value of the key if it exists, otherwise `undefined`.
 *
 * @example
 * const obj = { name: "Alice", age: 30 };
 * console.log(getKey(obj, "name")); // "Alice"
 * console.log(getKey(obj, "age")); // 30
 * console.log(getKey(obj, "height")); // undefined
 *
 * @example
 * type Person = { name: string; age?: number };
 * const person: Person = { name: "Bob" };
 * console.log(getKey(person, "age")); // undefined (since it's optional)
 */
export const getKey = <T extends object, K extends string>(
  r: T,
  k: K,
): NeverFallback<T[K & keyof T], unknown> | undefined => {
  if (isKeyOf(k, r)) return r[k];
};

/**
 * Converts a tuple array into a record asynchronously,using provided key and value mapping functions.
 *
 * Overload 1 : Tuple Overload, Ensures a fixed-length tuple (Tuple<T, N>) is converted into a fully mapped record.
 *
 * @template T - The type of elements in the tuple.
 * @template K - The key type (must be a string).
 * @template V - The value type.
 * @template N - The length of the tuple.
 * @param {Tuple<T, N>} array - The tuple array to convert.
 * @param {(t: T, i: number, array: readonly T[]) => Promise<K> | K} keyFun - Async or sync function to derive keys.
 * @param {(t: T, i: number, array: readonly T[]) => Promise<V> | V} valueFun - Async or sync function to derive values.
 * @returns {Promise<Record<K, V>>} - A Promise resolving to a `Record<K, V>`.
 *
 * @example
 * async function getKey(item: { id: number }) { return `key-${item.id}`; }
 * async function getValue(item: { id: number }) { return item.id * 2; }
 *
 * const tupleArray = [{ id: 1 }, { id: 2 }] as const;
 * const result = await arrayToRecordAsync(tupleArray, getKey, getValue);
 * console.log(result); // { "key-1": 2, "key-2": 4 }
 */
export async function arrayToRecordAsync<T, K extends string, V, N extends number>(
  array: Tuple<T, N>,
  keyFun: (t: T, i: number, array: readonly T[]) => Promise<K> | K,
  valueFun: (t: T, i: number, array: readonly T[]) => Promise<V> | V,
): Promise<Record<K, V>>;

/**
 * Converts an array into a record asynchronously, using provided key and value mapping functions.
 *
 * Overload 2 : Generic Array Overload, Handles arrays of unknown length
 *
 * @template T - The type of elements in the array.
 * @template K - The key type (must be a string).
 * @template V - The value type.
 * @param {readonly T[]} array - The array to convert.
 * @param {(t: T, i: number, array: readonly T[]) => Promise<K> | K} keyFun - Async or sync function to derive keys.
 * @param {(t: T, i: number, array: readonly T[]) => Promise<V> | V} valueFun - Async or sync function to derive values.
 * @returns {Promise<string extends K ? Record<string, V> : Partial<Record<K, V>>>} - A Promise resolving to a record.
 *
 * @example
 * async function getKey(item: { id: number }) { return `key-${item.id}`; }
 * async function getValue(item: { id: number }) { return item.id * 2; }
 *
 * const array = [{ id: 1 }, { id: 2 }];
 * const result = await arrayToRecordAsync(array, getKey, getValue);
 * console.log(result); // { "key-1": 2, "key-2": 4 }
 */
export async function arrayToRecordAsync<T, K extends string, V>(
  array: readonly T[],
  keyFun: (t: T, i: number, array: readonly T[]) => Promise<K> | K,
  valueFun: (t: T, i: number, array: readonly T[]) => Promise<V> | V,
): Promise<string extends K ? Record<string, V> : Partial<Record<K, V>>>;

/**
 * Converts an array into a record asynchronously by mapping items to key-value pairs.
 *
 * Function implementation
 *
 * @template T - The type of elements in the array.
 * @template K - The key type (must be a string).
 * @template V - The value type.
 * @param {readonly T[]} array - The array to convert.
 * @param {(t: T, i: number, array: readonly T[]) => Promise<K> | K} keyFun - Function to generate keys.
 * @param {(t: T, i: number, array: readonly T[]) => Promise<V> | V} valueFun - Function to generate values.
 * @returns {Promise<string extends K ? Record<string, V> : Partial<Record<K, V>>>} - A Promise resolving to a record.
 */
export async function arrayToRecordAsync<T, K extends string, V>(
  array: readonly T[],
  keyFun: (t: T, i: number, array: readonly T[]) => Promise<K> | K,
  valueFun: (t: T, i: number, array: readonly T[]) => Promise<V> | V,
): Promise<string extends K ? Record<string, V> : Partial<Record<K, V>>> {
  return Object.fromEntries(
    await Promise.all(array.map(async (...args) => [await keyFun(...args), await valueFun(...args)])),
  ) as string extends K ? Record<string, V> : Partial<Record<K, V>>;
}

/**
 * Creates a new object by picking specific keys from the input object, with an option to exclude null and undefined values.
 *
 * @template T - The type of the input object.
 * @template K - The keys of `T` to pick.
 * @param {T} object - The source object to pick properties from.
 * @param {readonly K[]} keys - The list of keys to pick from the source object.
 * @param {boolean} [onlyNonNull=false] - If `true`, filters out properties that are `null` or `undefined`.
 * @returns {Pick<T, K>} - A new object containing only the picked keys, optionally filtered for non-null values.
 *
 * @example
 * const user = { id: 1, name: "Alice", age: null, city: "NY" };
 *
 * // Pick "id" and "name" only
 * const picked = strictPick(user, ["id", "name"]);
 * console.log(picked); // { id: 1, name: "Alice" }
 *
 * // Pick "id", "name", and "age" but exclude null values
 * const pickedNonNull = strictPick(user, ["id", "name", "age"], true);
 * console.log(pickedNonNull); // { id: 1, name: "Alice" }
 */
export const strictPick = <T, K extends keyof T>(
  object: T,
  keys: readonly K[],
  onlyNonNull: boolean = false,
): Pick<T, K> => {
  const strictPicked = pick(object, keys) as Pick<T, K>;
  if (!onlyNonNull) return strictPicked;
  return pickBy(strictPicked, (v) => v !== null && v !== undefined) as Pick<T, K>;
};

/**
 * Checks at compile time that the `Keys` to omit from `T` actually exist –
 * which prevents typos.
 *
 * @see [Related GitHub issue](https://github.com/microsoft/TypeScript/issues/30825)
 *
 * @example
 * // Shows a typescript error "g" does not exist in typeof test
 * const test = { a: "A", b: "B" };
 * type Test = SafeOmit<typeof test, "g">;
 */
export type SafeOmit<T, Keys extends keyof T> = Omit<T, Keys>;

/**
 * Creates a new object by omitting specific keys from the input object.
 *
 * @template T - The type of the input object.
 * @template K - The keys of `T` to omit.
 * @param {T} object - The source object from which keys will be omitted.
 * @param {readonly K[]} keys - The list of keys to omit from the source object.
 * @returns {Omit<T, K>} - A new object with the specified keys omitted.
 *
 * @example
 * const user = { id: 1, name: "Alice", age: 25, city: "NY" };
 *
 * // Omit "age" and "city"
 * const result = strictOmit(user, ["age", "city"]);
 * console.log(result); // { id: 1, name: "Alice" }
 *
 * // Omit only "name"
 * const result2 = strictOmit(user, ["name"]);
 * console.log(result2); // { id: 1, age: 25, city: "NY" }
 */
export const strictOmit = <T extends object, K extends keyof T>(object: T, keys: readonly K[]): Omit<T, K> => {
  return omit(object, keys) as Omit<T, K>;
};

/**
 * Checks if the provided object has all the specified keys defined (not `undefined`).
 *
 * This function narrows the type of the object to a full record (i.e., a `Record<K, V>`)
 * if all the specified keys are present and not `undefined` in the object.
 *
 * @template K - The type of the keys in the record.
 * @template V - The type of the values in the record.
 *
 * @param {Partial<Record<K, V>>} r - The object to check, which is a partial record.
 * @param {K[]} k - An array of keys to check if they are defined in the object `r`.
 *
 * @returns {r is Record<K, V>} - Returns `true` if the object has all the specified keys defined, otherwise `false`.
 *
 * @example
 * const user = { id: 1, name: "Alice" };
 * const keys = ["id", "name"];
 *
 * if (isFullRecord(user, keys)) {
 *   // TypeScript knows that `user` is of type `Record<string, string>`
 *   console.log(user.id); // Safe to access, no need for undefined checks
 * } else {
 *   console.log("Not all keys are defined.");
 * }
 */
export const isFullRecord = <K extends string, V>(r: Partial<Record<K, V>>, k: K[]): r is Record<K, V> => {
  for (const key of k) if (r[key] === undefined) return false;
  return true;
};
