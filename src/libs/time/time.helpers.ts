import { excludeFalsy } from "src/libs/array";
import { memoize } from "src/libs/memoize";
import { arrayToRecord } from "src/libs/record";
import { typedAssert } from "src/libs/type";
import { range, uniq } from "src/vendors/lodash";

import allTimezonesArray from "./all-timezones.json";
import type { DateLikeOrNull, StrictDateString, TimeLike, TimeSignature } from "./time.type";
import { isStrictDateString, oneHour, theGoodLocale, timeSignatureUnits, toLocaleStringWorks } from "./time.type";

/**
 * Converts a time-like value (string or number) into milliseconds.
 *
 * @param {TimeLike} time - The time value to convert. Can be:
 *   - A number (treated as milliseconds).
 *   - A string with a unit (e.g., "10s", "5m", "2h").
 *   - Supported units: "ms" (milliseconds), "s" (seconds), "m" (minutes),
 *     "h" (hours), "d" (days), "w" (weeks), "mo" (months), "y" (years).
 *
 * @returns {number} The equivalent time in milliseconds, or NaN if invalid.
 *
 * @example
 * timeLikeToMs("10s"); // Returns 10000
 * timeLikeToMs("5m");  // Returns 300000
 * timeLikeToMs(5000);  // Returns 5000
 * timeLikeToMs("invalid"); // Returns NaN
 */
export const timeLikeToMs = (time: TimeLike): number => {
  if (typeof time === "number") return time;
  if (typeof time !== "string") return Number.NaN;

  const match = time.match(/^(\d+)(ms|s|m|h|d|w|mo|y)$/);
  if (!match) return Number.NaN;

  const [, value, unit] = match;
  return Number(value) * (timeSignatureUnits[unit] || Number.NaN);
};

/**
 * Checks if a given value is a valid TimeLike format.
 *
 * A valid TimeLike value is:
 *   - A number (milliseconds).
 *   - A string with a unit (e.g., "10s", "5m", "2h").
 *   - Supported units: "ms" (milliseconds), "s" (seconds), "m" (minutes),
 *     "h" (hours), "d" (days), "w" (weeks), "mo" (months), "y" (years).
 *
 * @param {unknown} x - The value to check.
 * @returns {x is TimeLike} `true` if the value is a valid TimeLike format, otherwise `false`.
 *
 * @example
 * isTimeLike("10s"); // Returns true
 * isTimeLike(5000);  // Returns true
 * isTimeLike("invalid"); // Returns false
 * isTimeLike(null); // Returns false
 */
export const isTimeLike = (x: unknown): x is TimeLike => !Number.isNaN(timeLikeToMs(x as TimeLike));

/**
 * Returns a `Date` object representing a time that occurred a specified duration ago.
 *
 * The duration is specified using a valid `TimeLike` value, which can be:
 *   - A number (milliseconds).
 *   - A string with a unit (e.g., "10s", "5m", "2h").
 *   - Supported units: "ms" (milliseconds), "s" (seconds), "m" (minutes),
 *     "h" (hours), "d" (days), "w" (weeks), "mo" (months), "y" (years).
 *
 * If the input is invalid, an error is thrown.
 *
 * @param {TimeLike} time - The time duration to subtract from the current time.
 *   - A number (milliseconds).
 *   - A string with a time unit (e.g., "10s", "5m").
 * @throws {Error} If the provided `time` is invalid.
 * @returns {Date} A `Date` object representing the time that occurred the specified duration ago.
 *
 * @example
 * someTimeAgo("10s"); // Returns the `Date` object 10 seconds ago.
 * someTimeAgo("5m");  // Returns the `Date` object 5 minutes ago.
 * someTimeAgo(5000);  // Returns the `Date` object 5000 milliseconds ago.
 * someTimeAgo("invalid"); // Throws Error: "Invalid time format"
 */
export function someTimeAgo(time: TimeLike): Date {
  const ms = timeLikeToMs(time);
  if (Number.isNaN(ms)) throw new Error("Invalid time format");
  return new Date(Date.now() - ms);
}

