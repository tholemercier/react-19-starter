import { someTimeAgo, timeLikeToMs } from "src/libs/time";
import type { TimeLike } from "src/libs/time";

/**
 * Returns a promise that resolves after the specified time or rejects with an error if provided.
 *
 * @param {TimeLike} wait - The duration to wait before resolving the promise.
 * @param {Error} [error] - An optional error that causes the promise to reject instead of resolving.
 * @returns {Promise<void> & { clearTimeout: () => void }} - A promise that resolves or rejects after the given time,
 *   with a `clearTimeout` method to cancel the timeout.
 *
 * @example
 * // Wait for 1 second and then resolve
 * await sleepPromise(1000);
 *
 * @example
 * // Wait for 1 second and then reject with an error
 * await sleepPromise(1000, new Error("Timeout occurred")).catch(console.error);
 *
 * @example
 * // Cancel the timeout before it completes
 * const sleep = sleepPromise(5000);
 * sleep.clearTimeout();
 */
export const sleepPromise = (wait: TimeLike, error?: Error): Promise<void> & { clearTimeout: () => void } => {
  let timer: number;
  const promise = new Promise<undefined>((resolve, reject) => {
    const execFn = error ? () => reject(error) : resolve;
    timer = setTimeout(execFn, timeLikeToMs(wait));
  });
  return Object.assign(promise, { clearTimeout: () => clearTimeout(timer) });
};

/**
 * Runs a given promise with a timeout. If the promise does not resolve within the specified time, it rejects with an error.
 *
 * @template T - The type of the resolved value of the promise.
 * @param {Promise<T>} promise - The promise to execute with a time constraint.
 * @param {TimeLike} timeout - The maximum duration (in milliseconds) before the timeout triggers.
 * @param {Error | string} [error="Timeout!"] - The error message or Error object to throw if the timeout is exceeded.
 * @returns {Promise<T>} - A promise that resolves with the result of the given promise or rejects if the timeout is exceeded.
 *
 * @throws {Error} If the timeout duration is exceeded before the promise resolves.
 *
 * @example
 * // Run a promise with a 2-second timeout
 * const result = await timebomb(fetchData(), 2000);
 *
 * @example
 * // Use a custom error message on timeout
 * await timebomb(fetchData(), 3000, "Operation took too long").catch(console.error);
 *
 * @example
 * // Use a custom Error object on timeout
 * await timebomb(fetchData(), 5000, new Error("Custom timeout error")).catch(console.error);
 */
export const timebomb = async <T>(
  promise: Promise<T>,
  timeout: TimeLike,
  error: Error | string = "Timeout!",
): Promise<T> => {
  const sleep = sleepPromise(timeout, error instanceof Error ? error : new Error(error));
  const res = await Promise.race([promise, sleep]);
  sleep.clearTimeout();
  return res as T;
};

/**
 * Repeatedly attempts to execute a function until it returns a truthy value or the specified duration expires.
 *
 * @template T - The expected return type of the function.
 * @param {TimeLike} duration - The maximum time to keep retrying before throwing an error.
 * @param {() => Promise<T | Falsy>} fn - The asynchronous function to execute.
 * @param {TimeLike} [sleep=1000] - The delay (in milliseconds) between each retry attempt.
 * @param {Error} [error=new Error("timeout")] - The error to throw if the function does not return a truthy value within the duration.
 * @returns {Promise<T>} - A promise that resolves with the first truthy result of `fn` or rejects if the timeout is reached.
 *
 * @throws {Error} If the function does not return a truthy value within the given duration.
 *
 * @example
 * // Keep trying until the API returns data or 10 seconds pass
 * const data = await tryForSomeTime(10000, async () => fetchData());
 *
 * @example
 * // Retry with a custom sleep interval of 500ms
 * const data = await tryForSomeTime(10000, async () => fetchData(), 500);
 *
 * @example
 * // Throw a custom error if the function fails within 5 seconds
 * await tryForSomeTime(5000, async () => fetchData(), 1000, new Error("API unavailable"));
 */
export const tryForSomeTime = async <T>(
  duration: TimeLike,
  fn: () => Promise<T | Falsy>,
  sleep: TimeLike = 1000,
  error: Error = new Error("timeout"),
): Promise<T> => {
  const startTime = new Date();
  while (startTime > someTimeAgo(duration)) {
    const result = await fn();
    if (result) return result;
    await sleepPromise(timeLikeToMs(sleep));
  }
  throw error;
};

/**
 * Repeatedly attempts to execute a function up to a specified number of times until it returns a truthy value.
 *
 * @template T - The expected return type of the function.
 * @param {() => T | Promise<T>} fn - The function to execute. It can be synchronous or asynchronous.
 * @param {{ times?: number; timeout?: number }} [options] - Configuration options.
 * @param {number} [options.times=4] - The maximum number of attempts before giving up.
 * @param {number} [options.timeout=3000] - The delay (in milliseconds) between retries.
 * @returns {Promise<T | null>} - A promise that resolves with the first truthy result of `fn` or `null` if all attempts fail.
 *
 * @example
 * // Attempt an API call up to 3 times with a 2-second delay between retries
 * const data = await tryTimes(() => fetchData(), { times: 3, timeout: 2000 });
 *
 * @example
 * // Retry a failing function with default settings (4 attempts, 3s delay)
 * const result = await tryTimes(async () => mightFail());
 *
 * @example
 * // Retry a function and return null if it fails after all attempts
 * const value = await tryTimes(() => getPossiblyNullValue());
 */
export const tryTimes = async <T>(
  fn: () => T | Promise<T>,
  { times = 4, timeout = 3000 }: { times?: number; timeout?: number } = {},
): Promise<T | null> => {
  for (let i = 0; i < times; i++)
    try {
      const res = await fn();
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (res) return res;
      throw new Error("No Value");
    } catch (error) {
      console.error("[tryTimes][error]", error);
      await sleepPromise(timeout);
    }
  return null;
};

/**
 * Repeatedly attempts to execute a function up to a specified number of times until it returns a truthy value.
 * If all attempts fail, it throws the last encountered error.
 *
 * @template T - The expected return type of the function.
 * @param {() => T | Promise<T>} fn - The function to execute. It can be synchronous or asynchronous.
 * @param {{ times?: number; timeout?: number }} [options] - Configuration options.
 * @param {number} [options.times=4] - The maximum number of attempts before throwing an error.
 * @param {number} [options.timeout=3000] - The delay (in milliseconds) between retries.
 * @returns {Promise<T>} - A promise that resolves with the first truthy result of `fn`.
 *
 * @throws {unknown} If all attempts fail, the last encountered error is thrown.
 *
 * @example
 * // Retry an API call up to 3 times with a 2-second delay before throwing an error
 * const data = await tryTimesAndThrow(() => fetchData(), { times: 3, timeout: 2000 });
 *
 * @example
 * // Retry a function with default settings (4 attempts, 3s delay)
 * const result = await tryTimesAndThrow(async () => mightFail());
 *
 * @example
 * // If all attempts fail, the last error is thrown
 * try {
 *   await tryTimesAndThrow(() => failingOperation());
 * } catch (error) {
 *   console.error("Operation failed:", error);
 * }
 */
export const tryTimesAndThrow = async <T>(
  fn: () => T | Promise<T>,
  { times = 4, timeout = 3000 }: { times?: number; timeout?: number } = {},
): Promise<T> => {
  let lastError: unknown;
  const result = await tryTimes(
    async () => {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
      }
    },
    { times, timeout },
  );
  if (!result) throw lastError;
  return result;
};
