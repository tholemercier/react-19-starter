import type { MockInstance } from "vitest";

import { sleepPromise, timebomb, tryForSomeTime, tryTimes, tryTimesAndThrow } from ".";

describe("Promise Helpers Test Suite", () => {
  let consoleErrorSpy: MockInstance;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });
  describe("tryTimesAndThrow", () => {
    it("should return the value if the function succeeds on the first try", async () => {
      const mockFn = vi.fn().mockResolvedValue("success");

      const result = await tryTimesAndThrow(mockFn);

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should retry until the function succeeds", async () => {
      const mockFn = vi
        .fn()
        .mockRejectedValueOnce(new Error("Fail 1"))
        .mockRejectedValueOnce(new Error("Fail 2"))
        .mockResolvedValue("success");

      const result = await tryTimesAndThrow(mockFn, { times: 3, timeout: 200 });

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it("should throw the last error if all retries fail", async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error("Final failure"));

      await expect(tryTimesAndThrow(mockFn, { times: 3, timeout: 200 })).rejects.toThrow("Final failure");
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it("should respect the specified retry count", async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error("Always failing"));

      await expect(tryTimesAndThrow(mockFn, { times: 5, timeout: 200 })).rejects.toThrow("Always failing");
      expect(mockFn).toHaveBeenCalledTimes(5);
    });

    it("should work with synchronous functions", async () => {
      const syncFn = vi.fn().mockImplementation(() => "sync success");

      const result = await tryTimesAndThrow(syncFn);

      expect(result).toBe("sync success");
      expect(syncFn).toHaveBeenCalledTimes(1);
    });

    it("should delay retries according to timeout", async () => {
      const mockFn = vi.fn().mockRejectedValueOnce(new Error("Fail 1")).mockResolvedValue("success");

      const start = Date.now();
      await tryTimesAndThrow(mockFn, { times: 2, timeout: 200 });
      const duration = Date.now() - start;

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(duration).toBeGreaterThanOrEqual(200);
    });
  });

  describe("tryTimes", () => {
    let consoleErrorSpy: MockInstance;

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });
    it("should return the value if the function succeeds on the first try", async () => {
      const mockFn = vi.fn().mockResolvedValue("success");

      const result = await tryTimes(mockFn);

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should retry until the function succeeds", async () => {
      const mockFn = vi
        .fn()
        .mockRejectedValueOnce(new Error("Fail 1"))
        .mockRejectedValueOnce(new Error("Fail 2"))
        .mockResolvedValue("success");

      const result = await tryTimes(mockFn, { times: 3, timeout: 200 });

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it("should return null after all retries fail", async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error("Final failure"));

      const result = await tryTimes(mockFn, { times: 3, timeout: 200 });

      expect(result).toBeNull();
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it("should respect the specified retry count", async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error("Always failing"));

      const result = await tryTimes(mockFn, { times: 5, timeout: 200 });

      expect(result).toBeNull();
      expect(mockFn).toHaveBeenCalledTimes(5);
    }, 10_000);

    it("should work with synchronous functions", async () => {
      const syncFn = vi.fn().mockImplementation(() => "sync success");

      const result = await tryTimes(syncFn);

      expect(result).toBe("sync success");
      expect(syncFn).toHaveBeenCalledTimes(1);
    });

    it("should delay retries according to timeout", async () => {
      const mockFn = vi.fn().mockRejectedValueOnce(new Error("Fail 1")).mockResolvedValue("success");

      const start = Date.now();
      await tryTimes(mockFn, { times: 2, timeout: 200 });
      const duration = Date.now() - start;

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(duration).toBeGreaterThanOrEqual(199);
    }, 10_000);

    it("should throw 'No Value' error if function returns a falsy value", async () => {
      const mockFn = vi.fn().mockResolvedValue(null);

      const result = await tryTimes(mockFn, { times: 3, timeout: 200 });

      expect(result).toBeNull();
      expect(mockFn).toHaveBeenCalledTimes(3);
    });
  });

  describe("tryForSomeTime", () => {
    let consoleErrorSpy: MockInstance;

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });
    it("should return the value if the function succeeds immediately", async () => {
      const mockFn = vi.fn().mockResolvedValue("success");

      const result = await tryForSomeTime(1000, mockFn);

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should retry until the function succeeds within the duration", async () => {
      const mockFn = vi.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValue("success");

      const result = await tryForSomeTime(1000, mockFn, 200);

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it("should throw an error if the duration is exceeded", async () => {
      const mockFn = vi.fn().mockResolvedValue(null);
      const customError = new Error("Custom timeout error");

      await expect(tryForSomeTime(1000, mockFn, 200, customError)).rejects.toThrow("Custom timeout error");
      expect(mockFn).toHaveBeenCalled();
    });

    it("should respect the sleep interval between retries", async () => {
      const mockFn = vi.fn().mockResolvedValueOnce(null).mockResolvedValue("success");

      const start = Date.now();
      await tryForSomeTime(1000, mockFn, 200);
      const duration = Date.now() - start;

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(duration).toBeGreaterThanOrEqual(200);
    });

    it("should return the first successful result within the duration", async () => {
      const mockFn = vi
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce("first success")
        .mockResolvedValueOnce("second success");

      const result = await tryForSomeTime(1000, mockFn, 200);

      expect(result).toBe("first success");
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe("timebomb", () => {
    let consoleErrorSpy: MockInstance;

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });
    it("should return the promise result if it resolves before timeout", async () => {
      const fastPromise = new Promise((resolve) => setTimeout(() => resolve("success"), 100));

      const result = await timebomb(fastPromise, 500);

      expect(result).toBe("success");
    });

    it("should throw an error if the promise exceeds the timeout", async () => {
      const slowPromise = new Promise((resolve) => setTimeout(() => resolve("too slow"), 1000));

      await expect(timebomb(slowPromise, 500)).rejects.toThrow("Timeout!");
    });

    it("should throw a custom error if specified", async () => {
      const slowPromise = new Promise((resolve) => setTimeout(() => resolve("too slow"), 1000));
      const customError = new Error("Custom timeout error");

      await expect(timebomb(slowPromise, 500, customError)).rejects.toThrow("Custom timeout error");
    });

    it("should resolve properly if the promise and timeout are close", async () => {
      const borderlinePromise = new Promise((resolve) => setTimeout(() => resolve("borderline"), 500));

      const result = await timebomb(borderlinePromise, 600);

      expect(result).toBe("borderline");
    });

    it("should clear the timeout when the promise resolves first", async () => {
      const spyClearTimeout = vi.spyOn(globalThis, "clearTimeout");
      const fastPromise = new Promise((resolve) => setTimeout(() => resolve("cleared"), 100));

      const result = await timebomb(fastPromise, 500);

      expect(result).toBe("cleared");
      expect(spyClearTimeout).toHaveBeenCalled();
      spyClearTimeout.mockRestore();
    });
  });

  describe("sleepPromise", () => {
    let consoleErrorSpy: MockInstance;

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });
    it("should resolve after the given time", async () => {
      const start = Date.now();
      await sleepPromise(500);
      const duration = Date.now() - start;

      expect(duration).toBeGreaterThanOrEqual(500);
    });

    it("should reject with the provided error after the given time", async () => {
      const customError = new Error("Timeout occurred");

      await expect(sleepPromise(500, customError)).rejects.toThrow("Timeout occurred");
    }, 2000); // Extended timeout to allow test completion

    it("should clear the timeout when manually called", async () => {
      const spyClearTimeout = vi.spyOn(globalThis, "clearTimeout");
      const sleep = sleepPromise(1000);
      sleep.clearTimeout();

      expect(spyClearTimeout).toHaveBeenCalled();
      spyClearTimeout.mockRestore();
    });

    it("should resolve normally when clearTimeout is not called", async () => {
      await expect(sleepPromise(500)).resolves.toBeUndefined();
    }, 2000);
  });
});