/**
 * Returns the number of milliseconds since a specified time duration ago.
 *
 * The duration is specified using a valid `TimeLike` value, which can be:
 *   - A number (milliseconds).
 *   - A string with a unit (e.g., "10s", "5m", "2h").
 *   - Supported units: "ms" (milliseconds), "s" (seconds), "m" (minutes),
 *     "h" (hours), "d" (days), "w" (weeks), "mo" (months), "y" (years).
 *
 * This function calls `someTimeAgo` to get the `Date` object representing the
 * time that occurred the specified duration ago and converts it to a millisecond
 * timestamp.
 *
 * @param {TimeLike} time - The time duration to subtract from the current time.
 *   - A number (milliseconds).
 *   - A string with a time unit (e.g., "10s", "5m").
 * @throws {Error} If the provided `time` is invalid, an error is thrown by `someTimeAgo`.
 * @returns {number} The number of milliseconds since the specified time duration ago.
 *
 * @example
 * someTimeAgoMs("10s"); // Returns the number of milliseconds 10 seconds ago.
 * someTimeAgoMs("5m");  // Returns the number of milliseconds 5 minutes ago.
 * someTimeAgoMs(5000);  // Returns the number of milliseconds 5000 milliseconds ago.
 * someTimeAgoMs("invalid"); // Throws Error: "Invalid time format"
 */
export function someTimeAgoMs(time: TimeLike): number {
  return +someTimeAgo(time);
}

/**
 * Returns a `Date` object representing a time that will occur after a specified duration.
 *
 * The duration is specified using a valid `TimeLike` value, which can be:
 *   - A number (milliseconds).
 *   - A string with a unit (e.g., "10s", "5m", "2h").
 *   - Supported units: "ms" (milliseconds), "s" (seconds), "m" (minutes),
 *     "h" (hours), "d" (days), "w" (weeks), "mo" (months), "y" (years).
 *
 * This function calls `someTimeAgo`, but negates the time duration to get a future date,
 * meaning it represents a time **after** the given duration from the current time.
 *
 * @param {TimeLike} time - The time duration to add to the current time.
 *   - A number (milliseconds).
 *   - A string with a time unit (e.g., "10s", "5m").
 * @throws {Error} If the provided `time` is invalid, an error will be thrown by `someTimeAgo`.
 * @returns {Date} A `Date` object representing the time that will occur the specified duration from now.
 *
 * @example
 * inSomeTime("10s"); // Returns the `Date` object 10 seconds from now.
 * inSomeTime("5m");  // Returns the `Date` object 5 minutes from now.
 * inSomeTime(5000);  // Returns the `Date` object 5000 milliseconds from now.
 * inSomeTime("invalid"); // Throws Error: "Invalid time format"
 */
export function inSomeTime(time: TimeLike): Date {
  return someTimeAgo(-(timeLikeToMs(time) || Number.NaN));
}

/**
 * Returns the number of milliseconds until a specified time duration from the current time.
 *
 * The duration is specified using a valid `TimeLike` value, which can be:
 *   - A number (milliseconds).
 *   - A string with a unit (e.g., "10s", "5m", "2h").
 *   - Supported units: "ms" (milliseconds), "s" (seconds), "m" (minutes),
 *     "h" (hours), "d" (days), "w" (weeks), "mo" (months), "y" (years).
 *
 * This function calls `inSomeTime` to get the `Date` object representing the future time
 * and converts it to a millisecond timestamp.
 *
 * @param {TimeLike} time - The time duration to add to the current time.
 *   - A number (milliseconds).
 *   - A string with a time unit (e.g., "10s", "5m").
 * @throws {Error} If the provided `time` is invalid, an error will be thrown by `inSomeTime`.
 * @returns {number} The number of milliseconds until the specified time duration from now.
 *
 * @example
 * inSomeTimeMs("10s"); // Returns the number of milliseconds 10 seconds from now.
 * inSomeTimeMs("5m");  // Returns the number of milliseconds 5 minutes from now.
 * inSomeTimeMs(5000);  // Returns the number of milliseconds 5000 milliseconds from now.
 * inSomeTimeMs("invalid"); // Throws Error: "Invalid time format"
 */
