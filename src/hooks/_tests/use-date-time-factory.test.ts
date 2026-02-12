import { renderHook } from "@testing-library/react";

import { useDateTimeFactory } from "../use-date-time-factory";

describe("useDateTimeFactory Hook", () => {
  it('should return correct date and time for "America/New_York"', () => {
    const { result } = renderHook(() => useDateTimeFactory("America/New_York"));

    expect(result.current.timezoneLabel).toBe("Eastern Time");
    expect(result.current.timezone).toBe("America/New_York");

    // January 1st at 23:59 UTC - 18:59 EST (same day) - 19:59 EDT (same day)
    const utcDate = new Date(Date.UTC(2025, 0, 1, 23, 59, 0, 0));
    expect(result.current.toDate(utcDate)).toBe("2025-01-01");
    const [date, time] = result.current.toDateAndTime(utcDate);
    expect(date).toBe("2025-01-01");
    expect(time).toBeOneOf(["19:59:00.000", "18:59:00.000"]);
  });
});
