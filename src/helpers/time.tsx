import { dateWithTimeZoneFactory } from "src/libs/time";

const defaultOpt: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

const { toDateAndTime } = dateWithTimeZoneFactory("Australia/Sydney");

export const toLocalDateAndTime = (dateAsString: string, options = defaultOpt) => {
  const [localDate, localTime] = toDateAndTime(dateAsString, { noMs: true });

  const localDateFormatted = new Date(localDate).toLocaleDateString("en-EN", options);

  return [localDateFormatted, localTime, new Date(localDate)] as const;
};