export function inSomeTimeMs(time: TimeLike): number {
  return +inSomeTime(time);
}

/**
 * Returns the latest (maximum) date from a list of provided dates.
 *
 * The function accepts multiple dates and returns the one that is the latest.
 * Any `null` or `undefined` values are ignored, and invalid date values are also excluded.
 *
 * @param {...DateLikeOrNull[]} dates - A list of dates or nullable values.
 *   - `DateLikeOrNull` can be a `Date` object, a string, or `null`.
 *   - If `null` or invalid values are provided, they are filtered out.
 * @returns {Date} The latest date from the provided list.
 *
 * @example
 * dateMax("2025-01-01", "2024-12-31", "2025-02-01");
 * // Returns the `Date` object representing 2025-02-01
 *
 * dateMax("2024-12-31", null, "invalid");
 * // Returns the `Date` object representing 2024-12-31 (ignoring `null` and "invalid")
 */
export function dateMax(...dates: DateLikeOrNull[]): Date {
  return new Date(
    Math.max(
      ...dates
        .filter((element) => excludeFalsy(element))
        .map((date) => +new Date(date))
        .filter((element) => excludeFalsy(element)),
    ),
  );
}

/**
 * Returns the earliest (minimum) date from a list of provided dates.
 *
 * The function accepts multiple dates and returns the one that is the earliest.
 * Any `null` or `undefined` values are ignored, and invalid date values are also excluded.
 *
 * @param {...DateLikeOrNull[]} dates - A list of dates or nullable values.
 *   - `DateLikeOrNull` can be a `Date` object, a string, or `null`.
 *   - If `null` or invalid values are provided, they are filtered out.
 * @returns {Date} The earliest date from the provided list.
 *
 * @example
 * dateMin("2025-01-01", "2024-12-31", "2025-02-01");
 * // Returns the `Date` object representing 2024-12-31
 *
 * dateMin("2024-12-31", null, "invalid");
 * // Returns the `Date` object representing 2024-12-31 (ignoring `null` and "invalid")
 */
export function dateMin(...dates: DateLikeOrNull[]): Date {
  return new Date(
    Math.min(
      ...dates
        .filter((element) => excludeFalsy(element))
        .map((date) => +new Date(date))
        .filter((element) => excludeFalsy(element)),
    ),
  );
}

/**
 * Converts a given date (Date object or string) to a UTC date string (`YYYY-MM-DD`)
 * and time string (`HH:MM:SS` or `HH:MM:SS.SSS`).
 *
 * @param {Date | string} date - The date to convert.
 * @param {Object} [options] - Optional settings.
 * @param {boolean} [options.noMs] - If `true`, excludes milliseconds from the time string.
 * @returns {[date: StrictDateString, hour: string]} - A tuple containing:
 *   - `StrictDateString`: The UTC date in `YYYY-MM-DD` format.
 *   - `hour`: The UTC time in `HH:MM:SS` format (or `HH:MM:SS.SSS` if `noMs` is `false` or omitted).
 *
 * @example
 * toUtcDateAndTime(new Date("2024-03-30T12:34:56.789Z"));
 * // Returns: ["2024-03-30", "12:34:56.789"]
 *
 * @example
 * toUtcDateAndTime("2024-03-30T12:34:56.789Z", { noMs: true });
 * // Returns: ["2024-03-30", "12:34:56"]
 *
 * @example
 * toUtcDateAndTime("1999-12-31T23:59:59.999Z");
 * // Returns: ["1999-12-31", "23:59:59.999"]
 *
 * @example
 * toUtcDateAndTime("invalid-date");
 * // Returns: ["NaN-NaN-NaN", "NaN:NaN:NaN"]
 */
export const toUtcDateAndTime = (
  date: Date | string,
  options?: { noMs?: boolean },
): [date: StrictDateString, hour: string] => {
  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return ["NaN-NaN-NaN", "NaN:NaN:NaN"];

  const dateTimeWithMs = d.toISOString().replace("T", " ").replace("Z", "");
  const [hourWithMs] = dateTimeWithMs.slice(11).split(" ");
  const [hourNoMs] = hourWithMs.split(".");

  return [toUtcDate(date), options?.noMs ? hourNoMs : hourWithMs];
};

