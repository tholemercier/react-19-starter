import { memo, useCallback, useState } from "react";

import clsx from "clsx";
import { atom, useAtomValue, useAtom } from "jotai";

import { dateWithTimeZoneFactory } from "src/libs/time";
import { range } from "src/vendors/lodash";
import { useDebounce } from "src/vendors/react-use";

const { toDate } = dateWithTimeZoneFactory("Australia/Sydney");

const fy = [
  { label: `ALL`, from: `2000-07-01`, to: toDate(new Date()) },
  ...range(20, getFiscalYear() + 1)
    .map((f) => ({
      label: `FY${f}`,
      from: `20${f}-07-01`,
      to: `20${f + 1}-06-29`,
    }))
    .toReversed(),
];

export type SelectionDateRangeType = {
  from: string;
  to: string;
};
export const selectionDateRangeAtom = atom<SelectionDateRangeType>({
  from: `2000-07-01`,
  to: toDate(new Date()),
});

export const useDateRange = () => {
  const selectionDateRange = useAtomValue(selectionDateRangeAtom);
  const [debouncedValue, setDebouncedValue] = useState<SelectionDateRangeType>(selectionDateRange);

  useDebounce(
    () => {
      setDebouncedValue(selectionDateRange);
    },
    1000,
    [selectionDateRange],
  );

  return debouncedValue;
};

function getFiscalYear() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0 = Jan, 6 = July

  // If month is July or later (>= 6), fiscal year = current year's last 2 digits
  if (month >= 6) {
    return year % 100;
  }

  // Else, fiscal year is last 2 digits minus 1
  return (year % 100) - 1;
}

const DateSelection = () => {
  const [selectionDateRange, setSelectionDateRange] = useAtom(selectionDateRangeAtom);
  const [selectedFy, setSelectedFy] = useState<string | undefined>("ALL");

  const onDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedFy(undefined);
      setSelectionDateRange((p) => ({
        ...p,
        [e.target.name]: e.target.value,
      }));
    },
    [setSelectionDateRange],
  );

  const onFyClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const s = fy.find((s) => s.label === e.currentTarget.dataset.fy);

      if (s) {
        setSelectionDateRange({ from: s.from, to: s.to });
        setSelectedFy(s.label);
      }
    },
    [setSelectionDateRange],
  );

  return (
    <div className={clsx("flex", "flex-col-reverse", "md:flex-row", "gap-2", "p-2")}>
      <div className={clsx("flex gap-2")}>
        <input
          type="date"
          value={selectionDateRange.from}
          name="from"
          onChange={onDateChange}
          className={clsx("border-b-2", "border-brand-600", "p-1")}
        />
        <input
          type="date"
          value={selectionDateRange.to}
          name="to"
          onChange={onDateChange}
          className={clsx("border-b-2", "border-brand-600", "p-1")}
        />
      </div>
      <div className={clsx("flex gap-2 overflow-auto pb-3 md:pb-0")}>
        {fy.map((f) => (
          <div
            key={f.label}
            data-fy={f.label}
            className={clsx(
              "font-semibold",
              "py-1",
              "px-2",
              "border-2",
              "md:text-md text-sm",
              "border-brand-600",
              selectedFy === f.label && "bg-brand-200",
              "cursor-pointer",
              "rounded-sm",
            )}
            onClick={onFyClick}
          >
            {f.label}
          </div>
        ))}
      </div>
    </div>
  );
};

const DateSelectionMemoized = memo(DateSelection);

export default DateSelectionMemoized;
