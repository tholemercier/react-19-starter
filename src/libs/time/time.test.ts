import {
  dateMax,
  dateMin,
  dateWithTimeZoneFactory,
  inSomeTime,
  inSomeTimeMs,
  isTimeLike,
  isWeekday,
  isWeekend,
  minus,
  plus,
  someTimeAgo,
  someTimeAgoMs,
  timeLikeToMs,
  toUtcDate,
  toUtcDateAndTime,
  utcOffset,
} from "./time.helpers";
import * as timeType from "./time.type";

describe("Time Helpers Test Suite", () => {
  describe("timeLikeToMs", () => {
    it("should return the same value when input is a number", () => {
      expect(timeLikeToMs(1000)).toBe(1000);
    });

    it("should return NaN when input is a string that cannot be parsed", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(timeLikeToMs("invalid")).toBeNaN();
    });

    it("should return NaN when input is not a string or number", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(timeLikeToMs({})).toBeNaN();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(timeLikeToMs([])).toBeNaN();
    });

    it("should correctly convert valid time strings to milliseconds", () => {
      expect(timeLikeToMs("10ms")).toBe(10);
      expect(timeLikeToMs("2s")).toBe(2000);
      expect(timeLikeToMs("5m")).toBe(300_000);
      expect(timeLikeToMs("3h")).toBe(10_800_000);
      expect(timeLikeToMs("1d")).toBe(86_400_000);
      expect(timeLikeToMs("1w")).toBe(604_800_000);
      expect(timeLikeToMs("6mo")).toBe(15_552_000_000); // 6 months
      expect(timeLikeToMs("1y")).toBe(31_536_000_000); // 1 year
    });

    it("should return NaN for invalid time unit", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(timeLikeToMs("10xyz")).toBeNaN();
    });
  });

  describe("isTimeLike", () => {
    it("should return true for valid time strings", () => {
      expect(isTimeLike("10ms")).toBe(true);
      expect(isTimeLike("2s")).toBe(true);
      expect(isTimeLike("5m")).toBe(true);
      expect(isTimeLike("3h")).toBe(true);
      expect(isTimeLike("1d")).toBe(true);
      expect(isTimeLike("1w")).toBe(true);
      expect(isTimeLike("6mo")).toBe(true);
      expect(isTimeLike("1y")).toBe(true);
    });

    it("should return false for invalid time strings", () => {
      expect(isTimeLike("invalid")).toBe(false);
      expect(isTimeLike("10xyz")).toBe(false);
      expect(isTimeLike("100")).toBe(false);
    });

    it("should return false for non-string or number inputs", () => {
      expect(isTimeLike({})).toBe(false);
      expect(isTimeLike([])).toBe(false);
      expect(isTimeLike(true)).toBe(false);
      expect(isTimeLike(null)).toBe(false);
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(isTimeLike(undefined)).toBe(false);
    });

    it("should return true for number input (if valid)", () => {
      expect(isTimeLike(1000)).toBe(true);
    });

    it("should return false for number input (if invalid)", () => {
      expect(isTimeLike(Number.NaN)).toBe(false);
    });
  });

  describe("someTimeAgo", () => {
    it("should return a valid date when the time is valid", () => {
      const now = new Date();

      // ms (milliseconds)
      const timeAgoMs = someTimeAgo("10ms");
      const msAgo = new Date(now.getTime() - timeLikeToMs("10ms"));
      expect(timeAgoMs.getTime()).toBeCloseTo(msAgo.getTime(), -3);

      // s (seconds)
      const timeAgoS = someTimeAgo("2s");
      const msAgoS = new Date(now.getTime() - timeLikeToMs("2s"));
      expect(timeAgoS.getTime()).toBeCloseTo(msAgoS.getTime(), -3);

      // m (minutes)
      const timeAgoM = someTimeAgo("5m");
      const msAgoM = new Date(now.getTime() - timeLikeToMs("5m"));
      expect(timeAgoM.getTime()).toBeCloseTo(msAgoM.getTime(), -3);

      // h (hours)
      const timeAgoH = someTimeAgo("3h");
      const msAgoH = new Date(now.getTime() - timeLikeToMs("3h"));
      expect(timeAgoH.getTime()).toBeCloseTo(msAgoH.getTime(), -3);

      // d (days)
      const timeAgoD = someTimeAgo("1d");
      const msAgoD = new Date(now.getTime() - timeLikeToMs("1d"));
      expect(timeAgoD.getTime()).toBeCloseTo(msAgoD.getTime(), -3);

      // w (weeks)
      const timeAgoW = someTimeAgo("2w");
      const msAgoW = new Date(now.getTime() - timeLikeToMs("2w"));
      expect(timeAgoW.getTime()).toBeCloseTo(msAgoW.getTime(), -3);

      // mo (months)
      const timeAgoMo = someTimeAgo("1mo");
      const msAgoMo = new Date(now.getTime() - timeLikeToMs("1mo"));
      expect(timeAgoMo.getTime()).toBeCloseTo(msAgoMo.getTime(), -3);

      // y (years)
      const timeAgoY = someTimeAgo("1y");
      const msAgoY = new Date(now.getTime() - timeLikeToMs("1y"));
      expect(timeAgoY.getTime()).toBeCloseTo(msAgoY.getTime(), -3);
    });

    it("should throw an error when the time format is invalid", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => someTimeAgo("invalid")).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => someTimeAgo("10xyz")).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => someTimeAgo("100")).toThrow("Invalid time format");
    });

    it("should throw an error for non-string or number inputs", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => someTimeAgo({})).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => someTimeAgo([])).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => someTimeAgo(true)).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => someTimeAgo(null)).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(() => someTimeAgo(undefined)).toThrow("Invalid time format");
    });

    it("should throw an error for NaN values", () => {
      expect(() => someTimeAgo(Number.NaN)).toThrow("Invalid time format");
    });
  });

  describe("someTimeAgoMs", () => {
    it("should return a valid past timestamp in ms when the time is valid", () => {
      const now = new Date();

      // ms (milliseconds)
      const timeAgoMs = someTimeAgoMs("10ms");
      const msAgo = now.getTime() - timeLikeToMs("10ms");
      expect(timeAgoMs).toBeCloseTo(msAgo, -3);

      // s (seconds)
      const timeAgoS = someTimeAgoMs("2s");
      const msAgoS = now.getTime() - timeLikeToMs("2s");
      expect(timeAgoS).toBeCloseTo(msAgoS, -3);

      // m (minutes)
      const timeAgoM = someTimeAgoMs("5m");
      const msAgoM = now.getTime() - timeLikeToMs("5m");
      expect(timeAgoM).toBeCloseTo(msAgoM, -3);

      // h (hours)
      const timeAgoH = someTimeAgoMs("3h");
      const msAgoH = now.getTime() - timeLikeToMs("3h");
      expect(timeAgoH).toBeCloseTo(msAgoH, -3);

      // d (days)
      const timeAgoD = someTimeAgoMs("1d");
      const msAgoD = now.getTime() - timeLikeToMs("1d");
      expect(timeAgoD).toBeCloseTo(msAgoD, -3);

      // w (weeks)
      const timeAgoW = someTimeAgoMs("2w");
      const msAgoW = now.getTime() - timeLikeToMs("2w");
      expect(timeAgoW).toBeCloseTo(msAgoW, -3);

      // mo (months)
      const timeAgoMo = someTimeAgoMs("1mo");
      const msAgoMo = now.getTime() - timeLikeToMs("1mo");
      expect(timeAgoMo).toBeCloseTo(msAgoMo, -3);

      // y (years)
      const timeAgoY = someTimeAgoMs("1y");
      const msAgoY = now.getTime() - timeLikeToMs("1y");
      expect(timeAgoY).toBeCloseTo(msAgoY, -3);
    });

    it("should throw an error when the time format is invalid", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => someTimeAgoMs("invalid")).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => someTimeAgoMs("10xyz")).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => someTimeAgoMs("100")).toThrow("Invalid time format");
    });

    it("should throw an error for non-string or number inputs", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => someTimeAgoMs({})).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => someTimeAgoMs([])).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => someTimeAgoMs(true)).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => someTimeAgoMs(null)).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(() => someTimeAgoMs(undefined)).toThrow("Invalid time format");
    });

    it("should throw an error for NaN values", () => {
      expect(() => someTimeAgoMs(Number.NaN)).toThrow("Invalid time format");
    });
  });

  describe("inSomeTime", () => {
    it("should return a valid date when the time is valid", () => {
      const now = new Date();

      // ms (milliseconds)
      const timeInMs = inSomeTime("10ms");
      const msIn = new Date(now.getTime() + timeLikeToMs("10ms"));
      expect(timeInMs.getTime()).toBeCloseTo(msIn.getTime(), -3);

      // s (seconds)
      const timeInS = inSomeTime("2s");
      const msInS = new Date(now.getTime() + timeLikeToMs("2s"));
      expect(timeInS.getTime()).toBeCloseTo(msInS.getTime(), -3);

      // m (minutes)
      const timeInM = inSomeTime("5m");
      const msInM = new Date(now.getTime() + timeLikeToMs("5m"));
      expect(timeInM.getTime()).toBeCloseTo(msInM.getTime(), -3);

      // h (hours)
      const timeInH = inSomeTime("3h");
      const msInH = new Date(now.getTime() + timeLikeToMs("3h"));
      expect(timeInH.getTime()).toBeCloseTo(msInH.getTime(), -3);

      // d (days)
      const timeInD = inSomeTime("1d");
      const msInD = new Date(now.getTime() + timeLikeToMs("1d"));
      expect(timeInD.getTime()).toBeCloseTo(msInD.getTime(), -3);

      // w (weeks)
      const timeInW = inSomeTime("2w");
      const msInW = new Date(now.getTime() + timeLikeToMs("2w"));
      expect(timeInW.getTime()).toBeCloseTo(msInW.getTime(), -3);

      // mo (months)
      const timeInMo = inSomeTime("1mo");
      const msInMo = new Date(now.getTime() + timeLikeToMs("1mo"));
      expect(timeInMo.getTime()).toBeCloseTo(msInMo.getTime(), -3);

      // y (years)
      const timeInY = inSomeTime("1y");
      const msInY = new Date(now.getTime() + timeLikeToMs("1y"));
      expect(timeInY.getTime()).toBeCloseTo(msInY.getTime(), -3);
    });

    it("should throw an error when the time format is invalid", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => inSomeTime("invalid")).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => inSomeTime("10xyz")).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => inSomeTime("100")).toThrow("Invalid time format");
    });

    it("should throw an error for non-string or number inputs", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => inSomeTime({})).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => inSomeTime([])).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => inSomeTime(true)).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => inSomeTime(null)).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(() => inSomeTime(undefined)).toThrow("Invalid time format");
    });

    it("should throw an error for NaN values", () => {
      expect(() => inSomeTime(Number.NaN)).toThrow("Invalid time format");
    });
  });

  describe("inSomeTimeMs", () => {
    it("should return a valid future timestamp in ms when the time is valid", () => {
      const now = new Date();

      // ms (milliseconds)
      const timeInMs = inSomeTimeMs("10ms");
      const msIn = now.getTime() + timeLikeToMs("10ms");
      expect(timeInMs).toBeCloseTo(msIn, -3);

      // s (seconds)
      const timeInS = inSomeTimeMs("2s");
      const msInS = now.getTime() + timeLikeToMs("2s");
      expect(timeInS).toBeCloseTo(msInS, -3);

      // m (minutes)
      const timeInM = inSomeTimeMs("5m");
      const msInM = now.getTime() + timeLikeToMs("5m");
      expect(timeInM).toBeCloseTo(msInM, -3);

      // h (hours)
      const timeInH = inSomeTimeMs("3h");
      const msInH = now.getTime() + timeLikeToMs("3h");
      expect(timeInH).toBeCloseTo(msInH, -3);

      // d (days)
      const timeInD = inSomeTimeMs("1d");
      const msInD = now.getTime() + timeLikeToMs("1d");
      expect(timeInD).toBeCloseTo(msInD, -3);

      // w (weeks)
      const timeInW = inSomeTimeMs("2w");
      const msInW = now.getTime() + timeLikeToMs("2w");
      expect(timeInW).toBeCloseTo(msInW, -3);

      // mo (months)
      const timeInMo = inSomeTimeMs("1mo");
      const msInMo = now.getTime() + timeLikeToMs("1mo");
      expect(timeInMo).toBeCloseTo(msInMo, -3);

      // y (years)
      const timeInY = inSomeTimeMs("1y");
      const msInY = now.getTime() + timeLikeToMs("1y");
      expect(timeInY).toBeCloseTo(msInY, -3);
    });

    it("should throw an error when the time format is invalid", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => inSomeTimeMs("invalid")).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => inSomeTimeMs("10xyz")).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => inSomeTimeMs("100")).toThrow("Invalid time format");
    });

    it("should throw an error for non-string or number inputs", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => inSomeTimeMs({})).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => inSomeTimeMs([])).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => inSomeTimeMs(true)).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      expect(() => inSomeTimeMs(null)).toThrow("Invalid time format");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(() => inSomeTimeMs(undefined)).toThrow("Invalid time format");
    });

    it("should throw an error for NaN values", () => {
      expect(() => inSomeTimeMs(Number.NaN)).toThrow("Invalid time format");
    });
  });

  describe("dateMax", () => {
    it("should return the latest date from a list of valid DateLikeOrNull", () => {
      const date1 = new Date(Date.UTC(2022, 0, 1));
      const date2 = new Date(Date.UTC(2023, 5, 15));
      const date3 = new Date(Date.UTC(2021, 10, 30));

      const latestDate = dateMax(date1, date2, date3);
      expect(latestDate.getTime()).toBe(date2.getTime());
    });

    it("should ignore falsy values like null, undefined, or NaN", () => {
      const date1 = new Date(Date.UTC(2022, 0, 1));
      const date2 = new Date(Date.UTC(2023, 5, 15));
      const invalidDate = null;

      const latestDate = dateMax(date1, invalidDate, date2);
      expect(latestDate.getTime()).toBe(date2.getTime());
    });

    it("should return the latest valid date even if there are multiple falsy values", () => {
      const date1 = new Date(2022, 0, 1);
      const invalidDate1 = null;
      const invalidDate2 = undefined;
      const date2 = new Date(Date.UTC(2023, 5, 15));

      const latestDate = dateMax(date1, invalidDate1, invalidDate2, date2);
      expect(latestDate.getTime()).toBe(date2.getTime());
    });

    it("should return the latest date when there is only one valid date", () => {
      const date1 = new Date(Date.UTC(2022, 0, 1));

      const latestDate = dateMax(date1);
      expect(latestDate.getTime()).toBe(date1.getTime());
    });

    it("should return NaN when all dates are falsy", () => {
      const invalidDate1 = null;
      const invalidDate2 = undefined;
      const invalidDate3 = Number.NaN;

      const latestDate = dateMax(invalidDate1, invalidDate2, invalidDate3);
      expect(Number.isNaN(latestDate.getTime())).toBe(true);
    });

    it("should handle dates in different formats correctly", () => {
      const date1 = "2022-01-01T00:00:00Z";
      const date2 = new Date(Date.UTC(2023, 5, 15));
      const date3 = 1_672_531_200_000;

      const latestDate = dateMax(date1, date2, date3);
      expect(latestDate.getTime()).toBe(date2.getTime());
    });

    it("should return NaN if an empty list of dates is provided", () => {
      const latestDate = dateMax();
      expect(Number.isNaN(latestDate.getTime())).toBe(true);
    });
  });

  describe("dateMin", () => {
    it("should return the earliest date from a list of valid DateLikeOrNull", () => {
      const date1 = new Date(Date.UTC(2022, 0, 1));
      const date2 = new Date(Date.UTC(2023, 5, 15));
      const date3 = new Date(Date.UTC(2021, 10, 30));

      const earliestDate = dateMin(date1, date2, date3);
      expect(earliestDate.getTime()).toBe(date3.getTime());
    });

    it("should ignore falsy values like null, undefined, or NaN", () => {
      const date1 = new Date(Date.UTC(2022, 0, 1));
      const date2 = new Date(Date.UTC(2023, 5, 15));
      const invalidDate = null;

      const earliestDate = dateMin(date1, invalidDate, date2);
      expect(earliestDate.getTime()).toBe(date1.getTime());
    });

    it("should return the earliest valid date even if there are multiple falsy values", () => {
      const date1 = new Date(Date.UTC(2022, 0, 1));
      const invalidDate1 = null;
      const invalidDate2 = undefined;
      const date2 = new Date(Date.UTC(2023, 5, 15));

      const earliestDate = dateMin(date1, invalidDate1, invalidDate2, date2);
      expect(earliestDate.getTime()).toBe(date1.getTime());
    });

    it("should return the earliest date when there is only one valid date", () => {
      const date1 = new Date(Date.UTC(2022, 0, 1));

      const earliestDate = dateMin(date1);
      expect(earliestDate.getTime()).toBe(date1.getTime());
    });

    it("should return NaN when all dates are falsy", () => {
      const invalidDate1 = null;
      const invalidDate2 = undefined;
      const invalidDate3 = Number.NaN;

      const earliestDate = dateMin(invalidDate1, invalidDate2, invalidDate3);
      expect(Number.isNaN(earliestDate.getTime())).toBe(true);
    });

    it("should handle dates in different formats correctly", () => {
      const date1 = "2022-01-01T00:00:00Z";
      const date2 = new Date(Date.UTC(2023, 5, 15));
      const date3 = 1_672_531_200_000;

      const earliestDate = dateMin(date1, date2, date3);
      expect(earliestDate.getTime()).toBe(new Date(date1).getTime());
    });

    it("should return NaN if an empty list of dates is provided", () => {
      const earliestDate = dateMin();
      expect(Number.isNaN(earliestDate.getTime())).toBe(true);
    });
  });

  describe("toUtcDateAndTime", () => {
    it("should return the correct date and hour for a Date object input", () => {
      const date = new Date(Date.UTC(2023, 5, 15, 10, 30, 0));
      const [datePart, hourPart] = toUtcDateAndTime(date);
      expect(datePart).toBe("2023-06-15");
      expect(hourPart).toBe("10:30:00.000");
    });

    it("should return the correct date and hour for a string input", () => {
      const dateStr = "2023-06-15T10:30:00Z";
      const [datePart, hourPart] = toUtcDateAndTime(dateStr);
      expect(datePart).toBe("2023-06-15");
      expect(hourPart).toBe("10:30:00.000");
    });

    it("should return the correct date and hour for a date string in ISO format", () => {
      const dateStr = "2023-06-15T10:30:00Z";
      const [datePart, hourPart] = toUtcDateAndTime(dateStr);
      expect(datePart).toBe("2023-06-15");
      expect(hourPart).toBe("10:30:00.000");
    });

    it("should handle date objects with different times correctly", () => {
      const date = new Date(Date.UTC(2021, 0, 1, 5, 45, 0));
      const [datePart, hourPart] = toUtcDateAndTime(date);
      expect(datePart).toBe("2021-01-01");
      expect(hourPart).toBe("05:45:00.000");
    });

    it("should return the same result for string and Date input", () => {
      const date = new Date(Date.UTC(2023, 5, 15, 12, 0, 0));
      const dateStr = "2023-06-15T12:00:00Z";

      expect(toUtcDateAndTime(date)).toEqual(toUtcDateAndTime(dateStr));
    });

    it("should handle invalid date inputs gracefully", () => {
      const invalidDate = "invalid-date";
      const [datePart, hourPart] = toUtcDateAndTime(invalidDate);
      expect(datePart).toBe("NaN-NaN-NaN");
      expect(hourPart).toBe("NaN:NaN:NaN");
    });
  });

  describe("toUtcDate", () => {
    test("valid date inputs", () => {
      expect(toUtcDate(new Date("2024-03-30T12:34:56Z"))).toBe("2024-03-30");
      expect(toUtcDate("2024-03-30T12:34:56Z")).toBe("2024-03-30");
      expect(toUtcDate("1999-12-31T23:59:59Z")).toBe("1999-12-31");
      expect(toUtcDate("0001-01-01T00:00:00Z")).toBe("0001-01-01");
    });

    test("invalid date inputs", () => {
      expect(toUtcDate("invalid-date")).toBe("NaN-NaN-NaN");
      expect(toUtcDate("2024-13-01")).toBe("NaN-NaN-NaN"); // Invalid month
      expect(toUtcDate("2024-02-32")).toBe("NaN-NaN-NaN"); // Invalid day
      expect(toUtcDate("")).toBe("NaN-NaN-NaN"); // Empty string
    });

    test("edge cases", () => {
      expect(toUtcDate(new Date("1970-01-01T00:00:00Z"))).toBe("1970-01-01"); // Unix epoch
      expect(toUtcDate(new Date(0))).toBe("1970-01-01"); // Unix epoch as timestamp
      expect(toUtcDate("2024-02-29T12:00:00Z")).toBe("2024-02-29"); // Leap year
    });
  });

  describe("isWeekend", () => {
    it("should return true for a Sunday", () => {
      const sunday = new Date(Date.UTC(2023, 5, 18));
      expect(isWeekend(sunday)).toBe(true);
    });

    it("should return true for a Saturday", () => {
      const saturday = new Date(Date.UTC(2023, 5, 17));
      expect(isWeekend(saturday)).toBe(true);
    });

    it("should return false for a Monday", () => {
      const monday = new Date(Date.UTC(2023, 5, 19));
      expect(isWeekend(monday)).toBe(false);
    });

    it("should return false for a Wednesday", () => {
      const wednesday = new Date(Date.UTC(2023, 5, 21));
      expect(isWeekend(wednesday)).toBe(false);
    });

    it("should return true for the current weekend date", () => {
      const today = new Date();
      const isTodayWeekend = [0, 6].includes(today.getUTCDay());
      expect(isWeekend(today)).toBe(isTodayWeekend);
    });
  });

  describe("isWeekday", () => {
    it("should return false for a Sunday", () => {
      const sunday = new Date(Date.UTC(2023, 5, 18));
      expect(isWeekday(sunday)).toBe(false);
    });

    it("should return false for a Saturday", () => {
      const saturday = new Date(Date.UTC(2023, 5, 17));
      expect(isWeekday(saturday)).toBe(false);
    });

    it("should return true for a Monday", () => {
      const monday = new Date(Date.UTC(2023, 5, 19));
      expect(isWeekday(monday)).toBe(true);
    });

    it("should return true for a Wednesday", () => {
      const wednesday = new Date(Date.UTC(2023, 5, 21));
      expect(isWeekday(wednesday)).toBe(true);
    });
  });

  describe("utcOffset", () => {
    it("should return correct UTC offset for New York - Daylight Saving Time (DST)", () => {
      const newYorkOffset = utcOffset("2023-06-15T12:00:00Z", "America/New_York");
      expect(newYorkOffset).toBe("UTC-04:00");
    });

    it("should return correct UTC offset for New York - Eastern Standard Time (EST)", () => {
      const newYorkOffset = utcOffset("2023-12-15T12:00:00Z", "America/New_York");
      expect(newYorkOffset).toBe("UTC-05:00");
    });

    it("should return correct UTC offset for UTC", () => {
      const utcOffsetValue = utcOffset("2023-06-15T12:00:00Z", "UTC");
      expect(utcOffsetValue).toBe("UTC+00:00");
    });

    it("should return correct UTC offset for London - British Summer Time (BST)", () => {
      const londonOffset = utcOffset("2023-06-15T12:00:00Z", "Europe/London");
      expect(londonOffset).toBe("UTC+01:00");
    });

    it("should return correct UTC offset for London - Greenwich Mean Time - GMT)", () => {
      const londonOffsetGMT = utcOffset("2023-12-15T12:00:00Z", "Europe/London");
      expect(londonOffsetGMT).toBe("UTC+00:00");
    });

    it("should return correct UTC offset for Sydney - Australian Eastern Standard Time (AEST)", () => {
      const sydneyOffset = utcOffset("2023-06-15T12:00:00Z", "Australia/Sydney");
      expect(sydneyOffset).toBe("UTC+10:00");
    });

    it("should return correct UTC offset for Sydney - Australian Eastern Daylight Time (AEDT)", () => {
      const sydneyOffsetDST = utcOffset("2023-12-15T12:00:00Z", "Australia/Sydney");
      expect(sydneyOffsetDST).toBe("UTC+11:00");
    });
  });

  describe("minus", () => {
    it("should subtract days correctly", () => {
      const date = new Date("2023-06-15T00:00:00Z");
      const result = minus(date, "5d");
      const expected = new Date("2023-06-10T00:00:00Z");
      expect(result).toEqual(expected);
    });

    it("should subtract months correctly", () => {
      const date = new Date("2023-06-15T00:00:00Z");
      const result = minus(date, "2mo");
      const expected = new Date("2023-04-15T00:00:00Z");
      expect(result).toEqual(expected);
    });

    it("should subtract years correctly", () => {
      const date = new Date("2023-06-15T00:00:00Z");
      const result = minus(date, "1y");
      const expected = new Date("2022-06-15T00:00:00Z");
      expect(result).toEqual(expected);
    });

    it("should return NaN for invalid input", () => {
      const date = new Date("2023-06-15T00:00:00Z");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      const result = minus(date, "3x");
      expect(result).toBe(Number.NaN);
    });

    it("should return NaN for non-matching input format", () => {
      const date = new Date("2023-06-15T00:00:00Z");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      const result = minus(date, "abc");
      expect(result).toBe(Number.NaN);
    });

    it("should handle subtracting from the start of the month", () => {
      const date = new Date("2023-06-01T00:00:00Z");
      const result = minus(date, "1mo");
      const expected = new Date("2023-05-01T00:00:00Z");
      expect(result).toEqual(expected);
    });

    it("should handle subtracting from the start of the year", () => {
      const date = new Date("2023-01-01T00:00:00Z");
      const result = minus(date, "1y");
      const expected = new Date("2022-01-01T00:00:00Z");
      expect(result).toEqual(expected);
    });
  });

  describe("plus", () => {
    it("should add days correctly", () => {
      const date = new Date("2023-06-15T00:00:00Z");
      const result = plus(date, "5d");
      const expected = new Date("2023-06-20T00:00:00Z");
      expect(result).toEqual(expected);
    });

    it("should add months correctly", () => {
      const date = new Date("2023-06-15T00:00:00Z");
      const result = plus(date, "2mo");
      const expected = new Date("2023-08-15T00:00:00Z");
      expect(result).toEqual(expected);
    });

    it("should add years correctly", () => {
      const date = new Date("2023-06-15T00:00:00Z");
      const result = plus(date, "1y");
      const expected = new Date("2024-06-15T00:00:00Z");
      expect(result).toEqual(expected);
    });

    it("should return NaN for invalid input", () => {
      const date = new Date("2023-06-15T00:00:00Z");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      const result = plus(date, "3x");
      expect(result).toBe(Number.NaN);
    });

    it("should return NaN for non-matching input format", () => {
      const date = new Date("2023-06-15T00:00:00Z");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Making sure incorrect types are handled
      const result = plus(date, "abc");
      expect(result).toBe(Number.NaN);
    });

    it("should handle adding to the end of the month", () => {
      const date = new Date("2023-06-30T00:00:00Z");
      const result = plus(date, "1d");
      const expected = new Date("2023-07-01T00:00:00Z");
      expect(result).toEqual(expected);
    });

    it("should handle adding to the end of the year", () => {
      const date = new Date("2023-12-31T00:00:00Z");
      const result = plus(date, "1y");
      const expected = new Date("2024-12-31T00:00:00Z");
      expect(result).toEqual(expected);
    });
  });

  describe("dateWithTimeZoneFactory", () => {
    it("should create correct toDate function for a given time zone", () => {
      const { toDate } = dateWithTimeZoneFactory("America/New_York");

      const date = new Date(Date.UTC(2023, 6, 15, 12, 0, 0));
      const formattedDate = toDate(date);

      // New York is UTC-04:00 during DST (assuming we're in the correct period for DST)
      const expectedDate = new Date(date).toLocaleDateString(timeType.theGoodLocale, { timeZone: "America/New_York" });

      expect(formattedDate).toBe(expectedDate);
    });

    it("should create correct toDateAndTime function for a given time zone", () => {
      const { toDateAndTime } = dateWithTimeZoneFactory("America/New_York");

      const date = new Date(Date.UTC(2023, 6, 15, 12, 0, 0));
      const [dateFormatted, hourFormatted] = toDateAndTime(date);

      const d = new Date(date);
      const dateTime = d
        .toLocaleString(timeType.theGoodLocale, { timeZone: "America/New_York", hour12: false })
        .replace(",", "");
      const ms = `000${d.getMilliseconds()}`.slice(-3);
      const expectedTimestamp = `${dateTime}.${ms}`;
      const [expectedDate, expectedHour] = expectedTimestamp.split(" ");

      expect(dateFormatted).toBe(expectedDate);
      expect(hourFormatted).toBe(expectedHour);
    });

    it("should handle the noMs option correctly in toDateAndTime", () => {
      const { toDateAndTime } = dateWithTimeZoneFactory("America/New_York");

      const date = new Date(Date.UTC(2023, 6, 15, 12, 0, 0));
      const [dateFormatted, hourFormatted] = toDateAndTime(date, { noMs: true });

      const d = new Date(date);
      const dateTime = d
        .toLocaleString(timeType.theGoodLocale, { timeZone: "America/New_York", hour12: false })
        .replace(",", "");
      const ms = `000${d.getMilliseconds()}`.slice(-3);
      const expectedTimestamp = `${dateTime}.${ms}`;
      const [expectedDate, expectedHourWithMs] = expectedTimestamp.split(" ");
      const expectedHour = expectedHourWithMs.split(".")[0];

      expect(dateFormatted).toBe(expectedDate);
      expect(hourFormatted).toBe(expectedHour);
    });

    it("should return fallback functions when toLocaleString is not supported", () => {
      const spy = vi.spyOn(timeType, "toLocaleStringWorks").mockReturnValue(false);

      const { toDate, toDateAndTime } = dateWithTimeZoneFactory("America/New_York");

      const date = new Date("2023-06-15T12:00:00Z");
      const formattedDate = toDate(date);
      const [dateFormatted, hourFormatted] = toDateAndTime(date);

      expect(formattedDate).toBe("2023-06-15");
      expect(dateFormatted).toBe("2023-06-15");
      expect(hourFormatted).toBe("12:00:00.000");

      spy.mockRestore();
    });
  });

  describe("isStrictDateString", () => {
    test("valid date strings as per local en-CA", () => {
      expect(timeType.isStrictDateString("2024-03-30")).toBe(true);
      expect(timeType.isStrictDateString("1999-12-31")).toBe(true);
      expect(timeType.isStrictDateString("0001-01-01")).toBe(true);
    });

    test("invalid month as per local en-CA", () => {
      expect(timeType.isStrictDateString("2024-13-01")).toBe(false); // Month 13 doesn't exist
    });

    test("invalid day as per local en-CA", () => {
      expect(timeType.isStrictDateString("2024-02-32")).toBe(false); // February 32 is invalid
    });

    test("invalid year format as per local en-CA", () => {
      expect(timeType.isStrictDateString("99-01-01")).toBe(false); // Year must be 4 digits
      expect(timeType.isStrictDateString("abcd-12-25")).toBe(false); // Non-numeric year
    });

    test("incorrect separator as per local en-CA", () => {
      expect(timeType.isStrictDateString("2024/03/30")).toBe(false); // Should use "-"
    });

    test("missing leading zeros as per local en-CA", () => {
      expect(timeType.isStrictDateString("2024-5-9")).toBe(false); // Should be "2024-05-09"
    });
  });
});