/**
 * Converts a given date (Date object or string) to a UTC date string in `YYYY-MM-DD` format.
 *
 * @param {Date | string} date - The date to convert.
 * @returns {StrictDateString} - The UTC date in `YYYY-MM-DD` format.
 *   Returns `"NaN-NaN-NaN"` if the input date is invalid.
 *
 * @example
 * toUtcDate(new Date("2024-03-30T12:34:56Z"));
 * // Returns: "2024-03-30"
 *
 * @example
 * toUtcDate("2024-03-30T12:34:56Z");
 * // Returns: "2024-03-30"
 *
 * @example
 * toUtcDate("1999-12-31T23:59:59Z");
 * // Returns: "1999-12-31"
 *
 * @example
 * toUtcDate("invalid-date");
 * // Returns: "NaN-NaN-NaN"
 */
export const toUtcDate = (date: Date | string): StrictDateString => {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return "NaN-NaN-NaN";
  }
  const formattedDate = new Date(date).toISOString().slice(0, 10);
  return isStrictDateString(formattedDate) ? formattedDate : "NaN-NaN-NaN";
};

/**
 * Factory function that returns functions for converting a given date to a date or date and time format,
 * with optional handling for a specific time zone. It provides two methods:
 * - `toDate`: Converts the date to a `YYYY-MM-DD` format in the specified time zone.
 * - `toDateAndTime`: Converts the date to a `YYYY-MM-DD` and `HH:MM:SS` or `HH:MM:SS.SSS` format in the specified time zone.
 *
 * @param {string} timeZone - The time zone to use for conversion (e.g., "UTC", "America/New_York").
 * @returns {{
 *   toDate: (date: Date | string) => StrictDateString,
 *   toDateAndTime: (date: Date | string, options?: { noMs?: boolean }) => [StrictDateString, string]
 * }} - An object containing:
 *   - `toDate`: A function that converts the date to `YYYY-MM-DD` in the specified time zone.
 *   - `toDateAndTime`: A function that converts the date to `[StrictDateString, string]` in the specified time zone, with optional exclusion of milliseconds.
 *
 * @example
 * const { toDate, toDateAndTime } = dateWithTimeZoneFactory("America/New_York");
 * toDate(new Date("2024-03-30T12:34:56.789Z"));
 * // Returns: "2024-03-30" (in New York time zone)
 *
 * @example
 * toDateAndTime("2024-03-30T12:34:56.789Z", { noMs: true });
 * // Returns: ["2024-03-30", "12:34:56"] (in New York time zone, no milliseconds)
 *
 * @example
 * toDate("invalid-date");
 * // Returns: "NaN-NaN-NaN"
 *
 * @example
 * toDateAndTime("invalid-date");
 * // Returns: ["NaN-NaN-NaN", "NaN:NaN:NaN"]
 */
export const dateWithTimeZoneFactory = (
  timeZone: string,
): {
  toDate: (date: Date | string) => StrictDateString;
  toDateAndTime: (date: Date | string, options?: { noMs?: boolean }) => [StrictDateString, string];
} => {
  if (!toLocaleStringWorks())
    return {
      toDate: toUtcDate,
      toDateAndTime: toUtcDateAndTime,
    };

  const toDate = (date: Date | string): StrictDateString => {
    const formattedDate = new Date(date).toLocaleDateString(theGoodLocale, { timeZone });
    if (isStrictDateString(formattedDate)) return formattedDate;
    return "NaN-NaN-NaN";
  };

  const toDateAndTime = (date: Date | string, options?: { noMs?: boolean }): [date: StrictDateString, hour: string] => {
    const d = new Date(date);

    if (Number.isNaN(d.getTime())) return ["NaN-NaN-NaN", "NaN:NaN:NaN"];

    const dateTime = d.toLocaleString(theGoodLocale, { timeZone, hour12: false }).replace(",", "");
    const ms = `000${d.getMilliseconds()}`.slice(-3);

    const timeWithMs = `${dateTime}.${ms}`;
    const [hourWithMs] = timeWithMs.slice(11).split(" ");
    const [hourNoMs] = hourWithMs.split(".");
    return [toDate(date), options?.noMs ? hourNoMs : hourWithMs];
  };

  return { toDate, toDateAndTime };
};

