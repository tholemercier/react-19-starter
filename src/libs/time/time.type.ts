import { setTypeGuard } from "src/libs/type";

export const nyTimeZone = "America/New_York";

// ISO-friendly date format like "1999-12-31, 19:00:00"
export const theGoodLocale = "en-CA";

/**
 * toLocaleStringWorks can be false due to:
 * - Locale formatting differences (comma vs. no comma).
 * - Browser behavior inconsistencies.
 * - Timezone handling issues in different environments.
 */
export const toLocaleStringWorks = () =>
  new Date("2000-01-01").toLocaleString(theGoodLocale, { timeZone: nyTimeZone, hour12: false }) ===
  "1999-12-31, 19:00:00";

export const oneSecond = 1000;
export const oneMinute = 60 * oneSecond;
export const oneHour = 60 * oneMinute;
export const oneDay = 24 * oneHour;
export const oneWeek = 7 * oneDay;
export const oneMonth = 30 * oneDay;
export const oneYear = 365 * oneDay;
export const forever = 1000 * oneYear;

export const timeSignatures = ["ms", "s", "m", "h", "d", "w", "mo", "y"] as const;
export type TimeSignature = (typeof timeSignatures)[number];
export const timeSignatureUnits: Record<string, number> = {
  ms: 1,
  s: oneSecond,
  m: oneMinute,
  h: oneHour,
  d: oneDay,
  w: oneWeek,
  mo: oneMonth,
  y: oneYear,
} satisfies Record<TimeSignature, number>;

export type TimeLike = number | `${number}${TimeSignature}`;

export type DateLike = Date | number | string;

export type DateLikeOrNull = DateLike | false | undefined | null | 0;

export type Year = `${number}${number}${number}${number}`;

// eslint-disable-next-line prettier/prettier
const months = ["01" , "02" , "03" , "04" , "05" , "06" , "07" , "08" , "09" , "10" , "11" , "12"] as const
const isMonth = setTypeGuard(months);
type Month = (typeof months)[number];

/* eslint-disable prettier/prettier */
const days = [
  "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
  "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
  "31"
] as const;
/* eslint-enable prettier/prettier */
const isDay = setTypeGuard(days);

type Day = (typeof days)[number];
export type StrictDateString = `${Year}-${Month}-${Day}` | "NaN-NaN-NaN";

/**
 * Checks if a given string is a strictly formatted date string (YYYY-MM-DD).
 *
 * @param {string} x - The string to validate.
 * @returns {x is StrictDateString} - Returns true if the string follows the strict date format.
 */
export const isStrictDateString = (x: string): x is StrictDateString => {
  const [year, month, day] = x.split("-");
  return /^\d{4}$/.test(year) && isDay(day) && isMonth(month);
};
