import { useMemo } from "react";

import { dateWithTimeZoneFactory, parseTimezone } from "src/libs/time";

export const useDateTimeFactory = (tz: string) => {
  return useMemo(() => {
    const { label, value } = parseTimezone(tz);
    const { toDate, toDateAndTime } = dateWithTimeZoneFactory(tz);
    return { timezoneLabel: label, timezone: value, toDate, toDateAndTime };
  }, [tz]);
};