export const isWeekend = (date = new Date()) => [0, 6].includes(date.getUTCDay());
export const isWeekday = (date = new Date()) => !isWeekend(date);

/**
 * Adds a specified amount of time (in days, months, or years) to a given `Date` object and returns the resulting date.
 *
 * The function accepts a `Date` object and a time-like string (e.g., "5d", "2mo", "1y") to adjust the date by the given amount.
 * - `"d"` represents days,
 * - `"mo"` represents months,
 * - `"y"` represents years.
 * The function then returns a new `Date` object reflecting the adjusted date.
 *
 * @param {Date} d - The `Date` object to which the time will be added.
 * @param {`${number}${Extract<TimeSignature, "d" | "mo" | "y">}`} timelike - A string representing the amount of time to add.
 *   The string must consist of a number followed by a unit:
 *   - `"d"` for days,
 *   - `"mo"` for months,
 *   - `"y"` for years.
 *   Example inputs: `"5d"`, `"2mo"`, `"1y"`.
 * @returns {Date} A new `Date` object with the adjusted date.
 *   If the input string is not in the correct format, `NaN` will be returned.
 *
 * @example
 * plus(new Date("2025-01-01"), "5d");
 * // Returns a `Date` object representing 2025-01-06 (5 days added).
 *
 * plus(new Date("2025-01-01"), "2mo");
 * // Returns a `Date` object representing 2025-03-01 (2 months added).
 *
 * plus(new Date("2025-01-01"), "1y");
 * // Returns a `Date` object representing 2026-01-01 (1 year added).
 *
 * plus(new Date("2025-01-01"), "10x");
 * // Returns NaN (invalid unit, "x" is not a valid time unit).
 */
export const plus = (
  d: Date,
  timelike: `${number}${Extract<TimeSignature, "d" | "mo" | "y">}`,
): Date | typeof Number.NaN => {
  const match = timelike.match(/^(\d+)(d|mo|y)$/);
  if (!match) return Number.NaN;

  const [, value, unit] = match;

  const year = d.getUTCFullYear() + (unit === "y" ? Number(value) : 0);
  const month = d.getUTCMonth() + (unit === "mo" ? Number(value) : 0);
  const day = d.getUTCDate() + (unit === "d" ? Number(value) : 0);

  return new Date(Date.UTC(year, month, day));
};

/**
 * Subtracts a specified amount of time (in days, months, or years) from a given `Date` object and returns the resulting date.
 *
 * The function accepts a `Date` object and a time-like string (e.g., "5d", "2mo", "1y") to subtract the specified time from the date.
 * - `"d"` represents days,
 * - `"mo"` represents months,
 * - `"y"` represents years.
 * The function then returns a new `Date` object reflecting the adjusted date.
 *
 * @param {Date} d - The `Date` object from which the time will be subtracted.
 * @param {`${number}${Extract<TimeSignature, "d" | "mo" | "y">}`} timelike - A string representing the amount of time to subtract.
 *   The string must consist of a number followed by a unit:
 *   - `"d"` for days,
 *   - `"mo"` for months,
 *   - `"y"` for years.
 *   Example inputs: `"5d"`, `"2mo"`, `"1y"`.
 * @returns {Date} A new `Date` object with the adjusted date.
 *   If the input string is not in the correct format, `NaN` will be returned.
 *
 * @example
 * minus(new Date("2025-01-01"), "5d");
 * // Returns a `Date` object representing 2024-12-27 (5 days subtracted).
 *
 * minus(new Date("2025-01-01"), "2mo");
 * // Returns a `Date` object representing 2024-11-01 (2 months subtracted).
 *
 * minus(new Date("2025-01-01"), "1y");
 * // Returns a `Date` object representing 2024-01-01 (1 year subtracted).
 *
 * minus(new Date("2025-01-01"), "10x");
 * // Returns NaN (invalid unit, "x" is not a valid time unit).
 */
