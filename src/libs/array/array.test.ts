import { ensureArray, excludeFalsy, excludeFilter, getFirst, getLast } from ".";

describe("Array Helpers Test Suite", () => {
  describe("getFirst", () => {
    it("should return the first element of a non-empty array", () => {
      expect(getFirst([1, 2, 3])).toBe(1);
      expect(getFirst(["a", "b", "c"])).toBe("a");
      expect(
        getFirst([
          [1, 2],
          [3, 4],
        ]),
      ).toEqual([1, 2]);
    });

    it("should return undefined for an empty array", () => {
      expect(getFirst([])).toBeUndefined();
    });
  });

  describe("getLast", () => {
    it("should return the last element of a non-empty array", () => {
      expect(getLast([1, 2, 3])).toBe(3);
      expect(getLast(["a", "b", "c"])).toBe("c");
      expect(
        getLast([
          [1, 2],
          [3, 4],
        ]),
      ).toEqual([3, 4]);
    });

    it("should return undefined for an empty array", () => {
      expect(getLast([])).toBeUndefined();
    });
  });

  describe("ensureArray", () => {
    it("should wrap non-array values in an array", () => {
      expect(ensureArray(1)).toEqual([1]);
      expect(ensureArray("test")).toEqual(["test"]);
      expect(ensureArray({ key: "value" })).toEqual([{ key: "value" }]);
    });

    it("should return the same array if already an array", () => {
      expect(ensureArray([1, 2, 3])).toEqual([1, 2, 3]);
      expect(ensureArray(["a", "b", "c"])).toEqual(["a", "b", "c"]);
    });

    it("should return an empty array for null or undefined", () => {
      expect(ensureArray(null)).toEqual([]);
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(ensureArray(undefined)).toEqual([]);
    });
  });

  describe("excludeFilter", () => {
    it("should exclude specified values from the filter", () => {
      const filterOutNumbers = excludeFilter([1, 2, 3]);
      expect(filterOutNumbers(1)).toBe(false);
      expect(filterOutNumbers(2)).toBe(false);
      expect(filterOutNumbers(3)).toBe(false);
      expect(filterOutNumbers(4)).toBe(true);
    });

    it("should correctly handle string values", () => {
      const filterOutFruits = excludeFilter(["apple", "banana"]);
      expect(filterOutFruits("apple")).toBe(false);
      expect(filterOutFruits("banana")).toBe(false);
      expect(filterOutFruits("cherry")).toBe(true);
    });

    it("should return true for values not in the exclusion list", () => {
      const filterOutOdds = excludeFilter([1, 3, 5]);
      expect(filterOutOdds(2)).toBe(true);
      expect(filterOutOdds(4)).toBe(true);
    });
  });

  describe("excludeFalsy", () => {
    it("should return true for truthy values", () => {
      expect(excludeFalsy(1)).toBe(true);
      expect(excludeFalsy("test")).toBe(true);
      expect(excludeFalsy([])).toBe(true);
      expect(excludeFalsy({})).toBe(true);
    });

    it("should return false for falsy values", () => {
      expect(excludeFalsy(0)).toBe(false);
      expect(excludeFalsy("")).toBe(false);
      expect(excludeFalsy(false)).toBe(false);
      expect(excludeFalsy(null)).toBe(false);
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(excludeFalsy(undefined)).toBe(false);
      expect(excludeFalsy(Number.NaN)).toBe(false);
    });
  });
});
