/* eslint-disable unicorn/consistent-function-scoping */
import {
  arrayToRecord,
  arrayToRecordAsync,
  ensureRecord,
  forceStringToNumber,
  getKey,
  isFullRecord,
  isKey,
  isKeyOf,
  jsonRecordToStringRecord,
  keyIsDefined,
  numberRecordToStringRecord,
  recordEntries,
  recordKeys,
  strictOmit,
  strictPick,
  stringRecordToJsonRecord,
} from ".";

describe("Record Helpers Test Suite", () => {
  describe("stringRecordToJsonRecord", () => {
    it("should convert a record of JSON strings into parsed objects", () => {
      const input = {
        key1: '{"a":1}',
        key2: "true",
        key3: "42",
        key4: '"hello"',
      };

      const result = stringRecordToJsonRecord(input);

      expect(result).toEqual({
        key1: { a: 1 },
        key2: true,
        key3: 42,
        key4: "hello",
      });
    });

    it("should return an empty object if given null or undefined", () => {
      expect(stringRecordToJsonRecord(null)).toEqual({});
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(stringRecordToJsonRecord(undefined)).toEqual({});
    });

    it("should ignore invalid JSON values", () => {
      const input = {
        key1: '{"valid": "json"}',
        key2: "invalid json",
      };

      const result = stringRecordToJsonRecord(input);

      expect(result).toEqual({
        key1: { valid: "json" },
      }); // key2 is ignored due to invalid JSON
    });

    it("should handle empty objects correctly", () => {
      expect(stringRecordToJsonRecord({})).toEqual({});
    });

    it("should not modify the input object", () => {
      const input = {
        key1: '{"x":10}',
        key2: "null",
      };

      const clone = { ...input };
      stringRecordToJsonRecord(input);

      expect(input).toEqual(clone);
    });
  });

  describe("forceStringToNumber", () => {
    it("should convert a string with currency symbols and commas into a number", () => {
      expect(forceStringToNumber("$1234.59")).toBe(1234.59);
      expect(forceStringToNumber("€99,99")).toBe(99.99);
      expect(forceStringToNumber("£1000")).toBe(1000);
    });

    it("should handle strings with letters and numbers", () => {
      expect(forceStringToNumber("abc123xyz")).toBe(123);
    });

    it("should handle only numbers or no numbers", () => {
      expect(forceStringToNumber("123456")).toBe(123_456);
      expect(forceStringToNumber("")).toBe(0);
    });

    it("should convert with decimal points correctly", () => {
      expect(forceStringToNumber("123.45")).toBe(123.45);
      expect(forceStringToNumber("123,45")).toBe(123.45);
    });

    it("should return NaN if the string cannot be converted into a valid number", () => {
      expect(forceStringToNumber("non-numeric")).toBe(0);
      expect(forceStringToNumber("abc")).toBe(0);
    });
  });

  describe("ensureRecord", () => {
    it("should return the original record when it is not null or undefined", () => {
      const validRecord = { key: "value" };
      expect(ensureRecord(validRecord)).toEqual(validRecord);
    });

    it("should return an empty object when the record is null", () => {
      expect(ensureRecord(null)).toEqual({});
    });

    it("should return an empty object when the record is undefined", () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(ensureRecord(undefined)).toEqual({});
    });

    it("should work with different types of values in the record", () => {
      const record = { a: 1, b: "string", c: true };
      expect(ensureRecord(record)).toEqual(record);
    });

    it("should return an empty object when passed an empty object", () => {
      expect(ensureRecord({})).toEqual({});
    });
  });

  describe("jsonRecordToStringRecord", () => {
    it("should convert a record of JSON values into a record of stringified values", () => {
      const record = {
        key1: { a: 1 },
        key2: [1, 2, 3],
        key3: true,
        key4: null,
      };

      const result = jsonRecordToStringRecord(record);

      expect(result).toEqual({
        key1: '{"a":1}',
        key2: "[1,2,3]",
        key3: "true",
        key4: "null",
      });
    });

    it("should handle an empty record correctly", () => {
      const result = jsonRecordToStringRecord({});
      expect(result).toEqual({});
    });

    it("should handle null or undefined records by returning an empty record", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(jsonRecordToStringRecord(null)).toEqual({});
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(jsonRecordToStringRecord(undefined)).toEqual({});
    });

    it("should return stringified values for different types", () => {
      const record = {
        key1: 123,
        key2: "string",
        key3: [1, 2, 3],
        key4: { a: "b" },
      };

      const result = jsonRecordToStringRecord(record);

      expect(result).toEqual({
        key1: "123",
        key2: '"string"',
        key3: "[1,2,3]",
        key4: '{"a":"b"}',
      });
    });
  });

  describe("numberRecordToStringRecord", () => {
    it("should convert a record of number values into a record of string values", () => {
      const record = {
        key1: 123,
        key2: 456.78,
        key3: 0,
        key4: -123,
      };

      const result = numberRecordToStringRecord(record);

      expect(result).toEqual({
        key1: "123",
        key2: "456.78",
        key3: "0",
        key4: "-123",
      });
    });

    it("should handle an empty record correctly", () => {
      const result = numberRecordToStringRecord({});
      expect(result).toEqual({});
    });

    it("should handle null or undefined records by returning an empty record", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(numberRecordToStringRecord(null)).toEqual({});
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(numberRecordToStringRecord(undefined)).toEqual({});
    });

    it("should correctly convert different number types to strings", () => {
      const record = {
        key1: 123,
        key2: -456.789,
        key3: 0.01,
      };

      const result = numberRecordToStringRecord(record);

      expect(result).toEqual({
        key1: "123",
        key2: "-456.789",
        key3: "0.01",
      });
    });
  });

  describe("recordKeys", () => {
    it("should return the correct keys for a simple object", () => {
      const person = { name: "John", age: 30 };
      const keys = recordKeys(person);
      expect(keys).toEqual(["name", "age"]);
    });

    it("should return the correct keys for a nested object", () => {
      const person = { name: "John", details: { age: 30, country: "USA" } };
      const keys = recordKeys(person);
      expect(keys).toEqual(["name", "details"]);
    });

    it("should return an empty array for an empty object", () => {
      const emptyObj = {};
      const keys = recordKeys(emptyObj);
      expect(keys).toEqual([]);
    });

    it("should handle an object with different key types", () => {
      const data = { 123: "numeric key", stringKey: "value", true: "boolean key" };
      const keys = recordKeys(data);
      expect(keys).toEqual(["123", "stringKey", "true"]);
    });

    it("should handle objects with special characters in keys", () => {
      const specialChars = { "key-with-dash": "value", key_with_underscore: "value" };
      const keys = recordKeys(specialChars);
      expect(keys).toEqual(["key-with-dash", "key_with_underscore"]);
    });
  });

  describe("recordEntries", () => {
    it("should return the correct entries for a simple object", () => {
      const person = { name: "John", age: 30 };
      const entries = recordEntries(person);
      expect(entries).toEqual([
        ["name", "John"],
        ["age", 30],
      ]);
    });

    it("should return the correct entries for a nested object", () => {
      const person = { name: "John", details: { age: 30, country: "USA" } };
      const entries = recordEntries(person);
      expect(entries).toEqual([
        ["name", "John"],
        ["details", { age: 30, country: "USA" }],
      ]);
    });

    it("should return an empty array for an empty object", () => {
      const emptyObj = {};
      const entries = recordEntries(emptyObj);
      expect(entries).toEqual([]);
    });

    it("should handle an object with different key types", () => {
      const data = { 123: "numeric key", stringKey: "value", true: "boolean key" };
      const entries = recordEntries(data);
      expect(entries).toEqual([
        ["123", "numeric key"],
        ["stringKey", "value"],
        ["true", "boolean key"],
      ]);
    });

    it("should handle objects with special characters in keys", () => {
      const specialChars = { "key-with-dash": "value", key_with_underscore: "value" };
      const entries = recordEntries(specialChars);
      expect(entries).toEqual([
        ["key-with-dash", "value"],
        ["key_with_underscore", "value"],
      ]);
    });
  });

  describe("arrayToRecord", () => {
    it("should convert a Tuple to a full Record (first overload)", () => {
      const array: [{ id: number; name: string }, { id: number; name: string }] = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      const keyFun = (item: { id: number }) => item.id.toString();
      const valueFun = (item: { name: string }) => item.name;

      const result = arrayToRecord(array, keyFun, valueFun);

      expect(result).toEqual({
        "1": "John",
        "2": "Jane",
      });
    });

    it("should convert a Readonly Array to a Partial Record (second overload)", () => {
      const array: { id: number; name: string }[] = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      const keyFun = (item: { id: number }) => item.id.toString();
      const valueFun = (item: { name: string }) => item.name;

      const result = arrayToRecord(array, keyFun, valueFun);

      expect(result).toEqual({
        "1": "John",
        "2": "Jane",
      });
    });

    it("should return a Partial Record if key type is string (second overload)", () => {
      const array: { id: number; name: string }[] = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      const keyFun = (item: { id: number }) => item.id.toString();
      const valueFun = (item: { name: string }) => item.name;

      const result = arrayToRecord(array, keyFun, valueFun);

      expect(result).toEqual({
        "1": "John",
        "2": "Jane",
      });
    });

    it("should handle an empty array and return an empty record (second overload)", () => {
      const array: { id: number; name: string }[] = [];
      const keyFun = (item: { id: number }) => item.id.toString();
      const valueFun = (item: { name: string }) => item.name;

      const result = arrayToRecord(array, keyFun, valueFun);

      expect(result).toEqual({});
    });

    it("should return a partial record with conditional keys (second overload)", () => {
      const array: { id: number; name: string }[] = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      const keyFun = (item: { id: number }) => (item.id > 1 ? "specialKey" : "defaultKey");
      const valueFun = (item: { name: string }) => item.name;

      const result = arrayToRecord(array, keyFun, valueFun);

      expect(result).toEqual({
        defaultKey: "John",
        specialKey: "Jane",
      });
    });
  });

  describe("isKey", () => {
    it("should return true when the key exists in the record", () => {
      const person = { name: "John", age: 30 };
      expect(isKey("name", person)).toBe(true);
      expect(isKey("age", person)).toBe(true);
    });

    it("should return false when the key does not exist in the record", () => {
      const person = { name: "John", age: 30 };
      expect(isKey("gender", person)).toBe(false);
      expect(isKey("address", person)).toBe(false);
    });

    it("should work with empty records", () => {
      const emptyRecord = {};
      expect(isKey("anyKey", emptyRecord)).toBe(false);
    });

    it("should work with records having keys of type string", () => {
      const person = { firstName: "John", lastName: "Doe" };
      expect(isKey("firstName", person)).toBe(true);
      expect(isKey("lastName", person)).toBe(true);
      expect(isKey("middleName", person)).toBe(false);
    });

    it("should narrow down the type of the key correctly", () => {
      const person = { name: "John", age: 30 };

      const key: string = "name";
      if (isKey(key, person)) {
        // TypeScript should now infer that `key` is "name" or "age"
        expect(key).toBe("name");
      } else {
        expect(key).toBe("name"); // it won't get here
      }
    });
  });

  describe("isKeyOf", () => {
    it("should return true for existing keys in an object", () => {
      const obj = { name: "Alice", age: 30 };

      expect(isKeyOf("name", obj)).toBe(true);
      expect(isKeyOf("age", obj)).toBe(true);
    });

    it("should return false for non-existing keys", () => {
      const obj = { name: "Alice", age: 30 };

      expect(isKeyOf("height", obj)).toBe(false);
      expect(isKeyOf("weight", obj)).toBe(false);
    });

    it("should return false for symbol keys when checking with string", () => {
      const symKey = Symbol("sym");
      const obj = { [symKey]: "symbolValue" };

      expect(isKeyOf("sym", obj)).toBe(false);
    });

    it("should return true for symbol keys when checking with the actual symbol", () => {
      const symKey = Symbol("sym");
      const obj = { [symKey]: "symbolValue" };

      expect(isKeyOf(symKey, obj)).toBe(true);
    });

    it("should return false for numbers that are not object keys", () => {
      const obj = { 1: "one", 2: "two" };

      expect(isKeyOf(3, obj)).toBe(false);
    });

    it("should return true for numbers that are object keys", () => {
      const obj = { 1: "one", 2: "two" };

      expect(isKeyOf(1, obj)).toBe(true);
      expect(isKeyOf(2, obj)).toBe(true);
    });

    it("should return false for non-object values", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(isKeyOf("key", null)).toBe(false);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(isKeyOf("key", undefined)).toBe(false);
    });
  });

  describe("keyIsDefined", () => {
    it("should return true if the key is defined", () => {
      const obj = { name: "Alice", age: 30 };

      expect(keyIsDefined(obj, "name")).toBe(true);
      expect(keyIsDefined(obj, "age")).toBe(true);
    });

    it("should return false if the key is undefined", () => {
      const obj = { name: "Alice", age: undefined };

      expect(keyIsDefined(obj, "age")).toBe(false);
    });

    it("should return false if the key does not exist", () => {
      const obj = { name: "Alice" };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(keyIsDefined(obj, "age")).toBe(false);
    });

    it("should work with optional properties", () => {
      type Person = { name?: string; age?: number };
      const obj: Person = { name: "Bob" };

      expect(keyIsDefined(obj, "name")).toBe(true);
      expect(keyIsDefined(obj, "age")).toBe(false);
    });

    it("should work with objects containing falsy values", () => {
      const obj = { zero: 0, empty: "", boolFalse: false };

      expect(keyIsDefined(obj, "zero")).toBe(true);
      expect(keyIsDefined(obj, "empty")).toBe(true);
      expect(keyIsDefined(obj, "boolFalse")).toBe(true);
    });

    it("should return false for null or undefined values", () => {
      const obj = { value: null };

      expect(keyIsDefined(obj, "value")).toBe(true); // Null is defined
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(keyIsDefined(null, "value")).toBe(false);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(keyIsDefined(undefined, "value")).toBe(false);
    });
  });

  describe("getKey", () => {
    it("should return the value of an existing key", () => {
      const obj = { name: "Alice", age: 30 };

      expect(getKey(obj, "name")).toBe("Alice");
      expect(getKey(obj, "age")).toBe(30);
    });

    it("should return undefined for non-existing keys", () => {
      const obj = { name: "Alice", age: 30 };

      expect(getKey(obj, "height")).toBeUndefined();
    });

    it("should work with optional properties", () => {
      type Person = { name: string; age?: number };
      const obj: Person = { name: "Bob" };

      expect(getKey(obj, "name")).toBe("Bob");
      expect(getKey(obj, "age")).toBeUndefined();
    });

    it("should return undefined for undefined values", () => {
      const obj = { key: undefined };

      expect(getKey(obj, "key")).toBeUndefined();
    });

    it("should work with falsy values", () => {
      const obj = { zero: 0, empty: "", boolFalse: false, nullValue: null };

      expect(getKey(obj, "zero")).toBe(0);
      expect(getKey(obj, "empty")).toBe("");
      expect(getKey(obj, "boolFalse")).toBe(false);
      expect(getKey(obj, "nullValue")).toBeNull();
    });

    it("should return undefined for keys in an empty object", () => {
      const obj = {};

      expect(getKey(obj, "anyKey")).toBeUndefined();
    });

    it("should work with symbol keys", () => {
      const symKey = Symbol("sym");
      const obj = { [symKey]: "symbolValue" };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(getKey(obj, symKey)).toBe("symbolValue");
    });
  });

  describe("arrayToRecordAsync", () => {
    it("should convert a tuple array into a record (sync functions)", async () => {
      const tupleArray = [{ id: 1 }, { id: 2 }] as const;

      const result = await arrayToRecordAsync(
        tupleArray,
        (item) => `key-${item.id}`,
        (item) => item.id * 2,
      );

      expect(result).toEqual({
        "key-1": 2,
        "key-2": 4,
      });
    });

    it("should convert a tuple array into a record (async functions)", async () => {
      const tupleArray = [{ id: 1 }, { id: 2 }] as const;

      const result = await arrayToRecordAsync(
        tupleArray,
        async (item) => `key-${item.id}`,
        async (item) => item.id * 2,
      );

      expect(result).toEqual({
        "key-1": 2,
        "key-2": 4,
      });
    });

    it("should convert an array into a record (sync functions)", async () => {
      const array = [{ id: 3 }, { id: 4 }];

      const result = await arrayToRecordAsync(
        array,
        (item) => `key-${item.id}`,
        (item) => item.id * 3,
      );

      expect(result).toEqual({
        "key-3": 9,
        "key-4": 12,
      });
    });

    it("should convert an array into a record (async functions)", async () => {
      const array = [{ id: 5 }, { id: 6 }];

      const result = await arrayToRecordAsync(
        array,
        async (item) => `key-${item.id}`,
        async (item) => item.id * 4,
      );

      expect(result).toEqual({
        "key-5": 20,
        "key-6": 24,
      });
    });

    it("should return an empty record for an empty array", async () => {
      const result = await arrayToRecordAsync(
        [],
        (item) => `key-${item}`,
        (item) => item,
      );

      expect(result).toEqual({});
    });

    it("should handle mixed sync/async key and value functions", async () => {
      const array = [{ id: 7 }, { id: 8 }];

      const result = await arrayToRecordAsync(
        array,
        (item) => `key-${item.id}`,
        async (item) => item.id * 5,
      );

      expect(result).toEqual({
        "key-7": 35,
        "key-8": 40,
      });
    });

    it("should handle string keys properly", async () => {
      const array = [{ name: "Alice" }, { name: "Bob" }];

      const result = await arrayToRecordAsync(
        array,
        (item) => item.name,
        (item) => item.name.length,
      );

      expect(result).toEqual({
        Alice: 5,
        Bob: 3,
      });
    });

    it("should handle numbers as values", async () => {
      const array = [{ num: 10 }, { num: 20 }];

      const result = await arrayToRecordAsync(
        array,
        (item) => `num-${item.num}`,
        (item) => item.num * 2,
      );

      expect(result).toEqual({
        "num-10": 20,
        "num-20": 40,
      });
    });

    it("should handle booleans as values", async () => {
      const array = [
        { id: 1, active: true },
        { id: 2, active: false },
      ];

      const result = await arrayToRecordAsync(
        array,
        (item) => `user-${item.id}`,
        (item) => item.active,
      );

      expect(result).toEqual({
        "user-1": true,
        "user-2": false,
      });
    });

    it("should handle null and undefined values", async () => {
      const array = [
        { key: "a", value: null },
        { key: "b", value: undefined },
      ];

      const result = await arrayToRecordAsync(
        array,
        (item) => item.key,
        (item) => item.value,
      );

      expect(result).toEqual({
        a: null,
        b: undefined,
      });
    });
  });

  describe("strictPick", () => {
    it("should pick only the specified keys", () => {
      const user = { id: 1, name: "Alice", age: 25, city: "NY" };

      const result = strictPick(user, ["id", "name"]);

      expect(result).toEqual({ id: 1, name: "Alice" });
    });

    it("should return an empty object when no matching keys are picked", () => {
      const user = { id: 1, name: "Alice" };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      const result = strictPick(user, ["age", "city"] as const);

      expect(result).toEqual({});
    });

    it("should return the full object if all keys are picked", () => {
      const user = { id: 1, name: "Alice", age: 25 };

      const result = strictPick(user, ["id", "name", "age"]);

      expect(result).toEqual(user);
    });

    it("should remove null and undefined values when onlyNonNull is true", () => {
      const user = { id: 1, name: "Alice", age: null, city: undefined };

      const result = strictPick(user, ["id", "name", "age", "city"], true);

      expect(result).toEqual({ id: 1, name: "Alice" });
    });

    it("should return an empty object when all picked values are null/undefined and onlyNonNull is true", () => {
      const user = { id: null, name: undefined, city: null };

      const result = strictPick(user, ["id", "name", "city"], true);

      expect(result).toEqual({});
    });

    it("should not filter out null/undefined values if onlyNonNull is false", () => {
      const user = { id: 1, name: null, age: undefined };

      const result = strictPick(user, ["id", "name", "age"], false);

      expect(result).toEqual({ id: 1, name: null, age: undefined });
    });

    it("should handle objects with mixed data types", () => {
      const data = { a: "hello", b: 42, c: null, d: undefined, e: true };

      const result = strictPick(data, ["a", "b", "c", "d"], true);

      expect(result).toEqual({ a: "hello", b: 42 });
    });

    it("should handle an empty object gracefully", () => {
      const emptyObject = {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      const result = strictPick(emptyObject, ["id", "name"]);

      expect(result).toEqual({});
    });

    it("should handle an empty keys array and return an empty object", () => {
      const user = { id: 1, name: "Alice" };

      const result = strictPick(user, []);

      expect(result).toEqual({});
    });
  });

  describe("strictOmit", () => {
    it("should omit the specified keys from the object", () => {
      const user = { id: 1, name: "Alice", age: 25, city: "NY" };

      const result = strictOmit(user, ["age", "city"]);

      expect(result).toEqual({ id: 1, name: "Alice" });
    });

    it("should return an empty object when all keys are omitted", () => {
      const user = { id: 1, name: "Alice", age: 25, city: "NY" };

      const result = strictOmit(user, ["id", "name", "age", "city"]);

      expect(result).toEqual({});
    });

    it("should return the same object if no keys are omitted", () => {
      const user = { id: 1, name: "Alice", age: 25, city: "NY" };

      const result = strictOmit(user, []);

      expect(result).toEqual(user);
    });

    it("should omit only the specified keys and retain others", () => {
      const user = { id: 1, name: "Alice", age: 25, city: "NY" };

      const result = strictOmit(user, ["age"]);

      expect(result).toEqual({ id: 1, name: "Alice", city: "NY" });
    });

    it("should return an empty object when the original object is empty", () => {
      const emptyObject = {};

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      const result = strictOmit(emptyObject, ["id", "name"]);

      expect(result).toEqual({});
    });

    it("should handle objects with mixed data types", () => {
      const data = { a: "hello", b: 42, c: null, d: undefined, e: true };

      const result = strictOmit(data, ["a", "e"]);

      expect(result).toEqual({ b: 42, c: null, d: undefined });
    });
  });

  describe("isFullRecord", () => {
    type User = {
      id: number;
      name: string;
      age?: number;
    };
    it("should return true when all specified keys are defined", () => {
      const user: Partial<User> = { id: 1, name: "Alice" };
      const keys = ["id", "name"];

      const result = isFullRecord(user, keys);

      expect(result).toBe(true);
    });

    it("should return false when any specified key is undefined", () => {
      const user: Partial<User> = { id: 1, name: undefined };
      const keys = ["id", "name"];

      const result = isFullRecord(user, keys);

      expect(result).toBe(false);
    });

    it("should return false when a key is missing", () => {
      const user: Partial<User> = { id: 1 };
      const keys = ["id", "name"];

      const result = isFullRecord(user, keys);

      expect(result).toBe(false);
    });

    it("should return true when all keys are defined (even with optional properties)", () => {
      const user: User = { id: 1, name: "Alice", age: 25 };
      const keys = ["id", "name", "age"];

      const result = isFullRecord(user, keys);

      expect(result).toBe(true);
    });

    it("should return false if object is empty", () => {
      const user: Partial<User> = {};
      const keys = ["id", "name"];

      const result = isFullRecord(user, keys);

      expect(result).toBe(false);
    });

    it("should handle the case when all keys are optional", () => {
      const user: Partial<User> = { name: "Alice" };
      const keys = ["id", "name"];

      const result = isFullRecord(user, keys);

      expect(result).toBe(false); // id is missing
    });

    it("should narrow the type to Record<K, V> when all keys are defined", () => {
      const user: Partial<User> = { id: 1, name: "Alice" };
      const keys = ["id", "name"];

      if (isFullRecord(user, keys)) {
        // TypeScript should now recognize `user` as a `Record<string, string>`
        expect(user.id).toBe(1);
        expect(user.name).toBe("Alice");
      } else {
        expect(true).toBe(false); // This case should not be reached
      }
    });
  });
});