export const minus = (
  d: Date,
  timelike: `${number}${Extract<TimeSignature, "d" | "mo" | "y">}`,
): Date | typeof Number.NaN => {
  const match = timelike.match(/^(\d+)(d|mo|y)$/);
  if (!match) return Number.NaN;

  const [, value, unit] = match;

  const year = d.getUTCFullYear() - (unit === "y" ? Number(value) : 0);
  const month = d.getUTCMonth() - (unit === "mo" ? Number(value) : 0);
  const day = d.getUTCDate() - (unit === "d" ? Number(value) : 0);

  return new Date(Date.UTC(year, month, day));
};

export const parseTimezone = (tz: string) => allTimezones[tz];

export const allTimezones = arrayToRecord(
  allTimezonesArray,
  (a) => a.value,
  (a) => a,
);

const memoTzHelpers = memoize((tz: string) => dateWithTimeZoneFactory(tz));

const offsetHoursGuesses: Record<string, number[]> = {};

/**
 * Calculates the UTC offset for a given date and timezone, and returns it in the format "UTC+hh:mm" or "UTC-hh:mm".
 *
 * The function uses heuristics to determine the correct UTC offset based on the provided date and timezone. It handles daylight
 * saving time (DST) changes, and guesses the correct offset by checking different possible values.
 *
 * @param {string | Date} dateReference - The input date, either as an ISO date string or a `Date` object. The date should represent a time
 *   in the given timezone to compute the UTC offset accurately.
 * @param {string} tz - The timezone string in the IANA timezone format (e.g., "America/New_York", "Europe/London").
 *   This is used to determine the timezone offset.
 *
 * @returns {string} The UTC offset in the format `UTC+-hh:mm`, where `+-` can be "+" or "-", `hh` represents the hours offset,
 *   and `mm` represents the minutes offset.
 *   If no valid offset can be determined, the function will return `NaN`.
 *
 * @example
 * const result = utcOffset("2025-03-01T12:00:00Z", "America/New_York");
 * console.log(result);
 * // Outputs: "UTC-05:00" or "UTC-04:00" depending on whether DST is in effect
 *
 * const result2 = utcOffset("2025-12-01T12:00:00Z", "Europe/London");
 * console.log(result2);
 * // Outputs: "UTC+00:00" or "UTC+01:00" depending on whether DST is in effect
 *
 * const invalidResult = utcOffset("invalid-date", "America/New_York");
 * console.log(invalidResult);
 * // Outputs: NaN (invalid date)
 */
export const utcOffset = (dateReference: string | Date, tz: string): string => {
  // Parse if string
  dateReference = new Date(dateReference);

  const dateFns = memoTzHelpers(tz);
  const [utcReferenceDate, utcReferenceHour] = toUtcDateAndTime(dateReference);

  // Test offsets between -13 hours to +13.25 hours, in 15-minute increments (0.25 hours).
  // This covers all known UTC offsets.
  const offsetHoursTest = offsetHoursGuesses[tz] ?? range(-13, 13.25, 0.25);

  // Iterates through possible offsets to find the correct one.
  const offsetHoursFound = offsetHoursTest.find((offsetHours) => {
    const dateReferenceOffset = new Date(+dateReference - offsetHours * oneHour);
    const [localDateOffset, localHourOffset] = dateFns.toDateAndTime(dateReferenceOffset);
    return localDateOffset === utcReferenceDate && localHourOffset === utcReferenceHour;
  });

  typedAssert(typeof offsetHoursFound === "number");

  // Try same hour first, offset is for DST
  // Expands the guess range to +-2 hours around offsetHoursFound for more efficient future lookups.
  offsetHoursGuesses[tz] = uniq([offsetHoursFound, ...range(offsetHoursFound - 2, offsetHoursFound + 2, 0.25)]);

  // Converts the offset to "hh:mm" format.
  const formattedHours = new Date(Math.abs(offsetHoursFound) * oneHour).toISOString().slice(11, 16);

  return `UTC${offsetHoursFound < 0 ? "-" : "+"}${formattedHours}`;
};
