import { describe, it, expect, vi } from "vitest";

import { memoize } from "./";

describe("memoize", () => {
  it("should memoize function results", () => {
    const fn = vi.fn((x: number, y: number) => x + y);
    const memoizedFn = memoize(fn);

    expect(memoizedFn(1, 2)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1);

    expect(memoizedFn(1, 2)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1);

    expect(memoizedFn(2, 3)).toBe(5);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should handle functions returning objects", () => {
    const fn = vi.fn((id: number) => ({ id }));
    const memoizedFn = memoize(fn);

    const result1 = memoizedFn(42);
    const result2 = memoizedFn(42);
    const result3 = memoizedFn(99);

    expect(result1).toEqual({ id: 42 });
    expect(result1).toBe(result2);
    expect(result3).toEqual({ id: 99 });
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should use argument list as cache key", () => {
    const fn = vi.fn((...args: string[]) => args.join("-"));
    const memoizedFn = memoize(fn);

    expect(memoizedFn("a", "b")).toBe("a-b");
    expect(memoizedFn("a", "b")).toBe("a-b");
    expect(memoizedFn("b", "a")).toBe("b-a");

    expect(fn).toHaveBeenCalledTimes(2);
  });
});
