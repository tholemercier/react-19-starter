import { isTruthy, isTruthyOrDefault, setTypeGuard, typedAssert, typedAsserted } from "../type";

describe("Type Helpers Test Suite", () => {
  describe("setTypeGuard", () => {
    const isFruit = setTypeGuard(["apple", "banana", "cherry"]);

    it("should return true for valid values in the set", () => {
      expect(isFruit("apple")).toBe(true);
      expect(isFruit("banana")).toBe(true);
      expect(isFruit("cherry")).toBe(true);
    });

    it("should return false for values not in the set", () => {
      expect(isFruit("pear")).toBe(false);
      expect(isFruit("orange")).toBe(false);
      expect(isFruit(123)).toBe(false);
      expect(isFruit(null)).toBe(false);
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(isFruit(undefined)).toBe(false);
    });
  });

  describe("isTruthy", () => {
    it("should return true for truthy values", () => {
      expect(isTruthy(true)).toBe(true);
      expect(isTruthy(1)).toBe(true);
      expect(isTruthy("hello")).toBe(true);
      expect(isTruthy([])).toBe(true);
      expect(isTruthy({})).toBe(true);
    });

    it("should return false for falsy values", () => {
      expect(isTruthy(false)).toBe(false);
      expect(isTruthy(0)).toBe(false);
      expect(isTruthy("")).toBe(false);
      expect(isTruthy(null)).toBe(false);
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(isTruthy(undefined)).toBe(false);
      expect(isTruthy(Number.NaN)).toBe(false);
    });
  });

  describe("isTruthyOrDefault", () => {
    it("should return the value when it is truthy", () => {
      expect(isTruthyOrDefault(1, 10)).toBe(1);
      expect(isTruthyOrDefault("hello", "default")).toBe("hello");
      expect(isTruthyOrDefault([], [1, 2, 3])).toEqual([]);
      expect(isTruthyOrDefault({}, { key: "value" })).toEqual({});
    });

    it("should return the default value when given a falsy value", () => {
      expect(isTruthyOrDefault(0, 10)).toBe(10);
      expect(isTruthyOrDefault("", "default")).toBe("default");
      expect(isTruthyOrDefault(false, true)).toBe(true);
      expect(isTruthyOrDefault(null, "fallback")).toBe("fallback");
      expect(isTruthyOrDefault(undefined, "fallback")).toBe("fallback");
      expect(isTruthyOrDefault(Number.NaN, 100)).toBe(100);
    });
  });

  describe("typedAssert", () => {
    it("should not throw an error when given a truthy value", () => {
      expect(() => typedAssert(true)).not.toThrow();
      expect(() => typedAssert(1)).not.toThrow();
      expect(() => typedAssert("string")).not.toThrow();
      expect(() => typedAssert([])).not.toThrow();
      expect(() => typedAssert({})).not.toThrow();
    });

    it("should throw a TypeError when given a falsy value", () => {
      expect(() => typedAssert(false)).toThrow(TypeError);
      expect(() => typedAssert(0)).toThrow(TypeError);
      expect(() => typedAssert("")).toThrow(TypeError);
      expect(() => typedAssert(null)).toThrow(TypeError);
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(() => typedAssert(undefined)).toThrow(TypeError);
      expect(() => typedAssert(Number.NaN)).toThrow(TypeError);
    });
  });

  describe("typedAsserted", () => {
    it("should return the value when it is truthy", () => {
      expect(typedAsserted(1)).toBe(1);
      expect(typedAsserted("hello")).toBe("hello");
      expect(typedAsserted([])).toEqual([]);
      expect(typedAsserted({})).toEqual({});
    });

    it("should throw a TypeError when given a falsy value", () => {
      expect(() => typedAsserted(0)).toThrow(TypeError);
      expect(() => typedAsserted("")).toThrow(TypeError);
      expect(() => typedAsserted(false)).toThrow(TypeError);
      expect(() => typedAsserted(null)).toThrow(TypeError);
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(() => typedAsserted(undefined)).toThrow(TypeError);
      expect(() => typedAsserted(Number.NaN)).toThrow(TypeError);
    });
  });
});
