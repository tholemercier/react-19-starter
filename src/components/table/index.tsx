import type { PropsWithChildren, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";

import clsx from "clsx";

export type TableConfigType<T> = {
  tdProps?: { className?: (d: T) => string };
  thProps?: { className?: string };
  th: ReactNode;
  td: (d: T) => ReactNode;
}[];

const Th = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <th className={clsx("px-3 md:px-6", "py-3", className)}>{children}</th>
);

const Td = ({ children, h, className }: PropsWithChildren<{ h?: boolean; i: number; className?: string }>) => (
  <td className={clsx(h && "hidden lg:table-cell", "px-3 md:px-6", "py-4", className)}>{children}</td>
);

export const Table = <T,>({
  config,
  data,
  className,
  wrapperClassName,
  paginate,
}: {
  config: TableConfigType<T>;
  data: T[];
  className?: string;
  wrapperClassName?: string;
  paginate?: boolean;
}) => {
  const totalPages = paginate ? Math.ceil(data.length / 15) : 1;
  const [currentPage, setCurrentPage] = useState(1);
  const handlePrev = useCallback(() => setCurrentPage((p) => Math.max(1, p - 1)), []);
  const handleNext = useCallback(() => setCurrentPage((p) => Math.min(totalPages, p + 1)), [totalPages]);

  const paginatedData = useMemo(() => {
    if (!paginate) return data;
    const start = (currentPage - 1) * 15;
    const end = start + 15;
    return data.slice(start, end);
  }, [data, currentPage, paginate]);

  const [ths, trs] = useMemo(() => {
    const ths = config.map((c, i) => (
      <Th key={`th-${i}`} className={c.thProps?.className}>
        {c.th}
      </Th>
    ));

    const trs = paginatedData.map((d, i) => (
      <tr key={`tr-${i}`} className={clsx("border-b", "border-primary-200", "bg-primary-010", "hover:bg-primary-020")}>
        {config.map((c, ii) => (
          <Td i={i} key={`td-${ii}`} className={c.tdProps?.className?.(d)}>
            {c.td(d)}
          </Td>
        ))}
      </tr>
    ));

    return [ths, trs] as const;
  }, [config, paginatedData]);

  return (
    <div className="relative">
      <div className={clsx("pb-8", wrapperClassName)}>
        {paginate && totalPages > 1 && (
          <div className="flex justify-end gap-2 p-1 pr-2 text-sm">
            <div>{data.length - 1} rows</div>
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="rounded border px-2 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="rounded border px-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
        <table className={clsx("w-full", "table-auto", "h-full", className)}>
          <thead className="sticky top-0 bg-primary-050 text-xs text-primary-800 uppercase">
            <tr>{ths.map((th) => th)}</tr>
          </thead>
          <tbody>{trs.map((tr) => tr)}</tbody>
        </table>
      </div>
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};
